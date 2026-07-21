const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../../config/apis');

router.post('/run', async (req, res) => {
  const { code, language } = req.body;

  const languageIds = {
    python: 71, javascript: 63, java: 62,
    cpp: 54, c: 50, php: 68, ruby: 72,
    go: 60, rust: 73, typescript: 74
  };

  try {
    const languageId = languageIds[language.toLowerCase()] || 63;

    const submission = await axios.post(
      `${config.judge0.baseURL}/submissions?base64_encoded=false&wait=true`,
      { source_code: code, language_id: languageId },
      {
        headers: {
          'X-RapidAPI-Key': config.judge0.apiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      }
    );

    const result = submission.data;
    res.json({
      success: true,
      output: result.stdout || result.stderr || result.compile_output || 'No output',
      status: result.status.description,
      type: 'preview'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;