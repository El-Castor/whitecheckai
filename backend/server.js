const express = require('express');
const cors = require('cors');
const { parsePdfFromUrl } = require('./utils/pdfParser');
const { analyzeTextWithAI } = require('./services/openaiService');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('✅ WhiteCheckAI API is running');
});

// Montre toutes les routes (POST /analyze et GET /history)
const analyzeRoutes = require('./routes/analyze');
app.use('/', analyzeRoutes);

app.listen(PORT, () => {
  console.log(`✅ WhiteCheckAI backend is running on http://localhost:${PORT}`);
});
