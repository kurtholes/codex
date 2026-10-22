import { describe, it, expect } from 'vitest';
import { GameState, ResonancePuzzle, isWalkable, parseSave, freshSave, BEACONS, ISLANDS, BRIDGES } from '../src/game';

describe('the pilgrimage route', () => {
  it('connects every island and bridge continuously to the Crown', () => {
    for (let z = 40; z >= -184; z -= .25) expect(isWalkable(0, z), `route at z=${z}`).toBe(true);
    for (const i of ISLANDS) expect(isWalkable(i.x, i.z)).toBe(true);
    for (const b of BRIDGES) expect(isWalkable(b.width, (b.start + b.end) / 2)).toBe(false);
    for (const b of BEACONS) expect(isWalkable(b.x, b.z)).toBe(true);
  });
  it('supports walking, jumping, stamina-limited sprinting, and recovery', () => {
    const g = new GameState();
    for (let i = 0; i < 60; i++) g.update(1 / 60, 0, -1, false, false);
    expect(g.z).toBeCloseTo(15.8, 2);
    g.update(1 / 60, 0, 0, false, true); expect(g.y).toBeGreaterThan(0);
    for (let i = 0; i < 90; i++) g.update(1 / 60, 0, 0, false, false);
    expect(g.y).toBe(0);
    const z = g.z;
    for (let i = 0; i < 60; i++) g.update(1 / 60, 0, -1, true, false);
    expect(z - g.z).toBeCloseTo(13, 1); expect(g.stamina).toBeLessThan(80);
    for (let i = 0; i < 120; i++) g.update(1 / 60, 0, 0, false, false);
    expect(g.stamina).toBe(100);
  });
  it('normalizes diagonal movement', () => {
    const g = new GameState(); g.update(.05, 1, 1, false, false);
    expect(Math.hypot(g.x, g.z - 23)).toBeCloseTo(.36, 3);
  });
  it('restores the last awakened checkpoint after a fall without losing memories', () => {
    const g = new GameState(); g.activate(1); g.save.memories.push(2); g.x = 200;
    let fell = false;
    for (let i = 0; i < 150; i++) if (g.update(1 / 60, 0, 0, false, false) === 'fall') fell = true;
    expect(fell).toBe(true); expect(g.x).toBe(0); expect(g.z).toBe(-92);
    expect(g.save.memories).toEqual([2]); expect(g.count).toBe(1); expect(g.resolve).toBe(100);
  });
});
describe('resonance, guardians, and persistence', () => {
  it('solves each resonator by aligning all three rings, including wraparound', () => {
    for (let i = 0; i < 3; i++) {
      const p = new ResonancePuzzle(i); expect(p.solved).toBe(false);
      for (let ring = 0; ring < 3; ring++) { p.selected = ring; while (p.rings[ring] !== 0) p.rotate(1); }
      expect(p.solved).toBe(true); p.rotate(-1); expect(p.rings[2]).toBe(7); expect(p.solved).toBe(false);
    }
  });
  it('enforces the pulse cooldown', () => {
    const g = new GameState(); expect(g.pulse()).toBe(true); expect(g.pulse()).toBe(false);
    for (let i = 0; i < 501; i++) g.update(1 / 60, 0, 0, false, false);
    expect(g.pulse()).toBe(true);
  });
  it('grants invulnerability between guardian attacks and restores depleted resolve', () => {
    const g = new GameState(); g.invulnerable = 0; expect(g.hurt(34)).toBe(false); expect(g.resolve).toBe(66);
    g.hurt(34); expect(g.resolve).toBe(66);
    g.invulnerable = 0; expect(g.hurt(100)).toBe(true); expect(g.resolve).toBe(100);
  });
  it('roundtrips progress and validates corrupted or unsafe saves', () => {
    const g = new GameState(); g.activate(0); g.activate(2); g.save.memories = [0, 3]; g.save.ending = 'release';
    expect(parseSave(JSON.stringify(g.save))).toEqual(g.save);
    const restored = new GameState(parseSave(JSON.stringify(g.save))!); expect(restored.z).toBe(-160); expect(restored.count).toBe(2);
    expect(parseSave('{broken')).toBeNull(); expect(parseSave(null)).toBeNull();
    expect(parseSave(JSON.stringify({ ...freshSave(), checkpoint: { x: 400, z: 0 } }))).toBeNull();
    expect(parseSave(JSON.stringify({ ...freshSave(), memories: [9] }))).toBeNull();
    expect(parseSave(JSON.stringify({ ...freshSave(), activated: [1, 1, 1] }))).toBeNull();
    expect(parseSave(JSON.stringify({ ...freshSave(), ending: 'invalid' }))).toBeNull();
  });
});
