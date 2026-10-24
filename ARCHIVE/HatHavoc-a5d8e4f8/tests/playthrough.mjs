import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('test-output',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:800},ignoreHTTPSErrors:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error'&&!e.text().includes('favicon'))errors.push(e.text())});
const start=Date.now();await page.goto('http://127.0.0.1:8080/src/?test');await page.waitForFunction(()=>!!window.__hat);await page.selectOption('#quality','low');await page.screenshot({path:'test-output/0s.png'});await page.keyboard.down('KeyW');await page.mouse.move(640,400);await page.mouse.down();const actionWall=Date.now()-start;await page.waitForTimeout(1500);await page.keyboard.up('KeyW');
let upgraded=false;const samples=[];const playStart=Date.now();let shot30=false;
while(Date.now()-playStart<180000){const t=(Date.now()-playStart)/1000;const state=await page.evaluate(()=>window.__hat.state());samples.push(state.fps);
if(!upgraded&&state.coins>=85){await page.mouse.up();await page.keyboard.press('KeyE');await page.click('[data-i="0"]');await page.click('#close');await page.screenshot({path:'test-output/first-upgrade.png'});await page.mouse.move(640,400);await page.mouse.down();upgraded=true;}
if(t>30&&!shot30){await page.screenshot({path:'test-output/30s.png'});shot30=true;}
// Fly the market using real input; aim sweeps across stalls and facades.
await page.keyboard.down(t%32<18?'KeyW':'KeyS');await page.keyboard.up(t%32<18?'KeyS':'KeyW');await page.keyboard.down(t%16<8?'ArrowLeft':'ArrowRight');await page.keyboard.up(t%16<8?'ArrowRight':'ArrowLeft');
if(t>65&&t<76)await page.keyboard.down('Space');else await page.keyboard.up('Space');
if(t>105&&t<116)await page.keyboard.down('ShiftLeft');else await page.keyboard.up('ShiftLeft');
await page.waitForTimeout(1800);
}
await page.mouse.up();for(const k of ['KeyW','KeyS','ArrowLeft','ArrowRight','Space','ShiftLeft'])await page.keyboard.up(k);await page.screenshot({path:'test-output/3min.png'});const final=await page.evaluate(()=>window.__hat.state());
// Dev helpers separately verify every upgrade and movement tier.
await page.evaluate(()=>{window.__hat.give(1e7);for(let i=0;i<8;i++)for(let j=0;j<8;j++)window.__hat.upgrade(i)});const max=await page.evaluate(()=>window.__hat.state());await page.reload();await page.waitForFunction(()=>!!window.__hat);const persisted=await page.evaluate(()=>window.__hat.state());
await page.click('#quick');await page.waitForTimeout(1000);const quick=await page.evaluate(()=>window.__hat.state());await page.evaluate(()=>document.getElementById('main').click());
const report={durationSeconds:(Date.now()-playStart)/1000,timeToFirstInputMs:actionWall,firstActionTimestampMs:final.firstAction,lowFpsMean:samples.reduce((a,b)=>a+b,0)/samples.length,lowFpsMin:Math.min(...samples),errors,upgraded,final,maxLevels:max.levels,persistedLevels:persisted.levels,quickStarted:quick.quick,renderer:'Chromium SwiftShader software; 1280x800, low'};
await writeFile('test-output/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
