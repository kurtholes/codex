import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { RELAYS, MEMORIES } from '../src/game.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
await mkdir(path.join(root,'artifacts'),{recursive:true});
const args=['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'];
if(process.env.QA_PROXY)args.push(`--proxy-server=${process.env.QA_PROXY}`,'--proxy-bypass-list=localhost;127.0.0.1');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args});
const base=process.env.TEST_URL||'http://localhost:5173';
const errors=[],requests=[];
async function setup(context){
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('request',r=>requests.push(r.url()));
 // Optional TLS-verified, downloaded fixtures for isolated CI browsers whose CA store differs from the host.
 if(process.env.QA_THREE_DIR)await page.route('https://cdn.jsdelivr.net/npm/three@0.180.0/build/*',route=>route.fulfill({path:path.join(process.env.QA_THREE_DIR,route.request().url().split('/').pop()),contentType:'text/javascript'}));
 await page.addInitScript(()=>localStorage.setItem('afterlight-settings-v1',JSON.stringify({quality:'low',muted:true,reduced:true})));
 return page;
}
async function waitMode(page,mode){await page.waitForFunction(m=>window.__AFTERLIGHT?.mode()===m,mode,{timeout:120000});}
async function arrive(page,s,lateral=0){await page.evaluate(([s,l])=>window.__AFTERLIGHT.teleport(s,l),[s,lateral]);await page.locator('#interaction:not(.hidden)').waitFor({timeout:30000});await page.locator('#interact-btn').click();}
try{
 const context=await browser.newContext({viewport:{width:1100,height:760}});const page=await setup(context);
 await page.goto(base+'/?test=1');await page.waitForFunction(()=>!!window.__AFTERLIGHT,{timeout:60000});
 await page.screenshot({path:path.join(root,'artifacts','title.png')});
 await page.locator('#begin').click();await waitMode(page,'intro');await page.locator('#cast-off').click();await waitMode(page,'play');
 let before=await page.evaluate(()=>window.__AFTERLIGHT.state());
 await page.keyboard.down('KeyW');await page.keyboard.down('KeyD');
 await page.waitForFunction(start=>window.__AFTERLIGHT.state().s>start+2,before.s,{timeout:30000});
 await page.keyboard.up('KeyD');await page.keyboard.up('KeyW');
 let moved=await page.evaluate(()=>window.__AFTERLIGHT.state());assert.ok(moved.lateral>before.lateral);assert.ok(moved.speed>0);
 await page.keyboard.down('Space');await page.waitForFunction(()=>window.__AFTERLIGHT.state().speed>30,null,{timeout:30000});await page.keyboard.up('Space');assert.ok((await page.evaluate(()=>window.__AFTERLIGHT.state().charge))<1);
 await page.evaluate(()=>window.__AFTERLIGHT.teleport(840,0));await page.keyboard.press('KeyQ');await page.waitForFunction(()=>window.__AFTERLIGHT.world.hazards[0].cleared,{timeout:10000});
 await page.keyboard.press('Escape');await waitMode(page,'pause');
 const paused=await page.evaluate(()=>window.__AFTERLIGHT.state().s);await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>window.__AFTERLIGHT.state().s),paused);
 await page.locator('#open-settings').click();await waitMode(page,'settings');
 await page.locator('[data-quality="balanced"]').click();assert.equal(await page.evaluate(()=>window.__AFTERLIGHT.stats().quality),'balanced');
 await page.locator('[data-quality="low"]').click();await page.locator('#settings-back').click();await page.locator('#resume').click();
 await arrive(page,MEMORIES[0].s,MEMORIES[0].x);await waitMode(page,'memory');await page.locator('#memory-back').click();
 assert.deepEqual(await page.evaluate(()=>window.__AFTERLIGHT.state().memories),[0]);
 for(let n=0;n<RELAYS.length;n++){
  const r=RELAYS[n];await arrive(page,r.s);await waitMode(page,'puzzle');assert.equal(await page.locator('#receive').isDisabled(),true);
  for(let i=0;i<3;i++){const dial=page.locator(`#phase-${i}`);await dial.focus();await dial.press('Home');for(let k=0;k<r.target[i];k++)await dial.press('ArrowRight');}
  assert.equal(await page.locator('#receive').isEnabled(),true);
  if(n===0)await page.screenshot({path:path.join(root,'artifacts','relay.png')});
  await page.locator('#receive').click();await waitMode(page,'voice');assert.equal(await page.evaluate(n=>window.__AFTERLIGHT.state().relays[n],n),true);await page.locator('#voice-back').click();
 }
 await page.keyboard.press('KeyJ');await waitMode(page,'journal');assert.equal(await page.locator('.journal-entry h3').count(),4);await page.locator('#journal-back').click();
 await page.keyboard.press('Escape');await page.locator('#to-title').click();await waitMode(page,'title');await page.reload();await page.waitForFunction(()=>!!window.__AFTERLIGHT,{timeout:60000});
 await page.locator('#continue').click();await waitMode(page,'play');assert.deepEqual(await page.evaluate(()=>window.__AFTERLIGHT.state().relays),[true,true,true]);
 await page.keyboard.press('KeyR');assert.ok(Math.abs((await page.evaluate(()=>window.__AFTERLIGHT.state().s))-(RELAYS[2].s+45))<5);
 await arrive(page,7330);await waitMode(page,'finale');await page.locator('#choose-awaken').click();await waitMode(page,'ending');
 assert.equal(await page.evaluate(()=>window.__AFTERLIGHT.state().ending),'awaken');await page.screenshot({path:path.join(root,'artifacts','ending.png')});
 // The alternate ending uses the same earned relay state and the actual choice UI.
 await page.evaluate(()=>{const st=window.__AFTERLIGHT.state();st.ending=null;st.s=7330;window.__AFTERLIGHT.setState(st);window.__AFTERLIGHT.play();});
 await arrive(page,7330);await page.locator('#choose-release').click();await waitMode(page,'ending');assert.equal(await page.evaluate(()=>window.__AFTERLIGHT.state().ending),'release');
 // All world sections compile and render; record a mid-chapter view.
 await page.evaluate(()=>{window.__AFTERLIGHT.play();window.__AFTERLIGHT.teleport(3100,-20);});
 await page.waitForTimeout(1000);await page.screenshot({path:path.join(root,'artifacts','voyage.png')});
 await context.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const phone=await setup(mobile);await phone.goto(base+'/?test=1');await phone.waitForFunction(()=>!!window.__AFTERLIGHT,{timeout:60000});await phone.locator('#begin').click();await phone.locator('#cast-off').click();
 await phone.locator('#touch:not(.hidden)').waitFor();const stick=phone.locator('#joystick');const box=await stick.boundingBox();const cdp=await mobile.newCDPSession(phone);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+50,y:box.y+15}]});await phone.waitForTimeout(500);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await phone.locator('#pause-btn').click();await phone.locator('#open-settings').click();await phone.screenshot({path:path.join(root,'artifacts','mobile.png')});assert.ok(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await mobile.close();
 // Optional production server test: hooks absent even when a caller supplies ?test=1.
 if(process.env.PRODUCTION_URL){const prodContext=await browser.newContext({viewport:{width:800,height:600}});const prod=await setup(prodContext);await prod.goto(process.env.PRODUCTION_URL+'/?test=1');await prod.locator('#title:not(.hidden)').waitFor({timeout:60000});assert.equal(await prod.evaluate(()=>typeof window.__AFTERLIGHT),'undefined');assert.equal((await prod.request.get(process.env.PRODUCTION_URL+'/src/dev-hooks.js')).status(),404);await prodContext.close();}
 const external=requests.filter(u=>!u.startsWith('http://localhost:')&&!u.startsWith('http://127.0.0.1:'));
 assert.ok(external.every(u=>/^https:\/\/cdn\.jsdelivr\.net\/npm\/three@0\.180\.0\/build\/three\.(module|core)\.js$/.test(u)),`Unexpected remote requests: ${external}`);
 assert.deepEqual(errors,[]);console.log('PASS: movement, pause, settings, memory, three puzzles, checkpoints, save/resume, journal, both endings, touch layout, external-request allowlist, and production isolation.');
}finally{await browser.close();}
