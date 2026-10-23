# Asset pipeline: Forge <-> Alia

Forge (game factory bot) requests assets. Alia generates them locally (image-to-3D, music, SFX) and pushes them back. Everything is async through this repo.

## Alia's loop
1. `git pull`
2. Open `ASSET_PIPELINE/asset-queue.json` and work every request with `"status": "open"`.
3. Generate the asset from `prompt` (+ `reference_image` if set), matching `spec`.
4. Save it at the exact `output_path` (inside `ARCHIVE/<Game>-<imageId>/assets/`).
5. Set `status` to `"delivered"`, fill `delivered_at` (ISO time) and optional `notes`.
6. Commit as `assets: <request ids>` and push to `main` (pull --rebase first). If a request can't be done, set `"status": "failed"` with the reason in `notes`.

Forge checks hourly, wires delivered assets into the game, tests, and sets status to `"integrated"`.

## Request format
```json
{
  "id": "StormDodger-1542e36e-001",
  "game": "ARCHIVE/StormDodger-1542e36e",
  "type": "model | texture | music | sfx",
  "prompt": "text prompt for the generator",
  "reference_image": "path or URL, optional",
  "spec": {"format": "glb", "max_tris": 20000, "scale_m": 2.0},
  "output_path": "ARCHIVE/StormDodger-1542e36e/assets/player.glb",
  "status": "open | delivered | integrated | failed",
  "delivered_at": null,
  "notes": ""
}
```
Specs by type: model = glb, max_tris, scale_m, origin. texture = png, size, tileable. music = ogg, length_s, loop. sfx = ogg/wav, length_s.
