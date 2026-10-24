import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('test-output',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/opt/google/chrome/chrome',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],warnings=[],requests=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text())});page.on('request',r=>requests.push(r.url()));
const nav=performance.now();await page.goto('http://localhost:4173');await page.waitForFunction(()=>window.__BRASS_DEV__);await page.evaluate(()=>__BRASS_DEV__.setQuality('low'));
await page.keyboard.down(' ');const first=await page.evaluate(()=>{__BRASS_DEV__.fire();return __BRASS_DEV__.state.firstAction});
const firstWall=performance.now()-nav;
await page.screenshot({path:'test-output/00-launch.png'});
const begin=performance.now(),samples=[];let checkpoint30=false,major=false,refits=0,nextIsland=35,lastSample=0;
while(performance.now()-begin<180000){let elapsed=(performance.now()-begin)/1000;
 const target=await page.evaluate(()=>{let d=__BRASS_DEV__,best=null,dist=Infinity;for(let p of d.world.parts){if(p.dead||!['tank','wall','chimney','turret'].includes(p.kind))continue;let v=p.pos.clone().project(d.camera),rr=p.pos.distanceTo(d.state.pos);if(v.z<0||v.z>1||Math.abs(v.x)>.8||v.y<-.2||v.y>.7||rr>700)continue;let rank=rr*(p.kind==='tank'?.55:1);if(rank<dist){dist=rank;best={x:(v.x+1)*640,y:(1-v.y)*400}}}return best});
 if(target)await page.mouse.move(target.x,target.y);
 if(elapsed>nextIsland){await page.evaluate(index=>{let d=__BRASS_DEV__,i=d.world.islands[index];d.teleport(i.x,i.y+65,i.z+i.size+140);d.state.yaw=0;d.state.speed=10;d.state.hull=100},Math.min(7,Math.floor(nextIsland/35)));nextIsland+=35;}
 let s=await page.evaluate(()=>({fps:__BRASS_DEV__.state.fps,money:__BRASS_DEV__.state.currency,tiers:[...__BRASS_DEV__.state.tiers],shots:__BRASS_DEV__.state.shots,destroyed:__BRASS_DEV__.state.destroyed,hull:__BRASS_DEV__.state.hull}));
 if(elapsed-lastSample>3){samples.push({wallSeconds:elapsed,...s});lastSample=elapsed;}
 if(s.tiers[0]<2&&s.money>=await page.evaluate(()=>__BRASS_DEV__.cost(0))){await page.keyboard.up(' ');await page.keyboard.press('r');await page.locator('.branch').nth(0).click();await page.keyboard.press('r');await page.keyboard.down(' ');refits++;if(s.tiers[0]===1){await page.screenshot({path:'test-output/03-major-upgrade.png'});major=true;}}
 if(!checkpoint30&&elapsed>=30){await page.screenshot({path:'test-output/01-30s.png'});checkpoint30=true;}
 await page.waitForTimeout(400);
}
await page.keyboard.up(' ');await page.screenshot({path:'test-output/02-180s.png'});
const final=await page.evaluate(()=>{let d=__BRASS_DEV__;d.save();return {destroyed:d.state.destroyed,shots:d.state.shots,salvage:d.state.currency,tiers:[...d.state.tiers],saved:JSON.parse(localStorage.getItem('brass-horizon-v1')),simulationSeconds:d.state.time}});
assert(final.destroyed>10,'Core destruction failed');assert(final.salvage>0,'Salvage collection failed');assert(major,'Twin-cannon upgrade not reached');assert(firstWall<10000,'First action exceeded ten seconds');assert.equal(errors.length,0,'Console errors');assert(!requests.some(u=>!u.startsWith('http://localhost:4173')&&!u.startsWith('data:')),'External request');
// Exercise all quick-play choices and restoration without waiting through three timers.
for(let i=0;i<3;i++){await page.click('#sortie');await page.locator('[data-loadout]').nth(i).click();await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>__BRASS_DEV__.state.mode),'sortie');await page.click('#frontier');assert.equal(await page.evaluate(()=>__BRASS_DEV__.state.mode),'frontier');}
await page.evaluate(()=>{__BRASS_DEV__.startSortie(0);__BRASS_DEV__.state.timer=.05});await page.waitForSelector('#results:not(.hidden)');assert(await page.locator('#finalscore').isVisible());await page.click('#returnfrontier');
await page.reload();await page.waitForFunction(()=>window.__BRASS_DEV__);const restored=await page.evaluate(()=>({money:__BRASS_DEV__.state.currency,tiers:__BRASS_DEV__.state.tiers}));assert.deepEqual(restored.tiers,final.tiers,'Save tiers restoration');
const fps=samples.map(s=>s.fps).sort((a,b)=>a-b),report={durationSeconds:(performance.now()-begin)/1000,coreLoopWallSeconds:180,timeToFirstActionMsFromNavigation:Math.round(firstWall),timeToFirstActionMsFromGameReady:Math.round(first),resolution:'1280×800 at 0.6 pixel ratio',renderer:'Chromium / ANGLE SwiftShader (CPU software rasterizer)',preset:'low',fps:{median:fps[Math.floor(fps.length/2)],min:fps[0],max:fps.at(-1)},refits,final,restored,consoleErrors:errors,consoleWarnings:warnings,externalRequests:requests.filter(u=>!u.startsWith('http://localhost:4173')&&!u.startsWith('data:')),samples};await writeFile('test-output/playtest.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...report,samples:undefined},null,2));await browser.close();
