import {chromium} from 'playwright';
import fs from 'node:fs';
const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,env:{...process.env,DISPLAY:process.env.TEST_DISPLAY||':1'},args:['--no-sandbox','--ozone-platform=x11','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
const p=await b.newPage({viewport:{width:1280,height:720}}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await p.goto('http://127.0.0.1:8080/src/?test=1');await p.waitForFunction(()=>window.__HEAT_TEST__);await p.selectOption('#quality','low');
// Exercise all 36 purchases and the visual attachment thresholds.
const max=await p.evaluate(()=>{const t=window.__HEAT_TEST__;t.grant(1000000);let n=0;for(let branch=0;branch<6;branch++)for(let tier=0;tier<6;tier++)if(t.buy(branch))n++;const capped=!t.buy(0);t.start();return{purchases:n,capped,levels:[...t.save.levels]}});await p.waitForTimeout(700);await p.screenshot({path:'test-output/max-upgrades.png'});
await p.evaluate(()=>window.__HEAT_TEST__.land());await p.waitForTimeout(600);await p.screenshot({path:'test-output/surface.png'});
await p.keyboard.down('KeyW');await p.waitForTimeout(800);await p.keyboard.up('KeyW');const movement=await p.evaluate(()=>window.__HEAT_TEST__.state.z);
// Reach the mast using teleport, then verify workshop overlay is clickable over results.
await p.evaluate(()=>{const t=window.__HEAT_TEST__;const r=t.save.levels[5]%4;t.teleport(100+r*70,t.state.y,-240-r*70);t.rescue()});await p.locator('#resultUpgrade').click();const workshop=await p.locator('#bench').isVisible();await p.locator('#closeBench').click();await p.locator('#resultQuick').click();
const started=performance.now();while(performance.now()-started<61000){await p.evaluate(()=>{const t=window.__HEAT_TEST__;t.keys.Space=t.state.heat>50;t.keys.KeyD=Math.sin(t.state.time*.3)>.5;t.keys.KeyA=Math.sin(t.state.time*.3)<-.5;});await p.waitForTimeout(350);}
const quick=await p.evaluate(()=>({...window.__HEAT_TEST__.state}));await p.screenshot({path:'test-output/quick-complete.png'});
const report={max,movement,workshop,quick,errors};fs.writeFileSync('test-output/smoke.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await b.close();if(max.purchases!==36||!max.capped||!workshop||quick.phase!=='end'||quick.time<60||errors.length)process.exitCode=1;
