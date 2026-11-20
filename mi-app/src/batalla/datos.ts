import type { Especie, Movimiento, Tipo } from './tipos'

export const VENTANA_TIPO: Record<Tipo, number> = { Normal: 1, Planta: 3, Fuego: 2, Agua: 4, Eléctrico: 6 }
export const TIPO_FILA: Record<Tipo, number> = { Normal: 13, Planta: 10, Fuego: 7, Agua: 18, Eléctrico: 4 }

export const VENTAJAS: Partial<Record<Tipo, Partial<Record<Tipo, number>>>> = {
    Planta: { Fuego: .5, Agua: 2 },
    Fuego: { Planta: 2, Agua: .5 },
    Agua: { Fuego: 2, Planta: .5 },
    Eléctrico: { Agua: 2, Planta: .5 },
}

export const MOVS: Record<string, Movimiento> = {
    placaje:      { n: 'Placaje',       t: 'Normal',    p: 50, c: 'a', pp: 35, fx: 'tackle' },
    malicioso:    { n: 'Malicioso',     t: 'Normal',            c: 's', pp: 30, fx: 'leer',          st: ['d', 'defensa'] },
    latigocepa:   { n: 'Látigo Cepa',   t: 'Planta',    p: 35, c: 'a', pp: 15, fx: 'vine-whip' },
    constriccion: { n: 'Constricción',  t: 'Normal',    p: 15, c: 'a', pp: 20, fx: 'wrap' },
    aranazo:      { n: 'Arañazo',       t: 'Normal',    p: 40, c: 'a', pp: 35, fx: 'scratch' },
    gruñido:      { n: 'Gruñido',       t: 'Normal',            c: 's', pp: 40, fx: 'growl',         st: ['a', 'ataque'] },
    ascuas:       { n: 'Ascuas',        t: 'Fuego',     p: 40, c: 'x', pp: 25, fx: 'ember' },
    furia:        { n: 'Furia',         t: 'Normal',    p: 20, c: 'a', pp: 20, fx: 'rage' },
    latigo:       { n: 'Látigo',        t: 'Normal',            c: 's', pp: 30, fx: 'tail-whip',     st: ['d', 'defensa'] },
    burbuja:      { n: 'Burbuja',       t: 'Agua',      p: 40, c: 'x', pp: 30, fx: 'bubble' },
    pistolaagua:  { n: 'Pistola Agua',  t: 'Agua',      p: 40, c: 'x', pp: 25, fx: 'water-gun' },
    impactrueno:  { n: 'Impactrueno',   t: 'Eléctrico', p: 40, c: 'x', pp: 30, fx: 'thunder-shock' },
    rapido:       { n: 'Ataque Rápido', t: 'Normal',    p: 40, c: 'a', pp: 30, fx: 'quick-attack', prio: 1 },
}

export const POKEDEX: Record<number, Especie> = {
    4:   { n: 'Charmander', t: ['Fuego'],     b: [39, 52, 43, 60, 50, 65], m: ['aranazo', 'gruñido', 'ascuas', 'furia'] },
    7:   { n: 'Squirtle',   t: ['Agua'],      b: [44, 48, 65, 50, 64, 43], m: ['placaje', 'latigo', 'burbuja', 'pistolaagua'] },
    25:  { n: 'Pikachu',    t: ['Eléctrico'], b: [35, 55, 40, 50, 50, 90], m: ['impactrueno', 'gruñido', 'rapido', 'latigo'] },
    495: { n: 'Snivy',      t: ['Planta'],    b: [45, 45, 55, 45, 55, 63], m: ['placaje', 'malicioso', 'latigocepa', 'constriccion'] },
}

const ESPECIE_BASE: Especie = { n: '', t: ['Normal'], b: [50, 50, 50, 50, 50, 50], m: ['placaje', 'aranazo', 'gruñido', 'latigo'] }

export const especieDe = (id: number): Especie => POKEDEX[id] ?? { ...ESPECIE_BASE, n: `#${id}` }
