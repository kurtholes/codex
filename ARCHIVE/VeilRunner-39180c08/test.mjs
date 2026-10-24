import {chromium} from 'playwright';import {mkdir,writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';
await mkdir('test-output',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[],consoleErrors=[],samples=[],requests=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});page.on('request',r=>{if(!r.url().startsWith('http://localhost:4173')&&!r.url().startsWith('data:'))requests.push(r.url())});
const load=Date.now();await page.goto('http://localhost:4173');await page.waitForFunction(()=>window.__VEIL_DEV__);await page.evaluate(()=>__VEIL_DEV__.quality('low'));await page.screenshot({path:'test-output/00s.png'});await page.keyboard.down('KeyW');await page.waitForTimeout(350);await page.keyboard.up('KeyW');await page.evaluate(()=>__VEIL_DEV__.navigate(true));
const actionWallMs=Date.now()-load;const started=Date.now();let at30=false,major=false;let purchaseCount=0;
while(Date.now()-started<180000){
 await page.waitForTimeout(2000);
 let m=await page.evaluate(()=>__VEIL_DEV__.metrics);samples.push({wallSeconds:(Date.now()-started)/1000,...m});await writeFile('test-output/partial.json',JSON.stringify({actionWallMs,samples,errors,consoleErrors},null,2));
 // Real earned currency, no grants or teleports. Stride II is the first major upgrade.
 const purchased=await page.evaluate(()=>{let d=__VEIL_DEV__,s=d.state;if(s.tiers[0]<2)return d.buy(0)?'stride':false;if(s.tiers[3]<3)return d.buy(3)?'pulse':false;if(s.tiers[4]<2)return d.buy(4)?'sight':false;if(s.tiers[5]<2)return d.buy(5)?'echo':false;return false});if(purchased)purchaseCount++;
 if(!major&&m.tiers[0]>=2){major=true;await page.keyboard.press('Tab');await page.screenshot({path:'test-output/first-major-upgrade.png'});await page.keyboard.press('Tab');}
 if(!at30&&Date.now()-started>=30000){await page.screenshot({path:'test-output/30s.png'});at30=true;}
 await page.evaluate(()=>__VEIL_DEV__.pulse());
}
await page.evaluate(()=>__VEIL_DEV__.navigate(false));await page.screenshot({path:'test-output/180s.png'});const final=await page.evaluate(()=>__VEIL_DEV__.metrics);
assert(final.totalHits>=8,'Main loop routes reached');assert(final.brokenCount>=1,'Crystal shattered');assert(major,'Major upgrade purchased');
// Visibility reset, movement, persistence, and quick-mode isolation.
await page.keyboard.press('KeyV');assert(await page.evaluate(()=>__VEIL_DEV__.state.contrast)>=.84);
const before=await page.evaluate(()=>[...__VEIL_DEV__.state.tiers]);await page.reload();await page.waitForFunction(()=>window.__VEIL_DEV__);assert.deepEqual(await page.evaluate(()=>__VEIL_DEV__.state.tiers),before);
await page.click('#quickMode');await page.evaluate(()=>__VEIL_DEV__.navigate(true));await page.waitForTimeout(65000);await page.waitForFunction(()=>document.querySelector('#results').open,null,{timeout:90000});const quick=await page.evaluate(()=>({hits:__VEIL_DEV__.metrics.quickHits,results:document.querySelector('#results').innerText}));await page.screenshot({path:'test-output/quick-results.png'});assert(quick.hits>0);await page.click('#retry');assert(await page.evaluate(()=>__VEIL_DEV__.metrics.quickElapsed)<2);
const stable=samples.filter(s=>s.wallSeconds>10);const fps=stable.map(s=>s.fps).sort((a,b)=>a-b);const result={viewport:'1280x800, low (.75 render scale)',renderer:await page.evaluate(()=>{let gl=document.querySelector('canvas').getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)}),actionWallMs,firstActionSimulationSeconds:final.firstAction,threeMinuteWallSeconds:samples.at(-1).wallSeconds,simulationSeconds:final.elapsed,fps:{mean:fps.reduce((a,b)=>a+b,0)/fps.length,median:fps[Math.floor(fps.length/2)],min:fps[0],max:fps.at(-1)},final,purchaseCount,major,quick,errors,consoleErrors,externalRequests:requests};
await writeFile('test-output/report.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();assert.equal(errors.length,0);assert.equal(consoleErrors.length,0);assert.equal(requests.length,0);
