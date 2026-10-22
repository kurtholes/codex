export class Sound {
  constructor(){this.ctx=null;this.muted=false;this.started=false;this.lastNote=0;}
  start(){
    if(this.ctx){this.ctx.resume().catch(()=>{});return;}
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
    this.ctx=new AC();this.master=this.ctx.createGain();this.master.gain.value=this.muted?0:.32;this.master.connect(this.ctx.destination);
    this.engine=this.ctx.createOscillator();this.engine.type='sawtooth';this.engine.frequency.value=38;
    const filter=this.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=130;
    this.engineGain=this.ctx.createGain();this.engineGain.gain.value=.04;
    this.engine.connect(filter).connect(this.engineGain).connect(this.master);this.engine.start();
    const delay=this.ctx.createDelay(2);delay.delayTime.value=.47;const feedback=this.ctx.createGain();feedback.gain.value=.32;delay.connect(feedback).connect(delay);delay.connect(this.master);this.delay=delay;
    for(const f of [55,82.4069,110.25]){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.value=.035;o.connect(g).connect(this.master);o.start();}
    this.ctx.resume().catch(()=>{});
  }
  setMute(v){this.muted=v;if(this.ctx)this.master.gain.setTargetAtTime(v?0:.32,this.ctx.currentTime,.2);}
  tone(freq=220,duration=.6,volume=.2,type='sine'){
    if(!this.ctx||this.muted)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
    o.connect(g);g.connect(this.master);g.connect(this.delay);o.start(t);o.stop(t+duration+.1);
  }
  chord(i=0){[0,4,7,11].forEach((n,j)=>setTimeout(()=>this.tone(110*Math.pow(2,(n+i)/12),2,.13),j*140));}
  tick(speed,time,active){if(!this.ctx)return;this.engine.frequency.setTargetAtTime(35+speed*1.6,this.ctx.currentTime,.2);this.engineGain.gain.setTargetAtTime(active?.025+speed*.0013:0,this.ctx.currentTime,.3);
    if(active&&time-this.lastNote>4.5){this.lastNote=time;const notes=[220,246.94,329.63,369.99,440,493.88];this.tone(notes[Math.floor(time/4.5)%notes.length],3,.055);}}
  pause(value){if(!this.ctx)return;if(value)this.ctx.suspend().catch(()=>{});else this.ctx.resume().catch(()=>{});}
}
