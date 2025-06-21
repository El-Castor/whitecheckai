const express = require('express');
const path = require('path');
const router = express.Router();

// Sert un PDF généré
router.get('/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../pdf', req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('❌ Fichier PDF introuvable :', filePath);
      res.status(404).send('❌ PDF introuvable.');
    }
  });
});

module.exports = router;
