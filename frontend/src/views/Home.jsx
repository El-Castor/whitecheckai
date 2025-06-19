// frontend/src/views/Home.jsx
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">🚀 WhiteCheckAI</h1>
        <p className="text-gray-700 mb-2">
          Bienvenue dans la Mini App Telegram.
        </p>
        <p className="text-gray-500 text-sm">
          Vous pourrez bientôt envoyer un whitepaper pour l’analyser.
        </p>
      </div>
    </div>
  );
}
