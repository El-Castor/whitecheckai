export async function analyzeWhitepaperByUrl(url) {
    const response = await fetch('http://localhost:3000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erreur lors de l’analyse');
    return data.result;
  }
  