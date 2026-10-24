# Replaceable procedural assets

All shipped visuals are generated in code. All audio is synthesized through Web Audio. No external art, textures, recordings, fonts or music are shipped. Three.js is the sole runtime dependency, pinned to **0.170.0** on jsDelivr. The reference image is intentionally not bundled.

| Asset now | Generator prompt | Replacement target |
|---|---|---|
| Custom mesh snowmobile and rider | Expedition snowmobile in deep snow, pearl white faceted cowling, charcoal continuous rubber track, twin curved skis, exposed orange coil shocks, smoked windshield, black helmet and cold-weather rider leaning forward; blue overcast light; no branding | glTF, meters, forward -Z, ground Y=0, under 18k triangles, single 1024 atlas; separate skis, rider, rear track and upgrade sockets |
| Instanced pine boughs and distant silhouettes | Snow-loaded alpine fir, narrow irregular dark silhouette, drooping branches with blue-white snow clumps, wind-battered, realistic asymmetry | Three LODs: 1600/300/40 triangles, glTF, 512 atlas, alpha cutouts optional; origin trunk base |
| Procedural terrain triplanar grain | Wind-scoured fine powder snow, icy pale blue shadows, no large recognizable features, uniform physical scale | Seamless 1024 albedo/normal/roughness, 4m tile; sample through world-space triplanar mapping |
| Timber, fences and fragile huts | Abandoned alpine logging camp, weathered charcoal timber, thick powder roofs, simple orange emergency marker, no text | glTF under 2k triangles each; separate breakable planks and roof pieces, 512 atlas |
| Pooled snow plume and wind flakes | Fine blue-white powder spray, curling translucent snow plume in cold diffuse light, no background | Transparent 512 RGBA sprite sheet, 4x4 frames, premultiplied alpha, no dark fringes |
| Synthesized engine | Powerful two-stroke snowmobile idle, gritty low mechanical rumble under wind, dry isolated recording | Seamless 3s mono 48kHz WAV idle / mid / full throttle; no music or speech |
| Synthesized storm noise | Mountain whiteout wind gust through conifer forest, soft snow hiss and distant icy air, no voices | Seamless 12s stereo 48kHz OGG, subtle dynamics |
| Synthesized collision and payout tones | Heavy sled thump into deep snow; separate splintering timber crack; short warm metallic reward chime | Five variants each, mono 48kHz WAV, 0.15–0.8s, normalized -12 dBFS |
| No music | Minimal glacial ambient bed, sparse granular ice textures, no lead melody, no percussion or voices, expansive cold wilderness | Optional seamless 90s stereo OGG, -20 LUFS, mixed below engine |
