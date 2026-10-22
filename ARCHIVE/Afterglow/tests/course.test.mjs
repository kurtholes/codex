import test from "node:test";
import assert from "node:assert/strict";
import {
  CRAFT,
  rng,
  routeX,
  chunkPlan,
  station,
  SIGNALS,
  freshState,
  stepBoat,
  collide,
  angleDelta,
} from "../src/course.js";
test("charts reproduce exactly and different seeds produce different islands", () => {
  assert.deepEqual(chunkPlan(15, 284, "palms"), chunkPlan(15, 284, "palms"));
  assert.notDeepEqual(chunkPlan(15, 284, "palms"), chunkPlan(15, 285, "palms"));
  const a = rng(1),
    b = rng(1);
  for (let i = 0; i < 100; i++) assert.equal(a(), b());
});
test("the channel and all seven signals remain clear across 60 generated charts", () => {
  for (const route of ["palms", "arches", "islands"])
    for (let seed = 1; seed <= 20; seed++) {
      for (let i = -3; i <= 39; i++) {
        const islands = chunkPlan(i, seed * 379, route).islands;
        for (let z = -i * 600 - 360; z <= -i * 600 + 360; z += 20) {
          const x = routeX(z, seed * 379, route);
          for (const p of islands)
            assert(
              Math.hypot((x - p.x) / (p.rx + 4), (z - p.z) / (p.rz + 4)) > 1,
              "Navigable channel intrudes on shoreline",
            );
        }
      }
      for (let i = 0; i < SIGNALS.length; i++) {
        const s = station(i, seed * 379, route);
        assert.equal(s.x, routeX(s.z, seed * 379, route));
      }
    }
});
test("all craft accelerate, turn, brake, reverse and hold cruise without invalid state", () => {
  for (const kind of Object.keys(CRAFT)) {
    const state = freshState();
    for (let i = 0; i < 1200; i++)
      stepBoat(state, { throttle: 1, steer: 0, brake: false }, kind, 1 / 60);
    assert.equal(state.speed, CRAFT[kind].max);
    assert(state.z < -100);
    const before = state.heading;
    for (let i = 0; i < 120; i++)
      stepBoat(state, { throttle: 0, steer: 1, brake: false }, kind, 1 / 60);
    assert(state.heading > before);
    for (let i = 0; i < 240; i++)
      stepBoat(state, { throttle: 0, steer: 0, brake: true }, kind, 1 / 60);
    assert(state.speed < 0.1);
    for (let i = 0; i < 400; i++)
      stepBoat(state, { throttle: -1, steer: 0, brake: false }, kind, 1 / 60);
    assert(state.speed < 0);
    state.cruise = true;
    for (let i = 0; i < 2000; i++)
      stepBoat(state, { throttle: 0, steer: 0, brake: false }, kind, 1 / 60);
    assert(Math.abs(state.speed - CRAFT[kind].max * 0.76) < 0.01);
    for (const value of Object.values(state))
      if (typeof value === "number") assert(Number.isFinite(value));
  }
});
test("shore recovery pushes the hull clear and releases cruise", () => {
  const state = { ...freshState(), x: 5, z: 10, speed: 25, cruise: true };
  const island = { x: 0, z: 0, rx: 60, rz: 120 };
  assert(collide(state, [island], "yacht"));
  assert(Math.hypot(state.x / (island.rx + 3), state.z / (island.rz + 3)) > 1);
  assert.equal(state.cruise, false);
  assert.equal(state.speed, 6.25);
  assert(!collide(state, [island], "yacht"));
});
test("voyage duration at cruise fits the intended 10–20 minutes for each ride", () => {
  for (const spec of Object.values(CRAFT)) {
    const minutes = SIGNALS.at(-1).z / (spec.max * 0.76) / 60;
    assert(minutes > 10 && minutes < 20);
  }
});
test("navigation takes the shortest turn across the heading seam", () => {
  assert(Math.abs(angleDelta(0.01, Math.PI * 2 - 0.01) - 0.02) < 1e-10);
});
