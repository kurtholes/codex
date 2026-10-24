# NEON ROOT
Inspiration image: 6170a9ab

A free-roaming heartfire destruction toy beneath a striped pink sun. Shatter violet crystals and ruined columns, drain the earth to heal, and evolve alongside a gold-eyed black cat. Eight permanent branches have six tiers each. Quick Hunt equips a flying cannon build for five minutes and banks its embers into the same save.

Serve this folder with `python3 -m http.server 8179`, then open `http://localhost:8179/dist/`. No account or service is needed. Three.js **0.170.0** loads from its pinned jsDelivr URL; that module download is the only runtime network dependency. Audio is synthesized locally. Progress saves in localStorage under `neonroot6170`.

- WASD / arrows: move. Shift: sprint.
- Click: capture mouse and cast; hold to keep firing. F also casts.
- Mouse: turn and adjust camera. Escape: release mouse.
- R: hold to root and heal; Deep Roots adds damage.
- Space: leap; hold after Ascension tier 3 to fly.
- E: root grapple impulse after Ascension tier 2.
- Tab: evolution; buy a branch to spend embers.
- Quick Hunt, sound and graphics: upper right. Touch buttons provide basic forward/fire/root input.

Build: `npm install`, then `npm run build`. The build copies static source into `dist/` and removes the marked development block. There are no runtime dependencies besides Three.js. No deployment workflow is included.

Development: serve `src/?test=1` to expose `window.__test` (state, teleport, currency, upgrades, aim, input, damage) and an FPS overlay. Production has no test hooks. `npm test` runs the Playwright three-minute exercise against port 8179 and writes screenshots plus JSON to ignored `test-output/`. See [TESTING.md](TESTING.md) for measured results and visual comparison.

Shortcuts: procedural anatomy and rigid motion rather than a skinned character; towers disintegrate into generic pooled fragments rather than physically hinged collapse; grapple is a directed root impulse, without a tether simulation; terrain and floating scenery have no solid platform collision; the familiar uses a nutrient halo and gathering motion instead of recorded speech. There is synthesized spell audio, but no music. Progression is implemented, but a full 30-minute balance pass has not been performed. Touch is basic; gamepad is not implemented.

The three changes most likely to improve fun:

1. Add distinctive guardian attacks and elite silhouettes that reward dodging and piercing shots.
2. Give each region a unique destruction behavior, especially cascading tower collapses and suspended crystal chains.
3. Tune the 30-minute economy with players, then add branch-specific spell mutations and expressive cat pounces.
