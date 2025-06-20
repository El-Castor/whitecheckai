#!/bin/bash

echo "🔄 Démarrage de localtunnel sur le port 5173..."

# Lance localtunnel en arrière-plan, capture la sortie
npx localtunnel --port 5173 --no-auth > lt.log &
LT_PID=$!

# Attendre que l’URL apparaisse dans lt.log
echo "⏳ Attente de l’URL publique..."
until grep -m1 -o 'https://.*\.loca\.lt' lt.log > /dev/null; do
  sleep 1
done

# Récupérer l’URL
URL=$(grep -m1 -o 'https://.*\.loca\.lt' lt.log)
echo "✅ Tunnel actif sur : $URL"

# Définir la variable d’environnement MINIAPP_URL
export MINIAPP_URL="$URL"

# Lancer le bot avec l’URL correcte
echo "🤖 Lancement du bot Telegram..."
node backend/bot/bot.js

# Nettoyer : arrêter LocalTunnel à la fin
kill $LT_PID
rm lt.log
