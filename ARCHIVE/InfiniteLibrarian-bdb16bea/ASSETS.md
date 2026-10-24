# Procedural asset manifest
All shipped visuals are generated with Three.js geometry, instancing, shaders and a small radial canvas halo. No external art, fonts or audio downloads. Three.js 0.170.0 is loaded from the exact jsDelivr module URL. All audio is synthesized with Web Audio oscillators; the sound toggle enables it after a user gesture.

Potential local-generator replacements (optional; none required at runtime):

| Asset | Generator prompt | Target specification |
| --- | --- | --- |
| Great lantern | Ornate octagonal Victorian library lantern, blackened brass cage, amber glass, turned finial, aged chain, dark walnut library lighting | GLB, 8k triangles, 1 material atlas, 1024² PBR, centered pivot, 6m tall |
| Librarian and trolley | Tiny faceless brass-masked archive keeper in black waxed coat, wheeled walnut book trolley with expandable brass cage | Rigged GLB, 6k triangles total, 1024² atlas; idle, skate, scoop, throw |
| Bookcase | Tall aged walnut shelves, leather multiverse books, inset brass heraldic category marker, detachable planks | GLB, 3k triangles, independent shelf/plank pieces, 1024² PBR |
| Wood and leather | Dark walnut end grain and leather binding, warm desaturated brown, no directional baked lighting | Seamless 1024² albedo/roughness/normal; sampled with world-space triplanar projection |
| Atmosphere | Smoky infinite archive, subtle warm air, distant clockwork, no voices or melody | Seamless stereo 48kHz OGG, 45 seconds, -22 LUFS |
| Sorting notes | Gentle wooden book clack rising into brass chime, tactile magical library tool | Mono 48kHz OGG, 0.1–0.6 seconds; 8 pitch variants |
| Shelf collapse | Rolling wooden bookcase topples, leather books slap and scatter, brass wheels rattle | Stereo 48kHz OGG, 1.5 seconds, no clipping |

The image itself is not bundled or sampled. Palette, density, vertical silhouettes, balconies, ladders and central lantern are reconstructed procedurally.
