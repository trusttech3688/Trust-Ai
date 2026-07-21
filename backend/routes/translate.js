const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../../config/apis');

router.post('/translate', async (req, res) => {
  const { message, targetLanguage = 'FR' } = req.body;

  try {
    const response = await axios.post(
      `${config.deepl.baseURL}/translate`,
      new URLSearchParams({
        auth_key: config.deepl.apiKey,
        text: message,
        target_lang: targetLanguage.toUpperCase()
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const translated = response.data.translations[0].text;
    res.json({ success: true, response: translated, type: 'translate' });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;