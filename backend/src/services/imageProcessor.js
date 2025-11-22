const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const processedDir = path.join(__dirname, '../../tmp/processed');

if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
}

exports.processImage = async (filePath) => {
    const outputFilename = `${uuidv4()}.jpg`;
    const outputPath = path.join(processedDir, outputFilename);

    // Resize to max 2000px width/height, convert to JPEG
    await sharp(filePath)
        .rotate() // Auto-rotate based on EXIF
        .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(outputPath);

    return outputPath;
};
