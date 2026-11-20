import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const files = [
  'index.html',
  'produkt.html',
  'success.html',
  'impressum.html',
  'datenschutz.html',
  'agb.html',
  'widerruf.html',
  'versand.html',
  'styles.css',
  'script.js',
  'produkt.js',
  'products.json'
];

for (const file of files) {
  await cp(path.join(root, file), path.join(dist, file));
}

await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });

console.log(`NOIRE: ${files.length} Dateien plus assets/ nach dist/ kopiert.`);
