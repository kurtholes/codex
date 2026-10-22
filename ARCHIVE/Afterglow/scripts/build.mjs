import { mkdir, readFile, writeFile, rm, cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(root, "src"), path.join(dist, "src"), { recursive: true });
const main = await readFile(path.join(root, "src/main.js"), "utf8");
const stripped = main.replace(
  /\/\/ DEV-ONLY-START[\s\S]*?\/\/ DEV-ONLY-END\n?/g,
  "",
);
if (stripped.includes("__AFTERGLOW__") || stripped.includes("teleport("))
  throw Error("Dev switch was not stripped");
await writeFile(path.join(dist, "src/main.js"), stripped);
await cp(path.join(root, "index.html"), path.join(dist, "index.html"));
console.log(
  "Built dist/ — development hooks stripped. Three.js pinned to 0.169.0.",
);
