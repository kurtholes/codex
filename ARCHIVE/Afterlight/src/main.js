import { World } from './world.js';
import { Sound } from './audio.js';
import { RELAYS, MEMORIES, LENGTH, createState, step, nextRelay, objective, activate, recover, finish, serialize, restore, clamp, tuneSolved, tuneDistance } from './game.js';
const $=id=>document.getElementById(id);
const show=(id,yes=true)=>$(id).classList.toggle('hidden',!yes);
const SAVE='afterlight-v1',SETTINGS='afterlight-settings-v1';
let storageWarning=false;
function read(key){try{return localStorage.getItem(key);}catch{return null;}}
function write(key,value){try{localStorage.setItem(key,value);}catch{if(!storageWarning){storageWarning=true;toast('Browser storage is unavailable. This voyage will not be saved.');}}}
const touchDevice=matchMedia('(pointer:coarse)').matches;
let settings={quality:touchDevice?'low':'balanced',muted:false,reduced:matchMedia('(prefers-reduced-motion:reduce)').matches};
try{const o=JSON.parse(read(SETTINGS)||'{}');if(['low','balanced','high'].includes(o.quality))settings.quality=o.quality;if(typeof o.muted==='boolean')settings.muted=o.muted;if(typeof o.reduced==='boolean')settings.reduced=o.reduced;}catch{}
const sound=new Sound();sound.setMute(settings.muted);
let world;
try{world=new World($('world'),settings.quality);}catch(error){$('loading-detail').textContent='The 3D renderer could not start. Please enable WebGL 2 / hardware acceleration and reload.';console.error(error);throw error;}
let state=createState(),mode='title',modalOrigin='title',selectedDial=0,puzzle=null,near=null,endingTime=0,saveTimer=0,pulseCooldown=0,toastTimer=0,cardTimer=0,radioTimer=0;
let hasSave=restore(read(SAVE)),voyageStarted=false;
const keys=new Set(),input={steer:0,thrust:false,brake:false,boost:false},touchInput={x:0,y:0,boost:false};
let radioQueue=[],played=new Set(),journalReturn='play',padPrevious={},padNavTime=0;
show('loading',false);show('title');show('continue',!!hasSave&&!hasSave.ending);
$('title-sound').innerHTML=`SOUND ${settings.muted?'OFF':'ON'} <span>◉</span>`;
function clearInput(){keys.clear();touchInput.x=0;touchInput.y=0;touchInput.boost=false;$('joystick').firstElementChild.style.transform='';}
function save(){write(SAVE,serialize(state));hasSave=restore(serialize(state));}
function persistSettings(){write(SETTINGS,JSON.stringify(settings));$('title-sound').innerHTML=`SOUND ${settings.muted?'OFF':'ON'} <span>◉</span>`;}
function toggleMute(){settings.muted=!settings.muted;sound.start();sound.setMute(settings.muted);persistSettings();}
function toast(text){$('toast').textContent=text;show('toast');toastTimer=4.5;}
function chapter(title,sub){$('chapter-title').textContent=title;$('chapter-sub').textContent=sub;show('chapter-card',false);void $('chapter-card').offsetWidth;show('chapter-card');cardTimer=6;}
function say(text,name='MOTH / ONBOARD ARCHIVE',duration=9){radioQueue.push({text,name,duration});}
function setRadio(){if(!radioQueue.length)return;const r=radioQueue.shift();$('radio-text').textContent=r.text;$('radio-name').textContent=r.name;radioTimer=r.duration;show('radio');}
function openModal(html,newMode,wide=false){clearInput();mode=newMode;show('modal');$('modal-content').innerHTML=html;$('modal-content').classList.toggle('wide',wide);show('touch',false);show('interaction',false);show('radio',false);requestAnimationFrame(()=>{const first=$('modal-content').querySelector('button:not(:disabled),input');first?.focus({preventScroll:true});});}
function closeModal(){show('modal',false);mode='play';clearInput();show('touch',touchDevice);if(radioTimer>0)show('radio');sound.pause(false);}
const closeButton='<button class="close-btn" id="modal-close" aria-label="Close dialog">×</button>';
function bindClose(callback){$('modal-close')?.addEventListener('click',callback);}
function returnTitle(){save();mode='title';clearInput();show('modal',false);show('hud',false);show('touch',false);show('title');show('continue',!state.ending);world.resetCamera();sound.pause(false);}
function intro(){
 openModal(`<div class="eyebrow">TRANSMISSION 001 / TO WHOEVER IS STILL LISTENING</div><h2 id="modal-heading">A city caught<br>between heartbeats.</h2><p>When the light went out, the river kept three voices. Bring them to the Dawn Engine, and the city can begin again.</p><p>You are the pilot of <em>Skiff 07</em>. Your companion, Moth, is a small archive with a very long memory.</p><div class="control-grid"><div class="control-row">Thrust / brake <span><kbd>W</kbd><kbd>S</kbd></span></div><div class="control-row">Steer <span><kbd>A</kbd><kbd>D</kbd></span></div><div class="control-row">Surge <kbd>SPACE</kbd></div><div class="control-row">Clear static <kbd>Q</kbd></div><div class="control-row">Listen / dock <kbd>E</kbd></div><div class="control-row">Look around <span>DRAG MOUSE</span></div></div><p class="small-note">The current carries you slowly when you let go. Follow cyan light. Gold fragments hold optional memories. Pink shards are static: pulse to clear them. No lives, no time limit.</p><div class="modal-footer"><button id="cast-off" class="primary">Cast off <span>→</span></button></div>`,'intro');
 $('cast-off').onclick=()=>{voyageStarted=true;show('title',false);show('hud');closeModal();sound.start();save();chapter('The Memory Delta','Three voices. One last journey.');say('There you are. I was beginning to think I would have to learn to steer.',undefined,8);say('The cyan current leads upstream. Find the Bellkeeper. I can still hear her, somewhere beyond the first ruins.',undefined,10);};
}
function startNew(){state=createState();played.clear();radioQueue=[];radioTimer=0;world.hazards.forEach(h=>{h.cleared=false;h.cooldown=0;});world.resetCamera();intro();}
$('begin').onclick=()=>{sound.start();if(hasSave&&!hasSave.ending){openModal(`<div class="eyebrow">A NEW CURRENT</div><h2 id="modal-heading">Begin another voyage?</h2><p>Your current voyage will be replaced when you cast off.</p><div class="modal-footer"><button id="new-confirm" class="primary">Begin again <span>→</span></button><button id="new-cancel" class="secondary">Keep my voyage</button></div>`,'confirm');$('new-confirm').onclick=startNew;$('new-cancel').onclick=()=>{show('modal',false);mode='title';};}else startNew();};
$('continue').onclick=()=>{const saved=restore(read(SAVE));if(!saved){toast('The saved signal could not be read. Start a new voyage.');return;}state=saved;voyageStarted=true;mode='play';played=new Set(narrative.filter(n=>n.s<state.s).map(n=>n.s));show('title',false);show('hud');show('touch',touchDevice);world.resetCamera();sound.start();say('Welcome back, pilot. The river kept your place.');};
$('title-sound').onclick=toggleMute;
function pause(){if(mode!=='play')return;save();openModal(`${closeButton}<div class="eyebrow">SKIFF 07 / CURRENT HELD</div><h2 id="modal-heading">A moment of quiet.</h2><p>The river will wait.</p><div class="modal-footer"><button id="resume" class="primary">Return to the river <span>→</span></button><button id="open-settings" class="secondary">Settings</button><button id="open-journal" class="secondary">Journal</button></div><div class="modal-footer"><button id="recover" class="text-btn">RETURN TO LAST RELAY</button><button id="to-title" class="text-btn">SAVE & TITLE</button></div><p class="small-note">W / S thrust & brake · A / D steer · Space surge · Q pulse · E listen<br>Drag to orbit · C reset view · R recover · J journal · M mute</p>`,'pause');bindClose(closeModal);$('resume').onclick=closeModal;$('open-settings').onclick=()=>openSettings('pause');$('open-journal').onclick=()=>openJournal('pause');$('recover').onclick=()=>{recover(state);world.resetCamera();closeModal();toast('Returned to the last safe signal. All discoveries kept.');save();};$('to-title').onclick=returnTitle;sound.pause(true);}
$('pause-btn').onclick=pause;
function openSettings(origin='title'){
 modalOrigin=origin;
 openModal(`${closeButton}<div class="eyebrow">TUNE YOUR EXPERIENCE</div><h2 id="modal-heading">Settings</h2><div class="setting-row"><div><strong>Visual quality</strong><small>Resolution, soft glow and drifting particles.</small></div><div class="preset-group">${[['low','Performance'],['balanced','Balanced'],['high','High']].map(([v,l])=>`<button data-quality="${v}" class="${settings.quality===v?'active':''}">${l}</button>`).join('')}</div></div><div class="setting-row"><div><strong>Soundscape</strong><small>Synthesized ambience, engine and signal tones.</small></div><button id="mute-toggle" class="toggle">${settings.muted?'OFF':'ON'}</button></div><div class="setting-row"><div><strong>Reduced motion</strong><small>Calmer effects; no camera surge or chapter fades.</small></div><button id="motion-toggle" class="toggle">${settings.reduced?'ON':'OFF'}</button></div><p class="small-note">Keyboard & mouse recommended. Touch controls and standard gamepad supported. Dialogue is always captioned.</p><div class="modal-footer"><button id="settings-back" class="primary">Done <span>→</span></button></div>`,'settings');
 const back=()=>{if(modalOrigin==='title'){show('modal',false);mode='title';}else{mode='play';pause();}};bindClose(back);$('settings-back').onclick=back;
 document.querySelectorAll('[data-quality]').forEach(b=>b.onclick=()=>{settings.quality=b.dataset.quality;world.setQuality(settings.quality);persistSettings();document.querySelectorAll('[data-quality]').forEach(x=>x.classList.toggle('active',x===b));});
 $('mute-toggle').onclick=()=>{toggleMute();$('mute-toggle').textContent=settings.muted?'OFF':'ON';if(origin==='pause')sound.pause(true);};
 $('motion-toggle').onclick=()=>{settings.reduced=!settings.reduced;persistSettings();$('motion-toggle').textContent=settings.reduced?'ON':'OFF';};
}
$('title-settings').onclick=()=>openSettings('title');
function openJournal(origin='play'){
 if(!['play','pause'].includes(mode))return;journalReturn=origin;save();
 openModal(`${closeButton}<div class="eyebrow">MOTH / THE SMALL THINGS WE KEPT</div><h2 id="modal-heading">Recovered signals</h2><p>Three voices to wake the city. Four fragments to remember why.</p>${RELAYS.map((r,i)=>state.relays[i]?`<article class="journal-entry"><h3>0${i+1} / ${r.name}</h3><p>“${r.story}”</p></article>`:`<div class="journal-entry locked">0${i+1} / A voice still lost in the current</div>`).join('')}${MEMORIES.map((m,i)=>state.memories.includes(i)?`<article class="journal-entry"><h3>◇ ${m.title}</h3><p>${m.text}</p></article>`:`<div class="journal-entry locked">◇ An unrecovered memory</div>`).join('')}<div class="modal-footer"><button id="journal-back" class="primary">Return <span>→</span></button></div>`,'journal');
 const back=()=>{closeModal();if(journalReturn==='pause')pause();};bindClose(back);$('journal-back').onclick=back;
}
$('journal-btn').onclick=()=>openJournal();
function wave(phase){let s='';for(let i=0;i<=80;i++){const x=i*3.6,y=24+Math.sin(i/80*Math.PI*4+phase/8*Math.PI*2)*16;s+=(i?'L':'M')+x.toFixed(1)+','+y.toFixed(1);}return s;}
function openPuzzle(index){
 if(index!==nextRelay(state))return;state.speed=0;puzzle={index,values:[...RELAYS[index].initial]};selectedDial=0;
 const r=RELAYS[index];sound.tone(110,.7,.15);
 openModal(`${closeButton}<div class="eyebrow">RELAY 0${index+1} / ${r.place}</div><h2 id="modal-heading">Find the voice<br>inside the noise.</h2><p class="tune-intro">Turn each signal until it overlaps the pale reference. A clear tone means the two are in phase. All three together will open the archive.</p><div class="tune-help"><span><i></i> LOST VOICE</span><span><i class="current"></i> YOUR SIGNAL</span></div><div id="dials">${[0,1,2].map(i=>`<div class="dial-row ${i===0?'selected':''}" data-row="${i}"><span class="dial-label">0${i+1}</span><svg class="waveform" viewBox="0 0 288 48" aria-hidden="true"><path class="reference" d="${wave(r.target[i])}"/><path class="signal" id="wave-${i}" d="${wave(puzzle.values[i])}"/></svg><div class="dial-controls"><button data-dial="${i}" data-delta="-1" aria-label="Turn signal ${i+1} left">−</button><output id="value-${i}">${puzzle.values[i]+1}/8</output><button data-dial="${i}" data-delta="1" aria-label="Turn signal ${i+1} right">+</button></div><span id="match-${i}" class="dial-status">·</span><input class="phase-slider" id="phase-${i}" type="range" min="0" max="7" step="1" value="${puzzle.values[i]}" aria-label="Signal ${i+1} phase"></div>`).join('')}</div><p id="tune-status" class="tune-status" aria-live="polite">Three signals, waiting for the same moment.</p><div class="modal-footer"><button id="receive" class="primary" disabled>Receive the voice <span>→</span></button><button id="puzzle-back" class="secondary">Return to skiff</button></div><p class="small-note">Click ± or drag a dial. Keyboard: 1 / 2 / 3 selects; ← / → turns. Gamepad: bumpers select; D-pad turns.</p>`,'puzzle',true);
 bindClose(closeModal);$('puzzle-back').onclick=closeModal;
 document.querySelectorAll('[data-dial]').forEach(b=>b.onclick=()=>adjustDial(Number(b.dataset.dial),Number(b.dataset.delta)));
 [0,1,2].forEach(i=>{$(`phase-${i}`).oninput=e=>{selectedDial=i;puzzle.values[i]=Number(e.target.value);updatePuzzle(i);};});
 $('receive').onclick=()=>receiveVoice(index);updatePuzzle();
}
function adjustDial(i,delta){if(!puzzle||mode!=='puzzle')return;selectedDial=i;puzzle.values[i]=(puzzle.values[i]+delta+8)%8;updatePuzzle(i);}
function updatePuzzle(changed=-1){const r=RELAYS[puzzle.index];let count=0;[0,1,2].forEach(i=>{const v=puzzle.values[i],matched=v===r.target[i];if(matched)count++;$(`wave-${i}`).setAttribute('d',wave(v));$(`value-${i}`).textContent=`${v+1}/8`;$(`phase-${i}`).value=v;$(`match-${i}`).textContent=matched?'✓':'·';$(`match-${i}`).classList.toggle('matched',matched);document.querySelector(`[data-row="${i}"]`).classList.toggle('selected',i===selectedDial);});$('receive').disabled=!tuneSolved(puzzle.values,r.target);$('tune-status').textContent=count===3?'The noise falls away. Someone is here.':`${count} / 3 signals in phase`;
 if(changed>=0){const d=tuneDistance(puzzle.values[changed],r.target[changed]);sound.tone(220*Math.pow(2,changed*4/12),.4,d===0?.2:.07);if(d>0)sound.tone(220*Math.pow(2,changed*4/12)+d*3,.4,.055);}
}
function receiveVoice(index){if(!puzzle||!tuneSolved(puzzle.values,RELAYS[index].target)||!activate(state,index))return;save();sound.chord(index*2);radioQueue=[];radioTimer=0;
 const r=RELAYS[index];openModal(`<span class="voice-number">0${index+1}</span><div class="eyebrow">VOICE RECOVERED / ${r.place}</div><h2 id="modal-heading">${r.name}</h2><p class="quote">“${r.story}”</p><p>${r.echo}</p><div class="modal-footer"><button id="voice-back" class="primary">Carry the voice <span>→</span></button></div><p class="small-note">Checkpoint saved. The river ahead has opened.</p>`,'voice');
 $('voice-back').onclick=()=>{closeModal();chapter(index===0?'The Glass Orchard':index===1?'The Last Crossing':'The Heart of the City',index===0?'Even here, something learned to grow.':index===1?'There is always a way back.':'The city is listening.');say(index===0?'One voice. I remember her bells. Follow the current to the Gardener.':index===1?'Two voices. I can almost remember what morning felt like. The Ferryman is waiting beyond the next bend.':'All three. They were never instructions. Just people, trying. Take them to the Dawn Engine.');};
}
function readMemory(i){if(state.memories.includes(i))return;state.memories.push(i);save();sound.chord(7);const m=MEMORIES[i];openModal(`<div class="eyebrow">RIVER FRAGMENT / ${state.memories.length} OF 4</div><h2 id="modal-heading">${m.title}</h2><p class="quote">“${m.text}”</p><p>Stored in Moth’s journal. Some things deserve to be carried.</p><div class="modal-footer"><button id="memory-back" class="primary">Keep this memory <span>→</span></button></div>`,'memory');$('memory-back').onclick=closeModal;}
function finale(){
 if(!state.relays.every(Boolean))return;state.speed=0;save();sound.chord(5);openModal(`<div class="eyebrow">THE DAWN ENGINE / THREE VOICES, ONE CHOICE</div><h2 id="modal-heading">What should<br>the morning remember?</h2><p>The voices gather in the engine. Not a program. A bell rung in the dark. A tree planted in salt. A boat turned toward home.</p><p>Moth is quiet for a long time. Then: <em>“We can give them the city again. Or we can let the river carry them somewhere new. I don’t think there is a wrong way to remember.”</em></p><div class="choice-grid"><button id="choose-awaken" class="choice"><span>01 / AWAKEN</span><strong>Let the city wake.</strong><p>Return the voices to their streets. A new beginning in an old home.</p></button><button id="choose-release" class="choice"><span>02 / RELEASE</span><strong>Let the river carry them.</strong><p>Send the voices beyond the horizon. A new beginning without walls.</p></button></div>`,'finale');
 ['awaken','release'].forEach(choice=>$(`choose-${choice}`).onclick=()=>{if(!finish(state,choice))return;save();show('modal',false);show('touch',false);mode='cinematic';endingTime=0;radioQueue=[];radioTimer=0;chapter(choice==='awaken'?'A city learns to breathe.':'A river becomes a sky.',choice==='awaken'?'And somewhere, a bell begins to ring.':'Nothing loved is ever truly lost.');sound.chord(choice==='awaken'?0:7);});
}
function endingScreen(){
 const awake=state.ending==='awaken';openModal(`<div class="eyebrow">CHAPTER COMPLETE / THE RIVER REMEMBERS</div><div class="ending-symbol">${awake?'☼':'≈'}</div><h2 id="modal-heading">${awake?'The first morning.':'Beyond the last light.'}</h2><p class="quote">${awake?'“For the first time in a very long time, the city woke before the bells.”':'“The river carried three small voices. By morning, the whole horizon was singing.”'}</p><p>${awake?'Windows kindle along the river. In the glass orchard, a tree opens its leaves. The ferry turns toward home. You leave the skiff tied to a new wooden pier. For once, there is nowhere else you need to be.':'The engine opens like a hand. Light rises from the streets and follows the river into the sky. Moth asks where you want to go. You turn the skiff toward the horizon. “Let’s find out.”'}</p><div class="ending-stats"><div><strong>3 / 3</strong><small>VOICES CARRIED</small></div><div><strong>${state.memories.length} / 4</strong><small>MEMORIES KEPT</small></div><div><strong>${Math.max(1,Math.round(state.elapsed/60))} MIN</strong><small>ON THE RIVER</small></div></div><div class="modal-footer"><button id="end-title" class="primary">Return to title <span>→</span></button><button id="end-replay" class="secondary">Another dawn</button></div><p class="ending-credit">AFTERLIGHT · A QUIET SIGNAL<br>World, skiff, story and sound created for this journey.<br>Thank you for listening.</p>`,'ending');$('end-title').onclick=returnTitle;$('end-replay').onclick=startNew;
}
function interact(){if(mode!=='play'||!near)return;sound.start();if(near.type==='relay')openPuzzle(near.index);if(near.type==='memory')readMemory(near.index);if(near.type==='final')finale();}
$('interact-btn').onclick=interact;
function pulse(){if(mode!=='play'||pulseCooldown>0)return;pulseCooldown=5;world.emitPulse(state);sound.tone(110,1.1,.17);let cleared=0;for(const h of world.hazards){if(!h.cleared&&Math.abs(h.s-state.s)<155&&Math.abs(h.lateral-state.lateral)<100){h.cleared=true;cleared++;}}if(cleared){state.charge=clamp(state.charge+.18*cleared,0,1);toast('Static dispersed · surge cell replenished');}else{const m=MEMORIES.find((m,i)=>!state.memories.includes(i)&&m.s>state.s-50&&m.s<state.s+500);if(m)toast('A golden memory is nearby. Look along the river’s edge.');}}
const narrative=[
 {s:270,text:'The city called this river Afterlight. It kept shining long after everything else went dark.'},
 {s:550,text:'See that gold fragment? A small memory. Steer toward it and press E to listen. We can leave it, but I would rather not.'},
 {s:770,text:'Pink static ahead. It cannot sink us, but it will drain the surge cell. Press Q when you are close to clear a path.'},
 {s:1230,text:'The Bellkeeper’s relay. Slow down with S, then press E when her signal is close. We will have to tune through the noise.'},
 {s:1930,text:'These ruins look empty. They are not. A place remembers the shape of everyone who cared for it.'},
 {s:2820,text:'The Glass Orchard. There were trees on every balcony once. I have a record of the leaves. I wish I had their sound.'},
 {s:3300,text:'The Gardener is close. Her signal is tangled in the static. Three clear tones will bring it back.'},
 {s:4100,text:'Do you ever miss a place you have never been? I think that is what these memories are doing to me.'},
 {s:5190,text:'We are nearly at the last crossing. The Ferryman kept one light burning, even after the last boat left.'},
 {s:5510,text:'There. His relay is still standing. Let’s hear what he was waiting for.'},
 {s:6340,text:'The Dawn Engine is beyond this bend. I thought I would know what to do when we got here. I am glad you are the pilot.'},
 {s:6970,text:'The river gave us back three voices. What happens next belongs to you.'}
];
function updateHud(){
 const o=objective(state),i=nextRelay(state),distance=Math.max(0,o.s-state.s);
 $('objective-label').textContent=i<0?'THE LAST LIGHT':`VOICE 0${i+1} / 03`;$('objective-text').textContent=i<0?'Reach the Dawn Engine':`Find ${o.name}`;
 $('objective-sub').textContent=distance>120?`${Math.round(distance)} m upstream · follow the cyan current`:'Signal within reach. Brake and press E to listen.';
 $('area').textContent=state.s<1900?'THE MEMORY DELTA':state.s<4100?'THE GLASS ORCHARD':state.s<6300?'THE LAST CROSSING':'THE HEART OF THE CITY';
 $('relay-marks').querySelectorAll('span').forEach((el,j)=>el.classList.toggle('done',state.relays[j]));
 $('speed').textContent=String(Math.round(state.speed)).padStart(2,'0');$('charge').style.width=`${state.charge*100}%`;$('route-progress').style.left=`${state.s/LENGTH*100}%`;
 $('engine-label').textContent=pulseCooldown>0?`PULSE RECHARGING / ${Math.ceil(pulseCooldown)} S`:'HOLD SPACE TO SURGE';
 const projected=world.project(o.s,0,i<0?50:34);show('target-marker',projected.visible&&distance<2500&&distance>75);if(projected.visible){$('target-marker').style.left=`${projected.x}px`;$('target-marker').style.top=`${projected.y}px`;$('target-distance').textContent=`${Math.round(distance)} M`;}
 near=null;if(Math.abs(o.s-state.s)<110&&Math.abs(state.lateral)<64)near=i<0?{type:'final'}:{type:'relay',index:i};
 for(let j=0;j<MEMORIES.length;j++){const m=MEMORIES[j];if(!state.memories.includes(j)&&Math.abs(m.s-state.s)<34&&Math.abs(state.lateral-m.x)<22)near={type:'memory',index:j};}
 show('interaction',!!near&&mode==='play');if(near)$('interact-text').textContent=near.type==='memory'?'Recover a river fragment':near.type==='final'?'Enter the Dawn Engine':`Listen to ${RELAYS[near.index].name}`;
}
function controlKey(e,down){
 if(down&&e.code==='Tab'&&mode!=='play'&&mode!=='title'){const els=[...$('modal-content').querySelectorAll('button:not(:disabled),input')];if(els.length){const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault();}}return;}
 if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&!['INPUT'].includes(e.target.tagName))e.preventDefault();
 if(!down){keys.delete(e.code);return;}if(e.repeat)return;
 if(e.code==='KeyM'){toggleMute();return;}
 if(e.code==='Escape'){
  if(mode==='play')pause();else if(mode==='pause')closeModal();else if(mode==='settings')$('settings-back').click();else if(mode==='journal')$('journal-back').click();else if(mode==='puzzle')closeModal();return;
 }
 if(mode==='puzzle'){
  if(['Digit1','Digit2','Digit3'].includes(e.code)){selectedDial=Number(e.code.slice(-1))-1;updatePuzzle();}
  if(e.target.tagName!=='INPUT'&&['ArrowLeft','KeyA','ArrowRight','KeyD'].includes(e.code)){e.preventDefault();adjustDial(selectedDial,['ArrowLeft','KeyA'].includes(e.code)?-1:1);}return;
 }
 if(mode!=='play')return;keys.add(e.code);
 if(e.code==='KeyE')interact();if(e.code==='KeyQ')pulse();if(e.code==='KeyJ')openJournal();if(e.code==='KeyC')world.resetCamera();
 if(e.code==='KeyR'){recover(state);world.resetCamera();toast('Returned to your last relay. Discoveries kept.');save();}
}
window.addEventListener('keydown',e=>controlKey(e,true));window.addEventListener('keyup',e=>controlKey(e,false));
window.addEventListener('blur',()=>{clearInput();if(mode==='play')pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(mode==='play')pause();sound.pause(true);}else if(mode!=='pause')sound.pause(false);});
let dragging=false,lastPointer=null;
$('world').addEventListener('pointerdown',e=>{if(mode!=='play')return;dragging=true;lastPointer=[e.clientX,e.clientY];$('world').setPointerCapture(e.pointerId);sound.start();});
$('world').addEventListener('pointermove',e=>{if(!dragging||mode!=='play')return;world.orbit=clamp(world.orbit-(e.clientX-lastPointer[0])*.004,-1.2,1.2);world.pitch=clamp(world.pitch+(e.clientY-lastPointer[1])*.025,-4,12);lastPointer=[e.clientX,e.clientY];});
for(const ev of ['pointerup','pointercancel'])$('world').addEventListener(ev,()=>dragging=false);
window.addEventListener('resize',()=>world.resize());
const stick=$('joystick');let stickPointer=null;
stick.addEventListener('pointerdown',e=>{if(mode!=='play')return;stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);moveStick(e);});
function moveStick(e){if(e.pointerId!==stickPointer)return;const r=stick.getBoundingClientRect();const x=clamp((e.clientX-r.left-50)/38,-1,1),y=clamp((e.clientY-r.top-50)/38,-1,1);touchInput.x=x;touchInput.y=y;stick.firstElementChild.style.transform=`translate(${x*28}px,${y*28}px)`;}
stick.addEventListener('pointermove',moveStick);for(const ev of ['pointerup','pointercancel'])stick.addEventListener(ev,()=>{stickPointer=null;touchInput.x=touchInput.y=0;stick.firstElementChild.style.transform='';});
$('touch-boost').addEventListener('pointerdown',e=>{touchInput.boost=true;$('touch-boost').setPointerCapture(e.pointerId);});for(const ev of ['pointerup','pointercancel'])$('touch-boost').addEventListener(ev,()=>touchInput.boost=false);$('touch-pulse').onclick=pulse;
function readGamepad(dt){
 const pad=navigator.getGamepads?.()?.[0];if(!pad){padPrevious={};return;}
 const press=i=>{const value=pad.buttons[i]?.pressed,old=padPrevious[i];padPrevious[i]=value;return value&&!old;};
 const a=press(0),x=press(2),y=press(3),start=press(9),back=press(1),lb=press(4),rb=press(5),left=press(14),right=press(15),up=press(12),down=press(13);
 const axis=(i)=>Math.abs(pad.axes[i]||0)>.15?pad.axes[i]:0;
 if(mode==='play'){
  input.steer=clamp(input.steer+axis(0),-1,1);input.thrust||=axis(1)<-.2||pad.buttons[7]?.value>.15;input.brake||=axis(1)>.35||pad.buttons[6]?.value>.15;input.boost||=pad.buttons[0]?.pressed;
  world.orbit=clamp(world.orbit-axis(2)*dt*1.2,-1.2,1.2);world.pitch=clamp(world.pitch+axis(3)*dt*5,-4,12);
  if(x)interact();if(y)pulse();if(start)pause();
 }else if(mode==='puzzle'){
  if(lb||rb){selectedDial=(selectedDial+(rb?1:2))%3;updatePuzzle();}if(left||right)adjustDial(selectedDial,left?-1:1);if(a&&!$('receive').disabled)$('receive').click();if(back)closeModal();
 }else{
  const scope=mode==='title'?$('title'):$('modal-content');const buttons=[...scope.querySelectorAll('button:not(:disabled)')].filter(b=>!b.closest('.hidden'));padNavTime-=dt;
  if(buttons.length&&(up||down||((Math.abs(axis(1))>.6)&&padNavTime<0))){padNavTime=.25;let i=buttons.indexOf(document.activeElement);i=(i+(up||axis(1)<-.6?-1:1)+buttons.length)%buttons.length;buttons[i].focus();}
  if(a&&buttons.includes(document.activeElement))document.activeElement.click();if(start&&mode==='pause')closeModal();
 }
}
let previous=performance.now(),hudTimer=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-previous)/1000,.05);previous=now;if(document.hidden)return;
 input.steer=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+touchInput.x;
 input.thrust=keys.has('KeyW')||keys.has('ArrowUp')||touchInput.y<-.2;input.brake=keys.has('KeyS')||keys.has('ArrowDown')||touchInput.y>.3;input.boost=keys.has('Space')||keys.has('ShiftLeft')||touchInput.boost;
 readGamepad(dt);
 if(mode==='play'){
  step(state,input,dt);saveTimer+=dt;pulseCooldown=Math.max(0,pulseCooldown-dt);
  for(const h of world.hazards){if(!h.cleared&&h.cooldown<=0&&Math.abs(state.s-h.s)<13&&Math.abs(state.lateral-h.lateral)<14){h.cooldown=4;state.speed*=.45;state.charge=Math.max(0,state.charge-.24);$('flash').style.opacity='1';setTimeout(()=>$('flash').style.opacity='0',100);sound.tone(65,.3,.15,'triangle');toast('Static caught the engines. Q clears nearby shards.');}}
  for(const n of narrative)if(state.s>n.s&&!played.has(n.s)){played.add(n.s);say(n.text);}
  if(radioTimer>0){radioTimer-=dt;if(radioTimer<=0)show('radio',false);}else if(radioQueue.length)setRadio();
  if(saveTimer>5){saveTimer=0;save();}
 }
 if(mode==='cinematic'){endingTime+=dt;if(endingTime>9)endingScreen();}
 const frozen=['pause','settings','journal'].includes(mode);const renderDt=frozen?0:dt;
 world.update(state,renderDt,{attract:mode==='title'||mode==='intro'||mode==='confirm'||(mode==='settings'&&modalOrigin==='title'),steer:input.steer,boost:mode==='play'&&input.boost&&state.charge>.035&&!settings.reduced,reduced:settings.reduced,ending:state.ending?Math.min(1,endingTime/8):0});
 hudTimer+=dt;if(hudTimer>.1){hudTimer=0;if(!['title','intro','confirm'].includes(mode))updateHud();}
 if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)show('toast',false);}if(cardTimer>0){cardTimer-=dt;if(cardTimer<=0)show('chapter-card',false);}
 sound.tick(state.speed,now/1000,mode==='play');
}
requestAnimationFrame(frame);
window.addEventListener('pagehide',()=>{if(voyageStarted)save();});
/* DEV-ONLY-BEGIN */
if(new URLSearchParams(location.search).get('test')==='1'){
 const {install}=await import('./dev-hooks.js');install({getState:()=>state,setState:v=>{state={...createState(),...v};world.resetCamera();},play:()=>{voyageStarted=true;mode='play';show('modal',false);show('title',false);show('hud');world.resetCamera();},world,getMode:()=>mode});
}
/* DEV-ONLY-END */
