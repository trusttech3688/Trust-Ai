const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../../config/apis');

router.post('/suggest', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      `${config.openrouter.baseURL}/chat/completions`,
      {
        model: config.openrouter.model,
        messages: [
          {
            role: 'system',
            content: `You are Trust AI, an expert UI/UX designer and creative director.
            You help with:
            - Logo design concepts and directions
            - Color palette suggestions with hex codes
            - Typography recommendations
            - UI/UX layout suggestions
            - Design critique and improvements
            - Brand identity guidance
            Always be specific with colors (hex codes), fonts (exact names), and measurements.`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 2048,
        temperature: 0.7
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
    res.json({ success: true, response: reply, type: 'design' });

  } catch (error) {
    console.log('Design error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;