import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath  = join(__dirname, "../public/logo-original.png");
const outputPath = join(__dirname, "../public/logo.png");

const image = sharp(inputPath);
const { width, height } = await image.metadata();

const { data } = await image
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = new Uint8ClampedArray(data);
const visited = new Uint8Array(width * height);

// Couleur de référence : prend la couleur du coin supérieur gauche
const refR = pixels[0];
const refG = pixels[1];
const refB = pixels[2];

const TOLERANCE = 40;

function colorDist(idx) {
  return Math.sqrt(
    (pixels[idx]     - refR) ** 2 +
    (pixels[idx + 1] - refG) ** 2 +
    (pixels[idx + 2] - refB) ** 2
  );
}

// Flood fill BFS depuis les 4 coins
const queue = [];
function seedCorners() {
  const corners = [
    0,
    (width - 1),
    (height - 1) * width,
    (height - 1) * width + (width - 1),
  ];
  for (const c of corners) {
    if (!visited[c] && colorDist(c * 4) < TOLERANCE) {
      visited[c] = 1;
      queue.push(c);
    }
  }
}

seedCorners();

while (queue.length > 0) {
  const pos = queue.shift();
  const x   = pos % width;
  const y   = Math.floor(pos / width);

  // Rendre transparent
  pixels[pos * 4 + 3] = 0;

  // 4 voisins (haut, bas, gauche, droite)
  const neighbors = [];
  if (x > 0)           neighbors.push(pos - 1);
  if (x < width - 1)   neighbors.push(pos + 1);
  if (y > 0)           neighbors.push(pos - width);
  if (y < height - 1)  neighbors.push(pos + width);

  for (const n of neighbors) {
    if (!visited[n] && colorDist(n * 4) < TOLERANCE) {
      visited[n] = 1;
      queue.push(n);
    }
  }
}

// Passe de lissage : adoucit les bords (anti-aliasing)
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const pos = (y * width + x) * 4;
    if (pixels[pos + 3] === 0) continue; // déjà transparent

    const dist = colorDist(pos);
    if (dist < TOLERANCE * 1.5) {
      // Pixel proche du fond mais non atteint par flood fill → semi-transparent
      pixels[pos + 3] = Math.round((dist / (TOLERANCE * 1.5)) * 255);
    }
  }
}

await sharp(Buffer.from(pixels), {
  raw: { width, height, channels: 4 },
})
  .png()
  .toFile(outputPath);

console.log(`✓ Fond supprimé (flood fill) → ${outputPath}`);
