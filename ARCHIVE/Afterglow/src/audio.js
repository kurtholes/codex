// Every sound is synthesized locally. No samples or requests.
export class SunsetAudio {
  constructor() {
    this.enabled = false;
    this.volume = 0.55;
    this.ready = false;
    this.paused = false;
  }
  init() {
    if (this.ready) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const c = this.ctx;
    this.master = c.createGain();
    this.master.gain.value = 0;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 4;
    this.master.connect(comp).connect(c.destination);
    this.music = c.createGain();
    this.music.gain.value = 0.5;
    this.music.connect(this.master);
    this.delay = c.createDelay(1);
    this.delay.delayTime.value = 0.341;
    const feedback = c.createGain();
    feedback.gain.value = 0.3;
    const wet = c.createGain();
    wet.gain.value = 0.22;
    this.delay.connect(feedback).connect(this.delay);
    this.delay.connect(wet).connect(this.music);
    const buffer = c.createBuffer(1, c.sampleRate * 4, c.sampleRate),
      data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    this.noiseBuffer = buffer;
    const sea = c.createBufferSource();
    sea.buffer = buffer;
    sea.loop = true;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 650;
    this.ocean = c.createGain();
    this.ocean.gain.value = 0.16;
    sea.connect(filter).connect(this.ocean).connect(this.master);
    sea.start();
    this.engine = c.createOscillator();
    this.engine.type = "triangle";
    this.engine.frequency.value = 42;
    this.engineGain = c.createGain();
    this.engineGain.gain.value = 0.015;
    const ef = c.createBiquadFilter();
    ef.frequency.value = 180;
    this.engine.connect(ef).connect(this.engineGain).connect(this.master);
    this.engine.start();
    this.ready = true;
    this.step = 0;
    this.next = c.currentTime + 0.15;
    this.timer = setInterval(() => this.schedule(), 120);
  }
  setEnabled(on) {
    this.init();
    this.enabled = !!on;
    if (!this.ready) return;
    if (on) this.ctx.resume().catch(() => {});
    this.master.gain.setTargetAtTime(
      on && !this.paused ? this.volume * 0.6 : 0,
      this.ctx.currentTime,
      0.2,
    );
  }
  setVolume(v) {
    this.volume = v;
    if (this.ready)
      this.master.gain.setTargetAtTime(
        this.enabled && !this.paused ? this.volume * 0.6 : 0,
        this.ctx.currentTime,
        0.12,
      );
  }
  setPaused(p) {
    this.paused = p;
    if (this.ready)
      this.master.gain.setTargetAtTime(
        this.enabled && !p ? this.volume * 0.6 : 0,
        this.ctx.currentTime,
        0.25,
      );
  }
  note(freq, time, duration, vol = 0.1, type = "sine", pan = 0) {
    const c = this.ctx,
      o = c.createOscillator(),
      g = c.createGain(),
      f = c.createBiquadFilter(),
      p = c.createStereoPanner();
    o.type = type;
    o.frequency.value = freq;
    f.type = "lowpass";
    f.frequency.value = type === "sawtooth" ? 650 : 2200;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(vol, time + 0.035);
    g.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    p.pan.value = pan;
    o.connect(f).connect(g).connect(p);
    p.connect(this.music);
    p.connect(this.delay);
    o.start(time);
    o.stop(time + duration + 0.02);
  }
  noise(time, length, vol, filterFreq) {
    const c = this.ctx,
      o = c.createBufferSource(),
      g = c.createGain(),
      f = c.createBiquadFilter();
    o.buffer = this.noiseBuffer;
    f.type = "highpass";
    f.frequency.value = filterFreq;
    g.gain.setValueAtTime(vol, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + length);
    o.connect(f).connect(g).connect(this.music);
    o.start(time);
    o.stop(time + length);
  }
  schedule() {
    if (!this.ready) return;
    const c = this.ctx;
    if (this.next < c.currentTime - 0.2) this.next = c.currentTime + 0.05;
    const beat = 60 / 88 / 2;
    while (this.next < c.currentTime + 0.5) {
      const s = this.step,
        t = this.next,
        chords = [
          [130.81, 155.56, 196, 233.08],
          [103.83, 130.81, 155.56, 196],
          [116.54, 146.83, 174.61, 207.65],
          [98, 123.47, 146.83, 174.61],
        ],
        chord = chords[Math.floor(s / 32) % 4];
      if (s % 32 === 0)
        chord.forEach((f, i) => {
          this.note(f, t, 9, 0.046, "sawtooth", i % 2 ? 0.45 : -0.45);
          this.note(f * 1.003, t + 0.02, 9, 0.025, "sine");
        });
      if (s % 2 === 0)
        this.note(
          chord[[0, 2, 1, 3, 2, 1, 3, 2][Math.floor(s / 2) % 8]] * 2,
          t,
          1.6,
          0.065,
          "triangle",
          Math.sin(s) * 0.5,
        );
      if (s % 4 === 0) {
        const o = c.createOscillator(),
          g = c.createGain();
        o.frequency.setValueAtTime(110, t);
        o.frequency.exponentialRampToValueAtTime(38, t + 0.2);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        o.connect(g).connect(this.music);
        o.start(t);
        o.stop(t + 0.36);
        this.note(chord[0] / 2, t, 1.1, 0.12, "sine");
      }
      if (s % 4 === 2) this.noise(t, 0.2, 0.32, 1000);
      if (s % 2 === 1) this.noise(t, 0.07, 0.12, 3500);
      this.step++;
      this.next += beat;
    }
  }
  update(speed) {
    if (!this.ready) return;
    const t = this.ctx.currentTime;
    this.engine.frequency.setTargetAtTime(37 + Math.abs(speed) * 1.5, t, 0.2);
    this.engineGain.gain.setTargetAtTime(
      0.006 + Math.abs(speed) * 0.0006,
      t,
      0.2,
    );
    this.ocean.gain.setTargetAtTime(0.12 + Math.abs(speed) * 0.003, t, 0.3);
  }
  signal() {
    if (!this.ready || !this.enabled) return;
    const t = this.ctx.currentTime;
    [523.25, 622.25, 783.99, 1046.5].forEach((f, i) =>
      this.note(f, t + i * 0.16, 2, 0.13, "sine", i % 2 ? 0.25 : -0.25),
    );
  }
}
