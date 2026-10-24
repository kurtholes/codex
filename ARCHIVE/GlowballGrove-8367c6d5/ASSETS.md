# Procedural asset manifest
All current geometry, shader patterns, glow sprites and sound effects are generated locally by source code. No downloaded art, fonts, music or audio. Three.js is pinned to jsDelivr **0.170.0**; it is the only runtime import.

Potential local-generator replacements:

| Asset | Generator prompt | Target specification |
|---|---|---|
| Ancient mint tree | Ancient twisting midnight oak, flared roots, huge luminous turquoise and lime canopy, hand-painted cobalt bark, welcoming magical garden | GLB, under 12k triangles, 3 LODs, origin at root, 25m tall, no baked lighting |
| Cottage | Tiny plaster gardener cottage, steep uneven violet slate roof, copper chimney, warm amber mullioned windows, painterly fairy valley | GLB, under 8k triangles, separate roof/window/chimney meshes, 7m wide |
| Beetle | Tiny friendly copper-winged gardener beetle, six springy midnight legs, gold eyes and delicate glowing antennae | Rigged GLB, under 4k triangles, walk/push/jump loops, 1.5m long |
| Moonflower grove | Mint leaves, gold pollen bells, violet stems, blue-hour fairy garden | GLB, under 1k triangles per plant, 3 growth stages, atlas 512px |
| Terrain detail | Cobalt grass and painterly navy soil, no directional lighting, broad brush marks | Seamless albedo/normal 512px, triplanar world mapping |
| Sky | Deep indigo night with violet swirling nebula and narrow pink horizon, no moon | Equirectangular 2048×1024, low contrast stars, seamless longitude |
| Rolling sound | Soft textured pollen sphere rolling through dry blue grass, weighty but cozy | Mono WAV, seamless 2s, 44.1kHz, no reverb |
| Timber hit | Crunchy brittle hollow log burst, woody splinters followed by soft magical shimmer | 5 mono WAV variations, 0.4–0.8s, peak -3dB |
| Music | Gentle moonlit garden instrumental, soft celesta and warm pads, subtle motion, no vocals | Stereo OGG, seamless 90s loop, -18 LUFS |

Current sounds are short Web Audio oscillator envelopes; no background music is bundled. Current destruction uses pooled instanced timber fragments. Grass, path stones and fireflies are instanced. Terrain and large solids use world-position projections blended by normal, with procedural grain instead of UV textures.
