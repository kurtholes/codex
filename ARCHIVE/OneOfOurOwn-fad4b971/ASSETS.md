# Asset replacement guide
All current assets are procedural Three.js meshes, world-space grain shaders and synthesized Web Audio. No external art or audio assets are used.

| Replacement | Generator prompt | Target spec |
|---|---|---|
| Officers | Tired internal affairs officer, charcoal utility uniform, worn shield badge, desaturated skin, realistic face, green fluorescent light | GLB, 12k triangles, 1k PBR atlas, seated/idle/run/cuffed animations |
| Interrogation furniture | Scratched rolled-edge steel table, exposed welds, bent metal folding chairs, grim institutional realism | Separate GLBs, 5k triangles combined, 1k PBR maps |
| Precinct surfaces | Stained olive institutional paint above dark green dado, grimy concrete, no baked lighting | Seamless 1k albedo/normal/roughness; retain world triplanar projection |
| Evidence | Clear police evidence pouch containing brass casing, no readable text | GLB, 1k triangles, 512 texture |
| Foley | Dry heavy boot steps, cuffs ratchet, scraping steel chair, glass shatter, reverberant small room | Mono 48kHz WAV, <1 second each, normalize -12dBFS |
| Ambience | Oppressive fluorescent hum, distant city traffic, subtle ventilation, no voices or music | Seamless 30-second stereo OGG, -24 LUFS |
