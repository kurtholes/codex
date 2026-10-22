import { mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, 'src'), { recursive: true });
for (const name of ['main.js', 'world.js', 'game.js', 'audio.js', 'style.css']) {
  const source = await readFile(path.join(root, 'src', name), 'utf8');
  const clean = source.replace(/\/\* DEV-ONLY-BEGIN \*\/[\s\S]*?\/\* DEV-ONLY-END \*\//g, '').trimEnd() + '\n';
  if (/__AFTERLIGHT|dev-hooks|teleport|test=1/.test(clean)) throw new Error(`Development code in ${name}`);
  await writeFile(path.join(out, 'src', name), clean);
}
await cp(path.join(root, 'index.html'), path.join(out, 'index.html'));
await cp(path.join(root, 'favicon.svg'), path.join(out, 'favicon.svg'));
console.log('Built dist/ — static HTML, CSS, JS. Development hooks removed.');
