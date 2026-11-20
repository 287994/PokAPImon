import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Batalla from './pages/Batalla'

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Login } from './pages/Login';
import './style.css';

const App: React.FC = () => {
  // Revisa si hay un usuario guardado en localStorage al abrir la página
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem('pokapimon_user');
  });

  const handleLoginSuccess = (username: string) => {
    localStorage.setItem('pokapimon_user', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('pokapimon_user');
    setUser(null);
  };

  // Si no hay usuario logueado, muestra el Login
  if (!user) {
    return <Login onAuthSuccess={handleLoginSuccess} />;
  }

  // Si ya inició sesión, muestra la pantalla principal
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>¡Bienvenido, Entrenador {user}!</h1>
      <p>Ya estás dentro de PokAPImon.</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <Batalla />
  </StrictMode>,
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
