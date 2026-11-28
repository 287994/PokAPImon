import React, { useMemo, useState } from 'react';
import { MOVS, POKEDEX, especieDe } from '../batalla/datos';
import type { Tipo } from '../batalla/tipos';
import { SpritePokemon } from '../components/SpritePokemon';
import {
    type EquipoGuardado,
    type PayloadEquipo,
    actualizarEquipo,
    crearEquipo,
} from '../services/equiposService';
import './ArmarEquipo.css';

interface ArmarEquipoProps {
    idUser: string;
    equipoAEditar?: EquipoGuardado | null;
    onGuardado: () => void;
    onCancelar: () => void;
}

const TIPOS_DISPONIBLES: ('Todos' | Tipo)[] = [
    'Todos',
    'Normal',
    'Planta',
    'Fuego',
    'Agua',
    'Eléctrico',
];

const ETIQUETAS_STATS = ['PS', 'ATQ', 'DEF', 'AT.ESP', 'DF.ESP', 'VEL'];

export const ArmarEquipo: React.FC<ArmarEquipoProps> = ({
    idUser,
    equipoAEditar = null,
    onGuardado,
    onCancelar,
}) => {
    const listaPokedex = useMemo(
        () =>
            Object.entries(POKEDEX).map(([idStr, especie]) => ({
                id: Number(idStr),
                especie,
            })),
        []
    );

    const [slots, setSlots] = useState<(number | null)[]>(() => {
        if (equipoAEditar) {
            return [
                Number(equipoAEditar.Pk1),
                Number(equipoAEditar.Pk2),
                Number(equipoAEditar.Pk3),
                Number(equipoAEditar.Pk4),
                Number(equipoAEditar.Pk5),
                Number(equipoAEditar.Pk6),
            ];
        }
        return [null, null, null, null, null, null];
    });

    const [slotActivo, setSlotActivo] = useState<number>(0);
    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState<'Todos' | Tipo>('Todos');
    const [inspeccionadoId, setInspeccionadoId] = useState<number>(
        listaPokedex[0]?.id ?? 4
    );
    const [guardando, setGuardando] = useState(false);

    const pokedexFiltrada = useMemo(() => {
        return listaPokedex.filter(({ id, especie }) => {
            const coincideTexto =
                especie.n.toLowerCase().includes(busqueda.toLowerCase()) ||
                String(id).includes(busqueda);
            const coincideTipo =
                filtroTipo === 'Todos' || especie.t.includes(filtroTipo);
            return coincideTexto && coincideTipo;
        });
    }, [listaPokedex, busqueda, filtroTipo]);

    const asignarPokemonASlot = (pokeId: number) => {
        setInspeccionadoId(pokeId);
        setSlots((prev) => {
            const copia = [...prev];
            const indiceDestino =
                copia[slotActivo] === null
                    ? slotActivo
                    : copia.findIndex((s) => s === null) !== -1
                        ? copia.findIndex((s) => s === null)
                        : slotActivo;

            copia[indiceDestino] = pokeId;
            const siguienteVacio = copia.findIndex((s) => s === null);
            if (siguienteVacio !== -1) {
                setSlotActivo(siguienteVacio);
            }
            return copia;
        });
    };

    const limpiarSlot = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSlots((prev) => {
            const copia = [...prev];
            copia[index] = null;
            return copia;
        });
        setSlotActivo(index);
    };

    const equipoCompleto = slots.every((s): s is number => s !== null);

    const handleGuardar = async () => {
        if (!equipoCompleto) return;
        setGuardando(true);

        const payload: PayloadEquipo = {
            Pk1: String(slots[0]),
            Pk2: String(slots[1]),
            Pk3: String(slots[2]),
            Pk4: String(slots[3]),
            Pk5: String(slots[4]),
            Pk6: String(slots[5]),
            idUser,
        };

        if (equipoAEditar) {
            await actualizarEquipo(equipoAEditar.idEquipo, payload);
        } else {
            await crearEquipo(payload);
        }

        setGuardando(false);
        onGuardado();
    };

    const especieInspeccionada = especieDe(inspeccionadoId);

    return (
        <div className="armar-page">
            <div className="armar-container">
                <header className="armar-topbar">
                    <h1>
                        {equipoAEditar
                            ? `EDITANDO EQUIPO #${equipoAEditar.idEquipo}`
                            : 'ARMAR NUEVO EQUIPO'}
                    </h1>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn-retro btn-secundario" onClick={onCancelar}>
                            Cancelar
                        </button>
                        <button
                            className="btn-retro btn-guardar-equipo"
                            disabled={!equipoCompleto || guardando}
                            onClick={() => void handleGuardar()}
                        >
                            {guardando
                                ? 'Guardando...'
                                : equipoCompleto
                                    ? 'Guardar Equipo'
                                    : `Faltan ${slots.filter((s) => s === null).length}`}
                        </button>
                    </div>
                </header>

                <section className="slots-bandeja" aria-label="Espacios del equipo">
                    {slots.map((pokeId, idx) => (
                        <div
                            key={idx}
                            className={`slot-box ${slotActivo === idx ? 'activo' : ''}`}
                            onClick={() => setSlotActivo(idx)}
                        >
                            <span className="slot-numero">
                                Pk{idx + 1} {idx === 0 ? '(Líder)' : ''}
                            </span>

                            {pokeId !== null ? (
                                <>
                                    <button
                                        type="button"
                                        className="slot-quitar"
                                        title="Quitar Pokémon"
                                        onClick={(e) => limpiarSlot(idx, e)}
                                    >
                                        ×
                                    </button>
                                    <SpritePokemon id={pokeId} size={64} />
                                    <span className="slot-nombre">{especieDe(pokeId).n}</span>
                                </>
                            ) : (
                                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                    + Vacío
                                </span>
                            )}
                        </div>
                    ))}
                </section>

                <div className="armar-workspace">
                    <section className="pokedex-panel">
                        <div className="filtros-bar">
                            <input
                                type="text"
                                className="buscador-input"
                                placeholder="Buscar Pokémon por nombre o #ID..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <div className="tipos-filtros">
                                {TIPOS_DISPONIBLES.map((tipo) => (
                                    <button
                                        key={tipo}
                                        type="button"
                                        className={`chip-filtro ${filtroTipo === tipo ? 'seleccionado' : ''
                                            }`}
                                        onClick={() => setFiltroTipo(tipo)}
                                    >
                                        {tipo}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pokedex-grid">
                            {pokedexFiltrada.map(({ id, especie }) => (
                                <button
                                    key={id}
                                    type="button"
                                    className={`poke-card ${inspeccionadoId === id ? 'inspeccionado' : ''
                                        }`}
                                    onMouseEnter={() => setInspeccionadoId(id)}
                                    onClick={() => asignarPokemonASlot(id)}
                                >
                                    <small style={{ color: '#94a3b8' }}>#{id}</small>
                                    <SpritePokemon id={id} size={68} />
                                    <strong>{especie.n}</strong>
                                    <div className="poke-tipos">
                                        {especie.t.map((t) => (
                                            <span key={t} className={`tag-tipo tipo-${t}`}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    <aside className="inspector-panel">
                        <div className="inspector-header">
                            <SpritePokemon id={inspeccionadoId} size={84} />
                            <div>
                                <small style={{ color: '#38bdf8' }}>#{inspeccionadoId}</small>
                                <h2 style={{ margin: '2px 0 6px' }}>{especieInspeccionada.n}</h2>
                                <div className="poke-tipos" style={{ justifyContent: 'flex-start' }}>
                                    {especieInspeccionada.t.map((t) => (
                                        <span key={t} className={`tag-tipo tipo-${t}`}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                            ESTADÍSTICAS BASE
                        </h3>
                        <div className="stats-lista">
                            {especieInspeccionada.b.map((valor, i) => (
                                <div key={ETIQUETAS_STATS[i]} className="stat-fila">
                                    <span>{ETIQUETAS_STATS[i]}</span>
                                    <strong>{valor}</strong>
                                    <div className="stat-barra-bg">
                                        <div
                                            className="stat-barra-fill"
                                            style={{ width: `${Math.min(100, (valor / 130) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                            MOVIMIENTOS
                        </h3>
                        <div className="movs-lista">
                            {especieInspeccionada.m.map((claveMov) => {
                                const mov = MOVS[claveMov];
                                if (!mov) return null;
                                return (
                                    <div key={claveMov} className="mov-item">
                                        <div style={{ fontWeight: 'bold', marginBottom: 3 }}>
                                            {mov.n}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                                            <span className={`tag-tipo tipo-${mov.t}`}>{mov.t}</span>
                                            <span>POD: {mov.p ?? '—'}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            className="btn-agregar-slot"
                            onClick={() => asignarPokemonASlot(inspeccionadoId)}
                        >
                            + Colocar en Pk{slotActivo + 1}
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    );
};