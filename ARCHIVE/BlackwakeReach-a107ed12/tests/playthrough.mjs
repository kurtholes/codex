import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('test-output',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium',args:['--no-sandbox','--disable-dev-shm-usage','--renderer-process-limit=1','--use-angle=swiftshader','--enable-webgl','--ignore-certificate-errors']});
const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto('http://127.0.0.1:5173/dist/');await page.waitForFunction(()=>window.__game);await page.selectOption('#quality','Low');
const captures={};let start=Date.now();
async function shot(name){captures[name]=(Date.now()-start)/1000;await page.screenshot({path:`test-output/${name}.png`})}
async function until(ms){const remaining=ms-(Date.now()-start);if(remaining>0)await new Promise(r=>setTimeout(r,remaining))}
await shot('00-start');await page.keyboard.down('KeyW');await page.keyboard.down('Space');
const lowFps=await page.evaluate(()=>new Promise(resolve=>{let n=0,start=performance.now();function f(){n++;let elapsed=performance.now()-start;if(elapsed>=3000)resolve(n*1000/elapsed);else requestAnimationFrame(f)}requestAnimationFrame(f)}));console.log('Initial low FPS:',lowFps);
await until(30000);await shot('30-seconds');await page.keyboard.down('KeyA');await new Promise(r=>setTimeout(r,1200));await page.keyboard.up('KeyA');
await until(45000);await page.keyboard.up('Space');await page.keyboard.up('KeyW');await page.evaluate(()=>window.__game.give(500));await page.click('#refit');await page.locator('#upgrades button').nth(2).click();await page.locator('#upgrades button').nth(1).click();await page.click('#close');await shot('first-upgrade');await page.keyboard.down('Space');await page.keyboard.down('KeyW');
await until(180000);await page.keyboard.up('KeyW');await page.keyboard.up('Space');await shot('180-seconds');const naval=await page.evaluate(()=>({...window.__game.state}));
await page.evaluate(()=>window.__game.teleport(-172,-380));await page.keyboard.press('KeyE');await page.waitForTimeout(300);let ashore=await page.evaluate(()=>window.__game.state.land);await page.keyboard.down('Space');await page.waitForTimeout(1500);await page.keyboard.up('Space');await shot('shore');await page.keyboard.press('KeyE');await page.click('#mode');await page.waitForTimeout(500);let quick=await page.evaluate(()=>window.__game.state.quick);
const report={durationSeconds:(Date.now()-start)/1000,captures,timeToFirstAction:Math.max(0,naval.firstAction),lowFps,shots:naval.shots,kills:naval.kills,levels:naval.levels,ashore,quick,errors};fs.writeFileSync('test-output/report.json',JSON.stringify(report,null,2));console.log(report);await browser.close();if(errors.length||naval.shots<1||naval.kills<1||!ashore||!quick||naval.levels[2]<1)process.exit(1);
