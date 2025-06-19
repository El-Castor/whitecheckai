const express = require('express');
const router = express.Router();
const { parsePdfFromUrl } = require('../utils/pdfParser');
const { analyzeTextWithAI } = require('../services/openaiService');

router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.endsWith('.pdf')) {
      return res.status(400).json({ error: '❌ Provide a valid .pdf URL in body as { url }' });
    }

    const extractedText = await parsePdfFromUrl(url);

    // Optionnel : tronque si trop long (OpenRouter a aussi une limite)
    const trimmedText = extractedText.slice(0, 5000);

    const aiAnalysis = await analyzeTextWithAI(trimmedText);

    res.status(200).json({
      message: '✅ PDF analyzed successfully',
      analysis: aiAnalysis
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error analyzing the PDF or generating the AI response' });
  }
});

module.exports = router;
