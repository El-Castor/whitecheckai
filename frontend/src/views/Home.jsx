import React, { useState } from 'react';
import { analyzeWhitepaperByUrl } from '../utils/api';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeWhitepaperByUrl(url);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">🚀 WhiteCheckAI</h1>
        <p className="text-gray-600 mb-4 text-center">Entrez l’URL d’un whitepaper PDF à analyser :</p>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/whitepaper.pdf"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !url}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Analyse en cours...' : 'Analyser'}
        </button>

        {error && (
          <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
        )}

        {result && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">📊 Résultats :</h2>
            <ul className="space-y-1 text-sm text-gray-700">
              {Object.entries(result).map(([key, value]) => (
                <li key={key}>
                  <strong>{key.replace(/_/g, ' ')} :</strong> {value.score}/10 — <em>{value.justification}</em>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
