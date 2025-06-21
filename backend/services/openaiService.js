const axios = require('axios');
const { generateScoringPrompt } = require('../utils/generatePrompt');
require('dotenv').config({ path: __dirname + '/../.env' });

const apiKey = process.env.OPENROUTER_API_KEY;
const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-8b-instruct:free';

if (!apiKey) {
  console.error('❌ OPENROUTER_API_KEY is undefined!');
  throw new Error('API key missing. Please check your .env and dotenv loading.');
}

/**
 * Extrait le bloc JSON d'une réponse textuelle (avec ou sans ```json)
 */
function extractJsonFromText(text) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      throw new Error('❌ JSON mal formé : ' + e.message);
    }
  } else {
    throw new Error('❌ Aucun bloc JSON trouvé dans la réponse IA.');
  }
}

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
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'WhiteCheckAI'
      }
    }
  );

  const fullText = response.data.choices[0].message.content;
  return extractJsonFromText(fullText);
}

module.exports = { analyzeTextWithAI };
