# Underworld Excavator
Inspiration image: 60593e9d

## The fantasy / core verb
Walk into the golden, sculpted belly of a buried city. The arches and reliefs of the photograph become enormous real spaces you can traverse and tear open. **Charge and blast** a slow seismic sphere into cracked stone; hear the rumble, see the fracture, walk through what was a wall.

## Genre and loop
Free-roaming first-person 3D excavation action sandbox.
**Explore → charge → fracture → vacuum stone → upgrade → descend.**
The player starts holding a heavy cannon, already aimed at a weak rock curtain. No introductory modal. A pulsing reticle and visibly cracked blocks teach firing. Timber galleries, giant carved figures, glowing fissures and skylights establish scale. Sandstone archways connect an entrance hall, residential warren, cistern, market and deep vault. Everything visible is approachable; only intact rock physically impedes movement.

## Progression
Six branches, eight tiers each, with escalating costs: seismic force (damage and cannon barrel growth), resonance (blast radius and luminous rings), tunneling (penetration and multiple impacts), magnet (collection range and golden pickups), machinery (persistent rigs and animated conveyors generating stone), mobility (sprint → jump boost → grapple → hover). District depth scales stone yield and wall strength. Milestones change the cannon's metal bands, glow and geometry. Rigs continue mining during exploration and award a capped offline income. Long equipment progression, no prestige reset. Tab opens a compact icon-led forge while the world stays visible. Main save persists gear, destroyed blocks, location, stone and rigs in localStorage. Quick rush is a separate five-minute district with a large cannon, hover and rapidly earned upgrades; it never overwrites main progress.

## Feel
Charged orb swells at the muzzle with rising synthesized tone; release kicks the camera. Impacts flash, briefly stop motion, shake the viewpoint, burst angular instanced rubble and floating yield numbers. Mining neighboring supports drops remaining blocks. Shards arc and scatter, stone motes stream to the player, a low chord confirms purchases. Dust and warm shaft light frame silhouettes. Real world-space triplanar sandstone shader, sculpted arch meshes and hand-shaped relief figures anchor the image's organic language.

## Minute 1 / 10 / 30
1: Break the first wall, vacuum a satisfying stone payout, buy a noticeably stronger cannon, discover the scale through a newly exposed arch.
10: Link stronger shots through clustered structures; leap across galleries, deploy rigs, fly toward deeper districts and build an efficient mining route.
30: Fill out all 48 tiers; enormous chain blasts and automated income support free-form carving across five districts. Replay a short rush for a destruction score.

## Delivery / testing
Pinned Three.js 0.170.0, otherwise dependency-free browser runtime. Procedural geometry and Web Audio. Static source is copied to dist with the development hook excluded. Low/medium/high resolution and particle budgets; auto starts conservatively on low-core devices. Instanced rubble and dust. Dev-only entry injects state, teleport, currency and FPS access. Automated Chromium playthrough runs 180 seconds, captures 0/30/180 seconds plus a major-upgrade frame, measures first action and low-preset FPS and collects errors. Document approximations honestly.
