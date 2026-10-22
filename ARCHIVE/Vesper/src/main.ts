import './style.css';
import { World } from './world';
import { BEACONS, MEMORIES, GameState, ResonancePuzzle, SAVE_KEY, distance, parseSave } from './game';
import { Soundscape } from './audio';

const emblem = `<svg class="emblem" viewBox="0 0 40 50" fill="none" aria-hidden="true"><path d="M5 10 20 43 35 10M12 12 20 29 28 12" stroke="currentColor" stroke-width="1.3"/><path d="M20 2v9M16 6h8M10 41h20" stroke="currentColor" stroke-width=".8"/><circle cx="20" cy="18" r="2" fill="currentColor"/></svg>`;
const speakerIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m11 5-5 4H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></svg>`;
const settingsIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 17h16M8 4v6M16 14v6"/></svg>`;
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <div id="world"></div><div id="cinema"></div><div id="vignette"></div><div id="grain"></div>
  <header id="topbar"><div class="wordmark">${emblem}<span>VESPER</span></div><nav class="top-actions" aria-label="Game options">
    <button class="icon-button" id="sound-button" aria-label="Enable sound" title="Toggle sound">${speakerIcon}<span class="button-label" id="sound-label">SOUND OFF</span></button><span class="top-divider"></span>
    <button class="icon-button" id="fullscreen-button" aria-label="Toggle fullscreen" title="Fullscreen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg></button>
    <button class="icon-button" id="settings-button" aria-label="Settings" title="Settings">${settingsIcon}</button>
    <button class="icon-button hidden" id="pause-button" aria-label="Pause game" title="Pause"><svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg></button>
  </nav></header>
  <main id="menu"><div class="menu-copy"><div class="eyebrow">At the edge of the dying light</div>
    <h1>VESPER</h1><p class="subtitle">THE LAST EMBER</p><div class="ornament"><span>✧</span></div>
    <h2 class="tagline">Some worlds are worth saving.<br>Others are waiting to be found.</h2>
    <p class="description">Beyond the ash, an ancient citadel still burns.<br>Follow its call. Uncover what remains.<br>Decide what comes next.</p>
    <div class="menu-buttons"><button class="primary" id="begin-button"><span>Begin your journey</span><span class="arrow">↗</span></button><button class="text-button hidden" id="new-button">New journey</button></div>
    <div class="menu-meta"><svg viewBox="0 0 16 16"><path d="M2 8a6 6 0 0 1 12 0v5h-3V8h3M2 8v5h3V8H2"/></svg>HEADPHONES RECOMMENDED<span>·</span>YOUR JOURNEY AUTOSAVES</div>
  </div></main>
  <div id="side-label">A QUIET WORLD. AN ANCIENT CALL.</div>
  <footer id="menu-footer"><div class="footer-left"><button class="text-button" id="controls-button">How to play <span style="margin-left:9px">↗</span></button><span class="footer-separator"></span><span class="footer-caption">AN ATMOSPHERIC EXPLORATION ADVENTURE</span></div><div class="chapter-card"><span class="chapter-number">01</span><div><small>THE FIRST CHAPTER</small><p>The Hollow Crown</p></div></div></footer>
  <div id="hud" class="hidden"><div class="hud-location"><div class="eyebrow">Chapter I · The Hollow Crown</div><div id="region">The Pilgrim’s Rest</div><div id="objective"></div><div id="beacon-progress"><span class="beacon-pip"></span><span class="beacon-pip"></span><span class="beacon-pip"></span></div></div>
    <div class="compass"><span>THE CROWN<b>◇</b></span></div>
    <button id="prompt" class="hidden"><kbd>E</kbd><span id="prompt-text">Listen</span></button>
    <div class="vitals"><div class="vitals-label"><span>THE LAST EMBER</span><span id="resolve-number">100</span></div><div class="bar"><span id="resolve-bar"></span></div><div class="bar stamina"><span id="stamina-bar"></span></div></div>
    <div id="controls-hint"><span><kbd>W A S D</kbd> Move</span><span><kbd>⇧</kbd> Sprint</span><span><kbd>SPACE</kbd> Jump</span><span>Drag to look</span><span><kbd>J</kbd> Journal</span></div>
    <div class="pulse-ability"><div><small>EMBER PULSE</small><div id="pulse-status">Q · READY</div></div><div class="pulse-icon"><span>✧</span></div></div>
  </div>
  <div id="subtitle"><small>The echo</small><p></p></div><div id="toast" role="status" aria-live="polite"></div><div id="damage"></div>
  <div id="touch-controls" class="hidden"><div id="joystick" role="application" aria-label="Movement joystick"><div id="stick"></div></div><div class="touch-buttons"><button id="touch-pulse" aria-label="Ember pulse">PULSE</button><button id="touch-jump" aria-label="Jump">JUMP</button><button id="touch-sprint" aria-label="Hold to sprint">RUN</button><button id="touch-interact" aria-label="Interact">ACT</button></div></div>
  <div id="overlay" class="hidden" role="dialog" aria-modal="true" aria-labelledby="panel-title"></div>
  <div id="loading">${emblem}<p>AWAKENING THE HOLLOW CROWN</p><div class="loading-line"></div></div>
`;
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const sound = new Soundscape();
let stored = readSave();
let game = new GameState(stored ?? undefined);
let world: World;
type Mode = 'menu' | 'playing' | 'paused' | 'settings' | 'controls' | 'puzzle' | 'memory' | 'journal' | 'choice' | 'ending' | 'confirm';
let mode: Mode = 'menu';
let returnMode: Mode = 'menu';
let lastFocus: HTMLElement | null = null;
let currentPuzzle: ResonancePuzzle | null = null;
let puzzleIndex = -1;
let puzzleSolved = false;
let modalTimer = 0;
const keys = new Set<string>();
let jumpQueued = false;
let touchX = 0, touchZ = 0, touchSprint = false;
let subtitleTimer = 0, toastTimer = 0;
let previousRegion = '';
let lastTime = 0;
let gamepadPrevious: boolean[] = [];
let contextLost = false;
let storageWarning = false;
const touchDevice = matchMedia('(pointer: coarse)').matches;
let settings = { quality: touchDevice ? 'low' : 'balanced', reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, invertY: false, muted: false };
try { const raw = localStorage.getItem('vesper-settings-v1'); if (raw) { const s = JSON.parse(raw); if (['high', 'balanced', 'low'].includes(s.quality)) settings.quality = s.quality; for (const k of ['reducedMotion', 'invertY', 'muted'] as const) if (typeof s[k] === 'boolean') settings[k] = s[k]; } } catch { /* Storage is optional. */ }
sound.muted = settings.muted;

function readSave() { try { return parseSave(localStorage.getItem(SAVE_KEY)); } catch { return null; } }
function persist() {
  stored = game.save;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(game.save)); } catch { if (!storageWarning) { storageWarning = true; toast('Browser storage is unavailable. Progress will last for this session only.'); } }
}
function persistSettings() { try { localStorage.setItem('vesper-settings-v1', JSON.stringify(settings)); } catch { /* Settings still apply this session. */ } }
function toast(text: string, seconds = 4) { $('toast').textContent = text; $('toast').classList.add('visible'); toastTimer = seconds; }
function subtitle(text: string, seconds = 8, speaker = 'The echo') { $('subtitle').querySelector('small')!.textContent = speaker; $('subtitle').querySelector('p')!.textContent = text; $('subtitle').classList.add('visible'); subtitleTimer = seconds; }
function startAudio() { try { sound.start(); updateSoundUI(); } catch { toast('Audio is unavailable in this browser. Your journey can continue.'); } }
function updateSoundUI() { const active = !!sound.context && !sound.muted; $('sound-label').textContent = active ? 'SOUND ON' : 'SOUND OFF'; $('sound-button').setAttribute('aria-label', active ? 'Mute sound' : 'Enable sound'); $('sound-button').setAttribute('aria-pressed', String(active)); }
function updateMenu() {
  $('begin-button').querySelector('span')!.textContent = stored ? 'Continue your journey' : 'Begin your journey';
  $('new-button').classList.toggle('hidden', !stored);
}
function clearInput() { keys.clear(); touchX = touchZ = 0; touchSprint = false; jumpQueued = false; $('stick').style.transform = ''; }
function changeMode(next: Mode) {
  mode = next; clearInput();
  const menu = next === 'menu';
  document.body.classList.toggle('playing', !menu);
  for (const id of ['menu', 'menu-footer', 'side-label']) $(id).classList.toggle('hidden', !menu);
  $('hud').classList.toggle('hidden', menu);
  $('pause-button').classList.toggle('hidden', menu);
  $('touch-controls').classList.toggle('hidden', next !== 'playing' || !touchDevice);
  $('prompt').classList.add('hidden');
  if (next !== 'playing') $('subtitle').classList.remove('visible');
}
function panel(next: Mode, html: string) {
  if ($('overlay').classList.contains('hidden')) lastFocus = document.activeElement as HTMLElement;
  changeMode(next); $('overlay').innerHTML = `<section class="panel">${html}</section>`; $('overlay').classList.remove('hidden');
  const focus = $('overlay').querySelector<HTMLElement>('button,select,input'); focus?.focus({ preventScroll: true });
  $('overlay').querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closePanel));
}
function closePanel() {
  if (mode === 'puzzle' && puzzleSolved) return;
  if (mode === 'choice') { $('overlay').classList.add('hidden'); changeMode('playing'); return; }
  if (returnMode === 'paused' && (mode === 'settings' || mode === 'controls' || mode === 'journal')) { showPause(); return; }
  const next = (mode === 'settings' || mode === 'controls' || mode === 'confirm') ? returnMode : 'playing';
  $('overlay').classList.add('hidden'); changeMode(next === 'menu' ? 'menu' : 'playing');
  lastFocus?.focus({ preventScroll: true });
}
function begin(fresh = false) {
  if (modalTimer) window.clearTimeout(modalTimer);
  game = new GameState(fresh ? undefined : stored ?? undefined);
  // A completed save resumes at the Crown, with its recovered memories intact.
  if (game.save.ending) delete game.save.ending;
  $('overlay').classList.add('hidden'); changeMode('playing'); startAudio(); persist();
  world.cameraYaw = 0; world.cameraPitch = .2;
  previousRegion = game.region;
  subtitle(game.count ? 'The light remembers you. Your journey is not yet over.' : 'The sun has fallen silent. But somewhere beyond the ash… something is still singing.', 9, 'The pilgrim');
  if (!game.count) toast(touchDevice ? 'Left thumb to move. Drag the world to look. ACT to interact.' : 'WASD to move · Drag to look · E to interact · Q to repel guardians', 8);
}
function showPause() {
  returnMode = 'playing';
  panel('paused', `<div class="eyebrow">A moment in the quiet</div><h2 id="panel-title">The world can wait.</h2><p class="panel-desc">Your awakened resonators and recovered memories are saved automatically.</p><div class="panel-rule"></div><div class="panel-actions"><button class="primary" id="resume-button">Continue journey <span class="arrow">↗</span></button><button class="secondary" id="pause-journal">Journal</button></div><div class="panel-actions"><button class="text-button" id="pause-controls">Controls</button><button class="text-button" id="pause-settings">Settings</button><button class="text-button" id="return-title">Return to title</button></div>`);
  $('resume-button').onclick = closePanel;
  $('pause-journal').onclick = () => { returnMode = 'paused'; showJournal(); };
  $('pause-controls').onclick = () => { returnMode = 'paused'; showControls(); };
  $('pause-settings').onclick = () => { returnMode = 'paused'; showSettings(); };
  $('return-title').onclick = () => { persist(); $('overlay').classList.add('hidden'); changeMode('menu'); updateMenu(); };
}
function showControls() {
  panel('controls', `<button class="close" data-close aria-label="Close controls">×</button><div class="eyebrow">A pilgrim’s guide</div><h2 id="panel-title">Find your way.</h2><p class="panel-desc">Awaken three resonators to open the Hollow Crown. Follow the inlaid path, collect the blue memory shards, and use your ember pulse to quiet the guardians.</p><div class="controls-grid">
  <div class="control-row">Move <kbd>W A S D / ↑ ↓ ← →</kbd></div><div class="control-row">Look <kbd>DRAG MOUSE</kbd></div><div class="control-row">Sprint <kbd>SHIFT</kbd></div><div class="control-row">Jump <kbd>SPACE</kbd></div><div class="control-row">Interact <kbd>E</kbd></div><div class="control-row">Ember pulse <kbd>Q</kbd></div><div class="control-row">Journal <kbd>J</kbd></div><div class="control-row">Pause <kbd>ESC</kbd></div><div class="control-row">Reset camera <kbd>R</kbd></div><div class="control-row">Zoom <kbd>SCROLL</kbd></div></div><p class="note">Controller: left stick move · right stick look · A jump · X interact · Y pulse · LB sprint · Start pause.<br>Touch: left joystick to move, drag to look, and use the action buttons.<br>Falling returns you to your last awakened resonator. Your discoveries are kept.</p><div class="panel-actions"><button class="primary" data-close>Understood <span class="arrow">↗</span></button></div>`);
}
function showSettings() {
  panel('settings', `<button class="close" data-close aria-label="Close settings">×</button><div class="eyebrow">Make this world yours</div><h2 id="panel-title">Settings</h2><div class="setting-row"><label for="quality">Visual quality<small>Lower settings improve battery life and performance.</small></label><select id="quality"><option value="high">High</option><option value="balanced">Balanced</option><option value="low">Performance</option></select></div><div class="setting-row"><label for="audio-enabled">Soundscape<small>Wind, resonant tones, and the sound of your journey.</small></label><input type="checkbox" id="audio-enabled" /></div><div class="setting-row"><label for="reduced-motion">Reduced motion<small>Disables camera shake and title-screen camera drift.</small></label><input type="checkbox" id="reduced-motion" /></div><div class="setting-row"><label for="invert-y">Invert vertical look<small>Applies to mouse, touch, and controller.</small></label><input type="checkbox" id="invert-y" /></div><div class="panel-actions"><button class="primary" data-close>Return <span class="arrow">↗</span></button></div>`);
  $<HTMLSelectElement>('quality').value = settings.quality;
  $<HTMLInputElement>('audio-enabled').checked = !sound.muted;
  $<HTMLInputElement>('reduced-motion').checked = settings.reducedMotion;
  $<HTMLInputElement>('invert-y').checked = settings.invertY;
  $('quality').onchange = () => { settings.quality = $<HTMLSelectElement>('quality').value; world.setQuality(settings.quality as 'high' | 'balanced' | 'low'); persistSettings(); };
  $('audio-enabled').onchange = () => { startAudio(); const checked = $<HTMLInputElement>('audio-enabled').checked; if (checked === sound.muted) sound.toggle(); settings.muted = sound.muted; updateSoundUI(); persistSettings(); };
  $('reduced-motion').onchange = () => { settings.reducedMotion = $<HTMLInputElement>('reduced-motion').checked; world.reducedMotion = settings.reducedMotion; persistSettings(); };
  $('invert-y').onchange = () => { settings.invertY = $<HTMLInputElement>('invert-y').checked; persistSettings(); };
}
function showJournal() {
  panel('journal', `<button class="close" data-close aria-label="Close journal">×</button><div class="eyebrow">Things the light remembers</div><h2 id="panel-title">The pilgrim’s journal</h2><p class="panel-desc">${game.save.memories.length} of 4 memories recovered · ${game.count} of 3 resonators awakened</p><div class="journal-list">${MEMORIES.map((m, i) => `<article class="journal-entry"><h3>${game.save.memories.includes(i) ? m.title : `${['I', 'II', 'III', 'IV'][i]}. A memory yet to be found`}</h3><p>${game.save.memories.includes(i) ? m.text : 'Look for a blue light along the pilgrimage route.'}</p></article>`).join('')}${BEACONS.filter((_, i) => game.save.activated[i]).map(b => `<article class="journal-entry"><h3>${b.name} · ${b.word}</h3><p>${b.line}</p></article>`).join('')}</div><div class="panel-actions"><button class="secondary" data-close>Return to the world</button></div>`);
}
function showPuzzle(index: number) {
  puzzleIndex = index; currentPuzzle = new ResonancePuzzle(index); puzzleSolved = false; returnMode = 'playing';
  const b = BEACONS[index];
  panel('puzzle', `<button class="close" data-close aria-label="Leave resonator">×</button><div class="eyebrow">Resonator ${['I', 'II', 'III'][index]} · ${b.word}</div><h2 id="panel-title">${b.name}</h2><p class="panel-desc">Three rings. One forgotten song.<br>Align each ring’s opening with the golden needle above.</p><div class="puzzle-art"><div class="puzzle-ring"></div><div class="puzzle-ring"></div><div class="puzzle-ring"></div><span class="puzzle-needle"></span><span class="puzzle-center">✧</span></div><div class="ring-select"><button data-ring="0">I · OUTER</button><button data-ring="1">II · MIDDLE</button><button data-ring="2">III · INNER</button></div><div class="turn-buttons"><button class="secondary" id="turn-left">↶ &nbsp; Turn left</button><button class="secondary" id="turn-right">Turn right &nbsp; ↷</button></div><div id="puzzle-status">0 / 3 RINGS ALIGNED</div><p class="note">Select a ring · A / D or arrow keys to turn · 1 / 2 / 3 to select</p>`);
  $('overlay').querySelectorAll<HTMLButtonElement>('[data-ring]').forEach(b => b.onclick = () => { if (puzzleSolved) return; currentPuzzle!.selected = Number(b.dataset.ring); updatePuzzle(); sound.tick(); });
  $('turn-left').onclick = () => turnPuzzle(-1); $('turn-right').onclick = () => turnPuzzle(1); updatePuzzle();
}
function updatePuzzle() {
  if (!currentPuzzle) return;
  $('overlay').querySelectorAll<HTMLElement>('.puzzle-ring').forEach((r, i) => { r.style.transform = `rotate(${currentPuzzle!.rings[i] * 45}deg)`; r.classList.toggle('selected', currentPuzzle!.selected === i); r.classList.toggle('aligned', currentPuzzle!.rings[i] === 0); });
  $('overlay').querySelectorAll('[data-ring]').forEach((b, i) => { b.classList.toggle('active', currentPuzzle!.selected === i); b.setAttribute('aria-pressed', String(currentPuzzle!.selected === i)); });
  $('puzzle-status').textContent = `${currentPuzzle.rings.filter(r => r === 0).length} / 3 RINGS ALIGNED`;
}
function turnPuzzle(direction: number) {
  if (!currentPuzzle || puzzleSolved) return;
  currentPuzzle.rotate(direction); sound.tick(); updatePuzzle();
  if (currentPuzzle.solved) {
    puzzleSolved = true; game.activate(puzzleIndex); persist(); sound.chime();
    $('puzzle-status').textContent = 'RESONANCE RESTORED';
    $('overlay').querySelectorAll<HTMLButtonElement>('button').forEach(b => b.disabled = true);
    modalTimer = window.setTimeout(() => {
      $('overlay').classList.add('hidden'); changeMode('playing'); world.emitPulse(BEACONS[puzzleIndex].x, BEACONS[puzzleIndex].z);
      subtitle(BEACONS[puzzleIndex].line, 10, BEACONS[puzzleIndex].name);
      toast(game.count === 3 ? 'The Hollow Crown is open. Follow the light to the threshold.' : `${game.count} of 3 resonators awakened · Checkpoint saved`, 5); modalTimer = 0;
    }, 1100);
  }
}
function nearestInteraction(): { type: 'beacon' | 'memory' | 'gate'; index: number; text: string } | null {
  for (let i = 0; i < BEACONS.length; i++) if (!game.save.activated[i] && distance(game, BEACONS[i]) < 3.7 && Math.abs(game.y) < 2) return { type: 'beacon', index: i, text: `Awaken ${BEACONS[i].name}` };
  for (let i = 0; i < MEMORIES.length; i++) if (!game.save.memories.includes(i) && distance(game, MEMORIES[i]) < 2.9 && Math.abs(game.y) < 2) return { type: 'memory', index: i, text: 'Recover a memory' };
  if (distance(game, { x: 0, z: -182 }) < 5.5) return { type: 'gate', index: 0, text: game.count === 3 ? 'Enter the Hollow Crown' : 'Listen at the threshold' };
  return null;
}
function interact() {
  if (mode !== 'playing') return;
  const target = nearestInteraction(); if (!target) return;
  if (target.type === 'beacon') showPuzzle(target.index);
  if (target.type === 'memory') {
    const m = MEMORIES[target.index]; game.save.memories.push(target.index); persist(); sound.chime(); returnMode = 'playing';
    panel('memory', `<div class="memory-symbol">◈</div><div class="eyebrow">A memory recovered</div><h2 id="panel-title">${m.title}</h2><p class="memory-body">${m.text}</p><p class="note">${game.save.memories.length} / 4 memories · Saved to your journal</p><div class="panel-actions"><button class="primary" data-close>Carry it with you <span class="arrow">↗</span></button></div>`);
  }
  if (target.type === 'gate') {
    if (game.count < 3) { subtitle('Three voices. Three fragments of a soul. Bring them home, and I will remember how to open.', 7, 'The threshold'); return; }
    showChoice();
  }
}
function showChoice() {
  returnMode = 'playing';
  panel('choice', `<button class="close" data-close aria-label="Return to the citadel">×</button><div class="eyebrow">The end of the pilgrimage</div><h2 id="panel-title">What will you give the dawn?</h2><p class="memory-body">At the heart of the Crown, a dying star dreams.<br>It has waited a thousand years for someone<br>who would ask what it wants.</p><p class="panel-desc">Your ember can wake the world that was.<br>Or it can light the way for a world yet to come.</p><div class="ending-choices"><button class="choice" id="rekindle"><strong>Rekindle</strong><span>Give your ember to the star. Let the old world see another morning.</span></button><button class="choice" id="release"><strong>Release</strong><span>Set the star’s memories free. Let something new grow in the quiet.</span></button></div>`);
  $('rekindle').onclick = () => finish('rekindle'); $('release').onclick = () => finish('release');
}
function finish(ending: 'rekindle' | 'release') {
  game.save.ending = ending; persist(); sound.chime();
  const rekindle = ending === 'rekindle';
  panel('ending', `<div class="memory-symbol" style="color:${rekindle ? '#e7bd77' : '#a5cace'}">${rekindle ? '☼' : '✧'}</div><div class="eyebrow">Chapter I · Complete</div><h2 id="panel-title">${rekindle ? 'A morning, once more.' : 'A sky without an ending.'}</h2><p class="memory-body">${rekindle ? 'For a moment, nothing happens.<br>Then warmth touches your face.<br>Far below, beneath a thousand years of ash,<br>a single flower opens.' : 'You open your hand.<br>A thousand small lights rise into the dark.<br>For the first time in an age, the star is quiet.<br>Somewhere, a seed begins to dream.'}</p><p class="panel-desc">${game.save.memories.length === 4 ? 'You carried every memory into the dawn. Nothing that was loved is ever truly lost.' : `You carried ${game.save.memories.length} of 4 memories into the dawn. Some stories still wait among the stones.`}</p><div class="panel-rule"></div><p class="note">Thank you for walking through this world.<br>VESPER · THE LAST EMBER</p><div class="panel-actions"><button class="primary" id="ending-title">Return to title <span class="arrow">↗</span></button><button class="secondary" id="ending-explore">Keep exploring</button></div>`);
  $('ending-title').onclick = () => { $('overlay').classList.add('hidden'); changeMode('menu'); updateMenu(); };
  $('ending-explore').onclick = () => { $('overlay').classList.add('hidden'); changeMode('playing'); };
}
function pulse() { if (mode !== 'playing') return; if (game.pulse()) { world.emitPulse(game.x, game.z); sound.pulse(); } else toast(`Your ember is gathering strength · ${Math.ceil(game.pulseCooldown)}s`, 2); }
function updateHUD() {
  $('region').textContent = game.region;
  const remaining = BEACONS.map((b, i) => ({ ...b, i })).filter(b => !game.save.activated[b.i]);
  const nearest = remaining.sort((a, b) => distance(game, a) - distance(game, b))[0];
  $('objective').innerHTML = `<span class="objective-dot"></span>${nearest ? `Awaken ${nearest.name} <span style="opacity:.6">· ${Math.round(distance(game, nearest))} m</span>` : 'Enter the Hollow Crown'}`;
  document.querySelectorAll('.beacon-pip').forEach((p, i) => p.classList.toggle('active', game.save.activated[i]));
  $('resolve-bar').style.width = `${game.resolve}%`; $('stamina-bar').style.width = `${game.stamina}%`; $('resolve-number').textContent = String(Math.round(game.resolve));
  $('pulse-status').textContent = game.pulseCooldown > 0 ? `${Math.ceil(game.pulseCooldown)}s · RECHARGING` : touchDevice ? 'READY' : 'Q · READY';
  const prompt = nearestInteraction(); $('prompt').classList.toggle('hidden', !prompt || mode !== 'playing');
  if (prompt) { $('prompt-text').textContent = prompt.text; $('prompt').querySelector('kbd')!.textContent = touchDevice ? 'ACT' : 'E'; }
}

$('begin-button').onclick = () => begin();
$('new-button').onclick = () => {
  returnMode = 'menu';
  panel('confirm', `<div class="eyebrow">A new pilgrimage</div><h2 id="panel-title">Begin again?</h2><p class="panel-desc">Starting a new journey replaces your saved resonators and memories.</p><div class="panel-actions"><button class="primary" id="confirm-new">Begin anew <span class="arrow">↗</span></button><button class="secondary" data-close>Keep my journey</button></div>`);
  $('confirm-new').onclick = () => begin(true);
};
$('sound-button').onclick = () => { if (!sound.context) { sound.muted = false; startAudio(); } else sound.toggle(); settings.muted = sound.muted; persistSettings(); updateSoundUI(); };
$('settings-button').onclick = () => { if (mode === 'puzzle' || mode === 'choice' || mode === 'ending' || mode === 'memory') return; returnMode = mode === 'menu' ? 'menu' : mode === 'paused' ? 'paused' : 'playing'; showSettings(); };
$('controls-button').onclick = () => { returnMode = 'menu'; showControls(); };
$('pause-button').onclick = () => { if (mode === 'playing') showPause(); else if (mode === 'paused') closePanel(); };
$('fullscreen-button').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); else toast('Use your browser’s fullscreen or Add to Home Screen option.'); } catch { toast('Fullscreen is unavailable here. You can continue in this window.'); } };
$('prompt').onclick = interact;
$('touch-interact').onclick = interact; $('touch-pulse').onclick = pulse; $('touch-jump').onclick = () => { jumpQueued = true; };
$('touch-sprint').onpointerdown = e => { touchSprint = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); };
$('touch-sprint').onpointerup = $('touch-sprint').onpointercancel = () => { touchSprint = false; };
let joystickId: number | null = null;
$('joystick').onpointerdown = e => { joystickId = e.pointerId; $('joystick').setPointerCapture(e.pointerId); moveJoystick(e); };
function moveJoystick(e: PointerEvent) { if (e.pointerId !== joystickId) return; const rect = $('joystick').getBoundingClientRect(); let x = (e.clientX - rect.left - rect.width / 2) / 40, z = (e.clientY - rect.top - rect.height / 2) / 40; const length = Math.max(1, Math.hypot(x, z)); x /= length; z /= length; touchX = x; touchZ = z; $('stick').style.transform = `translate(${x * 34}px,${z * 34}px)`; }
$('joystick').onpointermove = moveJoystick;
$('joystick').onpointerup = $('joystick').onpointercancel = () => { joystickId = null; touchX = touchZ = 0; $('stick').style.transform = ''; };

window.addEventListener('keydown', e => {
  // Keep focus inside the active dialog.
  if (e.code === 'Tab' && !$('overlay').classList.contains('hidden')) {
    const controls = Array.from($('overlay').querySelectorAll<HTMLElement>('button:not(:disabled),select,input'));
    if (controls.length) { const first = controls[0], last = controls[controls.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  }
  if (e.code === 'Escape') {
    e.preventDefault(); if (mode === 'playing') showPause(); else if (mode === 'paused') closePanel(); else if (!['menu', 'ending'].includes(mode)) closePanel(); return;
  }
  if (mode === 'puzzle') {
    if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Digit1', 'Digit2', 'Digit3'].includes(e.code)) e.preventDefault();
    if (e.repeat || puzzleSolved) return;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') turnPuzzle(-1);
    if (e.code === 'KeyD' || e.code === 'ArrowRight') turnPuzzle(1);
    if (/^Digit[123]$/.test(e.code)) { currentPuzzle!.selected = Number(e.code.slice(-1)) - 1; updatePuzzle(); }
    return;
  }
  if (mode !== 'playing') return;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) e.preventDefault();
  keys.add(e.code); if (e.repeat) return;
  if (e.code === 'Space') jumpQueued = true;
  if (e.code === 'KeyE') interact();
  if (e.code === 'KeyQ') pulse();
  if (e.code === 'KeyJ') { returnMode = 'playing'; showJournal(); }
  if (e.code === 'KeyR') { world.cameraYaw = 0; world.cameraPitch = .2; }
});
window.addEventListener('keyup', e => keys.delete(e.code));
window.addEventListener('blur', () => { clearInput(); if (mode === 'playing') showPause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { clearInput(); if (mode === 'playing') showPause(); sound.pause(true); } else if (sound.context) sound.pause(false); });
function setupLook() {
  const canvas = world.renderer.domElement; let pointer: number | null = null; let px = 0, py = 0;
  canvas.addEventListener('pointerdown', e => { if (mode !== 'playing') return; pointer = e.pointerId; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (pointer !== e.pointerId || mode !== 'playing') return; const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY; world.cameraYaw -= dx * .004; world.cameraPitch = Math.max(.05, Math.min(1.15, world.cameraPitch + dy * .003 * (settings.invertY ? -1 : 1))); });
  const release = () => { pointer = null; }; canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('wheel', e => { if (mode === 'playing') { e.preventDefault(); world.cameraDistance = Math.max(5, Math.min(17, world.cameraDistance + e.deltaY * .012)); } }, { passive: false });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); contextLost = true; showPause(); toast('The graphics connection was interrupted. Reload to restore your saved journey.', 120); });
}
function pollGamepad(dt: number): { x: number; z: number; sprint: boolean } {
  const pad = navigator.getGamepads?.()?.find(p => p?.connected);
  if (!pad) { gamepadPrevious = []; return { x: 0, z: 0, sprint: false }; }
  const pressed = pad.buttons.map(b => b.pressed);
  const edge = (i: number) => pressed[i] && !gamepadPrevious[i];
  if (edge(9)) { if (mode === 'playing') showPause(); else if (mode === 'paused') closePanel(); }
  if (mode === 'playing') {
    if (edge(0)) jumpQueued = true; if (edge(2)) interact(); if (edge(3)) pulse();
    if (Math.abs(pad.axes[2] ?? 0) > .15) world.cameraYaw -= pad.axes[2] * dt * 2;
    if (Math.abs(pad.axes[3] ?? 0) > .15) world.cameraPitch = Math.max(.05, Math.min(1.15, world.cameraPitch + pad.axes[3] * dt * 1.4 * (settings.invertY ? -1 : 1)));
  } else if (mode === 'puzzle') {
    if (edge(14)) turnPuzzle(-1); if (edge(15)) turnPuzzle(1);
    if (edge(4) || edge(5)) { currentPuzzle!.selected = (currentPuzzle!.selected + (edge(5) ? 1 : 2)) % 3; updatePuzzle(); }
    if (edge(1)) closePanel();
  } else {
    const buttons = Array.from((mode === 'menu' ? $('menu') : $('overlay')).querySelectorAll<HTMLElement>('button:not(:disabled):not(.hidden),select,input'));
    if (edge(12) || edge(13)) { const current = buttons.indexOf(document.activeElement as HTMLElement); buttons[(current + (edge(13) ? 1 : buttons.length - 1) + buttons.length) % buttons.length]?.focus(); }
    if (edge(0)) (document.activeElement as HTMLElement)?.click(); if (edge(1) && mode !== 'menu' && mode !== 'ending') closePanel();
  }
  gamepadPrevious = pressed;
  return { x: Math.abs(pad.axes[0]) > .15 ? pad.axes[0] : 0, z: Math.abs(pad.axes[1]) > .15 ? pad.axes[1] : 0, sprint: pressed[4] };
}
let hudClock = 0;
function frame(time: number) {
  requestAnimationFrame(frame); if (contextLost) return;
  const dt = Math.min((time - lastTime) / 1000 || .016, .05); lastTime = time;
  const pad = pollGamepad(dt);
  if (mode === 'playing') {
    const x = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft')) + touchX + pad.x;
    const z = Number(keys.has('KeyS') || keys.has('ArrowDown')) - Number(keys.has('KeyW') || keys.has('ArrowUp')) + touchZ + pad.z;
    const c = Math.cos(world.cameraYaw), s = Math.sin(world.cameraYaw);
    const outcome = game.update(dt, x * c + z * s, -x * s + z * c, keys.has('ShiftLeft') || keys.has('ShiftRight') || touchSprint || pad.sprint, jumpQueued); jumpQueued = false;
    if (game.z < -183) game.z = -183;
    if (outcome === 'fall') { toast('The ember carries you back. Your discoveries are safe.', 4); world.shake = 0; }
    if (game.region !== previousRegion) { previousRegion = game.region; toast(game.region, 3); if (game.region === 'The Cinder Choir' && game.count < 3) subtitle('The guardians have forgotten who they protect. Let your ember remind them.', 7, 'The echo'); }
    for (const sentry of world.sentries) {
      if (sentry.stunned <= 0 && game.count < 3 && game.y < 2 && distance(game, sentry.group.position) < 2.2 && game.invulnerable <= 0) {
        const restored = game.hurt(34); $('damage').style.opacity = '.7'; window.setTimeout(() => $('damage').style.opacity = '0', 180);
        sound.tone(75, .4, .25, 'sawtooth'); toast(restored ? 'Your ember finds its way back to the light.' : 'Guardian nearby · Use your ember pulse to quiet it.', 3);
      }
    }
    sound.step(dt, game.moving, game.sprinting, game.y === 0);
  } else { game.moving = false; game.sprinting = false; }
  // Dialogs freeze the scene; avoid spending GPU time rendering an unchanged frame.
  if (mode === 'playing' || mode === 'menu') { world.update(dt, game, mode); world.render(); }
  hudClock += dt; if (hudClock > .1 && mode !== 'menu') { updateHUD(); hudClock = 0; }
  if (toastTimer > 0) { toastTimer -= dt; if (toastTimer <= 0) $('toast').classList.remove('visible'); }
  if (subtitleTimer > 0 && mode === 'playing') { subtitleTimer -= dt; if (subtitleTimer <= 0) $('subtitle').classList.remove('visible'); }
}
try {
  world = new World($('world')); world.setQuality(settings.quality as 'high' | 'balanced' | 'low'); world.reducedMotion = settings.reducedMotion;
  setupLook(); updateMenu(); updateSoundUI();
  world.update(.016, game, 'menu'); world.render();
  requestAnimationFrame(frame);
  window.setTimeout(() => { $('loading').style.opacity = '0'; window.setTimeout(() => $('loading').classList.add('hidden'), 1000); }, 350);
  // Explicitly opt-in, development-only hooks for repeatable browser validation.
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('test')) {
    (window as unknown as { __vesper: unknown }).__vesper = {
      get state() { return game; }, get mode() { return mode; }, get world() { return world; },
      teleport(x: number, z: number) { game.x = x; game.z = z; game.y = 0; game.vy = 0; game.falling = false; game.invulnerable = 10; },
    };
  }
} catch (error) {
  console.error(error); $('loading').classList.add('failed'); $('loading').innerHTML = `${emblem}<p>This world needs WebGL 2 graphics. Enable hardware acceleration in your browser, or try a recent version of Chrome, Edge, Firefox, or Safari.</p><button class="secondary" id="retry">Try again</button>`; $('retry').onclick = () => location.reload();
}
