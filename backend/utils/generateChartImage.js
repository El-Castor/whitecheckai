// backend/utils/generateChartImage.js
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Assure-toi que ce package est installé

/**
 * Génère un graphique radar à partir des scores d’analyse.
 * @param {Object} scores - Objet contenant les scores des critères.
 * @param {string} outputPath - Chemin où sauvegarder l’image PNG.
 * @returns {Object} - Contient base64Image et chartPath (chemin public temporaire).
 */
async function generateChartImage(scores, outputPath) {
  const width = 600;
  const height = 600;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const labels = Object.keys(scores);
  const data = labels.map(key => scores[key]?.score || 0);

  const config = {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: 'Whitepaper Scoring',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      }]
    },
    options: {
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 10,
          ticks: {
            stepSize: 1,
            color: '#333',
          },
          grid: {
            color: '#ccc'
          },
          pointLabels: {
            color: '#000',
            font: { size: 10 }
          }
        }
      },
      plugins: {
        legend: { display: false },
        title: { display: false }
      }
    }
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config);
  fs.writeFileSync(outputPath, imageBuffer);
  
  // Génére l'image en base64
  const base64Image = imageBuffer.toString('base64');

  // Sauvegarde une copie temporaire dans /tmp/
  const tmpFileName = `${uuidv4()}_chart.png`;
  const tmpPath = path.join(__dirname, '..', 'tmp', tmpFileName);
  fs.writeFileSync(tmpPath, imageBuffer);

  // Retourne les chemins utiles
  return {
    base64Image,
    chartPath: `/tmp/${tmpFileName}`
  };
}

module.exports = { generateChartImage };