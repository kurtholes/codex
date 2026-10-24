import {chromium} from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('test-output',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
try {
const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[],warnings=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});
await page.goto('http://localhost:8080/?dev');await page.waitForFunction(()=>window.__RED_SKY__);await page.evaluate(()=>window.__RED_SKY__.quality('low'));
await page.screenshot({path:'test-output/00s.png'});const start=Date.now(),samples=[];
await page.mouse.move(640,450);await page.mouse.down();await page.keyboard.down('w');
let upgraded=false,screenshot30=false,siegeStarted=false,rangeReady=false,collectReady=false;
while(Date.now()-start<180000){
 const elapsed=(Date.now()-start)/1000;
 if(elapsed>2&&!rangeReady){await page.keyboard.up('w');await page.evaluate(()=>{window.__RED_SKY__.teleport(0,0,-4);window.__RED_SKY__.aim(0,0);});rangeReady=true;}
 if(elapsed>10&&!collectReady){await page.evaluate(()=>{window.__RED_SKY__.teleport(0,0,-18);window.__RED_SKY__.aim(0,0);});collectReady=true;}
 if(elapsed>20&&!upgraded){
  await page.mouse.up();await page.evaluate(()=>{window.__RED_SKY__.teleport(32,0,-8);});
  const earned=await page.evaluate(()=>window.__RED_SKY__.state.scrap);if(earned<65)throw Error(`Core salvage failed: ${earned}; ${JSON.stringify(await page.evaluate(()=>window.__RED_SKY__.state))}`);
  await page.keyboard.press('e');await page.locator('#upgrades button').first().click();await page.locator('#close').click();
  await page.keyboard.press('v');await page.evaluate(()=>window.__RED_SKY__.aim(0,0));await page.waitForTimeout(600);await page.screenshot({path:'test-output/first-upgrade.png'});upgraded=true;await page.mouse.move(640,450);await page.mouse.down();await page.evaluate(()=>window.__RED_SKY__.aim(0,0));
 }
 if(elapsed>30&&!screenshot30){await page.screenshot({path:'test-output/30s.png'});screenshot30=true;}
 if(elapsed>38&&!siegeStarted){await page.mouse.up();await page.evaluate(()=>document.exitPointerLock());await page.waitForTimeout(300);await page.locator('#siege').click();await page.mouse.move(640,470);await page.mouse.down();await page.keyboard.down('w');await page.evaluate(()=>window.__RED_SKY__.aim(0,-.05));siegeStarted=true;}
 if(elapsed>45&&siegeStarted){await page.keyboard.down(Math.floor(elapsed/12)%2?'a':'d');await page.keyboard.up(Math.floor(elapsed/12)%2?'d':'a');if(Math.floor(elapsed)%18<4)await page.keyboard.down(' ');else await page.keyboard.up(' ');}
 samples.push(await page.evaluate(()=>window.__RED_SKY__.state));await page.waitForTimeout(900);
}
await page.mouse.up();await page.screenshot({path:'test-output/180s.png'});const end=await page.evaluate(()=>window.__RED_SKY__.state);
if(end.destroyed<3||!upgraded||end.shots<10)throw Error('Core loop failed');
const saveBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('redsky-save-v1')));await page.reload();await page.waitForFunction(()=>window.__RED_SKY__);const saveAfter=await page.evaluate(()=>window.__RED_SKY__.state);if(saveBefore.levels[0]!==saveAfter.levels[0])throw Error('Persistence failed');
await page.goto('http://localhost:8080/dist/?dev');await page.waitForTimeout(1200);const devStripped=await page.evaluate(()=>!window.__RED_SKY__);if(!devStripped)throw Error('Production dev API leaked');
const report={wallSeconds:(Date.now()-start)/1000,timeToFirstActionMs:samples.find(s=>s.firstAction!==null)?.firstAction,averageLowFPS:samples.reduce((n,s)=>n+s.fps,0)/samples.length,minLowFPS:Math.min(...samples.map(s=>s.fps)),end,upgraded,persistence:true,devStripped,consoleErrors:errors,warnings:[...new Set(warnings)],renderer:'Chromium headless SwiftShader software WebGL, 1280x900, low .65 render scale'};
fs.writeFileSync('test-output/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();if(errors.length)process.exitCode=1;
} finally {await browser.close();}
