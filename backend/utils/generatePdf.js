// backend/utils/generatePdf.js
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

/**
 * Nettoie le texte pour éviter les caractères non pris en charge
 */
function cleanText(text) {
  return text.replace(/[^\x20-\x7E\n\r]/g, '');
}

/**
 * Affiche le logo et les métadonnées en haut de chaque page
 */
async function drawHeader(page, pdfDoc, logoBytes, timestamp, sourceUrl, pageNumber = 1) {
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const logo = await pdfDoc.embedPng(logoBytes);
  const { width } = page.getSize();

  const scaled = logo.scale(0.12);
  page.drawImage(logo, {
    x: 30,
    y: 800 - scaled.height/2,
    width: scaled.width,
    height: scaled.height,
  });

  page.drawText('WhiteCheckAI - Whitepaper Scoring', {
    x: 200,
    y: 800,
    size: 16,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText(`Scored at: ${timestamp}`, {
    x: 200,
    y: 785,
    size: 8,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(`Source: ${cleanText(sourceUrl)}`, {
    x: 200,
    y: 773,
    size: 8,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });
}

/**
 * Génère un PDF à partir des résultats
 */
async function generatePdf(analysisResult, outputFilename, options = {}) {
  const { timestamp = '', sourceUrl = '', chartImagePath = null } = options;

  const pdfDoc = await PDFDocument.create();
  page = pdfDoc.addPage([595.28, 841.89]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const logoPath = path.resolve(__dirname, '../assets/logo.png');
  const logoBytes = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;

  let y = 730;

  // ➤ 1. Header (logo + timestamp + source)
  if (logoBytes) {
    await drawHeader(page, pdfDoc, logoBytes, timestamp, sourceUrl);
  }

  // ➤ 2. Graphique radar généré par Chart.js
  if (chartImagePath && fs.existsSync(chartImagePath)) {
    const chartBytes = fs.readFileSync(chartImagePath);
    const chartImage = await pdfDoc.embedPng(chartBytes);
    const chartDims = chartImage.scale(0.5);

    page.drawImage(chartImage, {
      x: (595.28 - chartDims.width) / 2,
      y: y - chartDims.height - 10,
      width: chartDims.width,
      height: chartDims.height,
    });

    y -= chartDims.height + 40;

    // suppression du fichier PNG
    fs.unlinkSync(chartImagePath);
  }

  // ➤ 3. Résultats analysés (titre + justification)
  for (const [key, val] of Object.entries(analysisResult)) {
    const safeKey = cleanText(key.replace(/_/g, ' '));
    const score = val?.score ?? 'N/A';
    const justification = val?.justification ?? 'Justification manquante.';
    const safeJustification = cleanText(justification);

    page.drawText(`${safeKey}: ${score}/10`, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0.7),
    });
    y -= 18;

    const lines = safeJustification.match(/.{1,90}/g) || [''];
    for (const line of lines) {
      page.drawText(line, {
        x: 60,
        y,
        size: 10,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= 13;
    }
    y -= 10;

    // Nouvelle page si trop bas
    if (y < 100) {
      const newPage = pdfDoc.addPage([595.28, 841.89]);
      y = 730;
      if (logoBytes) await drawHeader(newPage, pdfDoc, logoBytes, timestamp, sourceUrl);
      page = newPage;
    }
  }

  const pdfBytes = await pdfDoc.save();
  const filePath = path.resolve(__dirname, '../pdf', outputFilename);
  fs.writeFileSync(filePath, pdfBytes);
  return filePath;
}

module.exports = { generatePdf };
