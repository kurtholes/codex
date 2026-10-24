import { chromium } from 'playwright';
import {mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
mkdirSync('test-output',{recursive:true});rmSync('test-output/failure.json',{force:true});
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const file=resolve('.'+(url.pathname==='/'?'/src/index.html':url.pathname));if(!file.startsWith(resolve('.')+'/'))throw Error();res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':'text/html');res.end(await readFile(file));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
let browser;const errors=[];
try{
browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--ignore-certificate-errors']});
const page=await browser.newPage({viewport:{width:1280,height:800}});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto(base+'/src/index.html?test');await page.waitForFunction(()=>window.__game);await page.selectOption('#quality','low');
const startingFrames=await page.evaluate(()=>window.__game.frames);const start=Date.now();const inputAt=await page.evaluate(()=>performance.now());await Promise.all([page.screenshot({path:'test-output/00s.png',timeout:60000}),page.keyboard.down('w')]);console.log('Initial screenshot captured');
await page.waitForTimeout(1600);await page.keyboard.up('w');await page.keyboard.press('Space');
const first=await page.evaluate(()=>window.__game.firstAction);const keyboardMoved=await page.evaluate(()=>window.__game.player.position.z<22);assert(keyboardMoved,'W must move after quality selection');
// Steer normal movement toward live books. No currency grants, spawns or teleports in the core loop.
await page.evaluate(()=>{window.bot=setInterval(()=>{const g=window.__game;g.keys.w=g.keys.s=g.keys.a=g.keys.d=false;const currentFloor=Math.round(g.player.position.y/8)*8;const candidates=g.books.filter(b=>Math.abs(b.base-currentFloor)<1).sort((a,b)=>a.p.distanceToSquared(g.player.position)-b.p.distanceToSquared(g.player.position));const b=candidates[0];if(b){const dx=b.p.x-g.player.position.x,dz=b.p.z-g.player.position.z;g.keys.a=dx<-.5;g.keys.d=dx>.5;g.keys.w=dz<-.5;g.keys.s=dz>.5;}if(g.bag.length>=6)g.fling();},120);});
const samples=[];let shot30=false,shotUpgrade=false,earnedBeforeUpgrade=null;let lastShove=0;
while(Date.now()-start<180000){await page.waitForTimeout(1500);const info=await page.evaluate(()=>({fps:window.__game.fps,credits:window.__game.state.credits,tiers:window.__game.state.tiers,sorted:window.__game.state.sorted}));samples.push(info.fps);
if(!shotUpgrade&&info.credits>=100){earnedBeforeUpgrade=info.credits;await page.click('[data-up="0"]');await page.screenshot({path:'test-output/first-upgrade.png'});shotUpgrade=true;console.log('First earned upgrade captured');}
if(shotUpgrade){await page.evaluate(()=>{const g=window.__game;if(g.state.tiers[2]<2)g.buy(2);else if(g.state.tiers[0]<4)g.buy(0);else g.buy(1);});}
if(Date.now()-start-lastShove>6000){lastShove=Date.now()-start;await page.keyboard.press('r');}
if(!shot30&&Date.now()-start>=30000){shot30=true;await page.screenshot({path:'test-output/30s.png'});console.log('30s screenshot captured');}}
await page.evaluate(()=>{clearInterval(window.bot);Object.keys(window.__game.keys).forEach(k=>window.__game.keys[k]=false);});
await page.screenshot({path:'test-output/180s.png'});const final=await page.evaluate(()=>({credits:window.__game.state.credits,sorted:window.__game.state.sorted,tiers:window.__game.state.tiers,frames:window.__game.frames}));const coreDuration=(Date.now()-start)/1000;
// Verify actual lift, shove, advanced movement, and development controls separately.
await page.evaluate(()=>{const g=window.__game;g.teleport(-6,0,22);g.shove();g.give(20000);for(let i=0;i<6;i++)g.buy(1);g.lift();});await page.waitForTimeout(300);const liftY=await page.evaluate(()=>window.__game.player.position.y);assert(liftY>7);const jumpY=await page.evaluate(()=>new Promise(resolve=>{let peak=window.__game.player.position.y;const begin=performance.now();window.dispatchEvent(new KeyboardEvent('keydown',{key:'q'}));setTimeout(()=>window.dispatchEvent(new KeyboardEvent('keyup',{key:'q'})),80);setTimeout(()=>{window.dispatchEvent(new KeyboardEvent('keydown',{key:'q'}));window.dispatchEvent(new KeyboardEvent('keyup',{key:'q'}));},160);function track(){peak=Math.max(peak,window.__game.player.position.y);if(performance.now()-begin>1000)resolve(peak);else requestAnimationFrame(track);}requestAnimationFrame(track);}));assert(jumpY>liftY+.2);await page.screenshot({path:'test-output/gallery.png'});
const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('infinite-librarian-v1')));
await page.goto(base+'/dist/index.html?test');await page.waitForTimeout(2500);const stripped=await page.evaluate(()=>!window.__game);const restored=await page.locator('#credits').textContent();await page.click('#quick');await page.waitForTimeout(1500);const quick=await page.locator('#shift').textContent();await page.click('#main');const restoredAfterQuick=await page.locator('#credits').textContent();
assert(stripped);assert.match(quick,/s ·/);assert.equal(restored,restoredAfterQuick);assert(final.sorted>20);assert(shotUpgrade);assert.equal(errors.length,0);
const report={coreDurationSeconds:coreDuration,timeToFirstActionMs:first,inputResponseMs:first-inputAt,earnedBeforeFirstUpgrade:earnedBeforeUpgrade,averageFpsLow:(final.frames-startingFrames)/coreDuration,smoothedFpsSamplesMean:samples.reduce((a,b)=>a+b,0)/samples.length,minFpsLow:Math.min(...samples),consoleErrors:errors,final,productionTestApiStripped:stripped,quickPlayDisplay:quick,saveRestored:restored===restoredAfterQuick,advancedTraversalTest:{liftY,jumpY,tiers:saved.tiers},renderer:'Chromium headless / SwiftShader software WebGL',keyboardMovementVerified:keyboardMoved,coreLoopUsesGrantsOrTeleports:false,fpsMethod:'Rendered frames divided by wall duration, including screenshots and automation overhead; smoothed overlay samples also retained'};writeFileSync('test-output/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}catch(e){writeFileSync('test-output/failure.json',JSON.stringify({error:String(e),consoleErrors:errors},null,2));throw e;}finally{await browser?.close();await new Promise(r=>server.close(r));}
