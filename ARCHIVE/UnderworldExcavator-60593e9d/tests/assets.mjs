// Headless check for Alia's assets: every file loads, no console errors or failed requests, screenshots of each placement.
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const port=process.env.PORT||8000,base=`http://localhost:${port}`,out='test-output';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('requestfailed',r=>failed.push(r.url()));page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});
await page.goto(`${base}/src/index.html?dev`);await page.waitForFunction(()=>window.__excavator);
const want=['relief_figure.glb','arch.glb','cannon.glb','timber_gallery.glb','sandstone_albedo.png'];
await page.waitForFunction(w=>w.every(n=>n in __excavator.assets),want,{timeout:60000});
await page.mouse.click(640,360);await page.evaluate(()=>{__excavator.quality('medium');document.querySelectorAll('.overlay,#intro,#start').forEach(e=>e.click?.());});
const shots=[['assets-firstperson',0,2.1,10,0,-.03],['assets-left-wall',-6,2.1,-2,Math.PI/2+.35,.12],['assets-right-wall',6,2.1,-29,-Math.PI/2+.5,.12],['assets-gallery',0,2.1,9,.45,.05],['assets-deep-left',-5,-5.2,-120,Math.PI/2+.6,.1]];
for(const [name,x,y,z,yaw,pitch] of shots){await page.evaluate(([x,y,z,yaw,pitch])=>{__excavator.teleport(x,y,z);__excavator.aim(yaw,pitch);},[x,y,z,yaw,pitch]);await page.waitForTimeout(1500);await page.screenshot({path:`${out}/${name}.png`});}
await page.waitForFunction(()=>__excavator.assets.music&&Object.keys(__excavator.assets.music.levels).length>0,null,{timeout:30000}).catch(()=>{});
const assets=await page.evaluate(()=>__excavator.assets);
await page.goto(`${base}/dist/index.html`);await page.waitForTimeout(6000);await page.screenshot({path:`${out}/assets-dist.png`});
const report={assets,missing:want.filter(n=>assets[n]!==true),errors,failed};
await writeFile(`${out}/assets.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
await browser.close();if(report.missing.length||errors.length||failed.length)process.exit(1);
