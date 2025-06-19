const axios = require('axios');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

/**
 * Analyse une URL vers un PDF direct ou une page contenant un lien vers un PDF
 * @param {string} url - URL directe ou HTML contenant un lien vers un PDF
 * @returns {Promise<string>} - texte extrait du PDF
 */
async function parsePdfFromUrl(url) {
  let pdfUrl = url;

  // Si ce n’est pas un lien PDF, on cherche un PDF dans la page HTML
  if (!url.endsWith('.pdf')) {
    const htmlRes = await axios.get(url);
    const $ = cheerio.load(htmlRes.data);

    const foundPdfLink = $('a[href$=".pdf"]').attr('href');
    if (!foundPdfLink) {
      throw new Error('❌ Aucun lien PDF trouvé sur la page.');
    }

    pdfUrl = foundPdfLink.startsWith('http')
      ? foundPdfLink
      : new URL(foundPdfLink, url).href;
  }

  const filePath = path.join(__dirname, '../tmp/whitepaper.pdf');
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url: pdfUrl,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);

  return pdfData.text;
}

module.exports = { parsePdfFromUrl };
