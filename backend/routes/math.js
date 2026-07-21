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
            content: `You are Trust AI, an expert mathematician and scientist.
            Solve mathematical and scientific problems step by step.
            Show all working clearly.
            Explain each step in simple terms.
            Use proper mathematical notation.`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 4096,
        temperature: 0.1
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
    res.json({ success: true, response: reply, type: 'math' });

  } catch (error) {
    console.log('Math error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;