import type { ClaseAtaque, Lado, Movimiento, Pokemon, Tipo } from './tipos'
import { MOVS, VENTAJAS, especieDe } from './datos'

export const NIVEL = 5

export const multEtapa = (s: number) => (s >= 0 ? (2 + s) / 2 : 2 / (2 - s))
export const nombre = (m: Pokemon) => (m.lado === 'e' ? m.n + ' rival' : m.n)
export const efectividad = (t: Tipo, ts: Tipo[]) => ts.reduce((x, d) => x * (VENTAJAS[t]?.[d] ?? 1), 1)

export function calcularStats(id: number) {
    const b = especieDe(id).b
    const f = (x: number, ps = false) => Math.floor((2 * x + 15) * NIVEL / 100) + (ps ? NIVEL + 10 : 5)
    return { hp: f(b[0], true), a: f(b[1]), d: f(b[2]), x: f(b[3]), y: f(b[4]), s: f(b[5]) }
}

export function crearPokemon(id: number, lado: Lado): Pokemon {
    const st = calcularStats(id), e = especieDe(id)
    return {
        id, n: e.n, t: e.t, st, hp: st.hp, et: { a: 0, d: 0, x: 0, y: 0 }, lado,
        mov: e.m.map(i => ({ ...MOVS[i], cur: MOVS[i].pp })),
    }
}

export function danio(a: Pokemon, d: Pokemon, m: Movimiento) {
    const k = m.c as ClaseAtaque, dk = k === 'a' ? 'd' : 'y'
    const A = a.st[k] * multEtapa(a.et[k]), D = d.st[dk] * multEtapa(d.et[dk])
    const base = Math.floor(Math.floor(Math.floor(2 * NIVEL / 5 + 2) * (m.p ?? 0) * A / D) / 50) + 2
    const e = efectividad(m.t, d.t), crit = Math.random() < 1 / 16
    const v = Math.floor(base * (crit ? 1.5 : 1) * (.85 + Math.random() * .15) * (a.t.includes(m.t) ? 1.5 : 1) * e)
    return { v: e ? Math.max(1, v) : 0, crit, e }
}
