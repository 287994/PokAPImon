import type { DatosAnim, EstadBajable, Lado, Pokemon } from './tipos'
import type { SpriteAnim } from './recursos'
import { IMG, cargarDatosAnim, urlHojaAnim } from './recursos'
import { dormir } from './utiles'

const MS_FOTOGRAMA = 75
const ZOOM_ANIM = 2.3
const MS_SPRITE = 83

const BOLA = {
    p: { fin: { x: 104, y: 123 }, salida: { x: -95, y: 10 }, cima: { x: -45, y: -75 } },
    e: { fin: { x: 216, y: 94 }, salida: { x: 115, y: -55 }, cima: { x: 60, y: -95 } },
}
const PARTICULAS = [[1, 6], [13, 6], [21, 6], [66, 8], [61, 4], [75, 4]]

const FILA_ESTAD: Record<EstadBajable, number> = { a: 2, d: 3 }

const BANDEJA = { p: { x: 216, y: 73 }, e: { x: 0, y: 39 } }

export interface Elementos {
    escena: HTMLElement
    efectos: HTMLElement
    pos: Record<Lado, HTMLElement>
    spr: Record<Lado, HTMLImageElement>
    hud: Record<Lado, HTMLElement>
}

const relojes = new WeakMap<HTMLImageElement, number>()

const fondosDe = (an: DatosAnim) =>
    Object.entries(an.frameTimedEvents ?? {}).flatMap(([k, evs]) =>
        evs.flatMap(e =>
            e.eventType === 'AnimTimedAddBgEvent' ? [[Number(k), 1, e.opacity ?? 0, e.duration ?? 0]]
            : e.eventType === 'AnimTimedUpdateBgEvent' ? [[Number(k), 0, e.opacity ?? 0, e.duration ?? 0]]
            : []))

export function crearEscenario(el: Elementos) {
    const hojas: Record<string, HTMLImageElement> = {}
    const bandejas = new Map<Lado, HTMLElement>()
    const datos: Record<string, DatosAnim[]> = {}

    const U = () => el.escena.clientWidth / 320

    const animar = (e: Element, k: Keyframe[], o: KeyframeAnimationOptions = {}) =>
        e.animate(k, { duration: 300, easing: 'ease-out', ...o }).finished

    const crear = (css: string, padre: HTMLElement = el.efectos) => {
        const d = document.createElement('div')
        d.style.cssText = 'position:absolute;' + css
        padre.appendChild(d)
        return d
    }

    const centro = (lado: Lado) => {
        const r = el.spr[lado].getBoundingClientRect(), s = el.escena.getBoundingClientRect()
        return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, w: r.width, h: r.height }
    }

    const precargar = (url: string) => new Promise<HTMLImageElement>(r => {
        const i = new Image()
        i.onload = i.onerror = () => r(i)
        i.src = url
    })

    const cargarRecursos = async (efectos: string[]) => {
        await Promise.all([IMG.pokebola, IMG.pokebolaAbriendo, IMG.pokebolaAbierta].map(precargar))
        await Promise.all([...new Set(efectos)].map(async fx => {
            const d = await cargarDatosAnim(fx)
            if (!d) return
            datos[fx] = d
            await Promise.all(d.map(async a => {
                if (hojas[a.graphic]) return
                const url = await urlHojaAnim(a.graphic)
                if (url) hojas[a.graphic] = await precargar(url)
            }))
        }))
    }

    const cargarSprite = async (lado: Lado, s: SpriteAnim) => {
        const img = el.spr[lado]
        const [mn, mx, S] = lado === 'p' ? [76, 112, 2] : [40, 76, 1.4]
        window.clearInterval(relojes.get(img))
        img.src = s.frames[0]
        try { await img.decode() } catch { }
        img.style.width = `calc(${Math.max(mn, Math.min(mx, s.w * S))} * var(--u))`
        img.style.height = 'auto'
        let i = 0
        const reloj = window.setInterval(() => {
            if (!img.isConnected) return window.clearInterval(reloj)
            i = (i + 1) % s.frames.length
            img.src = s.frames[i]
        }, MS_SPRITE)
        relojes.set(img, reloj)
    }

    const reiniciar = () => {
        ;(['p', 'e'] as Lado[]).forEach(l => {
            window.clearInterval(relojes.get(el.spr[l]))
            ;[el.pos[l], el.spr[l]].forEach(e => e.getAnimations().forEach(a => a.cancel()))
            el.pos[l].style.visibility = 'hidden'
            el.hud[l].style.visibility = 'hidden'
            el.spr[l].style.transform = ''
            el.spr[l].style.opacity = ''
        })
        el.efectos.innerHTML = ''
        bandejas.clear()
    }

    const mostrarBandejas = () => {
        const u = U()
        ;(['e', 'p'] as Lado[]).forEach(l => {
            const { x, y } = BANDEJA[l]
            const b = crear(`left:${x * u}px;top:${y * u}px;width:${104 * u}px;height:${11 * u}px`)
            crear(`left:0;top:${7 * u}px;width:${104 * u}px;height:${4 * u}px;background:url(${l === 'p' ? IMG.bandejaJugador : IMG.bandejaRival}) 0 0/100% 100%;image-rendering:pixelated`, b)
            for (let i = 0; i < 6; i++)
                crear(`left:${(13 + i * 14) * u}px;top:0;width:${7 * u}px;height:${7 * u}px;background:url(${IMG.bandejaBola}) ${i ? -7 * u : 0}px 0/${28 * u}px ${7 * u}px;image-rendering:pixelated`, b)
            bandejas.set(l, b)
            void animar(b, [{ transform: `translateX(${(l === 'p' ? 1 : -1) * 110 * u}px)` }, { transform: 'none' }], { duration: 500 })
        })
    }

    const quitarBandeja = (l: Lado) => {
        const b = bandejas.get(l)
        if (!b) return
        bandejas.delete(l)
        void animar(b, [{ transform: 'none' }, { transform: `translateX(${(l === 'p' ? 1 : -1) * 110 * U()}px)` }], { duration: 400, easing: 'ease-in', fill: 'forwards' }).then(() => b.remove())
    }

    const lanzarPokebola = async (m: Pokemon) => {
        const u = U(), c = BOLA[m.lado], pos = el.pos[m.lado]
        quitarBandeja(m.lado)
        const bola = document.createElement('img')
        bola.className = 'pokebola'
        bola.src = IMG.pokebola
        bola.style.left = c.fin.x * u + 'px'
        bola.style.top = c.fin.y * u + 'px'
        el.efectos.appendChild(bola)
        const pt = (q: { x: number; y: number }) => `translate(${q.x * u}px,${q.y * u}px)`
        await animar(bola, [
            { transform: pt(c.salida) + ' rotate(0deg)' },
            { transform: pt(c.cima) + ' rotate(360deg)', offset: .5 },
            { transform: 'translate(0,0) rotate(720deg)' },
        ], { duration: 900, easing: 'ease-in-out', fill: 'forwards' })
        bola.src = IMG.pokebolaAbriendo
        await dormir(150)
        bola.src = IMG.pokebolaAbierta
        for (let i = 0; i < 10; i++) {
            const [px, pw] = PARTICULAS[i % PARTICULAS.length]
            const k = 1.6 * u
            const p = crear(`left:${c.fin.x * u}px;top:${(c.fin.y - 8) * u}px;width:${pw * k}px;height:${8 * k}px;background:url(${IMG.particulas}) ${-px * k}px 0/${80 * k}px ${8 * k}px;image-rendering:pixelated`)
            const ang = i / 10 * Math.PI * 2, d = (16 + (i % 3) * 6) * u
            void animar(p, [{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${Math.cos(ang) * d}px,${Math.sin(ang) * d - 6 * u}px)`, opacity: 0 }], { duration: 550 }).then(() => p.remove())
        }
        void animar(bola, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.6)', opacity: 0 }], { duration: 350 }).then(() => bola.remove())
        pos.style.visibility = 'visible'
        await animar(pos, [
            { opacity: 1, transform: 'scale(.1)', filter: 'brightness(0) invert(1)' },
            { opacity: 1, transform: 'scale(1.1)', filter: 'brightness(0) invert(1)', offset: .6 },
            { opacity: 1, transform: 'scale(1)', filter: 'none' },
        ], { duration: 900, easing: 'ease-in-out' })
    }

    const mostrarHud = (lado: Lado) => {
        const h = el.hud[lado]
        h.style.visibility = 'visible'
        return animar(h, [{ transform: `translateX(${(lado === 'p' ? 60 : -60) * U()}px)` }, { transform: 'none' }], { duration: 700 })
    }

    const parpadeo = (lado: Lado) => animar(el.spr[lado],
        [1, 0, 1, 0, 1, 0, 1].map(opacity => ({ opacity })), { duration: 520, easing: 'steps(1)' })

    const temblor = () => animar(el.escena, [
        { transform: 'none' }, { transform: 'translate(-7px,3px)' }, { transform: 'translate(6px,-3px)' },
        { transform: 'translate(-4px,2px)' }, { transform: 'none' },
    ], { duration: 300 })

    const desmayar = (lado: Lado) => animar(el.pos[lado], [
        { transform: 'none', opacity: 1 },
        { transform: 'translateY(55%) scaleY(.2)', opacity: 0 },
    ], { duration: 700, easing: 'ease-in', fill: 'forwards' })

    const animacion = async (nombre: string, atacante: Lado, objetivo: Lado) => {
        const versiones = datos[nombre]
        if (!versiones) return
        const dosVersiones = versiones.length > 1
        const an = dosVersiones && atacante === 'e' ? versiones[1] : versiones[0]
        const hoja = hojas[an.graphic]
        if (!hoja) return
        const fondos = fondosDe(an)
        const u = U(), K = ZOOM_ANIM
        const lados: [Lado, Lado] = dosVersiones ? ['p', 'e'] : [atacante, objetivo]
        const ra = centro(lados[0]), rb = centro(lados[1]), rects = [ra, rb]
        const HW = hoja.naturalWidth, HH = hoja.naturalHeight, cols = Math.max(1, Math.round(HW / 96))
        const mapa = (f: number, x: number, y: number) =>
            f === 2 ? { x: ra.x + x * u * K, y: ra.y + y * u * K }
            : f === 1 ? { x: rb.x + (x - 128) * u * K, y: rb.y + (y + 64) * u * K }
            : { x: ra.x + x / 128 * (rb.x - ra.x), y: ra.y + y / -64 * (rb.y - ra.y) }
        const caja = crear('inset:0')
        let fondo: HTMLElement | null = null
        for (let i = 0; i < an.frames.length; i++) {
            for (const [fi, nuevo, opac, dur] of fondos) if (fi === i) {
                if (nuevo) fondo = crear(`inset:0;background:#000;opacity:${opac / 255}`)
                else if (fondo) { fondo.style.transition = `opacity ${dur * MS_FOTOGRAMA}ms linear`; fondo.style.opacity = String(opac / 255) }
            }
            caja.innerHTML = ''
            for (const c of an.frames[i]) {
                const { target: t, focus: f = 0, x, y, zoomX: zx = 100, zoomY: zy = 100, graphicFrame: gf = 0, opacity: op = 255, angle: ang = 0, mirror: esp = false, blendType: mez = 0, locked: fija = false, visible: vis = true } = c
                const p = mapa(f, x, y)
                if (t < 2) {
                    const spr = el.spr[lados[t]], base = t ? mapa(f, 128, -64) : mapa(f, 0, 0), dx = p.x - base.x, dy = p.y - base.y
                    if (fija) {
                        spr.style.transform = `translate(${dx}px,${dy}px) scale(${zx / 100},${zy / 100})`
                        spr.style.opacity = vis ? String(op / 255) : '0'
                    } else if (vis) {
                        const r = rects[t], g = document.createElement('img')
                        g.src = spr.src
                        g.style.cssText = `position:absolute;left:${r.x + dx - r.w / 2}px;top:${r.y + dy - r.h / 2}px;width:${r.w}px;height:${r.h}px;opacity:${op / 255};image-rendering:pixelated;transform:scale(${zx / 100},${zy / 100})`
                        caja.appendChild(g)
                    }
                } else if (vis && HW) {
                    const z = 96 * u * K, col = gf % cols, fila = Math.floor(gf / cols)
                    crear(`left:${p.x - z / 2}px;top:${p.y - z / 2}px;width:${z}px;height:${z}px;opacity:${op / 255};background:url("${hoja.src}") ${-col * z}px ${-fila * z}px/${HW * u * K}px ${HH * u * K}px;image-rendering:pixelated;transform:rotate(${ang}deg) scale(${(esp ? -1 : 1) * zx / 100},${zy / 100});${mez ? 'mix-blend-mode:screen' : ''}`, caja)
                }
            }
            await dormir(MS_FOTOGRAMA)
        }
        caja.remove()
        if (fondo) {
            const f = fondo
            f.style.transition = 'opacity .1s'; f.style.opacity = '0'
            setTimeout(() => f.remove(), 120)
        }
        lados.forEach(l => { el.spr[l].style.transform = ''; el.spr[l].style.opacity = '' })
    }


    const bajaEstadistica = async (lado: Lado, estad: EstadBajable) => {
        const c = centro(lado), u = U(), t = 32 * u
        const src = el.spr[lado].src
        const mascara = `url("${src}") center/100% 100% no-repeat`
        const velo = crear(`left:${c.x - c.w / 2}px;top:${c.y - c.h / 2}px;width:${c.w}px;height:${c.h}px;overflow:hidden;opacity:0;-webkit-mask:${mascara};mask:${mascara}`)
        const n = Math.ceil(c.h / t) + 2
        const cinta = document.createElement('div')
        cinta.style.cssText = `position:absolute;left:0;top:${-t}px;width:100%;height:${n * t}px`
        for (let i = 0; i < n; i++) {
            const f = document.createElement('div')
            f.style.cssText = `height:${t}px;background:url(${IMG.estadisticas}) 50% ${-FILA_ESTAD[estad] * t}px/${t}px ${8 * t}px repeat-x;image-rendering:pixelated;transform:scaleY(-1)`
            cinta.appendChild(f)
        }
        velo.appendChild(cinta)
        void cinta.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${t}px)` }], { duration: 350, iterations: 3, easing: 'linear' })
        await animar(velo, [{ opacity: 0 }, { opacity: .85, offset: .2 }, { opacity: .85, offset: .8 }, { opacity: 0 }], { duration: 1050, easing: 'linear' })
        velo.remove()
    }

    return { U, cargarRecursos, cargarSprite, reiniciar, mostrarBandejas, lanzarPokebola, mostrarHud, parpadeo, temblor, desmayar, animacion, bajaEstadistica }
}

export type Escenario = ReturnType<typeof crearEscenario>
