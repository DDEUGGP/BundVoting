import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Dies ist die Standard-CSS-Datei für die App
import App from './App'; // Importiert deine Hauptkomponente, die App.jsx

// Erstellt den "Root" der React-Anwendung
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendert die App-Komponente in den Root-Container
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
