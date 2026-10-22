import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const baseURL = process.env.TEST_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const errors = [];
await mkdir('artifacts', { recursive: true });
const observe = page => { page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); };
async function ready(page) { await page.goto(`${baseURL}/?test=1`); await page.waitForSelector('#loading.hidden', { state: 'attached', timeout: 60000 }); await page.evaluate(() => document.fonts.ready); }
async function teleport(page, x, z) { await page.evaluate(([x,z]) => window.__vesper.teleport(x,z), [x,z]); }
async function mode(page, expected) { await page.waitForFunction(m => window.__vesper.mode === m, expected); }
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); observe(page);
  await ready(page);
  assert.equal(await page.title(), 'VESPER — The Last Ember');
  await page.screenshot({ path: 'artifacts/title-desktop.png' });
  console.log('CHECK title and rendering');
  await page.click('#controls-button'); await mode(page, 'controls'); assert.match(await page.locator('#panel-title').textContent(), /Find your way/); await page.keyboard.press('Escape'); await mode(page, 'menu');
  await page.click('#settings-button'); await page.selectOption('#quality', 'low'); await page.check('#reduced-motion'); await page.click('[data-close]'); await mode(page, 'menu');
  await page.click('#begin-button'); await mode(page, 'playing');
  await page.keyboard.down('KeyW'); await page.waitForFunction(() => window.__vesper.state.z < 20, { timeout: 15000 }); await page.keyboard.up('KeyW');
  const z = await page.evaluate(() => window.__vesper.state.z); assert(z < 20);
  await page.keyboard.press('Space'); await page.waitForFunction(() => window.__vesper.state.y > .2); await page.waitForFunction(() => window.__vesper.state.y === 0);
  await page.screenshot({ path: 'artifacts/gameplay-desktop.png' });
  console.log('CHECK walking and jumping');
  await page.keyboard.press('Escape'); await mode(page, 'paused'); const pausedZ = await page.evaluate(() => window.__vesper.state.z); await page.waitForTimeout(250); assert.equal(await page.evaluate(() => window.__vesper.state.z), pausedZ); await page.click('#resume-button');
  await teleport(page, 9, 12); await page.keyboard.press('KeyE'); await mode(page, 'memory'); assert.match(await page.locator('#panel-title').textContent(), /promise in the ash/); await page.click('[data-close]');
  await page.keyboard.press('KeyJ'); await mode(page, 'journal'); assert.match(await page.locator('.journal-list').textContent(), /Your mother/); await page.keyboard.press('Escape');
  console.log('CHECK pause, memory, and journal');
  await teleport(page, 0, -182); await page.keyboard.press('KeyE'); assert.equal(await page.evaluate(() => window.__vesper.mode), 'playing'); assert.match(await page.locator('#subtitle p').textContent(), /Three voices/);
  const beacons = [{x:-9,z:-45,rings:[2,5,7]},{x:12,z:-97,rings:[3,6,2]},{x:-13,z:-165,rings:[5,3,6]}];
  for (let i = 0; i < beacons.length; i++) {
    const b = beacons[i]; await teleport(page, b.x + 1, b.z); await page.keyboard.press('KeyE'); await mode(page, 'puzzle');
    if (i === 0) await page.screenshot({ path: 'artifacts/resonator-puzzle.png' });
    for (let r = 0; r < 3; r++) { await page.click(`[data-ring="${r}"]`); for (let j = 0; j < b.rings[r]; j++) await page.click('#turn-left'); }
    await mode(page, 'playing'); assert.equal(await page.evaluate(() => window.__vesper.state.count), i + 1);
    console.log(`CHECK resonator ${i + 1}`);
    if (i === 0) {
      await teleport(page, 100, -45); await page.waitForFunction(() => window.__vesper.state.x === 0 && window.__vesper.state.z === -40, { timeout: 20000 });
      assert.equal(await page.evaluate(() => window.__vesper.state.save.memories.length), 1);
      const sentry = await page.evaluate(() => ({x:window.__vesper.world.sentries[0].group.position.x,z:window.__vesper.world.sentries[0].group.position.z}));
      await teleport(page, sentry.x, sentry.z); await page.keyboard.press('KeyQ'); await page.waitForFunction(() => window.__vesper.state.pulseCooldown > 0); assert(await page.evaluate(() => window.__vesper.world.sentries[0].stunned > 0));
    }
  }
  await teleport(page, 0, -180); await page.keyboard.press('KeyE'); await mode(page, 'choice'); await page.screenshot({ path: 'artifacts/final-choice.png' });
  await page.click('#rekindle'); await mode(page, 'ending'); assert.match(await page.locator('#panel-title').textContent(), /morning/); assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('vesper-save-v1')).ending), 'rekindle');
  await page.click('#ending-explore'); await page.keyboard.press('KeyE'); await mode(page, 'choice'); await page.click('#release'); await mode(page, 'ending'); assert.match(await page.locator('#panel-title').textContent(), /sky without/);
  await page.click('#ending-title'); await mode(page, 'menu');
  await page.reload(); await page.waitForSelector('#loading.hidden', { state: 'attached' }); assert.match(await page.locator('#begin-button').textContent(), /Continue/); await page.click('#begin-button'); await mode(page, 'playing');
  assert.equal(await page.evaluate(() => window.__vesper.state.count), 3); assert.deepEqual(await page.evaluate(() => window.__vesper.state.save.memories), [0]);
  // Standard Gamepad API movement is tested with a deterministic virtual pad.
  await page.evaluate(() => { window.testPad = { connected:true, axes:[1,0,0,0], buttons:Array.from({length:17},()=>({pressed:false})) }; Object.defineProperty(navigator,'getGamepads',{value:()=>[window.testPad]}); });
  await page.waitForFunction(() => window.__vesper.state.x > 1); await page.evaluate(() => window.testPad.axes[0] = 0);
  console.log('PASS desktop: rendered world, movement, jump, pause, memory, journal, locked gate, all puzzles, checkpoint recovery, guardian pulse, both endings, save/resume, controller movement.');
  await page.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }); observe(mobile); await ready(mobile);
  assert(await mobile.locator('#begin-button').isVisible()); assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mobile.screenshot({ path: 'artifacts/title-mobile.png' }); await mobile.tap('#begin-button'); await mode(mobile, 'playing'); assert(await mobile.locator('#joystick').isVisible());
  // Dispatch actual browser touch input, including pointer capture.
  const stick = await mobile.locator('#joystick').boundingBox(); const center = {x:stick.x+stick.width/2,y:stick.y+stick.height/2};
  const cdp = await mobile.context().newCDPSession(mobile);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:center.x,y:center.y-35,id:21}]});
  await mobile.waitForFunction(() => window.__vesper.state.z < 22);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await mobile.tap('#touch-jump'); await mobile.waitForFunction(() => window.__vesper.state.y > 0); await mobile.waitForFunction(() => window.__vesper.state.y === 0);
  await mobile.tap('#touch-pulse'); assert(await mobile.evaluate(() => window.__vesper.state.pulseCooldown > 0));
  await mobile.screenshot({ path: 'artifacts/gameplay-mobile.png' });
  await teleport(mobile, 9, 12); await mobile.tap('#touch-interact'); await mode(mobile, 'memory'); await mobile.tap('[data-close]');
  await mobile.tap('#pause-button'); await mode(mobile,'paused'); await mobile.tap('#pause-settings'); await mobile.selectOption('#quality','balanced'); await mobile.tap('[data-close]'); await mode(mobile,'paused'); await mobile.tap('#resume-button'); await mode(mobile,'playing');
  console.log('PASS mobile: portrait layout, touch movement, jump, pulse, interaction, pause, settings, and return to game.');
  await mobile.close();
  assert.deepEqual(errors, [], `Browser errors: ${errors.join('\n')}`);
  console.log('PASS no uncaught JavaScript, WebGL, or console errors.');
} finally { await browser.close(); }
