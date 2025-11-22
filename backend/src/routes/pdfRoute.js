const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf');

router.post('/generate-pdf', pdfController.generatePdf);
router.get('/pdf/:id', pdfController.getPdf);

module.exports = router;
