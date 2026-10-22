# Afterglow

A synthwave boating escape: three modeled watercraft, three seeded waterways, striped sunsets, palm islands, monumental arches, and a locally synthesized soundtrack.

**Sunset voyage** follows seven radio signals over 21.8 km, with a beginning and an ending. Allow roughly **10–17 minutes** at cruise speed, depending on your ride. **Free sail** extends the waterway indefinitely. You can keep sailing after the ending. There is no timer or loss condition.

## Run / build

Node.js 20+; no install step or build dependencies.

```sh
npm run dev       # localhost:4173 — source
npm test          # six deterministic checks
npm run build     # rebuilds dist/; strips development hooks
npm run preview   # localhost:4173 — production dist/
```

Stop one server before starting another, or set `PORT`. Host **the contents of `dist/`** on any static HTTP(S) server; subdirectory hosting works. Use HTTP rather than opening `index.html` as a file.

The only external request/runtime dependency is Three.js, pinned to **0.169.0** on jsDelivr. Everything else is generated locally. No accounts, analytics, or deployment workflows. Settings and one autosave stay in browser-local storage. Autosave runs every five seconds and on pause; **Continue your last voyage** resumes with the boat stopped.

## Controls

| Input          | Action                                      |
| -------------- | ------------------------------------------- |
| WASD / arrows  | Throttle, slow/reverse, steer               |
| Space / Shift  | Brake / cruise control                      |
| Mouse drag / C | Look around / change camera                 |
| R / M / H      | Recover to channel / sound / hide interface |
| Escape         | Pause/resume; quality and volume settings   |

Sail within 75 m of a cyan signal to hear its text broadcast. Touch screens have sailing buttons. Standard gamepads: left stick steers, triggers throttle/reverse, A brakes, Start pauses.

**Low** uses procedural reflection, pixel ratio 1, and less scenery. **Balanced** uses a 768 px planar reflection every other frame and caps pixel ratio at 1.35. **High** uses a 1280 px reflection every frame and caps pixel ratio at 2. Palms and terrain are batched; terrain and water detail use world coordinates.

## Tests and shortcuts

The source URL `/?test=1` exposes `window.__AFTERGLOW__`: state, `teleport(x,z,heading)`, `toSignal(index)`, and rendering diagnostics. **Production strips this entire block**, including when `?test=1` is present.

See [TESTING.md](TESTING.md) for automated results, optional browser-test instructions, and screenshots. Hardware performance, physical controllers/phones, Safari, Firefox, and speaker listening were not verified.

Deliberate shortcuts: arcade handling and gentle bobbing, elliptical shore collision, shader water with distorted planar reflections, text radio rather than voice recordings, and a repeating synthesized musical arrangement. Free sail generates a scenic corridor rather than a planet; far offshore becomes open water. Motifs recur on long trips.
