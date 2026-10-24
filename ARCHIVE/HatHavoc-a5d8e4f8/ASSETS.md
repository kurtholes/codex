# Procedural asset manifest
Everything currently ships as procedural Three.js geometry, shader grain or synthesized Web Audio. No remote assets, accounts, analytics or audio downloads. Three.js is the sole runtime import, pinned to jsDelivr **0.160.0**.

Optional generator replacements:

| Asset | Generation prompt | Target specification |
|---|---|---|
| Showman | Exaggerated Victorian street magician, angular expressive face, ragged black tailcoat, ochre waistcoat, red bow tie, towering black top hat with crimson ribbon and wild purple/yellow/red bouquet; theatrical storybook carving | GLB, <18k triangles, 1 × 1024 atlas, rigged arms and coat, 3m high; retain bouquet silhouette |
| Floating slab | Broken irregular ochre cobblestone paving slab, layered chips and fractured underside, flower vines peeking through | GLB <3k triangles, 3.8m wide, centered pivot |
| Market kit | Crooked dusty gold Victorian masonry, dark timber balconies, torn striped awnings, hanging baskets, warm amber lanterns | Modular GLBs, 4m bays, <2k triangles/module; separable breakable chunks |
| Crowd | Carved theatrical Victorian market spectators, astonished faces, worn brown coats and caps | 6 GLBs, <800 triangles each, shared 512 atlas, idle/flee animations |
| Masonry grain | Warm ochre dusty stone and soot, irregular cobblestone; no directional light | Seamless 512 albedo/normal/roughness, world-space triplanar mapping |
| Pollen impact | Heavy woody crunch, low rounded thump, bright floral shimmer tail | Mono WAV 0.6s, normalized -3dB; 6 variants |
| Bloom / coins | Organic flower unfurl, rising glassy coin chimes, no voice | Mono WAV 0.3–1s, 4 variants |
| Market ambience | Wind through narrow Victorian market, loose signs creaking, distant bell and murmurs, no intelligible words | Stereo OGG 45s seamless loop, quiet dynamics |
| Music | Mischievous theatrical chamber waltz, detuned piano, pizzicato bass, bassoon, building energy | Stereo OGG 90s seamless, 110bpm, separate intensity stems |
