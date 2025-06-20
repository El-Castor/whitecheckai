#!/bin/bash

echo "🚀 WhiteCheckAI - Démarrage complet (frontend + backend + bot + tunnel)"
echo "-------------------------------------------------------------"

# 1. Lancer le backend Express
echo "🟢 Lancement du backend..."
cd backend
node index.js &> ../backend.log &
BACK_PID=$!
cd ..

# 2. Lancer le frontend Vite
echo "🟢 Lancement du frontend Vite..."
cd frontend
npm run dev &> ../vite.log &
FRONT_PID=$!
cd ..

# 3. Démarrer localtunnel sans mot de passe
echo "🌍 Démarrage de localtunnel..."
npx localtunnel --port 5173 --no-auth > lt.log &
sleep 3

# 4. Extraire l'URL publique
LT_URL=$(grep -o 'https://[a-zA-Z0-9.-]*\.loca\.lt' lt.log | head -n 1)

if [ -z "$LT_URL" ]; then
  echo "❌ Échec de récupération de l’URL LocalTunnel"
  kill $BACK_PID $FRONT_PID
  exit 1
fi

echo "✅ Tunnel actif sur : $LT_URL"

# 5. Lancer le bot avec la bonne URL
echo "🤖 Lancement du bot Telegram avec URL : $LT_URL"
MINIAPP_URL=$LT_URL node backend/bot/bot.js
