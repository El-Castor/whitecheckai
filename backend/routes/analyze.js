const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { parsePdfFromUrl } = require('../utils/pdfParser');
const { analyzeTextWithAI } = require('../services/openaiService');
//const fetchWhitepaper = require("../services/fetchWhitepaper");
const { generatePdf } = require('../utils/generatePdf');
const { generateChartImage } = require('../utils/generateChartImage'); // <- important


router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.endsWith('.pdf')) {
      return res.status(400).json({ error: '❌ Provide a valid .pdf URL in body as { url }' });
    }
    
    const timestamp = new Date().toISOString();
    const filenameBase = `analysis_${Date.now()}`;
    const extractedText = await parsePdfFromUrl(url);
    const trimmedText = extractedText.slice(0, 5000); // Limite de tokens
    const jsonPath = path.join(__dirname, '../history', `${filenameBase}.json`);


    // Crée un objet d'analyse avec métadonnées
   // Normalisation si l'objet est plat
   const aiAnalysis = await analyzeTextWithAI(trimmedText);

   // Normalisation si l'objet est plat
   for (const key in aiAnalysis) {
     if (typeof aiAnalysis[key] !== 'object') {
       aiAnalysis[key] = {
         score: aiAnalysis[key],
         justification: "Justification non fournie."
       };
     }
   }
   
   // ✅ Restaurer après la normalisation
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

     // 3. Sauvegarde JSON dans history/
    const fileName = `analysis_${Date.now()}.json`;
    fs.writeFileSync(path.join(historyDir, fileName), JSON.stringify(analysisResult, null, 2));

    // 4. Génération du graphique
    //const pdfPath = await generatePdf(aiAnalysis, `${filenameBase}.pdf`);
    const chartImagePath = path.join(__dirname, '../tmp', `${filenameBase}_chart.png`);
    const { chartPath } = await generateChartImage(aiAnalysis, chartImagePath); // chartPath est une COPIE pour le frontend
    

    // 5. Génération du PDF
    const pdfPath = await generatePdf(aiAnalysis, `${filenameBase}.pdf`, {
      sourceUrl: url,
      timestamp,
      chartImagePath
    });

    // 6. Nettoyage
    if (fs.existsSync(chartImagePath)) {
      fs.unlinkSync(chartImagePath);
    }
      
    // 7. Réponse au frontend
    res.status(200).json({
      message: '✅ PDF analyzed successfully',
      result: aiAnalysis,
      pdf: `/export/${filenameBase}.pdf`,
      chartImageUrl: chartPath     // ✅ URL du PDF retournée
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
