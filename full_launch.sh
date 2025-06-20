#!/bin/bash
echo "🔄 Démarrage de localtunnel sur le port 5173..."
npx localtunnel --port 5173 > lt.log &
TUNNEL_PID=$!

sleep 5
URL=$(grep -oE "https://[a-zA-Z0-9-]+\.loca\.lt" lt.log | head -n 1)

if [ -z "$URL" ]; then
  echo "❌ Impossible d'extraire l'URL du tunnel."
  kill $TUNNEL_PID
  exit 1
fi

echo "✅ Tunnel actif sur : $URL"
echo "🤖 Lancement du bot Telegram..."
MINIAPP_URL=$URL node backend/bot/bot.js

