const axios = require('axios');
const { generateScoringPrompt } = require('../utils/generatePrompt');
require('dotenv').config();

async function analyzeTextWithAI(text) {
  const prompt = generateScoringPrompt(text);

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'meta-llama/llama-3.3-8b-instruct:free',
      messages: [
        {
          role: 'system',
          content: 'You are a crypto whitepaper analyst.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000', // à adapter si déployé
        'X-Title': 'WhiteCheckAI'
      }
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = { analyzeTextWithAI };
