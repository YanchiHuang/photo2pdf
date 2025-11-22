const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadHandler');
const uploadController = require('../controllers/upload');

router.post('/upload', upload.array('images', 100), uploadController.uploadImages);

module.exports = router;
