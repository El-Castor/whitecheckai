import subprocess
import time
from pyngrok import ngrok
import os

print("🚀 WhiteCheckAI - Démarrage complet (frontend + backend + bot + tunnel)")
print("-------------------------------------------------------------")

# 1. Lancer le backend Express
print("🟢 Lancement du backend...")
backend_proc = subprocess.Popen(["node", "backend/index.js"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# 2. Créer un tunnel vers le port 5173
print("🌍 Création du tunnel avec ngrok (via pyngrok)...")
public_url = ngrok.connect(5173, "http").public_url
print(f"✅ Tunnel actif sur : {public_url}")

# 3. Injecte l'host (ex: abc123.ngrok-free.app) pour Vite
os.environ["MINIAPP_HOST"] = public_url.replace("https://", "").replace("http://", "")

# 4. Lancer le frontend Vite avec MINIAPP_HOST injecté
print("🟢 Lancement du frontend Vite...")
frontend_proc = subprocess.Popen(["npm", "run", "dev"], cwd="frontend", env=os.environ.copy(), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# 5. Lancer le bot avec MINIAPP_URL dans l'env
print(f"🤖 Lancement du bot Telegram avec URL : {public_url}")
env = os.environ.copy()
env["MINIAPP_URL"] = public_url

bot_proc = subprocess.Popen(["node", "backend/bot/bot.js"], env=env)

print("🟢 Tout est lancé. Appuyez sur Entrée pour tout arrêter.")
input()

# 🔴 Nettoyage
print("🛑 Arrêt de tous les processus...")
bot_proc.terminate()
backend_proc.terminate()
frontend_proc.terminate()
ngrok.kill()
print("✅ Tous les processus sont arrêtés.")
