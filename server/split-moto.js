const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, '..', 'src', 'assets');

async function splitImage(inputPath, outputNames) {
  const img = await Jimp.read(inputPath);
  const totalWidth = img.bitmap.width;
  const totalHeight = img.bitmap.height;
  const partWidth = Math.floor(totalWidth / 3);
  
  // ULTRA TIGHT CROP: Isolate the tyre itself and eliminate all side borders and card backgrounds
  const tightX = 60;
  const tightY = 110; // Pushed down further to bypass the top rounded corners of the mockup cards
  const tightWidth = partWidth - 120; // 341 - 120 = 221px width
  const tightHeight = 290; // Height of the tyre only

  console.log(`Processing: ${path.basename(inputPath)} -> Extracting ultra-tight tyre graphics`);

  for (let i = 0; i < 3; i++) {
    const cropped = img.clone().crop(i * partWidth, 0, partWidth, totalHeight).crop(tightX, tightY, tightWidth, tightHeight);
    const outPath = path.join(assetsDir, outputNames[i]);
    await cropped.writeAsync(outPath);
    console.log(`  Saved: ${outputNames[i]}`);
  }
}

(async () => {
  const root = path.join(__dirname, '..');

  // Image 1 (ADV & Dual Sport, Cruisers, Motocross) 
  await splitImage(
    'C:/Users/imran/.gemini/antigravity/brain/8e7d884a-cdba-4307-9695-73ea55a3f59e/media__1775342407065.png',
    ['moto-adv.png', 'moto-cruiser.png', 'moto-motocross.png']
  );

  // Image 2 (Sport Touring, Super Sports, Vintage) 
  await splitImage(
    'C:/Users/imran/.gemini/antigravity/brain/8e7d884a-cdba-4307-9695-73ea55a3f59e/media__1775342407097.png',
    ['moto-sport-touring.png', 'moto-super-sports.png', 'moto-vintage.png']
  );

  console.log('All 6 images extracted!');
})().catch(e => { console.error(e.message); process.exit(1); });
