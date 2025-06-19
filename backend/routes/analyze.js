const express = require('express');
const router = express.Router();
const { parsePdfFromUrl } = require('../utils/pdfParser');
const { analyzeTextWithAI } = require('../services/openaiService');
const fs = require('fs');
const path = require('path');

router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.endsWith('.pdf')) {
      return res.status(400).json({ error: '❌ Provide a valid .pdf URL in body as { url }' });
    }

    const extractedText = await parsePdfFromUrl(url);
    const trimmedText = extractedText.slice(0, 5000); // Limite de tokens

    const aiAnalysis = await analyzeTextWithAI(trimmedText);

    // Crée un objet d'analyse avec métadonnées
    const analysisResult = {
      timestamp: new Date().toISOString(),
      sourceUrl: url,
      result: aiAnalysis
    };

    // Crée le dossier history/ s’il n’existe pas
    const historyDir = path.join(__dirname, '../history');
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir);
    }

    // Sauvegarde le fichier
    const fileName = `analysis_${Date.now()}.json`;
    fs.writeFileSync(path.join(historyDir, fileName), JSON.stringify(analysisResult, null, 2));

    // Répond avec l’analyse
    res.status(200).json({
      message: '✅ PDF analyzed successfully',
      result: analysisResult.result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error analyzing the PDF or generating the AI response' });
  }
});
// GET /history — Liste les fichiers d’analyse sauvegardés
router.get('/history', async (req, res) => {
  try {
    const historyDir = path.join(__dirname, '../history');

    if (!fs.existsSync(historyDir)) {
      return res.status(200).json({ analyses: [] });
    }

    const files = fs.readdirSync(historyDir).filter(file => file.endsWith('.json'));

    const analyses = files.map(file => {
      const content = fs.readFileSync(path.join(historyDir, file), 'utf-8');
      return JSON.parse(content);
    });

    res.status(200).json({ analyses });

  } catch (err) {
    console.error('Erreur lors du chargement de l’historique :', err);
    res.status(500).json({ error: '❌ Impossible de lire l’historique.' });
  }
});

module.exports = router;
