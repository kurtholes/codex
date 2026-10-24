# Asset manifest

All art is generated procedurally in `game.js`; all audio uses Web Audio oscillators. No external assets are loaded at runtime. Three.js is the sole runtime library, vendored unchanged from `https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js` (MIT, exact version 0.170.0). The reference image is not required to run the game.

Local generators could replace these assets later:

| Asset | Generator prompt | Target specification |
|---|---|---|
| Grounded guide | Back view of a lone woman in a long pearl-gray tailored coat, dark wavy hair, boots, restrained Gothic silver city; readable human silhouette, no glowing armor | GLB, 8k triangles, 1 × 1024 PBR atlas, idle/walk skeletal loops, 2.3m tall, origin at feet; replace procedural lathed coat/limbs/hair |
| Floating globes | Vast pearl lantern sphere with delicate longitude lattice, equatorial seams, layered brass-silver pendant housing and tiny luminous underside | GLB, 12k triangles plus 2k LOD, 2k PBR textures; 34m diameter; replace layered sphere and torus mesh |
| Gothic facade kit | Slender silver Gothic city facade, buttresses, pointed window tracery, pale stone, no warm brick, no text | Modular GLB, 10m wide modules, under 3k triangles each, 1k tiling PBR maps; triplanar world-space scale 4.35m |
| Wet pearl paving | Icy blue pearl limestone paving, worn fine grout, shallow wet sheen, restrained roughness variation, seamless and flat illumination | 1024 square albedo/roughness/normal, tileable, 4.35m physical repeat; feed triplanar shader, never stretch UVs |
| Spectral crowd | Almost invisible elongated lavender human apparition, translucent fabric streamers drifting upward, graceful slow sway | GLB 1k triangles / 250 LOD, shared atlas, two vertex animations or baked offsets; compatible with instancing |
| Crystal screens | Thin frosted silver crystal sheets with very faint Gothic etching, fragile and translucent | GLB 500 triangles intact, 16 reusable shard shapes under 24 triangles each, shared material |
| Mist | Soft pearl fog bank with no baked lighting or hard boundaries, nearly transparent feathered edge | 256 square RGBA; billboard, premultiplied alpha, replace radial canvas sprite |
| Footsteps | Quiet leather boots on wet limestone, intimate grounded heel then light splash, no reverb baked in | 8 mono PCM WAV variations, 44.1kHz, 0.2s, peak -12dBFS |
| Crystal impact | Thin glass breaks into many delicate pale splinters, warm low thump with high sparkling tail | 4 mono WAV, 44.1kHz, 0.6s, peak -6dBFS |
| Route chime | Soft glass bell chord, D minor suspended harmonics, clear attack and diffuse silvery decay | 4 stereo WAV, 44.1kHz, 1.5s, peak -12dBFS |
| City atmosphere | Air moving through immense cathedral streets, quiet distant glass harmonics, contemplative, no voices or rhythm | Seamless stereo 60s OGG/WAV loop, integrated -26 LUFS; optional replacement for sparse synthesized soundscape |

Current visual geometry intentionally stays procedural and inspectable. No model, image, music or SFX generation services were used.
