export const TAU = Math.PI * 2;
export const VOYAGE_LENGTH = 21800;
export const CRAFT = {
  runabout: {
    name: "Daydream",
    tag: "A little speed. A lot of soul.",
    max: 38,
    accel: 5.5,
    turn: 0.56,
    length: 6.8,
    beam: 2.55,
    number: "01",
  },
  jetski: {
    name: "Pulse",
    tag: "For the restless part of you.",
    max: 47,
    accel: 9,
    turn: 0.92,
    length: 3.4,
    beam: 1.22,
    number: "02",
  },
  yacht: {
    name: "Slowdance",
    tag: "Nowhere to be. Nothing to prove.",
    max: 29,
    accel: 3.2,
    turn: 0.36,
    length: 10.2,
    beam: 3.55,
    number: "03",
  },
};
export const SIGNALS = [
  {
    z: 650,
    name: "The first light",
    line: "Hey, stranger. You found the frequency. Seven signals out here, seven songs I never got to send. Take the long way, will you?",
  },
  {
    z: 3750,
    name: "Where the palms lean",
    line: "We used to come here after closing. Shoes on the dashboard. Salt on everything. I thought summer was a place you could keep.",
  },
  {
    z: 7200,
    name: "Electric cathedral",
    line: "There’s a whole cathedral made of stone out here. No doors. No ceiling. Just the kind of quiet that makes you listen.",
  },
  {
    z: 10650,
    name: "The blue hour",
    line: "Funny how the things you remember aren’t the big things. A loose cassette. A broken speedometer. The way the water looked at six.",
  },
  {
    z: 14100,
    name: "A place to disappear",
    line: "If you’re wondering where I went… I followed the coast. Found a little house. Learned to leave some days completely empty.",
  },
  {
    z: 17700,
    name: "One more song",
    line: "This one’s for the people we were. And the people we’re still becoming. Wherever you are, I hope you left the windows open.",
  },
  {
    z: 21800,
    name: "Home, eventually",
    line: "You made it. I knew you would. There’s no grand finale. Just this light, this water, and a little more time. Welcome home.",
  },
];
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function routeX(z, seed = 284, route = "palms") {
  const p = seed * 0.013,
    amp = route === "arches" ? 155 : route === "islands" ? 230 : 125;
  return (
    Math.sin(z * 0.00047 + p) * amp +
    Math.sin(z * 0.00113 + p * 2) * amp * 0.36 -
    (Math.sin(p) * amp + Math.sin(p * 2) * amp * 0.36)
  );
}
export function station(index, seed, route) {
  const s = SIGNALS[index];
  return { ...s, x: routeX(-s.z, seed, route), z: -s.z };
}
export function chunkPlan(index, seed, route) {
  const random = rng((seed + Math.imul(index, 65731)) >>> 0),
    z = -index * 600;
  const islands = [];
  for (const side of [-1, 1]) {
    const iz = z + (random() - 0.5) * 130,
      rx = 85 + random() * 65,
      rz = 220 + random() * 90;
    islands.push({
      x: routeX(iz, seed, route) + side * (rx + 95 + random() * 60),
      z: iz,
      rx,
      rz,
      height: 22 + random() * 55,
      side,
      palms: route === "islands" ? 10 : 18,
    });
  }
  return { index, z, islands, seed: (seed + Math.imul(index, 65731)) >>> 0 };
}
export function freshState() {
  return {
    x: 0,
    z: 0,
    heading: 0,
    speed: 0,
    steer: 0,
    bank: 0,
    cruise: false,
    distance: 0,
  };
}
export function stepBoat(state, input, craft, dt) {
  dt = Math.min(dt, 0.05);
  const spec = CRAFT[craft];
  if (input.throttle !== 0) {
    state.cruise = false;
    state.speed += input.throttle * spec.accel * dt;
  } else if (state.cruise) {
    state.speed += (spec.max * 0.76 - state.speed) * Math.min(1, dt * 0.7);
  } else state.speed *= Math.exp(-dt * 0.055);
  if (input.brake) {
    state.speed *= Math.exp(-dt * 1.7);
    state.cruise = false;
  }
  state.speed = Math.max(-spec.max * 0.2, Math.min(spec.max, state.speed));
  state.steer += (input.steer - state.steer) * Math.min(1, dt * 4);
  const authority = Math.min(1, Math.abs(state.speed) / 8);
  state.heading +=
    state.steer * spec.turn * authority * dt * (state.speed < 0 ? -1 : 1);
  state.bank +=
    (-state.steer * Math.min(1, Math.abs(state.speed) / spec.max) * 0.17 -
      state.bank) *
    Math.min(1, dt * 3);
  state.x += Math.sin(state.heading) * state.speed * dt;
  state.z -= Math.cos(state.heading) * state.speed * dt;
  state.distance += Math.abs(state.speed) * dt;
  return state;
}
export function collide(state, islands, craft) {
  let hit = false;
  const margin = CRAFT[craft].beam * 0.6;
  for (const p of islands) {
    const rx = p.rx + margin,
      rz = p.rz + margin,
      dx = state.x - p.x,
      dz = state.z - p.z,
      q = Math.hypot(dx / rx, dz / rz);
    if (q < 1) {
      const angle = Math.atan2(dz / rz, dx / rx);
      state.x = p.x + Math.cos(angle) * (rx + 1);
      state.z = p.z + Math.sin(angle) * (rz + 1);
      state.speed *= 0.25;
      state.cruise = false;
      hit = true;
    }
  }
  return hit;
}
export function angleDelta(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}
