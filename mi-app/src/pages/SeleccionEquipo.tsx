import React, { useEffect, useState } from 'react';
import { especieDe } from '../batalla/datos';
import { SpritePokemon } from '../components/SpritePokemon';
import {
    type EquipoGuardado,
    eliminarEquipo,
    obtenerEquiposUsuario,
} from '../services/equiposService';
import './SeleccionEquipo.css';

interface SeleccionEquipoProps {
    idUser: string;
    tituloContexto?: string;
    permitirCombate?: boolean;
    onSeleccionarParaBatalla: (equipo: EquipoGuardado) => void;
    onCrearNuevo: () => void;
    onEditarEquipo: (equipo: EquipoGuardado) => void;
    onVolver: () => void;
}

export const SeleccionEquipo: React.FC<SeleccionEquipoProps> = ({
    idUser,
    tituloContexto = 'TUS EQUIPOS GUARDADOS',
    permitirCombate = true,
    onSeleccionarParaBatalla,
    onCrearNuevo,
    onEditarEquipo,
    onVolver,
}) => {
    const [equipos, setEquipos] = useState<EquipoGuardado[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargar = async () => {
        setCargando(true);
        const lista = await obtenerEquiposUsuario(idUser);
        setEquipos(lista);
        setCargando(false);
    };

    useEffect(() => {
        void cargar();
    }, [idUser]);

    const handleEliminar = async (idEquipo: number) => {
        await eliminarEquipo(idEquipo);
        setEquipos((prev) => prev.filter((e) => e.idEquipo !== idEquipo));
    };

    const extraerIds = (eq: EquipoGuardado): number[] => [
        Number(eq.Pk1),
        Number(eq.Pk2),
        Number(eq.Pk3),
        Number(eq.Pk4),
        Number(eq.Pk5),
        Number(eq.Pk6),
    ];

    return (
        <div className="sel-equipo-page">
            <div className="sel-equipo-container">
                <header className="sel-equipo-header">
                    <div>
                        <h1>{tituloContexto}</h1>
                        <small>Entrenador: {idUser}</small>
                    </div>
                    <div className="sel-equipo-acciones-top">
                        <button className="btn-retro btn-secundario" onClick={onVolver}>
                            ← Menú
                        </button>
                        <button className="btn-retro btn-nuevo" onClick={onCrearNuevo}>
                            + Nuevo Equipo
                        </button>
                    </div>
                </header>

                {cargando ? (
                    <div className="estado-vacio">Cargando equipos de la PC...</div>
                ) : equipos.length === 0 ? (
                    <div className="estado-vacio">
                        <h2>NO TIENES EQUIPOS REGISTRADOS</h2>
                        <p>Arma un equipo de 6 Pokémon para entrar a combatir.</p>
                        <button className="btn-retro btn-nuevo" onClick={onCrearNuevo}>
                            + Crear mi primer equipo
                        </button>
                    </div>
                ) : (
                    <div className="equipos-grid">
                        {equipos.map((eq, index) => {
                            const ids = extraerIds(eq);
                            return (
                                <article key={eq.idEquipo} className="equipo-card">
                                    <div className="equipo-card-top">
                                        <span className="equipo-titulo">EQUIPO #{index + 1}</span>
                                        <small style={{ color: '#94a3b8' }}>ID: {eq.idEquipo}</small>
                                    </div>

                                    <div className="equipo-slots-preview">
                                        {ids.map((pokeId, slotIdx) => (
                                            <div key={slotIdx} className="equipo-mini-slot">
                                                {slotIdx === 0 && <span className="badge-lider">1°</span>}
                                                <SpritePokemon id={pokeId} size={56} />
                                                <span className="equipo-mini-nombre">{especieDe(pokeId).n}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="equipo-card-footer">
                                        {permitirCombate && (
                                            <button
                                                className="btn-retro btn-usar"
                                                onClick={() => onSeleccionarParaBatalla(eq)}
                                            >
                                                ¡ELEGIR EQUIPO!
                                            </button>
                                        )}
                                        <button
                                            className="btn-retro btn-editar"
                                            onClick={() => onEditarEquipo(eq)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn-retro btn-borrar"
                                            onClick={() => void handleEliminar(eq.idEquipo)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};