# 📦 WhiteCheckAI - Changelog

Toutes les modifications majeures, mineures et correctives sont listées ici.

---

## [v1.0-stable] - 2025-06-19

🎯 **Version stable initiale**

### ✅ Fonctionnalités ajoutées :
- Prise en charge des **URLs directes vers des PDF**
- Téléchargement automatique du fichier et extraction du texte (`pdfParser.js`)
- Création de l’API `/analyze` en POST
- Génération automatique d’un prompt IA à partir du contenu du PDF
- Connexion à l’API OpenRouter avec GPT-4-turbo
- Simulateur de réponse IA (prévisualisation du prompt généré)
- Structure de projet modulaire : `utils/`, `services/`, `controllers/`, `routes/`
- Dossier temporaire `tmp/` pour stockage des fichiers
- Ajout d’un `.gitignore` propre

### 🧪 Tests :
- Testé avec `curl` sur un whitepaper arXiv (Transformer)
- Résultat conforme : résumé complet et note générée

---

## 🔜 Prochaines versions prévues :

- [ ] Intégration du frontend Mini App Telegram
- [ ] Authentification via Telegram TON
- [ ] Paiement par analyse en Toncoin
- [ ] Historique utilisateur léger (via fichier local ou SQLite)
- [ ] Mode "Comparateur" de projets

