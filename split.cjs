const { Jimp } = require('jimp');

async function splitImage() {
  try {
    const imgPath = 'C:\\Users\\imran\\.gemini\\antigravity\\brain\\e00bfb4a-36cb-46df-99e2-91039d899e48\\media__1778118712211.png';
    const image = await Jimp.read(imgPath);
    
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    
    const cellW = Math.floor(w / 3);
    const cellH = Math.floor(h / 2);
    
    const parts = [
      { name: 'part-brakes.png', col: 0, row: 0 },
      { name: 'part-suspension.png', col: 1, row: 0 },
      { name: 'part-chain.png', col: 2, row: 0 },
      { name: 'part-engine.png', col: 0, row: 1 },
      { name: 'part-exhaust.png', col: 1, row: 1 },
      { name: 'part-accessories.png', col: 2, row: 1 },
    ];
    
    for (const part of parts) {
      const cloned = image.clone();
      // Crop full cell, no text to avoid
      cloned.crop({ x: part.col * cellW, y: part.row * cellH, w: cellW, h: cellH });
      
      try {
          cloned.autocrop({ tolerance: 0.05 });
      } catch(e) {
          console.error("Autocrop error:", e);
      }
      
      const outPath = `c:\\Users\\imran\\OneDrive\\Desktop\\BoxBox\\src\\assets\\${part.name}`;
      await cloned.write(outPath);
      console.log(`Saved ${outPath}`);
    }
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

splitImage();
