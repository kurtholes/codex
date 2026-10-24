# The Final Mile
Inspiration image: 2797a12a

## Fantasy and verb
A battered coupe, two silhouettes, a sunset road, and a lavender city that becomes real as you drive. Drive: drift, ram, jump and recover. Close chase camera with dashboard alternative. Physics-inspired arcade driving survival is the best fit: immediate momentum and recoverable disasters, no dialogue.

## Loop
Drive toward the city → drift and smash through physical failures → bank distance and stunt scrap → tune permanent parts at a garage → reach new routes and the city.

## World and feel
An open desert corridor includes highway, glass flats, canyon shoulder and industrial ruins. All lead toward the actual finish at the crystal city. Asphalt fissures, rolling rocks and crystal eruptions escalate with distance. Collisions scatter instanced debris; suspension, tire dust, red lamps, camera impulses and synthesized engine/crunch sounds carry feedback. Amber fog and peach sky frame a sharply modeled lavender skyline. Terrain uses world-space triplanar shader noise. Instant motion; icons and short labels teach inputs.

## Progression
Six permanent branches, six tiers each: drivetrain (speed, exhaust glow), chassis (condition, armor), cooling (boost recovery, glowing vents), tires (grip, glass-flat access), suspension (jump height, elevated road access), utility (ram rewards, crystal-break capability). Costs rise across tiers; speed trades recovery time against risk, grip trades slide rewards against control. Tier two suspension adds jump; tire tiers tame glass; cooling tames the basin; utility doubles smash rewards. Garage accessible while driving; purchases immediately rebuild visible equipment. No resets. City arrival banks a bonus and starts another harder crossing with retained upgrades.

## Modes and time
Main: persistent unlimited crossings. Quick-play: seeded one-mile approach, loaner upgrades, three timed failures, medals for finish/condition/style. Minute 1: dodge the first boulders, discover drifting and smash barriers. Minute 10: jump broken roads and build a visibly armored, fast coupe. Minute 30: max complementary branches and master faster crossings and quick-play medals.

## Scope and verification
Static Three.js application, pinned CDN, no runtime libraries. Instanced terrain props and debris, bounded recycling. Three quality presets, automatic initial selection. localStorage save. A separate dev entry enables state/teleport/currency/FPS; production excludes that module. Headless three-minute input simulation records screenshots, frame timings, first movement and console errors.
