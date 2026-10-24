# Procedural asset inventory

All current geometry, materials, particles and audio are generated in source. No downloaded art, music, fonts or sound recordings. Three.js 0.170.0 is the sole runtime dependency, imported from jsDelivr.

Possible local-generator replacements:

| Asset | Generator prompt | Target specification |
| --- | --- | --- |
| Explorer | Tiny midnight garden skater, white bell-shaped raincoat, scarlet cap and scarf, black visor, turquoise leaf skateboard, graphic illustration silhouette | GLB, under 8k triangles, single 1k atlas, idle/skate/lean/jump animations |
| Hollow turquoise trunk | Monumental curling turquoise botanical arch, teardrop hollow opening, black etched branch lines, asymmetrical illustrated silhouette | GLB, under 6k triangles, 3 LODs, world-space material compatible |
| Orange flower crown | Eleven broad vermilion petals around densely stippled golden disk, curved golden stem, black engraved veins | GLB, under 12k triangles, separated breakable petals |
| Golden leaf | Long curled golden leaf, black fine botanical veins, springy sculptural ribbon, near-flat graphic color | GLB, under 2k triangles, separate collision surface |
| Neon map | Floating rounded mint cartographic frame, thin branching green routes and two hot pink teardrop pins | GLB, under 5k triangles, separate emissive material channels |
| Botanical grain | Subtle handmade paper and ink botanical grain without directional lighting | Seamless 512px linear grayscale, triplanar sampling |
| Shear cut | Crisp woody snip with sparkling short neon tail, playful organic garden tool | Mono WAV, 48kHz, 0.18 seconds, 6 variations |
| Rail glide | Soft glassy musical wheel hum, warm airy mint neon, loopable without attack | Mono WAV, 48kHz, 2-second loop |
| Garden ambience | Minimal nocturnal wind with occasional tiny bird chirps, no voices, spacious and calm | Stereo OGG, seamless 60-second loop |

Current audio uses short synthesized oscillator envelopes; there is no background music. Current map uses emissive unlit lines rather than a postprocessing bloom pass.
