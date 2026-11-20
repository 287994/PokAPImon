import { useEffect, useMemo, useRef, useState } from 'react'
import type { Entrenadores, Interfaz, ItemMenu } from './tipos'
import { POKEMON_ALIADO, POKEMON_RIVAL } from './config'
import { crearPokemon } from './calculo'
import { crearEscenario } from './escenario'
import type { Elementos, Escenario } from './escenario'
import { jugarCombate } from './motor'
import { FaltaRecurso, cargarSpritePokemon } from './recursos'
import { dormir } from './utiles'

class Cancelado extends Error { }

export function useCombate(entrenadores: Entrenadores) {
    const escena = useRef<HTMLDivElement>(null)
    const efectos = useRef<HTMLDivElement>(null)
    const posJugador = useRef<HTMLDivElement>(null)
    const posRival = useRef<HTMLDivElement>(null)
    const sprJugador = useRef<HTMLImageElement>(null)
    const sprRival = useRef<HTMLImageElement>(null)
    const hudJugador = useRef<HTMLDivElement>(null)
    const hudRival = useRef<HTMLDivElement>(null)

    const [msg, setMsg] = useState({ t: 'Presiona el botón para comenzar.', n: Infinity, esp: false })
    const setMensaje = (t: string) => setMsg({ t, n: t.length, esp: false })
    const [menu, setMenu] = useState<ItemMenu<unknown>[]>([])
    const [seleccion, setSeleccion] = useState(true)
    const [vida, setVida] = useState({ p: 1, e: 1 })
    const [psTexto, setPsTexto] = useState('')

    const vivo = useRef(true)
    const ocupado = useRef(false)
    const saltar = useRef(false)
    const resolver = useRef<((v: unknown) => void) | null>(null)
    const escenario = useRef<Escenario | null>(null)
    const jugadores = useRef(entrenadores)

    useEffect(() => { jugadores.current = entrenadores })

    useEffect(() => {
        vivo.current = true
        return () => { vivo.current = false }
    }, [])

    const ui = useMemo<Interfaz>(() => ({
        async decir(texto, espera = 700) {
            saltar.current = false
            setMsg({ t: texto, n: 0, esp: false })
            for (let i = 0; i < texto.length; i++) {
                if (saltar.current) break
                setMsg({ t: texto, n: i + 1, esp: false })
                await dormir(22)
                if (!vivo.current) throw new Cancelado()
            }
            setMsg({ t: texto, n: texto.length, esp: espera >= 400 })
            await dormir(espera)
            if (!vivo.current) throw new Cancelado()
        },
        fijarMensaje: (t) => setMsg({ t, n: t.length, esp: false }),
        elegir<V>(items: ItemMenu<V>[]) {
            return new Promise<V>(res => {
                resolver.current = v => res(v as V)
                setMenu(items as ItemMenu<unknown>[])
            })
        },
        pintarVida(m, valor) {
            setVida(v => ({ ...v, [m.lado]: valor / m.st.hp }))
            if (m.lado === 'p') setPsTexto(`${Math.ceil(valor)} / ${m.st.hp}`)
        },
    }), [])

    const elegirOpcion = (v: unknown) => {
        setMenu([])
        resolver.current?.(v)
        resolver.current = null
    }

    const leerElementos = (): Elementos | null => {
        const e = escena.current, f = efectos.current
        const pj = posJugador.current, pr = posRival.current
        const sj = sprJugador.current, sr = sprRival.current
        const hj = hudJugador.current, hr = hudRival.current
        if (!e || !f || !pj || !pr || !sj || !sr || !hj || !hr) return null
        return { escena: e, efectos: f, pos: { p: pj, e: pr }, spr: { p: sj, e: sr }, hud: { p: hj, e: hr } }
    }

    async function empezar() {
        if (ocupado.current) return
        const el = leerElementos()
        if (!el) return
        ocupado.current = true
        escenario.current ??= crearEscenario(el)
        const esc = escenario.current
        esc.reiniciar()
        setSeleccion(false)
        setVida({ p: 1, e: 1 })
        const P = crearPokemon(POKEMON_ALIADO, 'p'), E = crearPokemon(POKEMON_RIVAL, 'e')
        setPsTexto(`${P.hp} / ${P.st.hp}`)
        try {
            const [animP, animE] = await Promise.all([
                cargarSpritePokemon(P.id, 'espalda'),
                cargarSpritePokemon(E.id, 'frente'),
            ])
            await Promise.all([esc.cargarRecursos([...P.mov, ...E.mov].map(m => m.fx)), esc.cargarSprite('p', animP), esc.cargarSprite('e', animE)])
            await jugarCombate(ui, esc, P, E, jugadores.current)
        } catch (err) {
            if (err instanceof FaltaRecurso) setMensaje(err.message)
            else if (!(err instanceof Cancelado)) console.error(err)
        } finally {
            ocupado.current = false
            if (vivo.current) setSeleccion(true)
        }
    }

    return {
        refs: { escena, efectos, posJugador, posRival, sprJugador, sprRival, hudJugador, hudRival },
        mensaje: msg.t.slice(0, msg.n), mensajeCompleto: msg.t, esperando: msg.esp,
        menu, seleccion, vida, psTexto,
        empezar, elegirOpcion,
        saltarTexto: () => { saltar.current = true },
    }
}
