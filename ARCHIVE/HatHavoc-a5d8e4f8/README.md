# Hat Havoc
Inspiration image: a5d8e4f8

A floating-slab destruction sandbox in an amber-and-teal Victorian market. Hurl slow pollen balls, collapse balconies, gather coins and grow eight upgrade branches through eight tiers each. Quick Play provides heavy pollen, flight and random free upgrade choices during a three-minute score run.

## Play
Serve this folder with `python3 -m http.server 8080`, then open `http://localhost:8080/dist/`. Opens straight into play. Three.js **0.160.0** loads from its pinned jsDelivr URL; this is the only runtime network request. No other runtime dependencies or assets.

- WASD / arrows up-down: surf; arrows left-right or mouse drag: turn.
- Hold click or F: hurl pollen. Space: rise. Shift: dive.
- E: upgrades. Q: dash after surfing tier 1. R: regrow market.
- Quick Play: instant heavy build; three minutes; select free upgrades.
- Low / Med / High / Auto: rendering presets; ♪ toggles synthesized sound.
- Touch buttons provide basic steering/fire. Gamepad left stick steers, right stick turns, trigger fires, A rises.

Campaign coins and upgrades save automatically to localStorage. Quick Play preserves the campaign and restores it on returning to Free Roam. Regrowing renews the market without resetting upgrades.

## Build & test
`npm install`, `npm run build`. The dependency-free build copies source into `dist/` and removes the marked developer test block. No bundler or deployment workflow. Serve with the command above, then `npx playwright install chromium` and `npm test` for the three-minute automated playthrough. Test artifacts and node_modules are ignored locally.

Development only: `/src/?test` exposes `window.__hat` with teleport, currency, firing, upgrades, state and FPS overlay. Production `dist/` removes this block entirely. See [TESTING.md](TESTING.md) for measured results and screenshot comparison.

## Scope and shortcuts
Procedural, deliberately stylized geometry replaces the reference's painterly detail. Buildings break into authored chunks; rubble uses bounded instancing and simple ballistic motion rather than rigid-body physics. Crowd bodies are instanced with a simple reactive sway. Eight linear upgrade tracks replace prerequisite webs. Richer districts increase structure height, toughness and value; flight unlocks upper reach. Regrowth is manual. No music track; all current sound is synthesized. Touch/gamepad are secondary implementations, not device-tested. The 60 FPS integrated-GPU target requires hardware verification.

The three changes most likely to improve fun:
1. More distinctive collapses: swinging baskets, torn cloth and roof-to-roof chain reactions.
2. District-specific moving targets and score multipliers that reward risky slab routes.
3. Sculpted showman animation, expressive crowd reactions and layered impact audio.
