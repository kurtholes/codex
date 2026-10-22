export type Vec2 = { x: number; z: number };
export const ISLANDS = [
  { x: 0, z: 20, rx: 17, rz: 26, name: 'The Pilgrim’s Rest' },
  { x: 0, z: -46, rx: 18, rz: 19, name: 'The Whispering Reach' },
  { x: 0, z: -99, rx: 22, rz: 22, name: 'The Cinder Choir' },
  { x: 0, z: -173, rx: 35, rz: 34, name: 'The Hollow Crown' },
];
export const BRIDGES = [
  { start: -5, end: -29, width: 5.4 },
  { start: -62, end: -80, width: 5.4 },
  { start: -118, end: -143, width: 6 },
];
export const BEACONS = [
  { x: -9, z: -45, name: 'The Voice', word: 'REMEMBER', line: 'We did not build the Crown to outlive the sun. We built it to remember its warmth.' },
  { x: 12, z: -97, name: 'The Heart', word: 'FORGIVE', line: 'The fire was never stolen. It was given freely, by a star that loved its children.' },
  { x: -13, z: -165, name: 'The Soul', word: 'BECOME', line: 'One ember remains. You can rekindle the world… or let it dream of something new.' },
];
export const MEMORIES = [
  { x: 9, z: 12, title: 'I. A promise in the ash', text: '“When the sky grows dark, follow the bells.” Your mother said it as though darkness were a place you could simply walk through.' },
  { x: 10, z: -48, title: 'II. The last gardener', text: 'Someone planted a seed here, long after the rain stopped. Beside it: a little cup, carefully filled with dust.' },
  { x: -12, z: -103, title: 'III. An unfinished letter', text: '“I have watched six thousand sunsets. I would trade them all for one more morning with you.” There is no signature.' },
  { x: 17, z: -178, title: 'IV. What the light keeps', text: 'The Crown holds no king. Only the memories of everyone who ever called this world home. You hear your own name among them.' },
];
export const SAVE_KEY = 'vesper-save-v1';
export type SaveData = { version: 1; activated: boolean[]; memories: number[]; checkpoint: Vec2; ending?: 'rekindle' | 'release' };
export function freshSave(): SaveData { return { version: 1, activated: [false, false, false], memories: [], checkpoint: { x: 0, z: 23 } }; }
export function parseSave(raw: string | null): SaveData | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    if (s.version !== 1 || !Array.isArray(s.activated) || s.activated.length !== 3 || !s.activated.every((v: unknown) => typeof v === 'boolean')) return null;
    if (!Array.isArray(s.memories) || !s.memories.every((v: unknown) => Number.isInteger(v) && Number(v) >= 0 && Number(v) < 4)) return null;
    if (!s.checkpoint || !Number.isFinite(s.checkpoint.x) || !Number.isFinite(s.checkpoint.z) || !isWalkable(s.checkpoint.x, s.checkpoint.z)) return null;
    if (s.ending && s.ending !== 'rekindle' && s.ending !== 'release') return null;
    return { version: 1, activated: s.activated, memories: [...new Set(s.memories)] as number[], checkpoint: s.checkpoint, ...(s.ending ? { ending: s.ending } : {}) };
  } catch { return null; }
}
export function isWalkable(x: number, z: number): boolean {
  return ISLANDS.some(i => ((x - i.x) / i.rx) ** 2 + ((z - i.z) / i.rz) ** 2 <= 1)
    || BRIDGES.some(b => z <= b.start + 1 && z >= b.end - 1 && Math.abs(x) <= b.width / 2);
}
export function distance(a: Vec2, b: Vec2) { return Math.hypot(a.x - b.x, a.z - b.z); }
export class GameState {
  save: SaveData;
  x = 0; z = 23; y = 0; vy = 0; yaw = Math.PI;
  stamina = 100; pulseCooldown = 0; invulnerable = 0; resolve = 100;
  steps = 0; moving = false; sprinting = false; falling = false;
  constructor(save?: SaveData) { this.save = save ?? freshSave(); this.restore(); }
  restore() { this.x = this.save.checkpoint.x; this.z = this.save.checkpoint.z; this.y = 0; this.vy = 0; this.resolve = 100; this.stamina = 100; this.invulnerable = 3; this.falling = false; }
  update(dt: number, moveX: number, moveZ: number, sprint: boolean, jump: boolean): 'fall' | null {
    dt = Math.min(dt, .05);
    this.pulseCooldown = Math.max(0, this.pulseCooldown - dt);
    this.invulnerable = Math.max(0, this.invulnerable - dt);
    const length = Math.hypot(moveX, moveZ);
    this.moving = length > .12;
    this.sprinting = sprint && this.stamina > 1 && this.moving;
    const speed = this.sprinting ? 13 : 7.2;
    if (this.moving) {
      this.x += moveX / Math.max(1, length) * speed * dt;
      this.z += moveZ / Math.max(1, length) * speed * dt;
      this.yaw = Math.atan2(moveX, moveZ);
      this.steps += dt * (this.sprinting ? 13 : 9);
    }
    this.stamina = Math.min(100, Math.max(0, this.stamina + dt * (this.sprinting ? -22 : 17)));
    if (jump && this.y === 0 && isWalkable(this.x, this.z)) this.vy = 8;
    this.vy -= 21 * dt;
    this.y += this.vy * dt;
    if (this.y <= 0 && isWalkable(this.x, this.z) && !this.falling) { this.y = 0; this.vy = 0; }
    else if (this.y < -.7) this.falling = true;
    if (this.y < -19) { this.restore(); return 'fall'; }
    return null;
  }
  pulse() { if (this.pulseCooldown > 0 || this.y < -1) return false; this.pulseCooldown = 8; return true; }
  hurt(amount: number) {
    if (this.invulnerable > 0) return false;
    this.resolve -= amount; this.invulnerable = 1.8;
    if (this.resolve <= 0) { this.restore(); return true; }
    return false;
  }
  activate(index: number) {
    if (index < 0 || index >= BEACONS.length) return;
    this.save.activated[index] = true;
    this.save.checkpoint = { x: 0, z: BEACONS[index].z + 5 };
    this.resolve = 100;
  }
  get count() { return this.save.activated.filter(Boolean).length; }
  get region() { return ISLANDS.reduce((a, b) => Math.abs(this.z - a.z) < Math.abs(this.z - b.z) ? a : b).name; }
}
export class ResonancePuzzle {
  rings: number[];
  selected = 0;
  constructor(index: number) { this.rings = [[2, 5, 7], [3, 6, 2], [5, 3, 6]][index].slice(); }
  rotate(direction: number) { this.rings[this.selected] = (this.rings[this.selected] + direction + 8) % 8; }
  get solved() { return this.rings.every(r => r === 0); }
}
