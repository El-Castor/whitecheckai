from pyngrok import ngrok

# Ouvre un tunnel sur le port 5173 (Vite)
public_url = ngrok.connect(5173)
print("✅ Tunnel URL :", public_url)

# Garde le tunnel ouvert
input("Appuyez sur Entrée pour quitter...")
