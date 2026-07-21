const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const config = require('../../config/apis');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('file'), async (req, res) => {
  const { message = 'Summarize this document' } = req.body;

  try {
    let documentText = '';

    if (req.file) {
      documentText = req.file.buffer.toString('utf-8');
    }

    const response = await axios.post(
      `${config.groq.baseURL}/chat/completions`,
      {
        model: config.groq.model,
        messages: [
          {
            role: 'system',
            content: 'You are Trust AI, an expert document analyst. Read, analyze and summarize documents clearly.'
          },
          {
            role: 'user',
            content: `${message}\n\nDocument Content:\n${documentText}`
          }
        ],
        max_tokens: 4096
      },
      {
        headers: {
          'Authorization': `Bearer ${config.groq.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ success: true, response: reply, type: 'document' });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;