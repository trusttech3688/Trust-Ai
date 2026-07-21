require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const router = require('./router');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// All API routes
app.use('/api', router);

// Serve index.html for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Trust AI is running on http://localhost:${PORT}`);
});