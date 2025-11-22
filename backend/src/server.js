const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files (if needed)
app.use('/uploads', express.static(path.join(__dirname, '../tmp/uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Image to PDF Service is running');
});

// Import routes
const uploadRoutes = require('./routes/uploadRoute');
const pdfRoutes = require('./routes/pdfRoute');

app.use('/api', uploadRoutes);
app.use('/api', pdfRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
