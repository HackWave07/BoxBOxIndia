import Jimp from 'jimp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, 'src', 'assets');

async function splitImage(inputPath, outputNames) {
  const img = await Jimp.read(inputPath);
  const totalWidth = img.bitmap.width;
  const totalHeight = img.bitmap.height;
  const partWidth = Math.floor(totalWidth / 3);

  console.log(`Processing: ${path.basename(inputPath)} (${totalWidth}x${totalHeight})`);

  for (let i = 0; i < 3; i++) {
    const cropped = img.clone().crop(i * partWidth, 0, partWidth, totalHeight);
    const outPath = path.join(assetsDir, outputNames[i]);
    await cropped.writeAsync(outPath);
    console.log(`  ✓ Saved: ${outputNames[i]}`);
  }
}

(async () => {
  try {
    // Image 1 (ADV, Cruisers, Motocross) - the jpg file
    await splitImage(
      path.join(__dirname, 'moto-group-1.jpg'),
      ['moto-adv.png', 'moto-cruiser.png', 'moto-motocross.png']
    );

    // Image 2 (Sport Touring, Super Sports, Vintage) - the png file
    await splitImage(
      path.join(__dirname, 'moto-group-2.jpg'),
      ['moto-sport-touring.png', 'moto-super-sports.png', 'moto-vintage.png']
    );

    console.log('\n✅ All 6 motorcycle tyre images extracted successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
