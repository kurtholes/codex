import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { World } from "./world.js";
import { makeBoat } from "./boats.js";
import { SunsetAudio } from "./audio.js";
import {
  CRAFT,
  SIGNALS,
  VOYAGE_LENGTH,
  freshState,
  stepBoat,
  collide,
  routeX,
  station,
  angleDelta,
} from "./course.js";
const $ = (id) => document.getElementById(id),
  all = (q) => [...document.querySelectorAll(q)];
const audio = new SunsetAudio();
const keys = new Set();
let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas: $("sea"),
    antialias: true,
    powerPreference: "high-performance",
  });
} catch (e) {
  fatal(
    "Your browser could not start WebGL. Enable hardware acceleration, or try a current browser.",
  );
  throw e;
}
renderer.setClearColor(0x110c2b);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.22;
const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(
    57,
    innerWidth / innerHeight,
    0.15,
    7000,
  );
scene.add(new THREE.HemisphereLight(0xfca3e1, 0x11182d, 2.4));
const sunLight = new THREE.DirectionalLight(0xffc4a2, 3.1);
sunLight.position.set(-40, 55, -80);
scene.add(sunLight);
const fill = new THREE.DirectionalLight(0x559dff, 1.2);
fill.position.set(50, 15, 40);
scene.add(fill);
const world = new World(scene, renderer),
  boats = {};
for (const kind of Object.keys(CRAFT)) {
  boats[kind] = makeBoat(kind);
  boats[kind].visible = false;
  scene.add(boats[kind]);
}
let craft = "runabout",
  route = "palms",
  seed = 284,
  mode = "voyage",
  status = "menu",
  quality = "medium",
  state = freshState(),
  signal = 0,
  elapsed = 0,
  travel = 0,
  frame = 0,
  time = 0,
  camMode = 0,
  lookYaw = 0,
  lookPitch = 0,
  lookIdle = 0,
  dragging = false,
  pointerX = 0,
  pointerY = 0,
  showUI = true,
  lastCollision = -10,
  radioUntil = 0,
  hintUntil = 10,
  endingDelay = 0,
  saveTimer = 0,
  mapTimer = 0,
  hudTimer = 0,
  lastTime = performance.now(),
  startedOnce = false,
  gamepadConnected = false,
  renderDirty = true;
const target = new THREE.Vector3(),
  desiredPos = new THREE.Vector3(),
  desiredTarget = new THREE.Vector3();
let cameraReady = false,
  storedSave = null;
const mapCtx = $("map").getContext("2d");
const prefs = readStore("afterglow-settings");
let audioPreference = prefs?.audio !== false;
if (prefs) {
  quality = ["low", "medium", "high"].includes(prefs.quality)
    ? prefs.quality
    : "medium";
  audio.volume =
    typeof prefs.volume === "number"
      ? Math.max(0, Math.min(1, prefs.volume))
      : 0.55;
}
try {
  const s = readStore("afterglow-save");
  if (
    s &&
    s.version === 1 &&
    CRAFT[s.craft] &&
    ["palms", "arches", "islands"].includes(s.route) &&
    ["voyage", "free"].includes(s.mode) &&
    s.state &&
    ["x", "z", "heading", "speed", "distance"].every((k) =>
      Number.isFinite(s.state[k]),
    ) &&
    Number.isInteger(s.seed) &&
    Number.isInteger(s.signal) &&
    s.signal >= 0 &&
    s.signal <= 7 &&
    Number.isFinite(s.elapsed)
  )
    storedSave = s;
} catch {}
if (storedSave) $("resumeBtn").hidden = false;
for (let i = 0; i < 18; i++)
  $("speedBars").appendChild(document.createElement("i"));
function readStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}
function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
function settings() {
  writeStore("afterglow-settings", {
    quality,
    volume: audio.volume,
    audio: audioPreference,
  });
}
function fatal(text) {
  $("loading").hidden = true;
  $("fatal").hidden = false;
  $("fatalText").textContent = text;
}
function resize() {
  renderDirty = true;
  const dpr = {
    low: 1,
    medium: Math.min(devicePixelRatio, 1.35),
    high: Math.min(devicePixelRatio, 2),
  }[quality];
  renderer.setPixelRatio(dpr);
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
function setQuality(q) {
  quality = q;
  $("quality").value = q;
  $("pauseQuality").value = q;
  world.setQuality(q);
  resize();
  settings();
}
function selectCraft(kind) {
  craft = kind;
  all("[data-craft]").forEach((b) =>
    b.classList.toggle("selected", b.dataset.craft === kind),
  );
  for (const [key, boat] of Object.entries(boats)) boat.visible = key === kind;
  const spec = CRAFT[kind];
  $("craftName").innerHTML = `${spec.name} <i>${spec.number}</i>`;
  $("craftDescription").textContent = spec.tag;
  $("craftSpec").textContent = `${Math.round(spec.max * 1.94384)} KNOTS`;
  cameraReady = false;
}
function resetWorld() {
  state = freshState();
  world.reset(seed, route);
  world.update(0, time, state, CRAFT[craft], signal, mode === "free");
  $("seedText").textContent = `CHART ${String(seed).padStart(4, "0")}`;
  $("chartFooter").textContent =
    $("routeSelect").selectedOptions[0].textContent.toUpperCase();
  cameraReady = false;
}
all("[data-craft]").forEach((b) =>
  b.addEventListener("click", () => selectCraft(b.dataset.craft)),
);
all("[data-mode]").forEach((b) =>
  b.addEventListener("click", () => {
    mode = b.dataset.mode;
    all("[data-mode]").forEach((el) =>
      el.classList.toggle("selected", el === b),
    );
    $("modeDescription").textContent =
      mode === "voyage"
        ? "Seven signals. One last mixtape. Follow the light home."
        : "An open horizon. An endless summer. No destination required.";
  }),
);
$("routeSelect").addEventListener("change", (e) => {
  route = e.target.value;
  resetWorld();
});
$("shuffleBtn").addEventListener("click", () => {
  seed = 1 + Math.floor(Math.random() * 9998);
  resetWorld();
});
$("quality").addEventListener("change", (e) => setQuality(e.target.value));
$("pauseQuality").addEventListener("change", (e) => setQuality(e.target.value));
function syncAudio() {
  const on = audio.enabled;
  $("soundState").textContent = on ? "ON" : "OFF";
  $("audioToggle").checked = on;
  $("soundBtn").setAttribute("aria-pressed", String(on));
  $("volume").value = Math.round(audio.volume * 100);
  settings();
}
function toggleAudio() {
  audioPreference = !audio.enabled;
  audio.setEnabled(audioPreference);
  syncAudio();
}
$("soundBtn").addEventListener("click", toggleAudio);
$("audioToggle").addEventListener("change", toggleAudio);
$("volume").addEventListener("input", (e) => {
  audio.setVolume(+e.target.value / 100);
  settings();
});
function showHint(text, duration = 5) {
  $("hintText").textContent = text;
  $("hint").hidden = false;
  hintUntil = time + duration;
}
function radio(text, duration = 12) {
  $("radioText").textContent = text;
  $("radio").hidden = false;
  radioUntil = time + duration;
}
function start(resume = false) {
  signal = 0;
  elapsed = 0;
  travel = 0;
  camMode = 0;
  lookYaw = 0;
  lookPitch = 0;
  endingDelay = 0;
  status = "playing";
  keys.clear();
  if (resume && storedSave) {
    const s = storedSave;
    craft = s.craft;
    route = s.route;
    seed = s.seed;
    mode = s.signal >= 7 ? "free" : s.mode;
    signal = s.signal;
    elapsed = s.elapsed;
    travel = s.state.distance;
    selectCraft(craft);
    $("routeSelect").value = route;
    resetWorld();
    state = { ...freshState(), ...s.state, speed: 0, cruise: false };
  } else resetWorld();
  status = "playing";
  startedOnce = true;
  document.body.classList.add("playing");
  $("menu").hidden = true;
  $("postcard").hidden = true;
  $("toolbar").hidden = false;
  $("hud").hidden = false;
  $("pause").hidden = true;
  $("ending").hidden = true;
  $("touch").hidden = !matchMedia("(pointer:coarse)").matches;
  cameraReady = false;
  audio.setEnabled(audioPreference);
  audio.setPaused(false);
  syncAudio();
  updateDestination();
  radio(
    resume
      ? "Still here. Still summer. Pick up wherever you left off."
      : mode === "voyage"
        ? "This is Sunset FM. One last broadcast, somewhere off the coast. Follow the cyan signals. We left a little light on for you."
        : "You’re off the clock. Pick a horizon. There’s more water than worries out here.",
    14,
  );
  showHint("W / ↑ to ease into the evening", 12);
  save();
}
$("startBtn").addEventListener("click", () => start());
$("resumeBtn").addEventListener("click", () => start(true));
function pause() {
  if (status === "playing") {
    status = "paused";
    keys.clear();
    dragging = false;
    $("pause").hidden = false;
    audio.setPaused(true);
    save();
  } else if (status === "paused") unpause();
}
function unpause() {
  status = "playing";
  $("pause").hidden = true;
  audio.setPaused(false);
  lastTime = performance.now();
}
$("pauseBtn").addEventListener("click", pause);
$("continueBtn").addEventListener("click", unpause);
function returnToShore() {
  save();
  status = "menu";
  keys.clear();
  $("menu").hidden = false;
  $("postcard").hidden = false;
  $("pause").hidden = true;
  $("ending").hidden = true;
  $("hud").hidden = true;
  $("touch").hidden = true;
  $("toolbar").hidden = true;
  document.body.classList.remove("playing", "clean");
  showUI = true;
  all("[data-mode]").forEach((b) =>
    b.classList.toggle("selected", b.dataset.mode === mode),
  );
  $("modeDescription").textContent =
    mode === "voyage"
      ? "Seven signals. One last mixtape. Follow the light home."
      : "An open horizon. An endless summer. No destination required.";
  audio.setPaused(true);
  storedSave = readStore("afterglow-save");
  $("resumeBtn").hidden = !storedSave;
  selectCraft(craft);
  resetWorld();
}
$("returnBtn").addEventListener("click", returnToShore);
$("anotherBtn").addEventListener("click", returnToShore);
$("helpBtn").addEventListener("click", () => {
  $("guide").hidden = false;
});
$("closeGuide").addEventListener("click", () => {
  $("guide").hidden = true;
});
$("sailOnBtn").addEventListener("click", () => {
  mode = "free";
  status = "playing";
  $("ending").hidden = true;
  audio.setPaused(false);
  updateDestination();
  radio(
    "No more signals. No more goodbyes. The rest of the evening belongs to you.",
    10,
  );
  save();
});
function changeCamera() {
  camMode = (camMode + 1) % 3;
  lookYaw = 0;
  lookPitch = 0;
  showHint(["Chase camera", "At the helm", "Wide horizon"][camMode], 3);
}
$("cameraBtn").addEventListener("click", changeCamera);
function recover() {
  const z = state.z;
  state.x = routeX(z, seed, route);
  state.speed = 0;
  state.cruise = false;
  state.heading = Math.atan2(routeX(z - 100, seed, route) - state.x, 100);
  state.bank = 0;
  cameraReady = false;
  showHint("Back in open water. Take your time.", 5);
}
window.addEventListener("keydown", (e) => {
  if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
  const k = e.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k))
    e.preventDefault();
  if (e.repeat) return;
  if (k === "escape") {
    if (!$("guide").hidden) $("guide").hidden = true;
    else pause();
    return;
  }
  if (k === "m") {
    toggleAudio();
    return;
  }
  if (status !== "playing") return;
  if (k === "shift") {
    state.cruise = !state.cruise;
    showHint(
      state.cruise ? "Cruise set. Just steer and breathe." : "Cruise released.",
      3,
    );
  } else if (k === "c") changeCamera();
  else if (k === "r") recover();
  else if (k === "h") {
    showUI = !showUI;
    document.body.classList.toggle("clean", !showUI);
  }
  keys.add(k);
});
window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));
window.addEventListener("blur", () => {
  keys.clear();
  if (status === "playing") pause();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && status === "playing") pause();
});
window.addEventListener("pagehide", save);
$("sea").addEventListener("pointerdown", (e) => {
  if (status !== "playing") return;
  dragging = true;
  pointerX = e.clientX;
  pointerY = e.clientY;
  $("sea").setPointerCapture(e.pointerId);
});
$("sea").addEventListener("pointermove", (e) => {
  if (!dragging) return;
  lookYaw -= (e.clientX - pointerX) * 0.005;
  lookPitch = Math.max(
    -0.28,
    Math.min(0.45, lookPitch + (e.clientY - pointerY) * 0.003),
  );
  pointerX = e.clientX;
  pointerY = e.clientY;
  lookIdle = time;
});
for (const event of ["pointerup", "pointercancel"])
  $("sea").addEventListener(event, () => {
    dragging = false;
    lookIdle = time;
  });
all("[data-key]").forEach((b) => {
  b.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    keys.add(b.dataset.key);
    b.setPointerCapture(e.pointerId);
  });
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    b.addEventListener(event, () => keys.delete(b.dataset.key));
});
function input() {
  let throttle =
      (keys.has("w") || keys.has("arrowup") ? 1 : 0) -
      (keys.has("s") || keys.has("arrowdown") ? 1 : 0),
    steer =
      (keys.has("d") || keys.has("arrowright") ? 1 : 0) -
      (keys.has("a") || keys.has("arrowleft") ? 1 : 0),
    brake = keys.has(" ");
  const pad = [...(navigator.getGamepads?.() || [])].find((p) => p?.connected);
  if (pad) {
    const axis = pad.axes[0] || 0;
    if (Math.abs(axis) > 0.12) steer = axis;
    const t = (pad.buttons[7]?.value || 0) - (pad.buttons[6]?.value || 0);
    if (Math.abs(t) > 0.05) throttle = t;
    brake = brake || pad.buttons[0]?.pressed;
    const press = pad.buttons[9]?.pressed;
    if (press && !gamepadConnected) pause();
    gamepadConnected = !!press;
  }
  return { throttle, steer, brake };
}
function updateDestination() {
  if (mode === "free" || signal >= SIGNALS.length) {
    $("signalCount").textContent = "OFF THE CLOCK";
    $("destinationName").textContent = "Nowhere in particular";
    $("distance").textContent = "∞";
    $("distanceUnit").textContent = "";
    $("directionText").textContent = "THE HORIZON IS YOURS";
    $("navArrow").hidden = true;
    $("journeyProgress").style.width = "100%";
    return;
  }
  $("signalCount").textContent =
    `SIGNAL ${String(signal + 1).padStart(2, "0")} / 07`;
  $("destinationName").textContent = SIGNALS[signal].name;
  $("distanceUnit").textContent = "KM";
  $("navArrow").hidden = false;
  $("journeyProgress").style.width = `${(signal / 7) * 100}%`;
}
function collectSignal() {
  audio.signal();
  const s = SIGNALS[signal];
  radio(s.line, signal === 6 ? 17 : 15);
  signal++;
  updateDestination();
  if (signal === 7) {
    endingDelay = 18;
    showHint("You’re home. Let the last song play.", 16);
  } else showHint("Signal found. The next light is waiting.", 5);
  save();
}
function finish() {
  status = "ending";
  state.cruise = false;
  state.speed *= 0.2;
  $("ending").hidden = false;
  const minutes = Math.max(1, Math.round(elapsed / 60));
  $("voyageStats").textContent =
    `${minutes} ${minutes === 1 ? "MINUTE" : "MINUTES"} AT SEA  /  ${(state.distance / 1000).toFixed(1)} KM OF SUMMER`;
  save();
}
function save() {
  if (!startedOnce || status === "menu") return;
  const s = {
    version: 1,
    craft,
    route,
    seed,
    mode,
    signal,
    elapsed,
    state: { ...state },
  };
  writeStore("afterglow-save", s);
  storedSave = s;
}
function updateCamera(dt) {
  const menu = status === "menu",
    spec = CRAFT[craft],
    h = state.heading + lookYaw,
    forward = new THREE.Vector3(Math.sin(h), 0, -Math.cos(h));
  if (menu) {
    desiredPos.set(state.x + Math.sin(time * 0.06) * 0.7, 3.8, state.z + 17);
    desiredTarget.set(state.x - 8, 4.0, state.z - 20);
    camera.fov = 52;
  } else if (camMode === 1) {
    desiredPos.set(
      state.x + Math.sin(state.heading) * 0.4,
      craft === "yacht" ? 2.8 : craft === "jetski" ? 2.05 : 1.85,
      state.z - Math.cos(state.heading) * 0.4,
    );
    desiredTarget.copy(desiredPos).addScaledVector(forward, 70);
    desiredTarget.y = desiredPos.y - 1.2 + lookPitch * 35;
    camera.fov = 68;
  } else {
    const wide = camMode === 2,
      back =
        (wide ? 29 : 18) + spec.length * 0.55 + Math.abs(state.speed) * 0.04;
    desiredPos.set(
      state.x - forward.x * back,
      (wide ? 10 : 4.6) + spec.length * 0.13 + lookPitch * 10,
      state.z - forward.z * back,
    );
    desiredTarget.set(
      state.x + forward.x * (wide ? 25 : 20),
      desiredPos.y - 0.35,
      state.z + forward.z * (wide ? 25 : 20),
    );
    camera.fov = wide ? 61 : 57;
  }
  if (!cameraReady) {
    camera.position.copy(desiredPos);
    target.copy(desiredTarget);
    cameraReady = true;
  } else {
    const a = 1 - Math.exp(-dt * (menu ? 1.5 : 3));
    camera.position.lerp(desiredPos, a);
    target.lerp(desiredTarget, a);
  }
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  renderer._cameraPosition = camera.position;
}
function updateHUD() {
  const speed = Math.round(Math.abs(state.speed) * 1.94384);
  $("speed").textContent = String(speed).padStart(2, "0");
  const n = Math.round((Math.abs(state.speed) / CRAFT[craft].max) * 18);
  [...$("speedBars").children].forEach((el, i) =>
    el.classList.toggle("lit", i < n),
  );
  $("cruiseLabel").textContent = state.cruise
    ? "● CRUISE CONTROL SET"
    : "SHIFT · CRUISE CONTROL";
  $("cruiseLabel").style.color = state.cruise ? "#86ede8" : "";
  if (mode === "voyage" && signal < 7) {
    const s = station(signal, seed, route),
      dist = Math.hypot(state.x - s.x, state.z - s.z),
      angle = Math.atan2(s.x - state.x, -(s.z - state.z)),
      delta = angleDelta(angle, state.heading);
    $("distance").textContent = (dist / 1000).toFixed(1);
    $("navArrow").style.transform = `rotate(${delta}rad)`;
    $("directionText").textContent =
      Math.abs(delta) < 0.28
        ? "FOLLOW THE CYAN LIGHT"
        : delta > 0
          ? "BEAR RIGHT"
          : "BEAR LEFT";
  }
}
function drawMap() {
  const ctx = mapCtx,
    w = 200,
    h = 170,
    scale = 0.105;
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w / 2, h * 0.68);
  ctx.strokeStyle = "#a7a4c91a";
  ctx.lineWidth = 0.5;
  for (let i = -200; i <= 200; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, -200);
    ctx.lineTo(i, 200);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-200, i);
    ctx.lineTo(200, i);
    ctx.stroke();
  }
  ctx.scale(scale, scale);
  ctx.translate(-state.x, -state.z);
  ctx.strokeStyle = "#735285";
  ctx.lineWidth = 1 / scale;
  ctx.fillStyle = "#785d983a";
  for (const p of world.islands) {
    ctx.beginPath();
    ctx.ellipse(p.x, p.z, p.rx, p.rz, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.strokeStyle = "#89cbd34a";
  ctx.lineWidth = 1 / scale;
  ctx.setLineDash([4 / scale, 5 / scale]);
  for (let z = state.z - 1600; z <= state.z + 900; z += 70) {
    const x = routeX(z, seed, route);
    if (z === state.z - 1600) ctx.moveTo(x, z);
    else ctx.lineTo(x, z);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  if (mode === "voyage" && signal < 7) {
    const s = station(signal, seed, route);
    ctx.beginPath();
    ctx.strokeStyle = "#7dfff0";
    ctx.lineWidth = 1.5 / scale;
    ctx.arc(s.x, s.z, 7 / scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#7dfff0";
    ctx.beginPath();
    ctx.arc(s.x, s.z, 2.5 / scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.translate(state.x, state.z);
  ctx.rotate(state.heading);
  ctx.fillStyle = "#ffda89";
  ctx.beginPath();
  ctx.moveTo(0, -6 / scale);
  ctx.lineTo(4 / scale, 5 / scale);
  ctx.lineTo(0, 3 / scale);
  ctx.lineTo(-4 / scale, 5 / scale);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.max(0, Math.min((now - lastTime) / 1000, 0.25));
  lastTime = now;
  frame++;
  const running = status === "playing",
    ambient = status === "menu" || running || status === "ending";
  if (ambient) time += dt;
  if (running) {
    const controls = input();
    if (status === "playing") {
      const substeps = Math.max(1, Math.ceil(dt / 0.05));
      for (let step = 0; step < substeps; step++)
        stepBoat(state, controls, craft, dt / substeps);
      elapsed += dt;
      travel = state.distance;
      if (!dragging && time - lookIdle > 2) {
        lookYaw *= Math.exp(-dt * 0.7);
        lookPitch *= Math.exp(-dt * 0.7);
      }
      if (mode === "voyage" && signal < 7) {
        const s = station(signal, seed, route);
        if (Math.hypot(state.x - s.x, state.z - s.z) < 75) collectSignal();
      }
      if (endingDelay > 0) {
        endingDelay -= dt;
        if (endingDelay <= 0) finish();
      }
      if (elapsed > 14 && elapsed < 15 && !state.cruise)
        showHint("Shift holds your speed. A / D lets you wander.", 9);
      if (elapsed > 32 && elapsed < 33)
        showHint("Drag to look around. C changes your view.", 7);
      if (controls.throttle > 0 && elapsed > 3 && elapsed < 10)
        $("hint").hidden = true;
      saveTimer += dt;
      if (saveTimer > 5) {
        saveTimer = 0;
        save();
      }
    }
  }
  if (ambient) {
    world.update(dt, time, state, CRAFT[craft], signal, mode === "free");
    if (
      running &&
      collide(state, world.islands, craft) &&
      time - lastCollision > 3
    ) {
      lastCollision = time;
      showHint(
        "A gentle nudge from the shore. R returns you to open water.",
        6,
      );
    }
    const boat = boats[craft];
    boat.position.set(
      state.x,
      0.06 + Math.sin(time * 1.1) * 0.05 + Math.sin(time * 2.4) * 0.025,
      state.z,
    );
    boat.rotation.set(
      Math.sin(time * 1.4) * 0.012 -
        Math.min(0.04, Math.abs(state.speed) * 0.001),
      -state.heading + (status === "menu" ? 0.48 : 0),
      state.bank + Math.sin(time * 0.85) * 0.012,
    );
    updateCamera(dt);
    audio.update(running ? state.speed : 0);
  }
  if (time > radioUntil) $("radio").hidden = true;
  if (time > hintUntil) $("hint").hidden = true;
  if (running) {
    hudTimer += dt;
    mapTimer += dt;
    if (hudTimer > 0.1) {
      hudTimer = 0;
      updateHUD();
    }
    if (mapTimer > 0.1) {
      mapTimer = 0;
      drawMap();
    }
  }
  if (ambient || renderDirty) {
    world.renderReflection(camera, target, frame);
    renderer.render(scene, camera);
    renderDirty = false;
  }
}
$("sea").addEventListener("webglcontextlost", (e) => {
  e.preventDefault();
  if (status === "playing") pause();
  fatal(
    "The graphics context was interrupted. Reload to return to your saved voyage.",
  );
});
document.body.dataset.ready = "true";
selectCraft(craft);
setQuality(quality);
resetWorld();
resize();
updateCamera(0.016);
$("loading").style.opacity = "0";
setTimeout(() => ($("loading").hidden = true), 550);
requestAnimationFrame(animate);
// DEV-ONLY-START
if (new URLSearchParams(location.search).has("test")) {
  window.__AFTERGLOW__ = {
    get diagnostics() {
      return { frame, time, endingDelay };
    },
    get state() {
      return {
        ...state,
        craft,
        route,
        seed,
        mode,
        status,
        signal,
        elapsed,
        quality,
      };
    },
    teleport(x, z, heading = 0) {
      state.x = x;
      state.z = z;
      state.heading = heading;
      state.speed = 0;
      state.cruise = false;
      cameraReady = false;
    },
    toSignal(index = signal) {
      const s = station(index, seed, route);
      this.teleport(s.x, s.z);
    },
    setSpeed(v) {
      state.speed = v;
    },
    start,
    finish,
    world,
    renderer,
    scene,
    camera,
  };
}
// DEV-ONLY-END
