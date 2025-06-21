import subprocess
import time
import requests
from pyngrok import ngrok
import os
from dotenv import load_dotenv
# Charger les variables d'environnement depuis .env (backend/.env)
load_dotenv(dotenv_path="backend/.env")

def wait_for_vite(timeout=30):
    print("⏳ Attente que Vite soit prêt (port 5173)...")
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            res = requests.get("http://localhost:5173")
            if res.status_code == 200:
                print("✅ Vite est prêt.")
                return True
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(1)
    print("❌ Timeout : Vite ne répond pas après 30 secondes.")
    return False


print("🚀 WhiteCheckAI - Démarrage complet (frontend + backend + bot + tunnel)")
print("-------------------------------------------------------------")

# 1. Lancer le backend Express
print("🟢 Lancement du backend...")
backend_proc = subprocess.Popen(["node", "backend/server.js"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# 2. Créer un tunnel vers le port 5173
print("🌍 Création du tunnel avec ngrok (via pyngrok)...")
public_url = ngrok.connect(5173, "http").public_url
print(f"✅ Tunnel actif sur : {public_url}")

# 3. Injecter MINIAPP_HOST AVANT de lancer Vite
os.environ["MINIAPP_HOST"] = public_url.replace("https://", "").replace("http://", "")

# 4. Lancer Vite AVEC la variable MINIAPP_HOST dans l'env
print("🟢 Lancement du frontend Vite...")
frontend_proc = subprocess.Popen(
    ["npm", "run", "dev"],
    cwd="frontend",
    env=os.environ.copy(),  # très important
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)

# 5. Attendre que Vite soit prêt avant de lancer le bot
if not wait_for_vite():
    print("❌ Échec du démarrage de Vite. Abandon du script.")
    frontend_proc.terminate()
    backend_proc.terminate()
    ngrok.kill()
    exit(1)

# 6. Lancer le bot avec l'URL de la mini-app
print(f"🤖 Lancement du bot Telegram avec URL : {public_url}")
bot_env = os.environ.copy()
bot_env["MINIAPP_URL"] = public_url  # utile pour ton bot.js
# Vérification (optionnelle)
if not bot_env.get("OPENROUTER_API_KEY"):
    print("⚠️  OPENROUTER_API_KEY n'est pas défini dans .env")

bot_proc = subprocess.Popen(["node", "backend/bot/bot.js"], env=bot_env)

print("🟢 Tout est lancé. Appuyez sur Entrée pour tout arrêter.")
input()

# 🔴 Nettoyage
print("🛑 Arrêt de tous les processus...")
bot_proc.terminate()
backend_proc.terminate()
frontend_proc.terminate()
ngrok.kill()
print("✅ Tous les processus sont arrêtés.")
