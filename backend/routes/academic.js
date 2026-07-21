const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../../config/apis');

router.post('/solve', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      `${config.openrouter.baseURL}/chat/completions`,
      {
        model: config.openrouter.model,
        messages: [
          {
            role: 'system',
            content: `You are Trust AI, an expert academic tutor covering all subjects.
            You help with:
            - Science subjects (Biology, Chemistry, Physics)
            - Art subjects (Literature, History, Geography, Economics)
            - Mathematics at all levels
            - Essay writing and structuring
            - Exam preparation
            Always explain concepts clearly, give examples, and break down complex topics simply.`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 4096,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openrouter.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Trust AI'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ success: true, response: reply, type: 'academic' });

  } catch (error) {
    console.log('Academic error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;