import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const server = spawn(process.execPath, ["server.mjs"]);
await new Promise((r) => setTimeout(r, 500));
let b;
let errors = [],
  requests = [];
try {
  b = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  let p = await b.newPage({ viewport: { width: 1280, height: 714 } });
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  p.on("request", (r) => requests.push(r.url()));
  await p.goto("http://localhost:4173/?test");
  await p.waitForTimeout(1200);
  assert.equal(await p.evaluate(() => typeof window.__overboard), "undefined");
  await p.keyboard.press("e");
  await p.keyboard.press(" ");
  await p.click("#settings");
  for (let q of ["low", "medium", "high", "auto"]) {
    await p.click(`[data-quality="${q}"]`);
    await p.waitForTimeout(1200);
  }
  await p.click("#settings");
  await p.screenshot({ path: "test-output/production.png" });
  let saved = await p.evaluate(() =>
    JSON.parse(localStorage.getItem("overboard-save-v1")),
  );
  assert.equal(saved.levels.hull, 1);
  await p.click("#rescue");
  await p.keyboard.press("e");
  assert.equal(
    await p
      .locator("#modeLabel")
      .textContent()
      .then((x) => x.startsWith("RESCUE RUN")),
    true,
  );
  assert.equal(errors.length, 0);
  const external = [
    ...new Set(requests.filter((u) => !u.startsWith("http://localhost:4173"))),
  ];
  assert.deepEqual(external, [
    "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
  ]);
  await writeFile(
    "test-output/production-report.json",
    JSON.stringify(
      {
        checks: [
          "Production dev hook absent even with ?test",
          "Production recovery and hull expansion",
          "Low/medium/high/auto shaders render",
          "Rescue mode starts",
          "Only pinned Three.js external request",
        ],
        errors,
        external,
      },
      null,
      2,
    ),
  );
  console.log("Production checks passed", external);
} finally {
  await b?.close();
  server.kill();
}
