const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const config = require('../../config/apis');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const uploadResponse = await axios.post(
      `${config.assemblyai.baseURL}/upload`,
      req.file.buffer,
      {
        headers: {
          'authorization': config.assemblyai.apiKey,
          'Content-Type': 'application/octet-stream'
        }
      }
    );

    const transcriptResponse = await axios.post(
      `${config.assemblyai.baseURL}/transcript`,
      { audio_url: uploadResponse.data.upload_url },
      { headers: { 'authorization': config.assemblyai.apiKey } }
    );

    res.json({ success: true, transcriptId: transcriptResponse.data.id, type: 'audio' });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;