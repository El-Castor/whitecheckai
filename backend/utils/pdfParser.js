const axios = require('axios');
const pdfParse = require('pdf-parse');
const fs = require('fs/promises');
const path = require('path');
const cheerio = require('cheerio');

/**
 * Télécharge et extrait le texte d’un PDF (direct ou depuis une page HTML).
 * @param {string} url - URL directe vers un PDF ou page contenant un lien PDF
 * @returns {Promise<string>} - Texte brut extrait du PDF
 */
async function parsePdfFromUrl(url) {
  try {
    let pdfUrl = url;

    // Si ce n’est pas un lien direct vers un PDF, on tente d’en trouver un dans la page HTML
    if (!url.endsWith('.pdf')) {
      const { data: html } = await axios.get(url);
      const $ = cheerio.load(html);

      const foundPdf = $('a[href$=".pdf"]').attr('href');
      if (!foundPdf) {
        throw new Error('❌ Aucun lien PDF trouvé sur la page HTML fournie.');
      }

      pdfUrl = foundPdf.startsWith('http')
        ? foundPdf
        : new URL(foundPdf, url).href;
    }

    // Téléchargement du PDF
    const tmpPath = path.join(__dirname, '../tmp/whitepaper.pdf');
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    await fs.writeFile(tmpPath, response.data);

    // Extraction du texte
    const buffer = await fs.readFile(tmpPath);
    const { text } = await pdfParse(buffer);

    return text;

  } catch (err) {
    console.error('❌ Erreur pendant le parsing du PDF :', err.message);
    throw new Error(`Erreur lors du parsing du PDF : ${err.message}`);
  }
}

module.exports = { parsePdfFromUrl };
