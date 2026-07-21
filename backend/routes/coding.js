const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../../config/apis');

router.post('/generate', async (req, res) => {
  const { message, history = [] } = req.body;

  try {
    const response = await axios.post(
      `${config.openrouter.baseURL}/chat/completions`,
      {
        model: config.openrouter.model,
        messages: [
          {
            role: 'system',
            content: `You are Trust AI, an expert senior software engineer and coding assistant. 
            You write clean, efficient, well-commented code. 
            When giving code always specify:
            1. Which file to create or open
            2. Exactly where to paste the code
            3. How to run or execute it
            4. What the code does
            Always format code properly with syntax highlighting markers.`
          },
          ...history,
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
    res.json({ success: true, response: reply, type: 'coding' });

  } catch (error) {
    console.log('Coding error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;