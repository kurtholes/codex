import {chromium} from 'playwright';
import fs from 'node:fs';
const b=await chromium.launch({args:['--no-sandbox','--enable-unsafe-swiftshader']});
try {
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.goto('http://localhost:8080/?dev');await p.waitForFunction(()=>window.__RED_SKY__);
 await p.evaluate(()=>{const g=window.__RED_SKY__;g.quality('low');g.give(100000);for(let i=0;i<8;i++)for(let j=0;j<6;j++)if(!g.buy(i))throw Error(`Purchase ${i}/${j}`);g.teleport(0,0,20);g.aim(0,0);});
 await p.keyboard.press('v');await p.keyboard.down(' ');await p.keyboard.down('w');await p.waitForTimeout(2500);await p.keyboard.up('w');await p.keyboard.up(' ');await p.screenshot({path:'test-output/late-tier-flight.png'});
 const state=await p.evaluate(()=>window.__RED_SKY__.state);if(state.levels.some(n=>n!==6)||state.pos[1]<1)throw Error('Tier or flight failure');
 await p.reload();await p.waitForFunction(()=>window.__RED_SKY__);const saved=await p.evaluate(()=>window.__RED_SKY__.state);if(saved.levels.some(n=>n!==6))throw Error('Max tier save failure');
 const report={purchases:48,flightHeight:state.pos[1],persisted:true,consoleErrors:errors};fs.writeFileSync('test-output/upgrades.json',JSON.stringify(report,null,2));console.log(report);if(errors.length)process.exitCode=1;
}finally{await b.close();}
