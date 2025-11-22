const imageProcessor = require('../services/imageProcessor');
const pdfGenerator = require('../services/pdfGenerator');
const path = require('path');
const fs = require('fs');

exports.generatePdf = async (req, res) => {
    try {
        const { images, options } = req.body; // images: array of serverPaths

        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: 'No images provided' });
        }

        // Process images (resize, etc.)
        // Use Promise.all for concurrency, maybe limit if needed
        const processedPaths = await Promise.all(
            images.map(async (img) => {
                // img could be the full path or relative. Assuming full path from upload response.
                // Verify file exists
                if (fs.existsSync(img)) {
                    return await imageProcessor.processImage(img);
                }
                return null;
            })
        );

        const validPaths = processedPaths.filter(p => p !== null);

        if (validPaths.length === 0) {
            return res.status(400).json({ error: 'No valid images found' });
        }

        // Generate PDF
        const { pdfId, outputPath } = await pdfGenerator.generatePdf(validPaths, options);

        // Return download URL (or ID)
        res.json({ pdfId, downloadUrl: `/api/pdf/${pdfId}` });

    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};

exports.getPdf = (req, res) => {
    const { id } = req.params;
    const pdfPath = path.join(__dirname, '../../tmp/pdf', `${id}.pdf`);

    if (fs.existsSync(pdfPath)) {
        res.download(pdfPath);
    } else {
        res.status(404).json({ error: 'PDF not found' });
    }
};
