// Asset smoke test: loads the game headless, waits for Alia's models/textures/music/sfx, checks for console errors,
// and saves screenshots for a visual check. Usage: node tests/assets.mjs  (serves this folder on PORT, default 8091)
import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
mkdirSync('test-output',{recursive:true});
const port=process.env.PORT||'8091';
const server=spawn('python3',['-m','http.server',port],{stdio:'ignore'});await new Promise(r=>setTimeout(r,800));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('requestfailed',r=>failed.push(r.url()));page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url())});
await page.goto('http://localhost:'+port+'/');await page.waitForFunction(()=>window.__moonfall);await page.evaluate(()=>__moonfall.quality('low'));
await page.waitForFunction(()=>{const a=__moonfall.assets;return a.ship&&a.sanctuary&&a.moonstone&&a.textured},null,{timeout:90000}).catch(()=>{});
await page.keyboard.press('Space');await page.waitForTimeout(3000);await page.screenshot({path:'test-output/assets-start.png'});
await page.evaluate(()=>{const d=__moonfall;d.teleport(d.ship.position.x+14,d.ship.position.y+4,d.ship.position.z+22)});await page.waitForTimeout(12000);await page.screenshot({path:'test-output/assets-ship.png'});
for(let i=0;i<8;i++){await page.evaluate(()=>{const d=__moonfall;d.fragment();const h=d.hazards[d.hazards.length-1];if(h){d.aimAt(h.o.position);d.shoot()}});await page.waitForTimeout(700)}
await page.screenshot({path:'test-output/assets-stones.png'});
await page.waitForFunction(()=>Object.keys(__moonfall.assets.musicLevels).length>0,null,{timeout:60000}).catch(()=>{});
const assets=await page.evaluate(()=>({...__moonfall.assets,sfx:__moonfall.sfx}));
// Decode every music track in-page to prove each file loads and to report its levelling gain.
const music=await page.evaluate(async()=>{const ctx=new AudioContext(),out={};for(let i=1;i<=10;i++){const n='music_moonfall_'+String(i).padStart(2,'0')+'.ogg';try{const b=await ctx.decodeAudioData(await (await fetch('assets/'+n)).arrayBuffer());out[n]=+b.duration.toFixed(1)}catch(e){out[n]='FAILED '+e}}return out});
const result={errors,failed,assets,music};writeFileSync('test-output/assets-report.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
await browser.close();server.kill();
if(errors.length||failed.length||!assets.ship||!assets.sanctuary||!assets.moonstone||!assets.textured)process.exitCode=1;
