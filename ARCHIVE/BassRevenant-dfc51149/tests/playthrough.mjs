import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('test-output',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
browser.on('disconnected',()=>console.log('BROWSER DISCONNECTED',new Date().toISOString()));
const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[],consoleErrors=[];page.on('crash',()=>console.log('PAGE CRASH',new Date().toISOString()));page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
try {
await page.goto('http://localhost:8080');await page.waitForFunction(()=>window.__TEST__);await page.evaluate(()=>__TEST__.quality('low'));await page.screenshot({path:'test-output/00-load.png'});
const started=Date.now();await page.click('#play');await page.keyboard.down('KeyW');await page.mouse.move(640,400);await page.mouse.down();await page.waitForTimeout(1100);await page.mouse.up();await page.keyboard.up('KeyW');await page.evaluate(()=>{document.exitPointerLock?.();__TEST__.aim(0,0);});
let upgraded=false,shotAt=0,cycle=0,counterAt=0,snap30=false,logged=0;const checkpoints=[];
while(Date.now()-started<180000){
 const t=(Date.now()-started)/1000;if(Math.floor(t/20)>logged){logged=Math.floor(t/20);const s=await page.evaluate(()=>__TEST__.state());console.log('CHECKPOINT',Math.floor(t),JSON.stringify({...s,fpsSamples:undefined}));}
 if(t>=30&&!snap30){await page.screenshot({path:'test-output/30-seconds.png'});snap30=true;checkpoints.push({at:t,state:await page.evaluate(()=>__TEST__.state())});}
 if(t>=15&&!upgraded){await page.evaluate(()=>{__TEST__.give(1000);__TEST__.buy(5);__TEST__.buy(5);__TEST__.buy(5);__TEST__.buy(0);__TEST__.buy(0);});await page.keyboard.down('Space');await page.waitForTimeout(550);await page.keyboard.up('Space');await page.evaluate(()=>__TEST__.fire());await page.screenshot({path:'test-output/first-major-upgrade.png'});upgraded=true;}
 if(t-shotAt>2.5){await page.evaluate(()=>__TEST__.fire());shotAt=t;}
 if(t-counterAt>14){await page.evaluate(()=>{__TEST__.attack();});await page.waitForTimeout(900);await page.keyboard.press('KeyF');await page.waitForTimeout(250);await page.keyboard.press('KeyF');counterAt=t;}
 if(Math.floor(t/22)>cycle){cycle=Math.floor(t/22);await page.evaluate(c=>{const ss=__TEST__.shrines(),s=ss.find(s=>!s.captured)||ss[c%ss.length];__TEST__.teleport(s.pos[0],s.pos[1]-2,s.pos[2]+12);__TEST__.aim(0,0);},cycle);}
 await page.waitForTimeout(300);
}
await page.screenshot({path:'test-output/180-seconds.png'});const state=await page.evaluate(()=>__TEST__.state());
const samples=state.fpsSamples;const report={wallSeconds:(Date.now()-started)/1000,timeToFirstActionMs:state.firstAction,lowFPS:{mean:samples.reduce((a,b)=>a+b,0)/samples.length,min:Math.min(...samples),max:Math.max(...samples),samples:samples.length},errors,consoleErrors,final:state,checkpoints,notes:['SwiftShader software WebGL in headless Chromium; not an integrated-GPU hardware benchmark.','Automation uses dev teleports and currency for deterministic district coverage; shots, counters, captures, hover and purchases use game logic.','180 seconds wall time; simulation time can differ because hit-stop and slow-frame delta clamp.']};await writeFile('test-output/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...report,final:{...state,fpsSamples:undefined}},null,2));
assert.equal(errors.length,0);assert.equal(consoleErrors.length,0);assert(state.shotsFired>20);assert(state.captured>0);assert(state.destruction>0);assert(state.counters>0);assert(state.levels[5]>=3);assert(state.firstAction<10000);
// Persistence and quick-play isolation.
await page.reload();await page.waitForFunction(()=>window.__TEST__);await page.click('#play');let saved=await page.evaluate(()=>__TEST__.state());assert(saved.levels[5]>=3);assert(saved.captured>0);await page.evaluate(()=>__TEST__.start('quick'));let quick=await page.evaluate(()=>__TEST__.state());assert.equal(quick.levels[5],5);await page.evaluate(()=>__TEST__.start('main'));assert.equal((await page.evaluate(()=>__TEST__.state())).levels[5],saved.levels[5]);
await writeFile('test-output/checks.json',JSON.stringify({persistence:true,quickIsolation:true,errors},null,2));} finally {await browser.close();}
