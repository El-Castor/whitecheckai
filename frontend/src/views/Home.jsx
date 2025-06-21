import React, { useState } from 'react';
import { analyzeWhitepaper } from "../utils/api.js";

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await analyzeWhitepaper(url);
      setResult(res);
    } catch (err) {
      setError('❌ Erreur pendant l’analyse. Vérifie l’URL PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">📄 Analyse de Whitepaper</h1>

        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 mb-4"
          placeholder="https://exemple.com/whitepaper.pdf"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          className={`w-full py-2 rounded-md font-medium text-white transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Analyse en cours...' : 'Lancer l’analyse'}
        </button>

        {error && <p className="text-red-600 text-center mt-4">{error}</p>}

        {result && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">✅ Résultats :</h2>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {Object.entries(result.result).map(([key, val]) =>
                  typeof val === 'object' && val.score !== undefined ? (
                    <li key={key}>
                      <strong>{key.replace(/_/g, ' ')}:</strong> {val.score}/10 —{' '}
                      <em>{val.justification}</em>
                    </li>
                  ) : null
                )}
              </ul>
            </div>

            {result.chartImageUrl && (
              <div className="text-center">
                <h3 className="font-semibold mb-2">📊 Visualisation des scores :</h3>
                <img
                  src={result.chartImageUrl}
                  alt="Graphique des scores"
                  className="w-full max-w-sm mx-auto rounded shadow"
                />
              </div>
            )}

            {result.pdf && (
              <div className="text-center mt-4">
                <a
                  href={result.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                >
                  📥 Télécharger le PDF complet
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
