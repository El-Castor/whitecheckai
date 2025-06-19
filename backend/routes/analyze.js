const express = require('express');
const router = express.Router();
const { parsePdfFromUrl } = require('../utils/pdfParser');

router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.endsWith('.pdf')) {
      return res.status(400).json({ error: '❌ Provide a valid .pdf URL in body as { url }' });
    }

    const extractedText = await parsePdfFromUrl(url);

    // Pour le MVP : juste un aperçu du texte (on branchera OpenAI ensuite)
    res.status(200).json({
      message: '✅ PDF fetched and parsed successfully',
      textPreview: extractedText.slice(0, 1000) + '...'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error parsing the PDF' });
  }
});

module.exports = router;
