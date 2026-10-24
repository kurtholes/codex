# Procedural assets and replacement targets

All current geometry, surface color and sound are generated locally in code. No stock assets, external fonts, music files, tracking or service calls. The sole runtime download is the explicitly pinned Three.js 0.169.0 module from jsDelivr.

| Replaceable asset | Generator prompt | Target specification |
|---|---|---|
| Guardian dog | Shaggy medium-sized shepherd mix, honey russet fur, charcoal saddle, cream chest and muzzle, soft floppy ears, expressive dark eyes; warm afternoon light; friendly, grounded anatomy, stylized painterly 3D | GLB, under 18k triangles, 1×1024 PBR atlas, rig; idle, walk, sprint, bound, fetch, shoulder check; forward +Z; 2m nose to tail |
| Child | Small red-haired boy with spiky orange hair and red flower, red t-shirt, green shorts, green backpack; hopeful, expressive; no words | GLB, 12k triangles, 1024 atlas; walk, cheer, kick, throw; 2.3m game scale |
| Swallow | Small mint and deep teal swallow with cream breast, long feathered wings, forked tail; golden guardian thread accents | GLB, 5k triangles; flap, glide, dive, perch; wingspan 1.5m |
| Neighbor | Kindly neighborhood gardener, teal shirt, warm brown shorts, comfortable shoes, warm skin, approachable rounded silhouette | GLB, 12k triangles; walk, lift, catch, build, wave |
| Guardian | Ethereal elongated amber humanoid, delicate hands, enormous gentle head, visible golden fibers dissolving into a dog, volumetric filaments and sparkles | GLB transparent shell under 8k triangles plus additive particle atlas; no opaque background |
| Meadow surfaces | Golden-green summer grass and dusty cream footpath, soft painterly microvariation, no directional shadows | 1024 seamless albedo/normal/roughness; world-space triplanar sampling on all axes, never stretched UVs |
| Neighborhood kit | Mint-hazed garden homes, warm weathered wood fences, crates, flower beds, handmade kickabout goal, inviting workshop | Modular GLBs, 1–4k triangles each, 1024 atlas; independently breakable boards and crate faces |
| Ambient bed | Peaceful summer meadow, faraway city hush, soft breeze, tiny sparrows, absolutely no speech | 45s seamless OGG stereo loop, -24 LUFS; currently omitted; the present soundscape uses action sounds only |
| Guardian possession | Airy golden rush and bright glass harmonic, friendly magical body transfer, no voice | OGG mono 0.4s, -18 LUFS; current descending sine sweep |
| Impact and destruction | Soft strong dog shoulder thump, dry splintering rotten wood, little clacks of tumbling boards | 6 OGG mono variants 0.1–0.7s, -16 LUFS; current synthesized triangle impact |
| Kindness reward | Warm four-note rising celesta flourish, sunlight and playful hope | OGG stereo 0.5s; current four synthesized sine notes |

The supplied image is not required at runtime. Palette and focal silhouettes are interpreted in procedural geometry; image ID is retained in DESIGN.md and README.md.
