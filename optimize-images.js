const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
const files = [
  'sky-clouds.jpeg',
  'User_requesting_cloud.jpeg'
];

async function optimize() {
  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    if (!fs.existsSync(inputPath)) continue;

    const originalStats = fs.statSync(inputPath);
    const originalSize = (originalStats.size / 1024 / 1024).toFixed(2);
    console.log(`\nOptimizing ${file} (Original size: ${originalSize} MB)`);

    const outputName = file.split('.')[0] + '.webp';
    const outputPath = path.join(imagesDir, outputName);

    try {
      await sharp(inputPath)
        .resize(1920, 1080, {
          fit: sharp.fit.cover,
          withoutEnlargement: true
        })
        .webp({ quality: 75 })
        .toFile(outputPath);

      const newStats = fs.statSync(outputPath);
      const newSize = (newStats.size / 1024).toFixed(2);
      console.log(`Success! Saved as ${outputName} (New size: ${newSize} KB)`);
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err);
    }
  }
}

optimize();
