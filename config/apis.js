require('dotenv').config();

module.exports = {
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile'
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'tencent/hy3:free',
    codingModel: 'cohere/north-mini-code:free',
    researchModel: 'moonshotai/kimi-k3',
    backupModel: 'poolside/laguna-xs-2.1:free'
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta'
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY,
    baseURL: 'https://api-inference.huggingface.co/models'
  },
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY,
    baseURL: 'https://api.mistral.ai/v1'
  },
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY,
    baseURL: 'https://api.elevenlabs.io/v1'
  },
  assemblyai: {
    apiKey: process.env.ASSEMBLYAI_API_KEY,
    baseURL: 'https://api.assemblyai.com/v2'
  },
  wolfram: {
    apiKey: process.env.WOLFRAM_API_KEY,
    baseURL: 'https://api.wolframalpha.com/v2'
  },
  deepl: {
    apiKey: process.env.DEEPL_API_KEY,
    baseURL: 'https://api-free.deepl.com/v2'
  },
  tavily: {
    apiKey: process.env.TAVILY_API_KEY,
    baseURL: 'https://api.tavily.com'
  },
  judge0: {
    apiKey: process.env.JUDGE0_API_KEY,
    baseURL: 'https://judge0-ce.p.rapidapi.com'
  },
  removebg: {
    apiKey: process.env.REMOVEBG_API_KEY,
    baseURL: 'https://api.remove.bg/v1.0'
  },
  cohere: {
    apiKey: process.env.COHERE_API_KEY,
    baseURL: 'https://api.cohere.ai/v1'
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  }
};