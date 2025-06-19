#!/bin/bash

echo "🔄 Démarrage de localtunnel sur le port 5173..."
npx localtunnel --port 5173 > lt.log &
LT_PID=$!

echo "⏳ Attente de l’URL publique..."

# Attendre que lt.log contienne une URL loca.lt
while ! grep -q "https://" lt.log; do
  sleep 1
done

# Extraire l’URL
URL=$(grep -o 'https://[^ ]*.loca.lt' lt.log | head -n 1)

echo "✅ Tunnel actif sur : $URL"
echo "🤖 Lancement du bot Telegram..."

# Lancer le bot avec MINIAPP_URL
MINIAPP_URL="$URL" node backend/bot/bot.js

# Si le bot crash, on arrête aussi localtunnel proprement
kill $LT_PID
