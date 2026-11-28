import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Batalla from './pages/Batalla'

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Login } from './pages/Login';
import './style.css';

import MenuSeleccion, { type OpcionMenu } from './pages/seleccion';
import { SeleccionEquipo } from './pages/SeleccionEquipo';
import { ArmarEquipo } from './pages/ArmarEquipo';
import type { EquipoGuardado } from './services/equiposService';

type Vista = 'menu' | 'seleccion-equipo' | 'armar-equipo' | 'batalla';

const App: React.FC = () => {
  // Revisa si hay un usuario guardado en localStorage al abrir la página
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem('pokapimon_user');
  });
  const [vista, setVista] = useState<Vista>('menu');
  const [modoBatalla, setModoBatalla] = useState<OpcionMenu>('contra-ia');
  const [equipoAEditar, setEquipoAEditar] = useState<EquipoGuardado | null>(null);
  const [, setEquipoElegido] = useState<EquipoGuardado | null>(null);

  const handleLoginSuccess = (username: string) => {
    localStorage.setItem('pokapimon_user', username);
    setUser(username);
    setVista('menu');
  };

  const handleLogout = () => {
    localStorage.removeItem('pokapimon_user');
    setUser(null);
  };

  // Si no hay usuario logueado, muestra el Login
  if (!user) {
    return <Login onAuthSuccess={handleLoginSuccess} />;
  }

  const handleElegirMenu = (opcion: OpcionMenu) => {
    setModoBatalla(opcion);
    setEquipoAEditar(null);
    setVista('seleccion-equipo');
  };

  if (vista === 'armar-equipo') {
    return (
      <ArmarEquipo
        idUser={user}
        equipoAEditar={equipoAEditar}
        onGuardado={() => {
          setEquipoAEditar(null);
          setVista('seleccion-equipo');
        }}
        onCancelar={() => {
          setEquipoAEditar(null);
          setVista('seleccion-equipo');
        }}
      />
    );
  }

  if (vista === 'seleccion-equipo') {
    const esSoloGestion = modoBatalla === 'crear-equipo';
    return (
      <SeleccionEquipo
        idUser={user}
        tituloContexto={
          esSoloGestion
            ? 'GESTIONAR MIS EQUIPOS'
            : 'ELIGE UN EQUIPO PARA COMBATIR'
        }
        permitirCombate={!esSoloGestion}
        onSeleccionarParaBatalla={(equipo) => {
          setEquipoElegido(equipo);
          setVista('batalla');
        }}
        onCrearNuevo={() => {
          setEquipoAEditar(null);
          setVista('armar-equipo');
        }}
        onEditarEquipo={(equipo) => {
          setEquipoAEditar(equipo);
          setVista('armar-equipo');
        }}
        onVolver={() => setVista('menu')}
      />
    );
  }

  if (vista === 'batalla') {
    return (
      <Batalla
        entrenador1={user}
        entrenador2={modoBatalla === 'contra-ia' ? 'CPU' : 'Rival'}
      />
    );
  }

  // Si ya inició sesión, muestra la pantalla principal
  return (
    <MenuSeleccion
        onElegir={handleElegirMenu}
        onCerrarSesion={handleLogout}
    />
  );
};

const contenedor =
  document.getElementById('root') || document.getElementById('app');

ReactDOM.createRoot(contenedor!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
