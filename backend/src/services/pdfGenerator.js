const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const pdfDir = path.join(__dirname, '../../tmp/pdf');

if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

exports.generatePdf = (imagePaths, options = {}) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ autoFirstPage: false });
        const pdfId = uuidv4();
        const outputFilename = `${pdfId}.pdf`;
        const outputPath = path.join(pdfDir, outputFilename);
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        const { size = 'A4', orientation = 'portrait', fit = 'contain' } = options;

        imagePaths.forEach((img) => {
            doc.addPage({ size, layout: orientation, margin: 0 });

            const imgOptions = {
                align: 'center',
                valign: 'center',
            };

            if (fit === 'cover') {
                imgOptions.cover = [doc.page.width, doc.page.height];
            } else {
                imgOptions.fit = [doc.page.width, doc.page.height];
            }

            doc.image(img, imgOptions);
        });

        doc.end();

        stream.on('finish', () => resolve({ pdfId, outputPath }));
        stream.on('error', reject);
    });
};
