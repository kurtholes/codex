# Verification

The reproducible browser test is `tests/play.mjs`: it loads the development entry, selects low quality at 1280×800, holds heartfire, moves into the first crystal field, roots after taking damage, buys Heart Mass through the actual UI, then alternates movement, turning and healing while casting for a nominal three-minute schedule. `test-output/report.json` records actual frame rates, first-action time, errors and ending state. The test uses a real-time run, not a fast-forwarded clock. Screenshot capture and UI pauses are included in the schedule. Browser scheduling/capture delays can make the wall-clock run longer.

`tests/smoke.mjs` separately checks the production entry, absence of development state access, localStorage loading, upgrade display, and Quick Hunt with flight/fire inputs. `node --check` checks both JavaScript entry files. The build has been inspected for removal of `__test`.

Screenshots are generated in the ignored `test-output/` directory: `00-load.png`, `30-seconds.png`, `upgrade.png`, and `180-seconds.png`.

## Comparison with image 6170a9ab

The opening keeps the navy negative space, large striped pink sun, pale-haired black humanoid, exposed warm heart, black cat with gold eyes, root silhouettes and violet shards. The game translates the source's detailed painted realism into deliberately faceted procedural geometry. The red boxing glove and snake are omitted in favor of the owner's caster/cat focus. The opening camera shows the chest and familiar; moving and turning exposes the full playable field.

The first major upgrade screenshot shows a new six-pronged molten crown and a larger heart/projectile; the damage instrument rises from 120 to 166. At 30 seconds the fractured starting formations have left space around the caster and enemies have approached. The three-minute screenshot checks continued rendering and activity after roaming beyond the starting composition. The source remains much richer in organic surface detail, irregular terrain and atmospheric glow. There is no bloom postprocess; emissive colors, local light, rings and instanced fragments provide feedback.

## Limits

Headless performance in this shared container is not representative of laptop integrated graphics; 60 fps has not been verified. Low/medium/high currently change pixel density (0.75 / 1.5 / up to 2), while CPU concurrency selects the initial preset. Static scenery is merged by material; crystals/ruins, guardians and debris are instanced. There is no GPU timing or adaptive quality loop. Manual audio listening, touch on a physical device, gamepad, a full five-minute hunt, full six-tier branch purchases, and a 30-minute progression balance pass have not been tested. The final run uses the final gameplay JavaScript; afterward the HTML gained a data favicon and an unused CSS import was removed. Production was separately smoke-tested.

## Measured final run

| Check | Result |
|---|---|
| First core action | 3.81 seconds from page time origin |
| Low preset average | 14.84 FPS |
| Final sample | 18.69 FPS |
| Console / page errors | 0 |
| Shots / broken formations / guardians | 182 / 10 / 16 |
| Root healing | 30 → 66.28 HP |
| Heart Mass purchase | Tier 1, 120 → 166 damage, crown visible |
| Production hooks absent | Passed |
| Saved bank and tier load | 999 embers and tier 1 restored |
| Quick Hunt activation | Passed; fire/flight input smoke exercised |

The nominal 180-second automated schedule took **802.01 wall-clock seconds** in the shared browser environment, with **163.03 seconds of simulation**. Browser scheduling/capture stalls and capped frame deltas mean the screenshot labeled `180-seconds.png` is the end-of-run capture, not an exact three-minute exposure. The 0/30-second names are schedule markers as well. This is a completed extended stability exercise, but exact-time screenshot timing and the 60 fps target remain unmet. Frame rate is computed from uncapped frame intervals, not simulation deltas.
