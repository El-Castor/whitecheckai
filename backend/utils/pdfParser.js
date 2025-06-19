const axios = require('axios');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

/**
 * Télécharge un PDF depuis une URL et extrait le texte
 * @param {string} url - URL directe vers un fichier PDF
 * @returns {Promise<string>} - texte extrait du PDF
 */
async function parsePdfFromUrl(url) {
  if (!url.endsWith('.pdf')) {
    throw new Error('URL must point to a .pdf file');
  }

  const filePath = path.join(__dirname, '../tmp/whitepaper.pdf');
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
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
