import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
execFileSync(process.execPath,['build.mjs','--dev']);
await mkdir('test-output',{recursive:true});
const server=createServer(async(req,res)=>{try{if(req.url==='/favicon.ico'){res.writeHead(204);res.end();return;}const path=req.url==='/'?'/dev-dist/index.html':req.url;res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':'text/html');res.end(await readFile('.'+path));}catch{res.writeHead(404);res.end();}}).listen(4182);
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.setDefaultTimeout(60000);const nav=Date.now();
try{
 await page.goto('http://localhost:4182/dev-dist/index.html');await page.waitForFunction(()=>window.__dream,{timeout:30000});
 await page.evaluate(()=>{window.__dream.quality('low');window.__dream.fire(true);});
 const ready=Date.now();await page.screenshot({path:'test-output/00s.png'});await page.keyboard.down('w');await page.waitForTimeout(1000);await page.keyboard.up('w');
 const samples=[];let shotAt=null,upgrade=false,at30=false,lastRoute=0,three=false;
 while(Date.now()-ready<180000){
  await page.waitForTimeout(1000);let state=await page.evaluate(()=>window.__dream.state);const t=(Date.now()-ready)/1000;samples.push({seconds:t,...state});
  if(shotAt===null&&state.shotCount)shotAt=(Date.now()-nav)/1000;
  if(!upgrade&&state.energy>=30){await page.evaluate(()=>window.__dream.buy(0));upgrade=true;await page.screenshot({path:'test-output/first-upgrade.png'});console.log('Natural upgrade',t.toFixed(1),state);}
  if(t>=30&&!at30){await page.screenshot({path:'test-output/30s.png'});at30=true;}
  if(Math.floor(t/14)>lastRoute){lastRoute=Math.floor(t/14);await page.evaluate(()=>{const d=window.__dream;const state=d.state;const ts=d.targets().filter(t=>!t.dead);const t=ts[Math.floor(state.destroyCount/3)%ts.length];if(t){d.teleport(t.pos[0],Math.max(3.5,t.pos[1]+1),t.pos[2]+45);d.aim(0,-.025);d.fire(true);}for(const i of [5,7,0,3,2,6,4,1])if(d.buy(i))break;});}
  if(t>=60&&!three){console.log('60 seconds',state);three=true;}
 }
 const final=await page.evaluate(()=>{window.__dream.fire(false);return window.__dream.state;});
 await writeFile('test-output/core.json',JSON.stringify({final,samples,errors},null,2));await page.screenshot({path:'test-output/180s.png',timeout:60000});assert(final.firstAction<10,'Action available within ten seconds');assert(final.shotCount>10,'Repeated firing');assert(final.destroyCount>=3,'Destruction loop');assert(upgrade,'Earned first upgrade');assert(final.levels.some(x=>x>0),'Upgrade retained');
 await page.evaluate(()=>window.__dream.quick());await page.waitForTimeout(22000);assert.equal(await page.locator('#choice').isVisible(),true);await page.keyboard.press('1');assert.equal(await page.locator('#choice').isVisible(),false);await page.click('#quickBtn');
 await page.reload();await page.waitForFunction(()=>window.__dream);const persisted=await page.evaluate(()=>window.__dream.state);assert.deepEqual(persisted.levels,final.levels,'Main progression persists independently of quick play');
 await page.goto('http://localhost:4182/dist/index.html');await page.waitForSelector('#loading',{state:'detached'});assert.equal(await page.evaluate(()=>typeof window.__dream),'undefined');assert.equal(await page.locator('#fps').count(),0);
 const measured=samples.at(-1);const report={durationSeconds:measured.seconds,loadToObservedFirstShotSeconds:shotAt,gameFirstActionSeconds:final.firstAction,lowPreset:{viewport:'1280x800',pixelRatio:.7,renderer:'Chromium SwiftShader software GPU',averageFps:final.averageFps,frames:final.frameCount,wallSeconds:final.wallTime},final,checks:{naturalUpgrade:upgrade,quickPickups:true,mainSaveRestored:true,productionHooksStripped:true},consoleErrors:errors,samples};
 await writeFile('test-output/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...report,samples:undefined},null,2));assert.equal(errors.length,0,'Console errors');
}catch(e){console.error(e);await page.screenshot({path:'test-output/failure.png'}).catch(()=>{});await writeFile('test-output/errors.json',JSON.stringify(errors));process.exitCode=1;}finally{await browser.close();server.close();}
