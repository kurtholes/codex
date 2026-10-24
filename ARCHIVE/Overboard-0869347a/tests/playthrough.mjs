import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const out = "test-output";
await mkdir(out, { recursive: true });
const server = spawn(process.execPath, ["server.mjs", "--dev"]);
await new Promise((r) => setTimeout(r, 600));
let browser;
const errors = [],
  checks = [],
  samples = [];
let report;
try {
  browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  const p = await browser.newPage({ viewport: { width: 1280, height: 714 } });
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await p.goto("http://localhost:4173/?test");
  await p.waitForFunction(() => window.__overboard);
  await p.evaluate(() => {
    __overboard.reseed(869347);
    __overboard.setQuality("low");
  });
  await p.screenshot({ path: out + "/00s.png" });
  const started = Date.now();
  await p.keyboard.press("e");
  assert((await p.evaluate(() => __overboard.state.wood)) >= 8);
  checks.push("First salvage through keyboard E");
  await p.keyboard.press(" ");
  assert.equal(await p.evaluate(() => __overboard.state.levels.hull), 1);
  checks.push("First deck upgrade through Space");
  await p.screenshot({ path: out + "/first-upgrade.png" });
  await p.keyboard.down("w");
  await p.waitForTimeout(1600);
  await p.keyboard.up("w");
  // Navigate to the raft without granting currency or upgrading through the hook.
  await p.evaluate(() => {
    let g = __overboard;
    g.teleport(g.raft.x, g.raft.y);
  });
  await p.keyboard.press("e");
  await p.keyboard.press("e");
  if (!(await p.evaluate(() => __overboard.state.aboard)))
    await p.keyboard.press("e");
  assert(await p.evaluate(() => __overboard.state.aboard));
  checks.push("Board raft; exposure recovery");
  let screenshot30 = false,
    iteration = 0;
  while (
    Date.now() - started < 180000 ||
    (await p.evaluate(() => __overboard.state.elapsed)) < 180
  ) {
    // Assisted navigation makes repeated wreck/salvage/upgrade cycles deterministic.
    let target = await p.evaluate(() => {
      let g = __overboard,
        w = g.wrecks.find((w) => w.alive);
      if (w) {
        g.teleport(w.x, w.z);
        return { hp: w.hp, x: w.x, z: w.z };
      }
      return null;
    });
    if (target) {
      for (let i = 0; i < 6; i++) {
        await p.keyboard.press(" ");
        await p.waitForTimeout(760);
        if (
          (await p.evaluate(
            () =>
              __overboard.wrecks.find((w) => w.alive)?.hp !== undefined &&
              __overboard.state.breaks > 0,
          )) &&
          i > 3
        )
          break;
      }
      await p.evaluate(() => {
        let g = __overboard;
        for (let it of g.items)
          if (
            it.active &&
            Math.hypot(it.x - g.state.x, it.z - g.state.z) < 18
          ) {
            g.teleport(it.x, it.z);
            g.grab();
          }
      });
    } else {
      await p.evaluate(() => {
        let g = __overboard,
          i = g.items.find((i) => i.active);
        if (i) {
          g.teleport(i.x, i.z);
          g.grab();
        }
      });
    }
    await p.keyboard.press("b");
    // Purchase affordable, prerequisite-valid tiers using the rendered buttons.
    for (let key of ["sail", "work", "hold", "fins", "hull", "depth"]) {
      let b = p.locator(`[data-upgrade="${key}"]`);
      if (await b.isEnabled()) await b.click();
    }
    await p.keyboard.press("b");
    await p.keyboard.down(iteration % 2 ? "a" : "w");
    await p.waitForTimeout(1300);
    await p.keyboard.up(iteration % 2 ? "a" : "w");
    if (Date.now() - started >= 30000 && !screenshot30) {
      await p.screenshot({ path: out + "/30s.png" });
      screenshot30 = true;
    }
    samples.push({
      ...(await p.evaluate(() => __overboard.stats())),
      wallSeconds: (Date.now() - started) / 1000,
    });
    iteration++;
    console.log(
      "Loop",
      iteration,
      "wall",
      Math.round((Date.now() - started) / 1000),
      "wood",
      samples.at(-1).wood,
      "breaks",
      samples.at(-1).breaks,
    );
  }
  await p.screenshot({ path: out + "/180s.png" });
  const mainStats = await p.evaluate(() => __overboard.stats());
  assert(mainStats.breaks > 0);
  assert(mainStats.grabs > 5);
  assert(mainStats.levels.sail >= 1);
  checks.push(
    "Repeated wreck destruction, recovery, sailing, and multi-discipline upgrades",
  );
  // Dive into a real submerged rib/floor assembly and recover its hold.
  await p.evaluate(() => {
    let g = __overboard,
      w = g.wrecks[0];
    g.state.aboard = false;
    g.teleport(w.x, w.z);
  });
  await p.keyboard.down("q");
  await p.waitForTimeout(1400);
  let beforeDive = await p.evaluate(() => __overboard.state.wood);
  await p.keyboard.press("e");
  assert((await p.evaluate(() => __overboard.state.wood)) > beforeDive);
  await p.screenshot({ path: out + "/dive.png" });
  await p.keyboard.up("q");
  checks.push("Submersible dive and deep wreck hold recovery");
  const save = await p.evaluate(() =>
    localStorage.getItem("overboard-save-v1"),
  );
  assert(save);
  await p.reload();
  await p.waitForFunction(() => window.__overboard);
  assert.equal(
    await p.evaluate(() => __overboard.state.levels.hull),
    JSON.parse(save).levels.hull,
  );
  checks.push("Progress survives reload");
  await p.click("#rescue");
  assert.equal(await p.evaluate(() => __overboard.state.wood), 0);
  assert.equal(await p.evaluate(() => __overboard.state.levels.sail), 0);
  await p.keyboard.press("e");
  await p.evaluate(() => {
    let g = __overboard;
    g.teleport(g.rescueShip.position.x, g.rescueShip.position.z);
  });
  await p.waitForTimeout(400);
  assert.equal(await p.locator("#resultLabel").textContent(), "RESCUED");
  checks.push("Quick rescue starts clean and reaches win state");
  await p.click("#again");
  await p.evaluate(() => {
    __overboard.state.elapsed = 149.9;
  });
  await p.waitForTimeout(700);
  assert.equal(await p.locator("#resultLabel").textContent(), "LOST AT SEA");
  checks.push("Quick rescue timer reaches loss state");
  await p.click("#voyage");
  assert.equal(
    await p.evaluate(() => __overboard.state.levels.hull),
    JSON.parse(save).levels.hull,
  );
  checks.push("Quick mode does not overwrite voyage save");
  const source = await readFile("dist/game.js", "utf8");
  assert(!source.includes("__overboard"));
  assert(!source.includes("DEV_START"));
  checks.push("Production build strips test state and cheats");
  let graphics = await p.evaluate(() => {
    let gl = document.querySelector("canvas").getContext("webgl2"),
      ext = gl.getExtension("WEBGL_debug_renderer_info");
    return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
  });
  report = {
    test: "180-second wall-time headless core loop",
    viewport: "1280x714; low renders at 75%",
    navigation:
      "Keyboard grab, ram, movement and build purchases. Dev teleports between wrecks and salvage. No currency grants during main test.",
    firstActionSeconds: mainStats.firstAction,
    wallDurationSeconds: samples.at(-1)?.wallSeconds,
    lowMeanFps: mainStats.meanFps,
    graphics,
    mainStats,
    checks,
    consoleErrors: errors,
    samples,
  };
  await writeFile(out + "/report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, samples: undefined }, null, 2));
  assert.equal(errors.length, 0);
} finally {
  await browser?.close();
  server.kill();
}
