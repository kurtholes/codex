import {chromium} from 'playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const out='test-output';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-background-timer-throttling','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:714}});const errors=[],warnings=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});
await page.goto('http://localhost:8000/src/index.html?dev');await page.waitForFunction(()=>window.__excavator);
await page.evaluate(()=>{__excavator.quality('low');document.getElementById('quality').value='low';});
const start=Date.now();await page.screenshot({path:out+'/00-start.png'});
await page.mouse.move(640,357);await page.mouse.down();await page.waitForTimeout(1000);await page.mouse.up();
let shot30=false,major=false,steps=0,lastLog=0;const captures={};const fps=[];let firstPurchase=null;
while(Date.now()-start<180000){
  await page.waitForTimeout(900);
  let state=await page.evaluate(()=>__excavator.state);fps.push(state.fps);if(Date.now()-lastLog>10000){lastLog=Date.now();console.log(JSON.stringify({seconds:(Date.now()-start)/1000,broken:state.broken,stone:state.stone,fps:state.fps,actions:state.actionCount}));}
  if(!major&&state.stone>=35){
    await page.keyboard.press('Tab');await page.locator('.upgrade').first().click();await page.keyboard.press('Tab');
    state=await page.evaluate(()=>__excavator.state);
    if(state.tiers[0]>0){major=true;firstPurchase=Date.now()-start;captures.firstUpgrade=(Date.now()-start)/1000;await page.screenshot({path:out+'/first-major-upgrade.png'});}
  }
  if(!shot30&&Date.now()-start>=30000){captures.thirty=(Date.now()-start)/1000;await page.screenshot({path:out+'/30-seconds.png'});shot30=true;}
  // The test navigator selects a reachable rock face; charge and movement use real input.
  await page.evaluate(()=>{const s=__excavator.state;const candidates=s.blocks.filter(b=>b.y<5&&b.z<12);candidates.sort((a,b)=>Math.abs(a.z-s.player[2])+Math.abs(a.x-s.player[0])*.4-(Math.abs(b.z-s.player[2])+Math.abs(b.x-s.player[0])*.4));const b=candidates[0];if(b){__excavator.teleport(b.x,b.y+.72,b.z+7);__excavator.aim(0,-.1);}});
  await page.keyboard.down('KeyW');await page.waitForTimeout(180);await page.keyboard.up('KeyW');
  await page.mouse.down();await page.waitForTimeout(1150);await page.mouse.up();steps++;
  // Earn purchases through destruction, spread over the progression branches.
  if(major&&steps%3===0)await page.evaluate(()=>{const s=__excavator.state;const i=Math.floor(s.actionCount/3)%6;__excavator.purchase(i);});
}
captures.end=(Date.now()-start)/1000;await page.waitForTimeout(500);await page.screenshot({path:out+'/180-seconds.png'});
const final=await page.evaluate(()=>{__excavator.save();return __excavator.state;});
const snapshot={stone:final.stone,tiers:final.tiers,broken:final.broken};
await page.reload();await page.waitForFunction(()=>window.__excavator);const restored=await page.evaluate(()=>__excavator.state);
const saveRestored=restored.broken===snapshot.broken&&JSON.stringify(restored.tiers)===JSON.stringify(snapshot.tiers);
await page.click('#rushMode');const rush=await page.evaluate(()=>__excavator.state);await page.click('#mainMode');const mainAfterRush=await page.evaluate(()=>__excavator.state);
const rushIsolated=mainAfterRush.broken===snapshot.broken&&JSON.stringify(mainAfterRush.tiers)===JSON.stringify(snapshot.tiers);
// Check production entry renders without a development API.
await page.goto('http://localhost:8000/dist/index.html?dev');await page.waitForTimeout(2000);const productionStripped=await page.evaluate(()=>typeof window.__excavator==='undefined');
const sorted=fps.slice().sort((a,b)=>a-b);const report={captures,durationSeconds:(Date.now()-start)/1000,timeToFirstActionMs:final.firstAction,firstUpgradeMs:firstPurchase,actions:final.actionCount,blocksDestroyed:final.broken,stone:Math.floor(final.stone),tiers:final.tiers,lowFPS:{mean:fps.reduce((a,b)=>a+b,0)/fps.length,median:sorted[Math.floor(sorted.length/2)],p10:sorted[Math.floor(sorted.length*.1)],minimum:sorted[0]},saveRestored,rushStartsHoverReady:rush.tiers[5]>=5,rushIsolated,productionStripped,consoleErrors:errors,warnings};
await writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();if(errors.length||!major||!saveRestored||!rushIsolated||!productionStripped||final.broken<10)process.exitCode=1;
