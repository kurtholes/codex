# Verification

- Full automated core-loop run completed: 180.026 game seconds, 208.502 total wall seconds including load, campaign exercise, screenshots and production verification.
- Time to first action: 6.3385 seconds from browser navigation's performance clock. This includes screenshot setup before input.
- LOW, 960×540 viewport, Chromium headless, ANGLE SwiftShader software rendering: average 7.43 FPS, minimum sampled 4.99 FPS. Shared-host software rendering is not representative of an integrated GPU. Actual 60 FPS laptop target not verified; performance remains a material limitation.
- Campaign destruction and salvage: 3 towers collapsed before the first upgrades. Three shell-size tiers plus bore and flight purchases exercised.
- Three-minute quick run: 23 collapsed towers, 153,330 damage, 6,489 salvage; ended=true at timeout.
- Zero browser console errors in the completed run.
- Static production build: development state access absent even with `?test`.
- Separate replay smoke: first run and restarted run each fired immediately (one active shell); purchase advanced shell tier from four to five; no page errors.
- Node syntax checks passed for source, static build and automation script.
- Earlier incomplete attempts encountered a browser closure and a stopped external test server; those are not represented as passing runs. Final automation owns its HTTP server and completed cleanly.

Screenshots: 00s.png, 30s.png, upgrade.png, 180s.png (world), result.png (result overlay). See VISUAL-REVIEW.md for comparison with the inspiration image. Raw measurements: report.json.

Not tested: physical GPU performance, real gamepad hardware, mobile/touch, full 30-minute campaign economy, cross-browser compatibility or audio mix on speakers.
