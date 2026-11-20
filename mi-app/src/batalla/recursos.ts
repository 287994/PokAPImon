import type { Atlas, DatosAnim } from './tipos'

import fondoCielo from '../assets/images/arena/grass_bg.png'
import plataformaRival from '../assets/images/arena/grass_b.png'
import plataformaJugador from '../assets/images/arena/grass_a.png'

import pokebola from '../assets/images/pokeball/pb.png'
import pokebolaAbriendo from '../assets/images/pokeball/pb_opening.png'
import pokebolaAbierta from '../assets/images/pokeball/pb_open.png'

import particulas from '../assets/images/effects/pb_particles.png'
import estadisticas from '../assets/images/effects/battle_stats.png'

import bandejaJugador from '../assets/images/ui/legacy/pb_tray_overlay_player.png'
import bandejaRival from '../assets/images/ui/legacy/pb_tray_overlay_enemy.png'
import bandejaBola from '../assets/images/ui/legacy/pb_tray_ball.png'

export const IMG = {
    fondoCielo, plataformaRival, plataformaJugador,
    pokebola, pokebolaAbriendo, pokebolaAbierta, particulas, estadisticas,
    bandejaJugador, bandejaRival, bandejaBola,
}

const archivosFuente = import.meta.glob<string>('../assets/fonts/*.{ttf,otf,woff,woff2}', { eager: true, query: '?url', import: 'default' })

export async function cargarFuente(): Promise<boolean> {
    const url = Object.values(archivosFuente)[0]
    if (!url) return false
    try {
        const f = new FontFace('PokemonUI', `url("${url}")`)
        await f.load()
        document.fonts.add(f)
        window.dispatchEvent(new Event('pokefuente'))
        return true
    } catch (err) {
        console.warn('No se pudo cargar la tipografía de src/assets/fonts/', err)
        return false
    }
}

const hojasPokemon = {
    frente: import.meta.glob<string>('../assets/images/pokemon/front/*.png', { query: '?url', import: 'default' }),
    espalda: import.meta.glob<string>('../assets/images/pokemon/back/*.png', { query: '?url', import: 'default' }),
}
const atlasPokemon = {
    frente: import.meta.glob<Atlas>('../assets/images/pokemon/front/json/*.json', { import: 'default' }),
    espalda: import.meta.glob<Atlas>('../assets/images/pokemon/back/json/*.json', { import: 'default' }),
}
const hojasAnim = import.meta.glob<string>('../assets/images/battle_anims/*.png', { query: '?url', import: 'default' })
const jsonAnim = import.meta.glob<DatosAnim | DatosAnim[]>('../assets/images/battle_anims/json/*.json', { import: 'default' })

export class FaltaRecurso extends Error { }

export interface SpriteAnim { frames: string[]; w: number; h: number }

const cacheSprites = new Map<string, Promise<SpriteAnim>>()

function cargarAnimacion(hoja: string, atlas: Atlas): Promise<SpriteAnim> {
    let p = cacheSprites.get(hoja)
    if (!p) {
        p = new Promise<SpriteAnim>((res, rej) => {
            const img = new Image()
            img.onload = () => {
                const lista = [...atlas.textures[0].frames].sort((a, b) => a.filename.localeCompare(b.filename))
                const { w, h } = lista[0].sourceSize
                const hechos = new Map<string, string>()
                const frames = lista.map(f => {
                    const clave = JSON.stringify([f.frame, f.spriteSourceSize])
                    let url = hechos.get(clave)
                    if (!url) {
                        const c = document.createElement('canvas')
                        c.width = f.sourceSize.w; c.height = f.sourceSize.h
                        const ctx = c.getContext('2d')
                        if (!ctx) throw new Error('No se pudo crear el canvas')
                        const s = f.spriteSourceSize, r = f.frame
                        ctx.drawImage(img, r.x, r.y, r.w, r.h, s.x, s.y, s.w, s.h)
                        url = c.toDataURL('image/png')
                        hechos.set(clave, url)
                    }
                    return url
                })
                res({ frames, w, h })
            }
            img.onerror = () => rej(new Error('No se pudo cargar ' + hoja))
            img.src = hoja
        })
        cacheSprites.set(hoja, p)
    }
    return p
}

export async function cargarSpritePokemon(id: number, lado: 'frente' | 'espalda'): Promise<SpriteAnim> {
    const carpeta = lado === 'frente' ? 'front' : 'back'
    const cargarHoja = hojasPokemon[lado][`../assets/images/pokemon/${carpeta}/${id}.png`]
    const cargarAtlas = atlasPokemon[lado][`../assets/images/pokemon/${carpeta}/json/${id}.json`]
    if (!cargarHoja || !cargarAtlas) throw new FaltaRecurso(`Faltan la imagen o el .json de ${lado} del Pokémon ${id}.`)
    const [hoja, atlas] = await Promise.all([cargarHoja(), cargarAtlas()])
    return cargarAnimacion(hoja, atlas)
}

export async function cargarDatosAnim(fx: string): Promise<DatosAnim[] | null> {
    const cargar = jsonAnim[`../assets/images/battle_anims/json/${fx}.json`]
    if (!cargar) return null
    const d = await cargar()
    return Array.isArray(d) ? d : [d]
}

export async function urlHojaAnim(graphic: string): Promise<string | null> {
    const cargar = hojasAnim[`../assets/images/battle_anims/${graphic}.png`]
    return cargar ? cargar() : null
}
