const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate', async (req, res) => {
  const { message } = req.body;

  try {
    // Use Pollinations AI - completely free, no API key needed
    const prompt = encodeURIComponent(message);
    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&nologo=true`;

    res.json({
      success: true,
      response: `Here is your generated image based on: "${message}"`,
      imageUrl,
      type: 'image'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;