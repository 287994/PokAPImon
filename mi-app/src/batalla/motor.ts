import type { Accion, Entrenadores, Interfaz, MovimientoActivo, Pokemon } from './tipos'
import { VENTANA_TIPO } from './datos'
import type { Escenario } from './escenario'
import { danio, nombre } from './calculo'
import { dormir } from './utiles'

export async function jugarCombate(ui: Interfaz, esc: Escenario, P: Pokemon, E: Pokemon, jugadores: Entrenadores) {
    let pociones = 2
    let terminado = false

    async function vidaA(m: Pokemon, a: number) {
        const de = m.hp
        m.hp = Math.max(0, Math.min(m.st.hp, a))
        const t0 = performance.now(), D = Math.min(1000, 250 + Math.abs(de - m.hp) * 70)
        await new Promise<void>(r => {
            const paso = (t: number) => {
                const k = Math.min(1, (t - t0) / D)
                ui.pintarVida(m, de + (m.hp - de) * k)
                if (k < 1) requestAnimationFrame(paso); else r()
            }
            requestAnimationFrame(paso)
        })
    }

    async function usarMovimiento(a: Pokemon, d: Pokemon, m: MovimientoActivo) {
        m.cur--
        await ui.decir(`¡${nombre(a)} usó ${m.n}!`, 250)
        await esc.animacion(m.fx, a.lado, d.lado)
        if (m.p) {
            const r = danio(a, d, m)
            if (!r.v) { await ui.decir(`No afecta a ${nombre(d)}…`); return }
            if (r.e > 1) void esc.temblor()
            await Promise.all([esc.parpadeo(d.lado), vidaA(d, d.hp - r.v)])
            if (r.crit) await ui.decir('¡Un golpe crítico!', 400)
            if (r.e > 1) await ui.decir('¡Es súper eficaz!', 500)
            else if (r.e < 1) await ui.decir('No es muy eficaz…', 500)
        } else if (m.st) {
            const [s, nom] = m.st
            if (d.et[s] <= -6) await ui.decir(`¡La ${nom} de ${nombre(d)} no puede bajar más!`)
            else {
                await esc.bajaEstadistica(d.lado, s)
                d.et[s]--
                await ui.decir(`¡La ${nom} de ${nombre(d)} bajó!`)
            }
        }
    }

    async function ejecutar(m: Pokemon, t: Pokemon, a: Accion) {
        if (a.k === 'i') {
            pociones--
            await ui.decir('¡Usaste una Poción!', 300)
            const cura = Math.min(20, m.st.hp - m.hp)
            await vidaA(m, m.hp + 20)
            await ui.decir(`¡${m.n} recuperó ${cura} PS!`)
            return
        }
        await usarMovimiento(m, t, a.m)
    }

    function elegirRival(): MovimientoActivo {
        const d = E.mov.filter(m => m.cur > 0), w = d.map(m => (m.p ? 2 : 1))
        let r = Math.random() * w.reduce((x, y) => x + y, 0)
        for (let i = 0; i < d.length; i++) { r -= w[i]; if (r < 0) return d[i] }
        return d[0] ?? E.mov[0]
    }

    async function menuJugador(): Promise<Accion> {
        for (;;) {
            ui.fijarMensaje(`¿Qué hará ${P.n}?`)
            const c = await ui.elegir<'l' | 'm' | 'p' | 'h'>([
                { titulo: 'LUCHAR', ventana: 2, v: 'l' }, { titulo: 'MOCHILA', ventana: 6, v: 'm' }, { titulo: 'POKÉMON', ventana: 3, v: 'p' }, { titulo: 'HUIR', ventana: 4, v: 'h' },
            ])
            if (c === 'l') {
                const i = await ui.elegir<number>([
                    ...P.mov.map((x, i) => ({ titulo: x.n, ventana: VENTANA_TIPO[x.t], tipo: x.t, pp: [x.cur, x.pp] as [number, number], v: i, off: !x.cur })),
                    { titulo: '← Volver', ventana: 1, v: -1 },
                ])
                if (i >= 0) return { k: 'm', m: P.mov[i] }
            } else if (c === 'm') {
                const i = await ui.elegir<number>([
                    { titulo: `Poción ×${pociones}`, ventana: 6, v: 1, off: !pociones || P.hp === P.st.hp },
                    { titulo: '← Volver', ventana: 1, v: 0 },
                ])
                if (i) return { k: 'i' }
            } else if (c === 'p') await ui.decir(`¡${P.n} es tu único Pokémon!`, 500)
            else await ui.decir('¡No puedes huir de un combate contra un entrenador!', 600)
        }
    }

    async function ronda(accion: Accion) {
        const acciones = [{ m: P, t: E, a: accion }, { m: E, t: P, a: { k: 'm', m: elegirRival() } as Accion }]
        const prioridad = (x: { a: Accion }) => (x.a.k !== 'm' ? 9 : (x.a.m.prio ?? 0))
        acciones.sort((x, y) => prioridad(y) - prioridad(x) || y.m.st.s - x.m.st.s || Math.random() - .5)
        for (const x of acciones) { if (P.hp <= 0 || E.hp <= 0) break; await ejecutar(x.m, x.t, x.a) }
        if (E.hp <= 0) {
            await esc.desmayar('e')
            await ui.decir(`¡${nombre(E)} se debilitó!`)
            await ui.decir(`¡${jugadores.p} ganó el combate!`, 900)
            terminado = true
        } else if (P.hp <= 0) {
            await esc.desmayar('p')
            await ui.decir(`¡${P.n} se debilitó!`)
            await ui.decir(`¡${jugadores.e} ganó el combate!`, 800)
            terminado = true
        }
    }

    esc.mostrarBandejas()
    await ui.decir(`¡${jugadores.e} quiere combatir!`, 500)
    await Promise.all([esc.lanzarPokebola(E), ui.decir(`¡${jugadores.e} envió a ${E.n}!`, 100)])
    await esc.mostrarHud('e')

    await Promise.all([esc.lanzarPokebola(P), ui.decir(`¡${jugadores.p} envió a ${P.n}!`, 100)])
    await esc.mostrarHud('p')
    await dormir(300)
    while (!terminado) await ronda(await menuJugador())
    ui.fijarMensaje(`¡Ganó ${P.hp > 0 ? jugadores.p : jugadores.e}!`)
    await ui.elegir([{ titulo: 'Revancha', ventana: 2, v: 1 }])

}
