const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../../config/apis');

router.post('/speak', async (req, res) => {
  const { text, voiceId = '21m00Tcm4TlvDq8ikWAM' } = req.body;

  try {
    const response = await axios.post(
      `${config.elevenlabs.baseURL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 }
      },
      {
        headers: {
          'xi-api-key': config.elevenlabs.apiKey,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    res.set({ 'Content-Type': 'audio/mpeg', 'Content-Length': response.data.length });
    res.send(Buffer.from(response.data));

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;