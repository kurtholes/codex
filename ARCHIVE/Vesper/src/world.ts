import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { BEACONS, BRIDGES, ISLANDS, MEMORIES, type GameState } from './game';

const GOLD = 0xe9aa54;
const v = new THREE.Vector3();
let seed = 876;
function rand() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
function material(color: number, roughness = .85, metalness = .12) { return new THREE.MeshStandardMaterial({ color, roughness, metalness }); }
function mesh<G extends THREE.BufferGeometry, M extends THREE.Material>(geo: G, mat: M, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m; }
function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) { return mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z); }
function cylinder(rt: number, rb: number, h: number, mat: THREE.Material, x = 0, y = 0, z = 0, segments = 8) { return mesh(new THREE.CylinderGeometry(rt, rb, h, segments), mat, x, y, z); }
function stoneTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#776b59'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 18000; i++) { const c = Math.floor(35 + rand() * 130); ctx.fillStyle = `rgba(${c + 15},${c + 8},${c},.2)`; ctx.fillRect(rand() * 512, rand() * 512, rand() * 6 + 1, rand() * 3 + 1); }
  ctx.strokeStyle = '#3c332a'; ctx.lineWidth = 3;
  for (let y = 0; y < 512; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke(); for (let x = (y % 128 === 0 ? 0 : 64); x < 512; x += 128) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 64); ctx.stroke(); } }
  const tex = new THREE.CanvasTexture(canvas); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2, 4); tex.colorSpace = THREE.SRGBColorSpace; return tex;
}
function rockTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d')!; const pixels = ctx.createImageData(512, 512);
  const lattice = (x: number, y: number) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); };
  const noise = (x: number, y: number) => {
    const ix = Math.floor(x), iy = Math.floor(y); let fx = x - ix, fy = y - iy;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    return (lattice(ix, iy) * (1 - fx) + lattice(ix + 1, iy) * fx) * (1 - fy) + (lattice(ix, iy + 1) * (1 - fx) + lattice(ix + 1, iy + 1) * fx) * fy;
  };
  for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
    const broad = noise(x / 47, y / 83), medium = noise(x / 12, y / 24), fine = noise(x / 2, y / 3);
    const vein = Math.abs(Math.sin(x * .07 + noise(x / 65, y / 110) * 7));
    const shade = (48 + broad * 65 + medium * 35 + fine * 24) * (vein < .085 ? .46 : 1);
    const i = (y * 512 + x) * 4; pixels.data[i] = shade; pixels.data[i + 1] = shade * .92; pixels.data[i + 2] = shade * .78; pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  const tex = new THREE.CanvasTexture(canvas); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 5); tex.colorSpace = THREE.SRGBColorSpace; return tex;
}

function rockSpire(radius: number, height: number, mat: THREE.Material, x: number, y: number, z: number) {
  const geo = new THREE.CylinderGeometry(radius * .8, radius * 1.15, height, 17, 18);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const a = Math.atan2(p.getZ(i), p.getX(i)), h = p.getY(i) / height;
    const ridges = 1 + Math.sin(a * 7 + h * 3) * .15 + Math.sin(a * 13 - h * 5) * .08 + Math.sin(h * 60 + a * 4) * .025;
    p.setXYZ(i, p.getX(i) * ridges, p.getY(i) + Math.sin(a * 3) * radius * .13, p.getZ(i) * ridges);
  }
  geo.computeVertexNormals(); return mesh(geo, mat, x, y, z);
}
const noiseGLSL = `
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,r=0.;for(int i=0;i<5;i++){r+=noise(p)*a;p=p*2.03+vec3(3.1,1.7,4.3);a*=.5;}return r;}
`;

export class World {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, .1, 1200);
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  bloom: UnrealBloomPass;
  root = new THREE.Group();
  avatar = new THREE.Group();
  cloak!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  legs: THREE.Group[] = [];
  arms: THREE.Group[] = [];
  beacons: { group: THREE.Group; ring: THREE.Mesh; core: THREE.Mesh; light: THREE.PointLight; beam: THREE.Mesh; }[] = [];
  memories: THREE.Group[] = [];
  sentries: { group: THREE.Group; center: THREE.Vector3; phase: number; stunned: number }[] = [];
  embers!: THREE.Points;
  gate!: THREE.Mesh;
  pulseMesh: THREE.Mesh;
  pulseAge = 10;
  time = 0;
  cameraYaw = 0;
  cameraPitch = .2;
  cameraDistance = 11;
  shake = 0;
  reducedMotion = false;
  quality: 'high' | 'balanced' | 'low' = 'balanced';
  private particleData!: Float32Array;
  private cameraReady = false;
  private sky!: THREE.Mesh;
  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    this.renderer.setSize(innerWidth, innerHeight); this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.18;
    this.renderer.domElement.setAttribute('aria-label', '3D world of Vesper'); container.appendChild(this.renderer.domElement);
    this.scene.fog = new THREE.FogExp2(0x91512d, .0026);
    this.scene.add(this.root);
    const ambient = new THREE.HemisphereLight(0xe7b880, 0x292c32, 1.65); this.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffc984, 4.8); sun.position.set(90, 85, 20); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -65; sun.shadow.camera.right = 65; sun.shadow.camera.top = 65; sun.shadow.camera.bottom = -65; sun.shadow.camera.near = 1; sun.shadow.camera.far = 400;
    sun.shadow.bias = -.0004; sun.shadow.normalBias = .12; sun.target.position.set(0, 0, -70); this.scene.add(sun, sun.target);
    const rim = new THREE.DirectionalLight(0xff6930, 1.2); rim.position.set(-70, 15, -160); this.scene.add(rim);
    this.makeSky(); this.makeLandscape(); this.makeCitadel(); this.batchArchitecture(); this.makeAvatar(); this.makeBeacons(); this.makeMemories(); this.makeSentries(); this.makeParticles();
    this.pulseMesh = mesh(new THREE.TorusGeometry(1, .035, 6, 100), new THREE.MeshBasicMaterial({ color: 0xffd49a, transparent: true, opacity: 0, depthWrite: false }), 0, .2, 0);
    this.pulseMesh.rotation.x = -Math.PI / 2; this.scene.add(this.pulseMesh);
    this.composer = new EffectComposer(this.renderer); this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .42, .7, 1.15); this.composer.addPass(this.bloom); this.composer.addPass(new OutputPass());
    this.camera.position.set(33, 12, 53); this.camera.lookAt(-6, 16, -115);
    window.addEventListener('resize', () => this.resize());
  }
  batchArchitecture() {
    // Static stonework shares GPU buffers instead of issuing a draw call per block.
    this.root.updateMatrixWorld(true);
    const batches = new Map<THREE.Material, THREE.Mesh[]>();
    this.root.traverse(o => {
      if (!(o instanceof THREE.Mesh) || o === this.gate || Array.isArray(o.material)) return;
      const batch = batches.get(o.material) ?? []; batch.push(o); batches.set(o.material, batch);
    });
    batches.forEach((objects, mat) => {
      const geometries = objects.map(o => {
        const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
        return g.applyMatrix4(o.matrixWorld);
      });
      const combined = mergeGeometries(geometries);
      if (combined) {
        const m = mesh(combined, mat); this.root.add(m);
        objects.forEach(o => { o.removeFromParent(); o.geometry.dispose(); });
      }
      geometries.forEach(g => g.dispose());
    });
  }
  makeSky() {
    const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: {}, vertexShader: `varying vec3 vPos;void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`, fragmentShader: `${noiseGLSL}
varying vec3 vPos;void main(){vec3 p=normalize(vPos);float h=p.y;float n=fbm(p*5.8+vec3(0.,0.,4.));float wisps=pow(fbm(p*16.+vec3(n*4.)),3.);vec3 dark=vec3(.022,.018,.016),warm=vec3(.50,.145,.035),horizon=vec3(1.1,.36,.08);vec3 col=mix(warm,dark,smoothstep(.0,.65,h));col=mix(col,horizon,exp(-pow((h+.09)*5.,2.))*.8);float cloud=pow(max(0.,n-.35)*2.,2.);col+=vec3(.65,.22,.055)*wisps*1.7*smoothstep(.7,-.15,h);col+=vec3(.7,.3,.08)*cloud*.28;float star=pow(hash(floor(p*900.)),130.)*smoothstep(.05,.65,h);col+=vec3(star*.7);gl_FragColor=vec4(col,1.);}` });
    this.sky = mesh(new THREE.SphereGeometry(900, 32, 24), skyMat); this.sky.castShadow = false; this.sky.receiveShadow = false; this.scene.add(this.sky);
    const planetMat = new THREE.ShaderMaterial({ vertexShader: `varying vec3 vNormal;varying vec3 vPos;void main(){vNormal=normal;vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`, fragmentShader: `${noiseGLSL}
varying vec3 vNormal;varying vec3 vPos;void main(){vec3 n=normalize(vNormal);float terrain=fbm(n*15.);float ridges=fbm(n*37.+terrain*2.);float light=max(0.,dot(n,normalize(vec3(1.2,-.25,-.35))));float rim=pow(1.-max(0.,dot(n,vec3(0.,0.,1.))),3.);vec3 dark=vec3(.061,.035,.022);vec3 surface=mix(vec3(.21,.10,.048),vec3(.58,.30,.12),terrain);vec3 col=dark+surface*pow(light,1.5)*1.5;col+=vec3(.72,.29,.07)*rim*pow(light,.5)*1.9;col*=.86+ridges*.28;gl_FragColor=vec4(col,1.);}` });
    const planet = mesh(new THREE.SphereGeometry(106, 80, 64), planetMat, 68, 172, -490); planet.castShadow = false; this.scene.add(planet);
    const moon = mesh(new THREE.SphereGeometry(29, 48, 32), planetMat, 200, 53, -410); moon.castShadow = false; moon.rotation.z = .2; this.scene.add(moon);
  }
  makeLandscape() {
    const tex = stoneTexture();
    const rockMap = rockTexture();
    const rock = new THREE.MeshStandardMaterial({ color: 0xb8ab93, roughness: .98, map: rockMap, bumpMap: rockMap, bumpScale: 1.2 });
    const paving = new THREE.MeshStandardMaterial({ color: 0x8a7960, roughness: .94, map: tex, bumpMap: tex, bumpScale: .11 });
    const dark = material(0x3d382f); const trim = material(0x9b8058, .6, .35);
    const rune = new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 1.4 });
    ISLANDS.forEach((island, index) => {
      const g = new THREE.CylinderGeometry(1, .60, 1, 28, 7);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const y = p.getY(i); const angle = Math.atan2(p.getZ(i), p.getX(i));
        const noise = 1 + Math.sin(angle * 9 + y * 8) * .075 + Math.sin(angle * 15 + y * 9) * .04;
        p.setXYZ(i, p.getX(i) * noise * (island.rx + 1), y * (70 + index * 10), p.getZ(i) * noise * (island.rz + 1));
      }
      g.computeVertexNormals();
      const cliff = mesh(g, rock, island.x, -(70 + index * 10) / 2 - .3, island.z); this.root.add(cliff);
      const top = cylinder(1, 1, .7, paving, island.x, -.35, island.z, 48); top.scale.set(island.rx, 1, island.rz); this.root.add(top);
      for (let j = 0; j < 17; j++) {
        const a = j / 17 * Math.PI * 2; if (Math.abs(Math.sin(a)) > .91) continue;
        const height = 3 + rand() * 7;
        const b = rockSpire(1.2 + rand() * 2.5, height, rock, Math.cos(a) * island.rx * .98, -height * .38, island.z + Math.sin(a) * island.rz * .98);
        b.rotation.y = rand() * 3; this.root.add(b);
      }
      // Inlaid pilgrimage route.
      for (let z = island.z - island.rz + 2; z < island.z + island.rz - 2; z += 4) {
        this.root.add(box(5.3, .035, 3.7, dark, 0, .025, z));
        if (Math.round(z) % 3 === 0) this.root.add(box(.06, .045, .9, rune, 0, .06, z));
      }
      for (let j = 0; j < 14; j++) {
        const x = (rand() - .5) * island.rx * 1.7, z = island.z + (rand() - .5) * island.rz * 1.5;
        if (Math.abs(x) < 4) continue;
        const b = box(.7 + rand() * 2, .3 + rand() * 1.1, .6 + rand() * 1.3, rock, x, .2, z); b.rotation.set(rand() * .2, rand() * 4, rand() * .2); this.root.add(b);
      }
    });
    BRIDGES.forEach((b) => {
      const len = b.start - b.end, z = (b.start + b.end) / 2;
      this.root.add(box(b.width, 1.25, len + 2, paving, 0, -.64, z));
      this.root.add(box(b.width + .5, .22, len + 2, trim, 0, -1.25, z));
      for (let j = b.end; j < b.start; j += 2.2) {
        this.root.add(box(b.width - .2, .025, .045, dark, 0, .01, j));
        if (Math.round(j) % 2 === 0) this.root.add(box(.06, .035, .75, rune, 0, .02, j));
        for (const side of [-1, 1]) {
          const x = side * (b.width / 2 + .1);
          this.root.add(box(.35, 1.35, .4, dark, x, .65, j));
          this.root.add(box(.48, .12, .54, trim, x, 1.34, j));
          if (rand() > .18) this.root.add(box(.16, .17, 2.3, trim, x, .95, j + 1.1));
        }
      }
      for (const side of [-1, 1]) {
        const arch = mesh(new THREE.TorusGeometry(len * .48, .4, 6, 32, Math.PI), dark, side * b.width / 2, -2, z); arch.rotation.set(Math.PI, Math.PI / 2, 0); this.root.add(arch);
      }
    });
    // Monumental canyon walls and distant stone needles.
    for (let i = 0; i < 48; i++) {
      const side = i % 2 ? 1 : -1; const z = 80 - Math.floor(i / 2) * 23;
      const height = side === 1 ? 30 + rand() * 85 : 70 + rand() * 150;
      const x = side * ((side === 1 ? 155 : 75) + rand() * 65);
      const cliff = rockSpire(13 + rand() * 19, height, rock, x, height * .5 - 65, z);
      cliff.rotation.z = (rand() - .5) * .18; cliff.rotation.y = rand() * 5; this.root.add(cliff);
      for (let k = 0; k < 3; k++) this.root.add(rockSpire(3 + rand() * 5, height * .85, rock, x + (rand() - .5) * 25, height * .35 - 65, z + (rand() - .5) * 28));
    }
    // Distant mesas disappear gradually into the atmospheric haze.
    for (let i = 0; i < 14; i++) {
      const h = 45 + rand() * 65;
      this.root.add(rockSpire(15 + rand() * 25, h, rock, (rand() - .5) * 500, h * .5 - 120, -400 - rand() * 150));
    }
    // Entry overlook, lanterns and a broken arch.
    const pillarMat = material(0x77624a);
    for (const x of [-9, 9]) {
      this.root.add(box(1.5, 6, 1.7, pillarMat, x, 3, 31));
      this.root.add(box(2, .4, 2.1, trim, x, 6.1, 31));
      this.root.add(cylinder(.8, 1, 1, trim, x, 6.8, 31));
      this.root.add(mesh(new THREE.OctahedronGeometry(.35), rune, x, 7.5, 31));
    }
    for (let i = 0; i < 12; i++) {
      const z = 18 - i * 17;
      for (const x of [-3.7, 3.7]) {
        if (BRIDGES.some(b => z < b.start && z > b.end)) continue;
        this.root.add(cylinder(.12, .3, 1.7, dark, x, .85, z));
        this.root.add(cylinder(.5, .25, .3, trim, x, 1.7, z));
        this.root.add(mesh(new THREE.OctahedronGeometry(.2), rune, x, 2.05, z));
      }
    }
  }
  makeCitadel() {
    const tex = stoneTexture();
    const stone = new THREE.MeshStandardMaterial({ color: 0x88775a, map: tex, bumpMap: tex, bumpScale: .2, roughness: .82, metalness: .22 });
    const bronze = material(0x756047, .52, .55); const dark = material(0x2e2a25); const gold = material(0xcaa66c, .4, .65);
    const glow = new THREE.MeshStandardMaterial({ color: 0xffd598, emissive: 0xffac4e, emissiveIntensity: 2.1 });
    const building = new THREE.Group(); this.root.add(building);
    building.add(box(49, 20, 25, stone, 0, 10, -202));
    building.add(box(54, 1.5, 28, bronze, 0, 20, -202));
    building.add(box(53, 1.5, 29, bronze, 0, 1, -202));
    const roof = cylinder(17, 27, 9, bronze, 0, 25, -202, 4); roof.rotation.y = Math.PI / 4; roof.scale.z = .58; building.add(roof);
    for (let y = 3; y < 20; y += 3.5) building.add(box(49.5, .15, 25.5, bronze, 0, y, -202));
    for (let x = -24; x <= 24; x += 6) {
      building.add(box(.65, 21, 1.2, bronze, x, 10.5, -188.8));
      if (Math.abs(x) > 5) {
        building.add(box(2.4, 8, .18, dark, x + 2.6, 12, -189.3));
        building.add(box(.24, 6.8, .2, glow, x + 2.6, 12, -189.1));
        building.add(cylinder(.05, 1.2, 3.4, bronze, x + 2.6, 17.4, -189, 4));
      }
    }
    // Three tall, buttressed gothic towers.
    [-21, 0, 21].forEach((x, i) => {
      const h = i === 1 ? 67 : 44; const z = -210 - (i === 1 ? 3 : 0);
      building.add(cylinder(3.4, 5.6, h, stone, x, h / 2, z));
      for (let y = 8; y < h; y += 5) building.add(cylinder(4.5 - y / h, 4.7 - y / h, .5, bronze, x, y, z));
      building.add(cylinder(.06, 4.1, 22, bronze, x, h + 10, z));
      building.add(cylinder(.04, .16, 6, gold, x, h + 23, z));
      for (let a = 0; a < 8; a++) {
        const angle = a / 8 * Math.PI * 2;
        building.add(box(.45, h * .85, .55, bronze, x + Math.cos(angle) * 3.5, h * .5, z + Math.sin(angle) * 3.5));
        building.add(box(.3, 9, .3, glow, x + Math.cos(angle) * 3.7, h * .69, z + Math.sin(angle) * 3.7));
      }
    });
    // Suspended observatory on the left cliff.
    building.add(cylinder(15, 20, 9, stone, -40, 19, -192, 12));
    building.add(cylinder(20, 13, 5, bronze, -40, 12, -192, 12));
    building.add(cylinder(13, 5, 15, dark, -40, 2, -192, 10));
    building.add(cylinder(11, 16, 6, bronze, -40, 26.5, -192, 12));
    building.add(cylinder(16.4, 16.4, .5, gold, -40, 23.5, -192, 12));
    for (let a = 0; a < 12; a++) {
      const angle = a / 12 * Math.PI * 2;
      const x = -40 + Math.cos(angle) * 17.1, z = -192 + Math.sin(angle) * 17.1;
      building.add(box(.4, 10, .4, bronze, x, 18, z));
      const w = box(3.2, 1.2, .3, glow, x * 1.001, 19, z); w.rotation.y = -angle + Math.PI / 2; building.add(w);
    }
    // Crown arch and the sealed threshold.
    for (const x of [-6.3, 6.3]) {
      building.add(box(2.8, 15, 4, bronze, x, 7.5, -185.8));
      building.add(box(3.3, .5, 4.7, gold, x, 1.2, -185.8));
      building.add(cylinder(.05, 1.7, 7, stone, x, 18, -185.8, 4));
    }
    const arch = mesh(new THREE.TorusGeometry(6.3, 1.05, 4, 20, Math.PI), bronze, 0, 13.4, -185.8); building.add(arch);
    this.gate = box(10, 14, .35, new THREE.MeshStandardMaterial({ color: 0x131417, emissive: 0x7ecfff, emissiveIntensity: .03, transparent: true, opacity: .95 }), 0, 7, -186);
    building.add(this.gate);
    for (const x of [-3.3, 0, 3.3]) building.add(box(.07, 12, .4, gold, x, 7, -185.6));
    const crest = mesh(new THREE.TorusGeometry(2.15, .1, 8, 64), glow, 0, 11, -185.4); building.add(crest);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const p = box(.13, .8, .12, gold, Math.sin(a) * 2.6, 11 + Math.cos(a) * 2.6, -185.4); p.rotation.z = -a; building.add(p); }
    // Terrace parapets and broad silhouettes.
    for (const x of [-30, 30]) for (let z = -151; z > -196; z -= 5) { building.add(box(1.8, 2.5, 1.8, stone, x, 1.25, z)); building.add(box(2, .25, 2, gold, x, 2.6, z)); }
  }
  makeAvatar() {
    const leather = material(0x252429, .86); const fabric = material(0x343135, 1, .02); const trim = material(0x9a7650, .5, .6);
    const body = cylinder(.34, .4, 1.05, leather, 0, 1.23, 0); this.avatar.add(body);
    const head = mesh(new THREE.SphereGeometry(.32, 16, 12), fabric, 0, 2.02, -.04); head.scale.set(1.06, 1.18, 1.12); this.avatar.add(head);
    const face = mesh(new THREE.SphereGeometry(.25, 16, 12), material(0x090b0e), 0, 2.02, .17); face.scale.set(.82, 1, .35); this.avatar.add(face);
    const hoodRim = mesh(new THREE.TorusGeometry(.255, .065, 6, 20, Math.PI * 1.7), fabric, 0, 2.025, .205); hoodRim.rotation.z = -.7; hoodRim.scale.y = 1.2; this.avatar.add(hoodRim);
    this.avatar.add(mesh(new THREE.SphereGeometry(.37, 16, 8), fabric, 0, 1.65, -.04));
    const gem = mesh(new THREE.OctahedronGeometry(.09), new THREE.MeshStandardMaterial({ color: 0xffdc99, emissive: GOLD, emissiveIntensity: 2 }), .16, 1.55, .32); this.avatar.add(gem);
    this.avatar.add(cylinder(.39, .39, .12, trim, 0, 1.04, 0));
    for (const side of [-1, 1]) {
      const leg = new THREE.Group(); leg.position.set(side * .17, .9, 0); leg.add(cylinder(.12, .13, .72, leather, 0, -.35, 0)); leg.add(box(.25, .25, .42, leather, 0, -.76, .08)); this.legs.push(leg); this.avatar.add(leg);
      const arm = new THREE.Group(); arm.position.set(side * .38, 1.61, 0); const m = cylinder(.125, .09, .75, leather, side * .08, -.36, 0); m.rotation.z = side * .15; arm.add(m); arm.add(mesh(new THREE.SphereGeometry(.105, 8, 8), trim, side * .13, -.77, .02)); this.arms.push(arm); this.avatar.add(arm);
    }
    const cloth = new THREE.PlaneGeometry(1.6, 1.65, 14, 18);
    this.cloak = mesh(cloth, new THREE.MeshStandardMaterial({ color: 0x40332d, roughness: 1, side: THREE.DoubleSide }), 0, 0, 0);
    this.avatar.add(this.cloak);
    const staff = cylinder(.035, .045, 2.4, trim, -.56, 1.1, .05, 6); staff.rotation.z = .12; this.avatar.add(staff);
    this.avatar.add(mesh(new THREE.OctahedronGeometry(.12), new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 2.5 }), -.7, 2.32, .05));
    const glow = new THREE.PointLight(GOLD, 2, 5); glow.position.set(0, 1.3, .5); this.avatar.add(glow);
    this.scene.add(this.avatar);
  }
  makeBeacons() {
    const stone = material(0x625746); const bronze = material(0x9b7b4c, .38, .7);
    BEACONS.forEach((b) => {
      const group = new THREE.Group(); group.position.set(b.x, 0, b.z);
      group.add(cylinder(1.75, 2.2, .5, stone, 0, .25)); group.add(cylinder(1.1, 1.5, .6, bronze, 0, .75));
      for (let a = 0; a < 3; a++) { const theta = a / 3 * Math.PI * 2; const p = cylinder(.1, .32, 3, bronze, Math.cos(theta) * .9, 2.1, Math.sin(theta) * .9, 4); p.rotation.z = -.15 * Math.cos(theta); p.rotation.x = .15 * Math.sin(theta); group.add(p); }
      const ring = mesh(new THREE.TorusGeometry(1.02, .075, 8, 64), bronze, 0, 2.6); ring.rotation.x = .4; group.add(ring);
      const inner = mesh(new THREE.TorusGeometry(.76, .035, 6, 48), bronze); inner.rotation.y = Math.PI / 2; ring.add(inner);
      const core = mesh(new THREE.OctahedronGeometry(.48, 0), new THREE.MeshStandardMaterial({ color: 0xeab064, emissive: GOLD, emissiveIntensity: .7 }), 0, 2.6); group.add(core);
      const light = new THREE.PointLight(GOLD, 2, 10); light.position.y = 3; group.add(light);
      const beam = cylinder(.1, .5, 90, new THREE.MeshBasicMaterial({ color: 0xffce81, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }), 0, 47); beam.castShadow = false; group.add(beam);
      this.root.add(group); this.beacons.push({ group, ring, core, light, beam });
      const outline = mesh(new THREE.TorusGeometry(2.8, .025, 6, 64), bronze, b.x, .04, b.z); outline.rotation.x = Math.PI / 2; this.root.add(outline);
    });
  }
  makeMemories() {
    MEMORIES.forEach((m) => {
      const group = new THREE.Group(); group.position.set(m.x, 1.3, m.z);
      const mat = new THREE.MeshStandardMaterial({ color: 0x9ed5de, emissive: 0x6ab8ce, emissiveIntensity: 1.8, roughness: .2, metalness: .5 });
      const core = mesh(new THREE.OctahedronGeometry(.26), mat); core.scale.y = 1.8; group.add(core);
      const ring = mesh(new THREE.TorusGeometry(.48, .015, 6, 32), mat); ring.rotation.x = Math.PI / 2.4; group.add(ring); this.memories.push(group); this.root.add(group);
      this.root.add(cylinder(.7, .9, .35, material(0x564c41), m.x, .17, m.z));
    });
  }
  makeSentries() {
    [1, 2].forEach((i) => {
      const group = new THREE.Group(); const dark = material(0x37322d, .45, .7); const hot = new THREE.MeshStandardMaterial({ color: 0xff703c, emissive: 0xff451b, emissiveIntensity: 3 });
      group.add(mesh(new THREE.OctahedronGeometry(.5), dark)); group.add(mesh(new THREE.SphereGeometry(.16, 12, 8), hot, 0, 0, .4));
      const ring = mesh(new THREE.TorusGeometry(.8, .04, 6, 32), hot); ring.rotation.x = Math.PI / 2; group.add(ring);
      for (const x of [-1, 1]) { const wing = box(.9, .11, .4, dark, x * .7); wing.rotation.z = x * -.3; group.add(wing); }
      const light = new THREE.PointLight(0xff4e20, 3, 5); group.add(light);
      this.sentries.push({ group, center: new THREE.Vector3(0, 2, ISLANDS[i + 1].z + 4), phase: i * Math.PI, stunned: 0 }); this.root.add(group);
    });
  }
  makeParticles() {
    const count = 550; const data = this.particleData = new Float32Array(count * 3); const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { data[i * 3] = (rand() - .5) * 130; data[i * 3 + 1] = rand() * 55 - 8; data[i * 3 + 2] = 65 - rand() * 300; colors.set([1, .35 + rand() * .4, .12], i * 3); }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(data, 3)); geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 32; const ctx = canvas.getContext('2d')!; const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, '#fff'); g.addColorStop(.2, '#fff'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 32, 32);
    const mat = new THREE.PointsMaterial({ size: .18, map: new THREE.CanvasTexture(canvas), vertexColors: true, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending });
    this.embers = new THREE.Points(geometry, mat); this.root.add(this.embers);
  }
  setQuality(quality: 'high' | 'balanced' | 'low') {
    this.quality = quality; this.renderer.setPixelRatio(Math.min(devicePixelRatio, quality === 'high' ? 2 : quality === 'balanced' ? 1.5 : 1));
    this.renderer.shadowMap.enabled = quality !== 'low'; this.bloom.enabled = quality !== 'low'; this.resize();
  }
  resize() { this.camera.aspect = innerWidth / innerHeight; this.camera.updateProjectionMatrix(); this.renderer.setSize(innerWidth, innerHeight); this.composer.setSize(innerWidth, innerHeight); }
  emitPulse(x: number, z: number) {
    this.pulseAge = 0; this.pulseMesh.position.set(x, .35, z); this.shake = this.reducedMotion ? 0 : .12;
    this.sentries.forEach(s => { if (Math.hypot(s.group.position.x - x, s.group.position.z - z) < 14) s.stunned = 8; });
  }
  update(dt: number, state: GameState, mode: string) {
    this.time += dt;
    const t = this.time;
    this.avatar.position.set(state.x, state.y + (state.moving ? Math.abs(Math.sin(state.steps)) * .035 : Math.sin(t * 1.5) * .018), state.z);
    let diff = state.yaw - this.avatar.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); this.avatar.rotation.y += diff * Math.min(1, dt * 12);
    this.legs.forEach((leg, i) => leg.rotation.x = state.moving ? Math.sin(state.steps + i * Math.PI) * .65 : 0);
    this.arms.forEach((arm, i) => arm.rotation.x = state.moving ? -Math.sin(state.steps + i * Math.PI) * .3 : .04);
    const pos = this.cloak.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const row = Math.floor(i / 15), col = i % 15, f = row / 18;
      const edge = col / 14 * 2 - 1;
      pos.setXYZ(i, edge * (.32 + f * .56) + Math.sin(t * 2.5 + f * 3) * f * .10, 1.8 - f * 1.55 + Math.sin(edge * 8 + t * 3) * f * .035, -.27 - f * f * (state.sprinting ? .8 : .45) + Math.sin(f * 7 - t * 4 + edge * 1.4) * f * .13);
    }
    pos.needsUpdate = true; this.cloak.geometry.computeVertexNormals();
    this.beacons.forEach((b, i) => {
      b.ring.rotation.y = t * .35; b.ring.rotation.z = Math.sin(t * .3) * .35; b.core.rotation.y = -t * .5; b.core.position.y = 2.6 + Math.sin(t * 1.5 + i) * .14;
      (b.core.material as THREE.MeshStandardMaterial).emissiveIntensity = state.save.activated[i] ? 3.2 : .7;
      (b.beam.material as THREE.MeshBasicMaterial).opacity = state.save.activated[i] ? .14 + Math.sin(t) * .025 : 0;
      b.light.intensity = state.save.activated[i] ? 8 : 2;
    });
    this.memories.forEach((m, i) => { m.visible = !state.save.memories.includes(i); m.rotation.y = t * .6; m.position.y = 1.3 + Math.sin(t * 1.8 + i) * .12; });
    this.sentries.forEach(s => {
      if (mode === 'playing') s.stunned = Math.max(0, s.stunned - dt);
      s.group.position.copy(s.center).add(v.set(Math.sin(t * .35 + s.phase) * 9, Math.sin(t * 2) * .4, Math.cos(t * .35 + s.phase) * 7));
      s.group.rotation.y = t * .35; s.group.rotation.z = s.stunned > 0 ? .5 : Math.sin(t) * .05;
      s.group.visible = state.count < 3; s.group.position.y = s.stunned > 0 ? .7 : 2.3 + Math.sin(t * 2) * .3;
    });
    const gateMat = this.gate.material as THREE.MeshStandardMaterial; gateMat.emissiveIntensity = state.count === 3 ? 1.3 + Math.sin(t * 2) * .2 : .03;
    this.pulseAge += dt; const size = 1 + this.pulseAge * 13; this.pulseMesh.scale.setScalar(size); (this.pulseMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - this.pulseAge / 1.2);
    for (let i = 0; i < this.particleData.length; i += 3) { this.particleData[i] += dt * .32; this.particleData[i + 1] += dt * (.23 + (i % 4) * .14); if (this.particleData[i + 1] > 48) this.particleData[i + 1] = -8; }
    this.embers.geometry.attributes.position.needsUpdate = true;
    if (mode === 'menu') {
      this.camera.position.set(29 + (this.reducedMotion ? 0 : Math.sin(t * .08) * 2.5), 10, 53);
      this.camera.lookAt(-7, 24, -115); this.cameraReady = false;
    } else {
      const distance = this.cameraDistance;
      const target = new THREE.Vector3(state.x, Math.max(-3, state.y) + 1.7, state.z);
      const desired = target.clone().add(new THREE.Vector3(Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * distance, Math.sin(this.cameraPitch) * distance + 1.5, Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * distance));
      this.camera.position.lerp(desired, this.cameraReady ? 1 - Math.exp(-dt * 6) : 1);
      if (this.shake > 0) { this.camera.position.x += (rand() - .5) * this.shake; this.camera.position.y += (rand() - .5) * this.shake; this.shake = Math.max(0, this.shake - dt * .3); }
      target.add(new THREE.Vector3(-Math.sin(this.cameraYaw) * 7, .8, -Math.cos(this.cameraYaw) * 7));
      this.camera.lookAt(target); this.cameraReady = true;
    }
    this.sky.position.copy(this.camera.position);
  }
  render() { this.composer.render(); }
}
