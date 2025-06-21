const express = require('express');
const cors = require('cors');
const { parsePdfFromUrl } = require('./utils/pdfParser');
const { analyzeTextWithAI } = require('./services/openaiService');
require("dotenv").config({ path: __dirname + "/.env" });
const path = require('path'); // ✅ À ajouter

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 👇 Expose le dossier /tmp pour accéder aux images de graphe
app.use('/tmp', express.static(path.join(__dirname, 'tmp')));

app.get('/', (req, res) => {
  res.send('✅ WhiteCheckAI API is running');
});

// Montre toutes les routes (POST /analyze et GET /history)
const analyzeRoutes = require('./routes/analyze');
app.use('/', analyzeRoutes);

const exportRoute = require('./routes/export');
app.use('/export', require('./routes/export'));

app.listen(PORT, () => {
  console.log(`✅ WhiteCheckAI backend is running on http://localhost:${PORT}`);
});
