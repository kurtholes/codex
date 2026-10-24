import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
mkdirSync('test-output',{recursive:true});
const port=process.env.PORT||'8080';
const server=spawn('python3',['-m','http.server',port],{stdio:'ignore'});await new Promise(r=>setTimeout(r,700));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:800}});let errors=[],samples=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto('http://localhost:'+port);await page.waitForFunction(()=>window.__moonfall);await page.evaluate(()=>__moonfall.quality('low'));await page.screenshot({path:'test-output/00s.png'});
const start=Date.now();await page.keyboard.down('KeyW');await page.waitForTimeout(1400);await page.keyboard.press('Space');
let upgraded=false,launched=false;
while(Date.now()-start<180000){let elapsed=(Date.now()-start)/1000;
if(elapsed>15&&!launched){await page.evaluate(()=>{let d=__moonfall;d.teleport(d.ship.position.x,d.ship.position.y,d.ship.position.z);d.launch()});launched=true;await page.keyboard.up('KeyW')}
await page.evaluate(()=>{let d=__moonfall;d.fragment();let h=d.hazards.find(h=>h.o.position.distanceTo(d.player)<350);if(h){d.aimAt(h.o.position);d.shoot()}});
if(elapsed>30&&!upgraded){await page.screenshot({path:'test-output/30s.png'});await page.evaluate(()=>{__moonfall.give(150);__moonfall.buy(5)});await page.screenshot({path:'test-output/upgrade.png'});upgraded=true}
samples.push(await page.evaluate(()=>({fps:__moonfall.fps,mode:__moonfall.state.mode,shots:__moonfall.state.shots,breaks:__moonfall.state.breaks,bank:__moonfall.state.bank})));await page.waitForTimeout(1000);
}
await page.screenshot({path:'test-output/180s.png'});let result=await page.evaluate(()=>({firstActionMs:__moonfall.firstAction,state:__moonfall.state}));result.fps={mean:samples.reduce((s,x)=>s+x.fps,0)/samples.length,min:Math.min(...samples.map(x=>x.fps)),samples:samples.length};result.consoleErrors=errors;result.durationSeconds=(Date.now()-start)/1000;result.assistance='Test teleports to ship at 15s, aims at spawned hazards, gives 150 shards for upgrade screenshot. Movement/jump uses keyboard; flight, shots, collisions, salvage and progression run in real time.';writeFileSync('test-output/report.json',JSON.stringify(result,null,2));
await page.goto('http://localhost:'+port+'/dist/');await page.waitForTimeout(1800);result.productionHooksAbsent=await page.evaluate(()=>!window.__moonfall);writeFileSync('test-output/report.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();server.kill();
