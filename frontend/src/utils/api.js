// frontend/src/api.js
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export async function analyzeWhitepaper(url) {
  const res = await fetch(`${BACKEND_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });

  if (!res.ok) {
    throw new Error('Erreur lors de l’analyse du whitepaper');
  }

  return await res.json();
}
