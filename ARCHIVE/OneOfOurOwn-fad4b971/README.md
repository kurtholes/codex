# One of Our Own
Inspiration image: fad4b971

A first-person detective action toy set in an olive-green precinct. Recover the marked proof, carry it to the interrogation table, confront the marked officer, then pursue and restrain them. Continue shift saves credits, arrests and 24 upgrade tiers locally. Quick case provides tier-three equipment and rates one arrest without a timer.

Serve `dist/` with any static HTTP server, then open its index.html. Three.js is pinned to **0.170.0**, imported from jsDelivr. That CDN request is required on first load; there are no gameplay network requests, accounts or analytics.

Controls: WASD move, mouse look, Shift sprint, Space jump/vault, E recover/present/confront/arrest, Q reveal the trace, F break nearby props, Tab buy equipment, Escape release mouse. Click the scene to recapture. Facilities tier two enables walking the courtyard stairs to the gallery. Forensics increases payouts and scanner rings; pursuit improves speed and jumping; restraint extends cuff reach; facilities increases payouts and access. Each branch has six tiers with exponential prices. Select Low/Medium/High or hardware-based Auto in the starting menu.

Build: `npm install`, then `npm run build`. No runtime bundler or dependencies besides Three.js. Source is index.html + game.js; build.mjs copies the static entry and strips the development API from game.js. `npm test` runs the three-minute Playwright traversal; `node tests/smoke.mjs` checks the latest core loop and production API removal. Install Chromium with `npx playwright install chromium` if needed. Tests and screenshots are ignored under test-output/.

Verification details and screenshot comparison are in TESTING.md. The automated traversal uses development teleports to exercise the normal interaction handlers; it is not a navigation or human-usability test. Touch/gamepad, real integrated-GPU performance, and long-term economy balance were not tested.

Shortcuts: compact procedural architecture and low-poly people; symbolic scan markers rather than a full deduction system; no voiced questioning, branching suspect testimony, vehicle driving, or authored cases. Suspects follow a courtyard escape path. Collateral is counted rather than physically simulated building collapse. Progression is deliberately expensive and has no prestige reset. Stairs unlock by upgrading facilities. Audio uses small synthesized cues instead of recorded foley.

The three most valuable fun improvements:
1. Distinct suspect escape routes with vaults, door slams and officer reactions.
2. Physical questioning prompts and richer evidence types that change pursuit tactics.
3. Animated seated officers and hands, stronger impact foley, and more destructible shortcuts.
