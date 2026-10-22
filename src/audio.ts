export class Soundscape {
  context: AudioContext | null = null;
  master: GainNode | null = null;
  muted = false;
  private wind: AudioBufferSourceNode | null = null;
  private footTimer = 0;
  start() {
    if (this.context) { void this.context.resume(); return; }
    const ctx = this.context = new AudioContext();
    const master = this.master = ctx.createGain();
    master.gain.value = this.muted ? 0 : .4;
    master.connect(ctx.destination);
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 5, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) { last = (last + (Math.random() * 2 - 1) * .025) / 1.025; data[i] = last * 3; }
    const wind = this.wind = ctx.createBufferSource(); wind.buffer = buffer; wind.loop = true;
    const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 600;
    const gain = ctx.createGain(); gain.gain.value = .32;
    wind.connect(filter).connect(gain).connect(master); wind.start();
    [55, 82.41, 110.15, 164.81].forEach((freq, i) => {
      const osc = ctx.createOscillator(); const g = ctx.createGain(); osc.type = 'sine'; osc.frequency.value = freq; g.gain.value = .026 / (1 + i * .3);
      osc.connect(g).connect(master); osc.start();
      const lfo = ctx.createOscillator(); const lg = ctx.createGain(); lfo.frequency.value = .07 + i * .017; lg.gain.value = .012; lfo.connect(lg).connect(g.gain); lfo.start();
    });
  }
  toggle() { this.muted = !this.muted; if (this.master && this.context) this.master.gain.setTargetAtTime(this.muted ? 0 : .4, this.context.currentTime, .2); return this.muted; }
  tone(freq: number, duration = 1, volume = .2, type: OscillatorType = 'sine', delay = 0) {
    if (!this.context || !this.master) return;
    const ctx = this.context; const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = type; osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(volume, t + .025); gain.gain.exponentialRampToValueAtTime(.0001, t + duration);
    osc.connect(gain).connect(this.master); osc.start(t); osc.stop(t + duration + .05);
  }
  chime() { [220, 329.63, 440, 659.25].forEach((f, i) => this.tone(f, 3.5, .18, 'sine', i * .18)); }
  pulse() { this.tone(68, 1.3, .5, 'sine'); this.tone(440, .8, .12, 'triangle'); }
  tick() { this.tone(660, .15, .08, 'sine'); }
  step(dt: number, moving: boolean, sprinting: boolean, grounded: boolean) {
    this.footTimer -= dt;
    if (moving && grounded && this.footTimer <= 0) { this.tone(80 + Math.random() * 35, .12, .1, 'triangle'); this.footTimer = sprinting ? .28 : .43; }
  }
  pause(paused: boolean) { if (this.context) { if (paused) void this.context.suspend(); else void this.context.resume(); } }
}
