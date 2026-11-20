import React from "react";
export type OpcionMenu = "crear-sala" | "unirse-sala" | "contra-ia" | "crear-equipo";
interface MenuSeleccionProps {
  onElegir?: (opcion: OpcionMenu) => void;
  onCerrarSesion?: () => void;
}
const opciones: {
  id: OpcionMenu;
  titulo: string;
  descripcion: string;
  icono: string;
  fondo: string;
  texto: string;
}[] = [
  {
    id: "crear-sala",
    titulo: "Empezar sala PVP",
    descripcion: "Crea una sala y espera a tu rival",
    icono: "",
    fondo: "#d7263d",
    texto: "#ffffff",
  },
  {
    id: "unirse-sala",
    titulo: "Unirse a sala PVP",
    descripcion: "Entra con el código de una sala",
    i
    fondo: "#1d2b4f",
    texto: "#ffffff",
  },
  {
    id: "contra-ia",
    titulo: "Luchar contra la IA",
    descripcion: "Practica contra la máquina",
    icono: "🤖",
    fondo: "#1f7a6f",
    texto: "#ffffff",
  },
  {
    id: "crear-equipo",
    titulo: "Crear equipo",
    descripcion: "Arma tu equipo de Pokémon",
    icono: "👥",
    fondo: "#f4b942",
    texto: "#1d2b4f",
  },
];
const estilos = `
  .menu {
    position: relative;
    display: flex;
    height: 100vh;
    font-family: "Rubik", system-ui, sans-serif;
  }
  .menu__panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem 1rem;
    border: 0;
    cursor: pointer;
    text-align: center;
    font: inherit;
    transition: flex 0.25s ease;
  }
  .menu__panel:hover,
  .menu__panel:focus-visible {
    flex: 1.25;
  }
  .menu__panel:focus-visible {
    outline: 4px solid #f8f6f1;
    outline-offset: -8px;
  }
  .menu__icono { font-size: 3.5rem; }
  .menu__titulo { font-size: 1.4rem; font-weight: 700; }
  .menu__desc { font-size: 0.95rem; opacity: 0.85; max-width: 16ch; }
  .menu__salir {
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 1;
    padding: 0.5rem 1rem;
    border: 0;
    border-radius: 999px;
    background:#f8f6f1;
    color: #1d2b4f;
    font: inherit;
    font-weight: 500;
    cursor: pointer;
  }
  .menu__salir:hover { background: #ffffff; }
  @media (max-width: 700px) {
    .menu { flex-wrap: wrap; }
    .menu__panel { flex: 1 1 50%; padding-top: 3rem; }
    .menu__panel:hover { flex: 1 1 50%; }
  }
`;
export default function MenuSeleccion({
  onElegir = (opcion) => console.log("Opción elegida:", opcion),
  onCerrarSesion = () => console.log("Sesión cerrada"),
}: MenuSeleccionProps) {
  return (
    <>
      <style>{estilos}</style>
      <main className="menu">
        <button className="menu__salir" onClick={onCerrarSesion}>
          ← Cerrar sesión
        </button>
        {opciones.map((op) => (
          <button
            key={op.id}
            className="menu__panel"
            style={{ background: op.fondo, color: op.texto }}
            onClick={() => onElegir(op.id)}
          >
            <span className="menu__icono" aria-hidden="true">{op.icono}</span>
            <span className="menu__titulo">{op.titulo}</span>
            <span className="menu__desc">{op.descripcion}</span>
          </button>
        ))}
      </main>
    </>
  );
}