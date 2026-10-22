import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { CRAFT } from "./course.js";
const palette = {
  white: new THREE.MeshStandardMaterial({
    color: 0xede3e8,
    roughness: 0.33,
    metalness: 0.35,
  }),
  pink: new THREE.MeshStandardMaterial({
    color: 0xf43b91,
    roughness: 0.3,
    metalness: 0.45,
  }),
  ink: new THREE.MeshStandardMaterial({ color: 0x15142b, roughness: 0.65 }),
  seat: new THREE.MeshStandardMaterial({ color: 0xede0cb, roughness: 0.75 }),
  chrome: new THREE.MeshStandardMaterial({
    color: 0x9ab6d2,
    roughness: 0.25,
    metalness: 0.85,
  }),
  glass: new THREE.MeshStandardMaterial({
    color: 0x274b67,
    roughness: 0.12,
    metalness: 0.55,
    transparent: true,
    opacity: 0.79,
    side: THREE.DoubleSide,
  }),
  teak: new THREE.MeshStandardMaterial({ color: 0x7c4a61, roughness: 0.8 }),
  cyan: new THREE.MeshBasicMaterial({ color: 0x62ffed }),
  gold: new THREE.MeshBasicMaterial({ color: 0xffd478 }),
};
function mesh(group, geometry, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(
    geometry,
    typeof material === "string" ? palette[material] : material,
  );
  m.position.set(x, y, z);
  group.add(m);
  return m;
}
function box(g, size, mat, pos, r = 0) {
  let geo;
  if (mat === "seat" || (mat === "white" && size[1] > 0.2)) {
    const [w, h, d] = size,
      b = Math.min(0.055, w * 0.12, h * 0.19, d * 0.12),
      shape = new THREE.Shape();
    shape.moveTo(-w / 2 + b, -h / 2 + b);
    shape.lineTo(w / 2 - b, -h / 2 + b);
    shape.lineTo(w / 2 - b, h / 2 - b);
    shape.lineTo(-w / 2 + b, h / 2 - b);
    shape.closePath();
    geo = new THREE.ExtrudeGeometry(shape, {
      depth: d - b * 2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: b,
      bevelThickness: b,
    });
    geo.translate(0, 0, -d / 2 + b);
  } else geo = new THREE.BoxGeometry(...size);
  const m = mesh(g, geo, mat, ...pos);
  m.rotation.x = r;
  return m;
}
function rail(g, points, mat = "chrome", r = 0.025) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
  );
  return mesh(
    g,
    new THREE.TubeGeometry(curve, Math.max(8, points.length * 5), r, 5, false),
    mat,
  );
}
function hull(g, L, W, mat = "white") {
  const stations = [
    [-0.5, 0.015, 0.26],
    [-0.44, 0.43, 0.05],
    [-0.32, 0.77, -0.15],
    [-0.1, 1, -0.35],
    [0.22, 1, -0.42],
    [0.48, 0.92, -0.39],
    [0.5, 0.9, -0.36],
  ];
  const pos = [],
    idx = [],
    deck = [],
    didx = [];
  for (let i = 0; i < stations.length; i++) {
    const [z, w, keel] = stations[i],
      ww = W * 0.5 * w;
    const ring = [
      [-ww, 0.65],
      [-ww * 0.98, 0.22],
      [-ww * 0.6, keel],
      [0, keel - 0.15],
      [ww * 0.6, keel],
      [ww * 0.98, 0.22],
      [ww, 0.65],
    ];
    for (const [x, y] of ring) pos.push(x, y, z * L);
    deck.push(-ww, 0.65, z * L, ww, 0.65, z * L);
    if (i) {
      for (let j = 0; j < 6; j++) {
        const a = (i - 1) * 7 + j,
          b = i * 7 + j;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
      const a = (i - 1) * 2,
        b = i * 2;
      didx.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  // Transom and bow closure. The hull is a lofted, multi-chine surface, not a scaled primitive.
  idx.push(42, 48, 45, 42, 45, 43, 43, 45, 44, 45, 48, 47, 45, 47, 46);
  for (let i = 0; i < idx.length; i += 3) {
    const t = idx[i + 1];
    idx[i + 1] = idx[i + 2];
    idx[i + 2] = t;
  }
  for (let i = 0; i < didx.length; i += 3) {
    const t = didx[i + 1];
    didx[i + 1] = didx[i + 2];
    didx[i + 2] = t;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  mesh(g, geo, palette[mat]);
  const dg = new THREE.BufferGeometry();
  dg.setAttribute("position", new THREE.Float32BufferAttribute(deck, 3));
  dg.setIndex(didx);
  dg.computeVertexNormals();
  mesh(g, dg, "white");
  const edges = stations.map(([z, w]) => [W * 0.5 * w, 0.63, z * L]);
  rail(g, edges, "pink", 0.038);
  rail(
    g,
    edges.map(([x, y, z]) => [-x, y, z]),
    "pink",
    0.038,
  );
  for (const side of [-1, 1])
    rail(
      g,
      stations.slice(1).map(([z, w]) => [side * W * 0.5 * w, 0.22, z * L]),
      "cyan",
      0.017,
    );
}
function cushion(g, x, y, z, w = 0.72, d = 0.75) {
  box(g, [w, 0.16, d], "seat", [x, y, z]);
  box(g, [w, 0.6, 0.15], "seat", [x, y + 0.28, z + 0.35], -0.12);
}
function windshield(g, w, y, z) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [
        -w / 2,
        y,
        z,
        w / 2,
        y,
        z,
        -w * 0.41,
        y + 0.65,
        z + 0.35,
        w * 0.41,
        y + 0.65,
        z + 0.35,
      ],
      3,
    ),
  );
  geo.setIndex([0, 1, 2, 1, 3, 2]);
  geo.computeVertexNormals();
  mesh(g, geo, "glass");
  rail(
    g,
    [
      [-w / 2, y, z],
      [-w * 0.41, y + 0.65, z + 0.35],
      [w * 0.41, y + 0.65, z + 0.35],
      [w / 2, y, z],
    ],
    "chrome",
    0.026,
  );
  rail(
    g,
    [
      [0, y, z],
      [0, y + 0.65, z + 0.35],
    ],
    "chrome",
    0.019,
  );
}
function helm(g, x, y, z) {
  box(g, [0.55, 0.33, 0.5], "ink", [x, y, z]);
  box(g, [0.26, 0.015, 0.15], "cyan", [x, y + 0.17, z]);
  const wheel = mesh(
    g,
    new THREE.TorusGeometry(0.17, 0.019, 5, 16),
    "chrome",
    x,
    y + 0.27,
    z + 0.31,
  );
  wheel.rotation.x = -0.55;
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3;
    rail(
      g,
      [
        [x, y + 0.27, z + 0.31],
        [x + Math.sin(a) * 0.15, y + 0.27 + Math.cos(a) * 0.13, z + 0.31],
      ],
      "chrome",
      0.012,
    );
  }
}
function outboard(g, x, z, s = 1) {
  box(g, [0.42 * s, 0.7 * s, 0.5 * s], "ink", [x, 0.2, z]);
  const cap = mesh(
    g,
    new THREE.CapsuleGeometry(0.23 * s, 0.23 * s, 3, 8),
    "white",
    x,
    0.56,
    z,
  );
  cap.rotation.z = Math.PI / 2;
  box(g, [0.2 * s, 0.45 * s, 0.18 * s], "chrome", [x, -0.35, z + 0.1]);
  box(g, [0.52 * s, 0.06 * s, 0.16 * s], "ink", [x, -0.55, z + 0.18]);
}
function label(g, text, x, y, z, scale) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 100;
  const cx = c.getContext("2d");
  cx.clearRect(0, 0, 512, 100);
  cx.fillStyle = "#34283d";
  cx.font = "italic 54px Georgia";
  cx.textAlign = "center";
  cx.fillText(text, 256, 67);
  const tex = new THREE.CanvasTexture(c);
  const p = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3 * scale, 0.45 * scale),
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
    }),
  );
  p.position.set(x, y, z);
  g.add(p);
}
export function makeBoat(kind) {
  const g = new THREE.Group();
  g.name = kind;
  const s = CRAFT[kind];
  if (kind === "runabout") {
    hull(g, s.length, s.beam);
    box(g, [1.85, 0.07, 2.8], "teak", [0, 0.7, 0.85]);
    for (let i = -4; i <= 4; i++)
      box(g, [0.012, 0.008, 2.8], "ink", [i * 0.2, 0.741, 0.85]);
    box(g, [1.92, 0.35, 0.7], "white", [0, 0.81, -0.2]);
    windshield(g, 2.03, 1, -0.65);
    cushion(g, -0.52, 0.86, 0.65);
    cushion(g, 0.52, 0.86, 0.65);
    cushion(g, 0, 0.84, 2.05, 1.77, 0.7);
    helm(g, 0.53, 1.03, -0.12);
    box(g, [1.4, 0.09, 1.15], "seat", [0, 0.74, -1.7]);
    rail(
      g,
      [
        [-0.65, 0.91, -2.1],
        [0, 0.95, -2.85],
        [0.65, 0.91, -2.1],
      ],
      "chrome",
      0.025,
    );
    outboard(g, 0, 3.5, 1.1);
    label(g, "Daydream", 0, 0.36, 3.42, 0.7);
  } else if (kind === "yacht") {
    hull(g, s.length, s.beam);
    box(g, [2.6, 0.09, 2.6], "teak", [0, 0.72, 3.1]);
    for (let i = -5; i <= 5; i++)
      box(g, [0.012, 0.01, 2.6], "ink", [i * 0.22, 0.771, 3.1]);
    const cabin = box(g, [2.6, 0.85, 3.3], "white", [0, 1.12, -0.3]);
    cabin.scale.z = 1;
    box(g, [2.28, 0.65, 2.38], "glass", [0, 1.87, -0.35]);
    box(g, [2.7, 0.14, 2.9], "white", [0, 2.27, -0.15]);
    box(g, [1.85, 0.13, 1.7], "seat", [0, 0.81, -3]);
    windshield(g, 2.42, 1.57, -1.65);
    cushion(g, -0.7, 0.88, 2.1, 0.8, 0.8);
    cushion(g, 0.7, 0.88, 2.1, 0.8, 0.8);
    box(g, [1.8, 0.12, 0.7], "seat", [0, 0.94, 3.55]);
    helm(g, 0.65, 1.1, 1.35);
    for (const side of [-1, 1]) {
      const pts = [
        [side * 1.5, 1.24, 3.9],
        [side * 1.65, 1.24, 1],
        [side * 1.5, 1.24, -2.1],
        [side * 0.85, 1.24, -4.1],
        [0, 1.24, -4.8],
      ];
      rail(g, pts);
      for (const p of pts.slice(0, 4))
        rail(g, [[p[0], 0.65, p[2]], p], "chrome", 0.021);
      for (let i = 0; i < 3; i++)
        box(g, [0.04, 0.24, 0.4], "glass", [side * 1.31, 1.1, -1.2 + i * 0.8]);
    }
    rail(
      g,
      [
        [0, 2.3, 0.4],
        [0, 3.25, 0.65],
        [0.75, 3.25, 0.65],
      ],
      "chrome",
      0.035,
    );
    box(g, [0.8, 0.12, 0.3], "ink", [0, 3.25, 0.65]);
    outboard(g, -0.62, 5.14, 1.05);
    outboard(g, 0.62, 5.14, 1.05);
    label(g, "Slowdance", 0, 0.36, 5.12, 0.9);
  } else {
    hull(g, s.length, s.beam, "pink");
    const seat = mesh(
      g,
      new THREE.CapsuleGeometry(0.25, 0.9, 4, 10),
      "ink",
      0,
      0.94,
      0.2,
    );
    seat.rotation.x = Math.PI / 2;
    box(g, [0.55, 0.32, 0.52], "white", [0, 1, -0.75], -0.35);
    rail(
      g,
      [
        [-0.46, 1.28, -0.55],
        [0, 1.32, -0.65],
        [0.46, 1.28, -0.55],
      ],
      "chrome",
      0.034,
    );
    box(g, [0.22, 0.03, 0.16], "cyan", [0, 1.2, -0.8], -0.35);
    for (const side of [-1, 1]) {
      box(g, [0.19, 0.05, 1.4], "ink", [side * 0.43, 0.72, 0.5]);
      rail(
        g,
        [
          [side * 0.42, 0.76, 0.8],
          [side * 0.43, 0.84, 1.25],
        ],
        "white",
        0.035,
      );
    }
    // A seated rider, with modeled helmet, visor, jacket, bent arms and legs.
    const suit = new THREE.MeshStandardMaterial({
      color: 0x261f46,
      roughness: 0.75,
    });
    const skin = new THREE.MeshStandardMaterial({
      color: 0xa9797a,
      roughness: 0.75,
    });
    const torso = mesh(
      g,
      new THREE.CapsuleGeometry(0.24, 0.35, 4, 8),
      suit,
      0,
      1.49,
      0.3,
    );
    torso.rotation.x = -0.22;
    mesh(g, new THREE.SphereGeometry(0.23, 14, 10), "white", 0, 2.04, 0.17);
    const visor = mesh(
      g,
      new THREE.SphereGeometry(
        0.234,
        14,
        8,
        Math.PI * 0.65,
        Math.PI * 0.7,
        0.25,
        1.6,
      ),
      "glass",
      0,
      2.04,
      0.17,
    );
    visor.rotation.y = Math.PI;
    for (const side of [-1, 1]) {
      rail(
        g,
        [
          [side * 0.18, 1.68, 0.17],
          [side * 0.35, 1.46, -0.13],
          [side * 0.4, 1.3, -0.55],
        ],
        suit,
        0.075,
      );
      mesh(
        g,
        new THREE.SphereGeometry(0.07, 6, 6),
        skin,
        side * 0.4,
        1.3,
        -0.55,
      );
      rail(
        g,
        [
          [side * 0.15, 1.22, 0.4],
          [side * 0.33, 0.96, 0.1],
          [side * 0.4, 0.8, 0.73],
        ],
        suit,
        0.1,
      );
      box(g, [0.18, 0.1, 0.35], "ink", [side * 0.4, 0.8, 0.78]);
    }
    rail(
      g,
      [
        [-0.18, 1.6, 0.05],
        [0, 1.68, 0.01],
        [0.18, 1.6, 0.05],
      ],
      "cyan",
      0.018,
    );
  }
  // Stern navigation and bow light, cleats, and hull hardware.
  for (const side of [-1, 1]) {
    mesh(
      g,
      new THREE.SphereGeometry(0.045, 6, 5),
      side < 0
        ? new THREE.MeshBasicMaterial({ color: 0xff5276 })
        : palette.cyan,
      side * s.beam * 0.38,
      0.79,
      -s.length * 0.25,
    );
    for (const z of [-s.length * 0.31, s.length * 0.35]) {
      box(g, [0.2, 0.04, 0.06], "chrome", [side * s.beam * 0.41, 0.73, z]);
    }
  }
  g.traverse((o) => {
    if (o.isMesh) o.frustumCulled = true;
  });
  return g;
}
