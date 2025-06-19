// frontend/src/App.jsx
import React from 'react';

function App() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      color: '#000000'
    }}>
      <img src="/logo.png" alt="WhiteCheckAI logo" width="100" style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '1.5rem' }}>🚀 Bienvenue sur WhiteCheckAI</h1>
      <p>Cette Mini App est bien connectée à Telegram.</p>
    </div>
  );
}

export default App;
