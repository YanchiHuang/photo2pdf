const path = require('path');

exports.uploadImages = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = req.files.map(file => ({
        filename: file.filename,
        path: file.path,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        serverPath: file.path
    }));

    res.json({ files });
};
