const express = require('express');
const cors = require('cors');
const { parsePdfFromUrl } = require('./utils/pdfParser');
const { analyzeTextWithAI } = require('./services/openaiService');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ WhiteCheckAI API is running');
});


app.post('/analyze', async (req, res) => {
    const { url } = req.body;
  
    if (!url) {
      return res.status(400).json({ error: '❌ Missing URL in request body.' });
    }
  
    try {
      const extractedText = await parsePdfFromUrl(url);
      const aiResponse = await analyzeTextWithAI(extractedText);
  
      res.json({
        message: '🧠 Analyse générée avec OpenRouter',
        result: aiResponse,
      });
    } catch (error) {
      console.error('❌ Erreur détaillée :', error);
      res.status(500).json({ error: error.message || 'Erreur lors du traitement.' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`✅ WhiteCheckAI backend is running on http://localhost:${PORT}`);
});
