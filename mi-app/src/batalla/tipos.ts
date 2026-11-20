export type Lado = 'p' | 'e'

export type Entrenadores = Record<Lado, string>
export type Tipo = 'Normal' | 'Planta' | 'Fuego' | 'Agua' | 'Eléctrico'
export type Clase = 'a' | 'x' | 's'
export type ClaseAtaque = 'a' | 'x'
export type EstadBajable = 'a' | 'd'

export interface FotogramaAtlas {
    filename: string
    sourceSize: { w: number; h: number }
    spriteSourceSize: { x: number; y: number; w: number; h: number }
    frame: { x: number; y: number; w: number; h: number }
}
export interface Atlas { textures: { frames: FotogramaAtlas[] }[] }

export interface CeldaAnim {
    target: number
    x: number
    y: number
    focus?: number
    zoomX?: number
    zoomY?: number
    graphicFrame?: number
    opacity?: number
    angle?: number
    mirror?: boolean
    blendType?: number
    locked?: boolean
    visible?: boolean
}
export interface EventoAnim { eventType: string; opacity?: number; duration?: number }
export interface DatosAnim {
    graphic: string
    frames: CeldaAnim[][]
    frameTimedEvents?: Record<string, EventoAnim[]>
}

export interface Movimiento {
    n: string
    t: Tipo
    p?: number
    c: Clase
    pp: number
    fx: string
    st?: [EstadBajable, string]
    prio?: number
}
export interface MovimientoActivo extends Movimiento {
    cur: number
}

export type EstadBase = [number, number, number, number, number, number]
export interface Especie {
    n: string
    t: Tipo[]
    b: EstadBase
    m: [string, string, string, string]
}

export interface Estadisticas { hp: number; a: number; d: number; x: number; y: number; s: number }
export interface Etapas { a: number; d: number; x: number; y: number }

export interface Pokemon {
    id: number
    n: string
    t: Tipo[]
    st: Estadisticas
    hp: number
    et: Etapas
    mov: MovimientoActivo[]
    lado: Lado
}

export type Accion = { k: 'm'; m: MovimientoActivo } | { k: 'i' }

export interface ItemMenu<V> {
    titulo: string
    ventana: number
    tipo?: Tipo
    pp?: [number, number]
    v: V
    off?: boolean
}

export interface Interfaz {
    decir(texto: string, espera?: number): Promise<void>
    fijarMensaje(texto: string): void
    elegir<V>(items: ItemMenu<V>[]): Promise<V>
    pintarVida(m: Pokemon, valorPS: number): void
}
