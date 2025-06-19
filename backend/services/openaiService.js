// services/openaiService.js

const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

async function analyzeTextWithAI(text) {
  const prompt = `Analyse ce whitepaper crypto et donne une note de fiabilité (sur 10) et un résumé clair du projet :\n\n${text}`;

  const completion = await openai.chat.completions.create({
    model: 'mistralai/mistral-7b-instruct', // modèle gratuit sur OpenRouter
    messages: [
      { role: 'system', content: 'Tu es un expert en analyse de projets blockchain.' },
      { role: 'user', content: prompt },
    ],
  });

  return completion.choices[0].message.content;
}

module.exports = { analyzeTextWithAI };
