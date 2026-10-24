import {chromium} from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('test-output',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,env:{...process.env,DISPLAY:process.env.TEST_DISPLAY||':1'},args:['--no-sandbox','--ozone-platform=x11','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[],logs=[],fps=[],events=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());else if(m.type()==='warning')logs.push(m.text())});
await page.goto('http://127.0.0.1:8080/src/?test=1');await page.waitForFunction(()=>window.__HEAT_TEST__);
await page.selectOption('#quality','low');
await page.screenshot({path:'test-output/00s.png'});
await page.keyboard.down('KeyW');await page.waitForTimeout(200);await page.keyboard.up('KeyW');
const start=performance.now();let screen30=false,upgradeShot=false,rescued=false,quickStarted=false,firstUpgrade=null;
while(performance.now()-start<180000){
const state=await page.evaluate(()=>{const t=window.__HEAT_TEST__;return {...t.state,money:t.save.money,levels:[...t.save.levels],fps:t.fps(),tower:[100+(t.save.levels[5]%4)*70,-240-(t.save.levels[5]%4)*70]}});
const seconds=(performance.now()-start)/1000;fps.push({seconds,fps:state.fps,phase:state.phase});if(fps.length%15===0){console.log(JSON.stringify({seconds,phase:state.phase,alt:state.alt,air:state.air,hull:state.hull,x:state.x,z:state.z,fps:state.fps}));fs.writeFileSync('test-output/live.json',JSON.stringify({seconds,state,events},null,2));}
if(!screen30&&seconds>=30){await page.screenshot({path:'test-output/30s.png'});screen30=true;events.push({seconds,event:'30s screenshot',state})}
if(!upgradeShot&&state.money>=70){await page.keyboard.press('KeyU');await page.locator('[data-buy="0"]').click();await page.keyboard.press('Escape');await page.screenshot({path:'test-output/first-upgrade.png'});upgradeShot=true;firstUpgrade=seconds;events.push({seconds,event:'earned first shield upgrade'})}
if(state.phase==='dive'){
await page.evaluate(()=>{const t=window.__HEAT_TEST__,s=t.state;t.keys.Space=s.heat>48||s.alt<24;t.keys.KeyA=Math.sin(s.time*.2)<-.7;t.keys.KeyD=Math.sin(s.time*.2)>.7;t.keys.KeyW=false;t.keys.KeyS=false;});
}else if(state.phase==='trek'){
await page.evaluate(({tx,tz})=>{const t=window.__HEAT_TEST__,s=t.state;t.keys.Space=false;t.keys.ShiftLeft=true;t.keys.KeyD=s.x<tx-3;t.keys.KeyA=s.x>tx+3;t.keys.KeyW=s.z>tz+3;t.keys.KeyS=s.z<tz-3;},{tx:state.tower[0],tz:state.tower[1]});
if(Math.hypot(state.x-state.tower[0],state.z-state.tower[1])<18){await page.keyboard.press('KeyE');rescued=true;await page.screenshot({path:'test-output/rescue.png'});events.push({seconds,event:'rescued',score:state.score});}
}else if(state.phase==='end'&&!quickStarted){await page.locator('#resultQuick').click();quickStarted=true;events.push({seconds,event:'quick dive started'});}
await page.waitForTimeout(350);
}
await page.screenshot({path:'test-output/180s.png'});
let final=await page.evaluate(()=>({state:{...window.__HEAT_TEST__.state},save:{...window.__HEAT_TEST__.save}}));
const cleanFps=fps.filter(x=>x.seconds>5&&x.phase!=='end').map(x=>x.fps).filter(Number.isFinite).sort((a,b)=>a-b);
const report={durationSeconds:(performance.now()-start)/1000,timeToFirstAction:final.state.firstAction,quality:'low',resolution:'1280x720, 0.75 pixel ratio',renderer:'Chromium headless / SwiftShader software (X11 ozone)',fps:{median:cleanFps[Math.floor(cleanFps.length/2)],p10:cleanFps[Math.floor(cleanFps.length*.1)],min:cleanFps[0]},rescued,firstUpgradeSeconds:firstUpgrade,quickStarted,errors,warnings:[...new Set(logs)],events,final};
fs.writeFileSync('test-output/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
// Reload verifies saved progression; production verifies stripped dev switch and offline requests.
await page.reload();await page.waitForFunction(()=>window.__HEAT_TEST__);report.persistence=await page.evaluate(()=>window.__HEAT_TEST__.save.levels[0]>0);
const requests=[];page.on('request',r=>requests.push(r.url()));await page.goto('http://127.0.0.1:8080/dist/?test=1');await page.waitForTimeout(1500);report.productionHookAbsent=await page.evaluate(()=>!('__HEAT_TEST__'in window));report.externalRequests=requests.filter(u=>!u.startsWith('http://127.0.0.1:8080/'));await page.screenshot({path:'test-output/production.png'});fs.writeFileSync('test-output/report.json',JSON.stringify(report,null,2));
await browser.close();if(errors.length||!rescued||!report.persistence||!report.productionHookAbsent)process.exitCode=1;
