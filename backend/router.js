const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config/apis');

const imageRoute = require('./routes/image');
const voiceRoute = require('./routes/voice');
const documentsRoute = require('./routes/documents');
const previewRoute = require('./routes/preview');
const audioRoute = require('./routes/audio');

router.use('/image', imageRoute);
router.use('/voice', voiceRoute);
router.use('/documents', documentsRoute);
router.use('/preview', previewRoute);
router.use('/audio', audioRoute);

// MODELS FOR EACH TASK
const MODELS = {
  coding: 'cohere/north-mini-code:free',
  research: 'moonshotai/kimi-k3',
  math: 'tencent/hy3:free',
  design: 'tencent/hy3:free',
  academic: 'tencent/hy3:free',
  translate: 'tencent/hy3:free',
  image: 'pollinations',
  chat: 'tencent/hy3:free',
  backup: 'poolside/laguna-xs-2.1:free'
};

// CALL AI FUNCTION
async function callAI(model, systemPrompt, userMessage) {
  try {
    const response = await axios.post(
      `${config.openrouter.baseURL}/chat/completions`,
      {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
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
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(`Model ${model} failed, trying backup...`);
    // Try backup model if primary fails
    const backupResponse = await axios.post(
      `${config.openrouter.baseURL}/chat/completions`,
      {
        model: MODELS.backup,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
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
    return backupResponse.data.choices[0].message.content;
  }
}

// SMART AUTO INTENT DETECTOR
function detectIntent(message) {
  const lower = message.toLowerCase();

  if (lower.match(/code|function|program|script|debug|error|bug|html|css|javascript|python|java|cpp|api|database|sql|react|node|fix this|write a|build a|create a (app|website|program|function|class|component)|git|github|algorithm|loop|array|object|variable|import|export|library|framework/)) {
    return 'coding';
  }

  if (lower.match(/generate image|create image|draw|picture of|photo of|image of|logo for|design a logo|make an image|visualize|render|illustration/)) {
    return 'image';
  }

  if (lower.match(/solve|calculate|equation|integral|derivative|matrix|algebra|geometry|trigonometry|calculus|mathematics|formula|proof|theorem|\d+[\+\-\*\/\^]\d+|percentage|probability|statistics/)) {
    return 'math';
  }

  if (lower.match(/translate|in french|in spanish|in german|in arabic|in chinese|in japanese|in portuguese|in italian|in yoruba|in igbo|in hausa|in pidgin|convert language/)) {
    return 'translate';
  }

  if (lower.match(/design|ui|ux|color palette|font|typography|layout|wireframe|mockup|brand|logo concept|color scheme|interface|figma|canva|graphic|visual identity/)) {
    return 'design';
  }

  if (lower.match(/research|who is|what is|explain|history of|latest|current|find out|tell me about|how does|why does|when did|where is|facts about|information about|news/)) {
    return 'research';
  }

  if (lower.match(/essay|homework|assignment|exam|study|biology|chemistry|physics|geography|economics|literature|history|science|academic|school|university|college|thesis|dissertation/)) {
    return 'academic';
  }

  return 'chat';
}

// MAIN CHAT ROUTE — handles everything automatically
router.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const intent = detectIntent(message);
    console.log(`✅ Auto-detected intent: ${intent}`);

    // IMAGE — use Pollinations (free, no API needed)
    if (intent === 'image') {
      const prompt = encodeURIComponent(message);
      const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&nologo=true`;
      return res.json({
        success: true,
        response: `Here is your generated image based on: "${message}"`,
        imageUrl,
        type: 'image'
      });
    }

    // CODING — use Cohere code model
    if (intent === 'coding') {
      const reply = await callAI(
        MODELS.coding,
        `You are Trust AI, an expert senior software engineer and coding assistant.
        Write clean, efficient, well-commented code.
        When giving code always specify:
        1. Which file to create or open
        2. Exactly where to paste the code
        3. How to run or execute it
        4. What the code does
        Always format code with proper markdown code blocks.`,
        message
      );
      return res.json({ success: true, response: reply, type: 'coding' });
    }

    // MATH — use Tencent HY3
    if (intent === 'math') {
      const reply = await callAI(
        MODELS.math,
        `You are Trust AI, an expert mathematician and scientist.
        Solve problems step by step showing all working.
        Explain each step clearly in simple terms.
        Use proper mathematical notation.`,
        message
      );
      return res.json({ success: true, response: reply, type: 'math' });
    }

    // RESEARCH — use Kimi K3 (best for reasoning)
    if (intent === 'research') {
      const reply = await callAI(
        MODELS.research,
        `You are Trust AI, an expert researcher and analyst.
        Give detailed, accurate, well structured research answers.
        Include facts, statistics, and sources where possible.
        Structure response with clear headings and sections.`,
        message
      );
      return res.json({ success: true, response: reply, type: 'research' });
    }

    // TRANSLATE — use Tencent HY3
    if (intent === 'translate') {
      const reply = await callAI(
        MODELS.translate,
        `You are Trust AI, an expert translator fluent in all languages.
        Translate accurately and naturally.
        If no target language specified, detect source language and translate to English.
        Also provide pronunciation guide if helpful.`,
        message
      );
      return res.json({ success: true, response: reply, type: 'translate' });
    }

    // DESIGN — use Tencent HY3
    if (intent === 'design') {
      const reply = await callAI(
        MODELS.design,
        `You are Trust AI, an expert UI/UX designer and creative director.
        Give specific color hex codes, exact font names, and detailed design guidance.
        Suggest layouts, color schemes, typography and visual hierarchy.
        Be specific and actionable in all recommendations.`,
        message
      );
      return res.json({ success: true, response: reply, type: 'design' });
    }

    // ACADEMIC — use Tencent HY3
    if (intent === 'academic') {
      const reply = await callAI(
        MODELS.academic,
        `You are Trust AI, an expert academic tutor covering all subjects.
        Help with science, arts, math, essays and exam preparation.
        Explain concepts clearly with examples.
        Break down complex topics into simple understandable parts.`,
        message
      );
      return res.json({ success: true, response: reply, type: 'academic' });
    }

    // GENERAL CHAT — use Tencent HY3
    const reply = await callAI(
      MODELS.chat,
      `You are Trust AI, a powerful all-in-one AI assistant.
      You can help with coding, research, design, math, academic questions,
      translation, image generation and much more.
      Always be helpful, detailed, friendly and accurate.`,
      message
    );
    return res.json({ success: true, response: reply, type: 'chat' });

  } catch (error) {
    console.log('Chat error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;