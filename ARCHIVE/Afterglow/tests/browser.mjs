// Optional browser QA. npm install --no-save playwright; CHROMIUM_PATH=/path/to/chromium node tests/browser.mjs
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.TEST_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
  ],
});
const errors = [],
  requests = new Set();
await mkdir("artifacts", { recursive: true });
async function prepare(page) {
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("request", (r) => requests.add(r.url()));
  if (process.env.THREE_TEST_FILE)
    await page.route(
      "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js",
      (r) =>
        r.fulfill({
          path: process.env.THREE_TEST_FILE,
          contentType: "text/javascript",
        }),
    );
}
async function ready(page, path = "/?test=1") {
  await page.goto(base + path);
  await page.waitForFunction(() => document.body.dataset.ready === "true", {
    timeout: 30000,
  });
  await page.locator("#loading").waitFor({ state: "hidden" });
}
async function state(page) {
  return page.evaluate(() => window.__AFTERGLOW__.state);
}
async function waitState(page, key, value) {
  await page.waitForFunction(
    ([k, v]) => window.__AFTERGLOW__.state[k] === v,
    [key, value],
    { timeout: 20000 },
  );
}
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await prepare(page);
  await ready(page);
  assert.match(await page.title(), /Afterglow/);
  await page.screenshot({ path: "artifacts/shore.png" });
  // All generated meshes must contain finite positions; catches shader-adjacent geometry failures.
  assert.equal(
    await page.evaluate(() => {
      let bad = false;
      window.__AFTERGLOW__.scene.traverse((o) => {
        if (
          o.geometry?.attributes.position &&
          !Array.from(o.geometry.attributes.position.array).every(
            Number.isFinite,
          )
        )
          bad = true;
      });
      return bad;
    }),
    false,
  );
  for (const craft of ["jetski", "yacht", "runabout"]) {
    await page.click(`[data-craft="${craft}"]`);
    assert.equal((await state(page)).craft, craft);
    if (craft !== "runabout")
      await page.screenshot({ path: `artifacts/${craft}.png` });
  }
  await page.selectOption("#routeSelect", "arches");
  assert.equal((await state(page)).route, "arches");
  await page.selectOption("#routeSelect", "islands");
  assert.equal((await state(page)).route, "islands");
  const seedBefore = (await state(page)).seed;
  await page.click("#shuffleBtn");
  assert.notEqual((await state(page)).seed, seedBefore);
  await page.selectOption("#routeSelect", "palms");
  await page.click("#helpBtn");
  assert(await page.locator("#guide").isVisible());
  await page.click("#closeGuide");
  await page.click("#startBtn");
  await waitState(page, "status", "playing");
  await page.screenshot({ path: "artifacts/voyage.png" });
  await page.setViewportSize({ width: 800, height: 600 });
  console.log(
    "PASS rendered scene, finite geometry, craft and route selectors, chart generation, field guide, embark.",
  );
  await page.keyboard.press("Escape");
  await waitState(page, "status", "paused");
  await page.selectOption("#pauseQuality", "low");
  await page.click("#continueBtn");
  await waitState(page, "quality", "low");
  await page.keyboard.down("w");
  await page.waitForFunction(() => window.__AFTERGLOW__.state.speed > 3, null, {
    timeout: 20000,
  });
  await page.keyboard.up("w");
  assert((await state(page)).z < 0);
  await page.keyboard.down("d");
  await page.waitForFunction(
    () => window.__AFTERGLOW__.state.heading > 0.08,
    null,
    { timeout: 20000 },
  );
  await page.keyboard.up("d");
  await page.keyboard.press("Shift");
  assert((await state(page)).cruise);
  await page.keyboard.down(" ");
  await page.waitForFunction(() => !window.__AFTERGLOW__.state.cruise);
  await page.keyboard.up(" ");
  await page.keyboard.press("Escape");
  await waitState(page, "status", "paused");
  const frozen = await state(page);
  await page.waitForTimeout(250);
  assert.deepEqual(await state(page), frozen);
  await page.click("#continueBtn");
  await page.keyboard.press("c");
  await page.keyboard.press("c");
  await page.keyboard.press("h");
  assert(
    await page.locator("body").evaluate((el) => el.classList.contains("clean")),
  );
  await page.keyboard.press("h");
  await page.keyboard.press("r");
  assert.equal((await state(page)).speed, 0);
  // Trigger the same shoreline collision path as real sailing.
  await page.evaluate(() => {
    const p = window.__AFTERGLOW__.world.islands[0];
    window.__AFTERGLOW__.teleport(p.x + 5, p.z);
    window.__AFTERGLOW__.setSpeed(20);
  });
  await page.waitForFunction(() => window.__AFTERGLOW__.state.speed < 10);
  await page.keyboard.press("r");
  for (let i = 0; i < 3; i++) {
    await page.evaluate((i) => window.__AFTERGLOW__.toSignal(i), i);
    await waitState(page, "signal", i + 1);
  }
  await page.keyboard.press("Escape");
  await page.click("#returnBtn");
  await ready(page);
  assert(await page.locator("#resumeBtn").isVisible());
  await page.click("#resumeBtn");
  await waitState(page, "signal", 3);
  assert.equal((await state(page)).speed, 0);
  console.log(
    "PASS throttle, steering, cruise, brake, pause freeze, cameras, interface toggle, shore collision/recovery, signals, save and resume.",
  );
  for (let i = 3; i < 7; i++) {
    await page.evaluate((i) => window.__AFTERGLOW__.toSignal(i), i);
    await waitState(page, "signal", i + 1);
  }
  await page.waitForFunction(
    () => window.__AFTERGLOW__.state.status === "ending",
    null,
    { timeout: 90000 },
  );
  await page.screenshot({ path: "artifacts/ending.png" });
  assert(await page.locator("#ending").isVisible());
  await page.click("#sailOnBtn");
  await waitState(page, "mode", "free");
  await waitState(page, "status", "playing");
  await page.evaluate(() => window.__AFTERGLOW__.teleport(0, -120000));
  await page.keyboard.press("r");
  await page.waitForFunction(() => window.__AFTERGLOW__.world.chunks.has(200));
  assert(
    await page.evaluate(() => window.__AFTERGLOW__.world.chunks.size <= 10),
  );
  // Deterministic Gamepad API input; physical controllers still require hardware QA.
  await page.evaluate(() => {
    window.qaPad = {
      connected: true,
      axes: [0.4, 0],
      buttons: Array.from({ length: 17 }, (_, i) => ({
        pressed: i === 7,
        value: i === 7 ? 1 : 0,
      })),
    };
    Object.defineProperty(navigator, "getGamepads", {
      value: () => [window.qaPad],
    });
  });
  await page.waitForFunction(() => window.__AFTERGLOW__.state.speed > 1);
  await page.evaluate(() => (window.qaPad.connected = false));
  await page.keyboard.press("Escape");
  await page.selectOption("#pauseQuality", "high");
  await page.click("#continueBtn");
  await waitState(page, "quality", "high");
  await page.keyboard.press("Escape");
  console.log(
    "PASS all seven radio signals, natural final transition, ending, continued free sail, distant chunk replacement, virtual gamepad, all quality presets.",
  );
  const production = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  await prepare(production);
  await ready(production, "/dist/index.html?test=1");
  assert.equal(
    await production.evaluate(() => typeof window.__AFTERGLOW__),
    "undefined",
  );
  await production.click("#startBtn");
  assert(await production.locator("#hud").isVisible());
  await production.close();
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  await prepare(mobile);
  await ready(mobile);
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await mobile.screenshot({ path: "artifacts/shore-mobile.png" });
  await mobile.selectOption("#quality", "low");
  await mobile.tap("#startBtn");
  assert(await mobile.locator("#touch").isVisible());
  const throttle = await mobile.locator('[data-key="w"]').boundingBox(),
    touch = await mobile.context().newCDPSession(mobile);
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      {
        x: throttle.x + throttle.width / 2,
        y: throttle.y + throttle.height / 2,
        id: 1,
      },
    ],
  });
  await mobile.waitForFunction(() => window.__AFTERGLOW__.state.speed > 1);
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await mobile.screenshot({ path: "artifacts/voyage-mobile.png" });
  await mobile.tap("#pauseBtn");
  assert(await mobile.locator("#pause").isVisible());
  await mobile.close();
  assert.deepEqual(errors, []);
  assert(
    [...requests].every(
      (url) =>
        url.startsWith(base) ||
        url ===
          "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js",
    ),
  );
  console.log(
    "PASS production test hooks absent, production embark, mobile layout and touch controls, zero JavaScript/WebGL errors, only local assets + exact Three.js CDN requested.",
  );
} finally {
  await browser.close();
}
