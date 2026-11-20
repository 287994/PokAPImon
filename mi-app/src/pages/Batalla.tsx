import { useEffect, useState } from 'react'
import '../batalla/batalla.css'
import { useAjuste } from '../batalla/ajuste'
import { NIVEL } from '../batalla/calculo'
import { ENTRENADOR_1, ENTRENADOR_2, EXP_ALIADO, POKEMON_ALIADO, POKEMON_RIVAL } from '../batalla/config'
import { TIPO_FILA, especieDe } from '../batalla/datos'
import { IMG, cargarFuente } from '../batalla/recursos'
import type { ItemMenu, Tipo } from '../batalla/tipos'
import { useCombate } from '../batalla/useCombate'

const GLIFOS = '0123456789/' /* Esto es para renderizar los números señalados y que se puedan renderizar. Y pq tengo los números en sprite también ps.*/
const ANCHO_EXP = 85 /* Ancho en px de la barra de EXP jugador. El combate no usa experiencia asi que queda meramente decorativa, pq si no me daba toc. */
const nombreDe = (id: number) => especieDe(id).n /* Nombre de la especie de Poke, si no les gusta decirles especie reclamen a la profeco ps.*/
const claseBarra = (q: number) => (q < .2 ? ' l' : q < .5 ? ' m' : ' h') /* Clase de la barra de vida: l = low abajo del 20%, m = medium abajo del 50%, h = high ps completa.*/

/* Aquí usamos los glifos para renderizar los números, pq si no se veían feos y pixelados. */
function Numeros({ texto }: { texto: string }) { /* LLega el texto*/
    return (
        <span className="numeros">
            {[...texto].filter(c => GLIFOS.includes(c)).map((c, i) => ( /* Filtramos los caracteres que no son glifos.*/
                <i key={i} style={{ backgroundPositionX: `calc(${-GLIFOS.indexOf(c) * 8} * var(--u))` }} /> /*Renderizamos cada Glifo mediante un <i> que funciona como sprite, y le damos la posición de fondo según el índice del glifo en la cadena GLIFOS.*/
            ))}
        </span>
        /* Explicamos paso a paso:

            1. [...texto]: Separa el texto en letras o símbolos sueltos: ['2', '5', '/', '4', '0'].
            2. .filter(c => GLIFOS.includes(c)): Deja pasar solo lo que esté en GLIFOS ('0123456789/') y borra cualquier cosa que no esté ahí.
            3. .map((c, i) => ...): Por cada símbolo que quedó, crea una cajita visual (<i>) con su número de turno (i, que sirve para que React no se confunda al dibujar la lista).
            4. GLIFOS.indexOf(c): Busca en qué posición está el símbolo dentro de '0123456789/'.
            5. calc(${-GLIFOS.indexOf(c) * 8} * var(--u)): Multiplica esa posición por 8 y por la medida base de la pantalla (--u), con signo negativo para empujar la imagen de fondo hacia la izquierda y mostrar el dibujo exacto. (Un sprite es una sola imagen grande que junta varios dibujos pequeños).
        */
    )
}

/* Renderiza el tipo elemental.*/
function ChipTipo({ tipo }: { tipo: Tipo }) { /* Recibe el nombre del tipo.*/
    return <i className="tipo" style={{ backgroundPositionY: `calc(${-TIPO_FILA[tipo] * 14} * var(--u))` }} /> 
    /* La imagen de los tipos es un sprite
       y cada mini icono tiene 14px de alto
       se multiplica por la fila del tipo en negativo para que se mueva hacia arriba
       y por 14 px para mueva la cantidad exacta de pixeles que mide cada icono
       el resultado se multiplica por var(--u) que es la medida base de la pantalla
       para que se adapte a cualquier pantalla sin perder calidad. 

       Y todo se maneja en Y pq el sprite de tipos es vertical, no horizontal.
    */ 
}

/* Renderiza un texto ajustado a la pantalla, es que antes se cortaba en laptop y no en telefono e hice ajustes a estas dos funciones.
   Es para textos fijos que aparecen completos de golpe, como el nombre del Pokémon o el texto de un botón.*/
function Ajustado({ texto, className }: { texto: string; className?: string }) { /* Recibe el texto y la clase CSS opcional. La css por si me late personalizarlo*/
    const ref = useAjuste<HTMLSpanElement>(texto) /* useAjuste es un hook (En react es algo que me permite guardar algo que va a cambiar ps) que ajusta el tamaño del texto para que quepa en la pantalla. Recibe el texto y devuelve una referencia a un elemento HTML (en este caso un <span>) que se ajustará automáticamente al tamaño de la pantalla. */
    return <span ref={ref} className={className}>{texto}</span> /* Retorna un <span> con la referencia y la clase opcional, y dentro va el texto que se quiere mostrar. */
}

/* Renderiza un mensaje de texto que se va mostrando poco a poco, como en los juegos de Pokémon. 
   Es para el diálogo de la batalla que se va escribiendo letra por letra.*/
function Mensaje({ completo, visible }: { completo: string; visible: string }) { /* Recibe el mensaje completo y el mensaje visible actual*/
    const ref = useAjuste<HTMLDivElement>(completo) /* useAjuste ajusta el tamaño del texto para que quepa en la pantalla. Recibe el mensaje completo y devuelve una referencia a un elemento HTML (en este caso un <div>) que se quedra divis automáticamente al tamaño de la pantalla. */
    return <div ref={ref} className="texto">{visible}<span className="oculto">{completo.slice(visible.length)}</span></div> /* Retorna un <div> que es el mensaje que se va mostrando poquito a poquito suave sueva... es para hacer el efecto letra por letra ps.*/
} /* En useCombate y en el css veremos como se logra este efectp.*/

/* Renderiza el nivel del Poketomoster. */
function Nivel() {
    return <span className="nivel"><i className="etNv" /><Numeros texto={String(NIVEL)} /></span> /* Retorna un <span> que es el nivel del Poketomon, con un icono de nivel y los numeros del nivel. */
}

/* Trae las propiedades que se usaran en la batalla, como los nombres de los entrenadores. */
export interface PropsBatalla {
    /* UserName del jugador.*/
    entrenador1?: string /* Si no se pasa el nombre del jugador, se usa el nombre por defecto ENTRENADOR1 lo mismo con el otro. */
    /* UserName del rival.*/
    entrenador2?: string
}

/* Ya lo mero chido la batalla, esta maiz renderiza toda la batalla.*/
export default function Batalla({ entrenador1 = ENTRENADOR_1, entrenador2 = ENTRENADOR_2 }: PropsBatalla) { /* Recibe los nombres de los entrenadores, si no se pasan se usan los nombres por defecto ENTRENADOR1 y ENTRENADOR2. */
    const jugadores = { p: entrenador1.trim() || ENTRENADOR_1, e: entrenador2.trim() || ENTRENADOR_2 } /* Crea un objeto con los nombres de los jugadores, quitando los espacios al inicio y al final, si quedan vacios se usan los nombres por defecto. */
    const c = useCombate(jugadores) /* Le pasas los nombres de los jugadores y te devuelve un paquete (c) con todo lo necesario para la pelea: la vida actual, los mensajes que van saliendo, las opciones del menú y las acciones para atacar o avanzar.*/
    const r = c.refs /* Trae las referencias (en assets) a los elementos HTML que se van a usar en la batalla, como los sprites de los Pokémon, los HUDs (información fija que ves encima de la pantalla del juego) y el panel de mensajes. */
    const [sobre, setSobre] = useState<ItemMenu<unknown> | null>(null) /* Crea un estado (sobre) que guarda el boton del menu sobre el cual esta el mouse, para mostrar la información del movimiento o ataque que se va a usar. Si no hay ninguno, es null. */

    useEffect(() => { void cargarFuente() }, []) /* Carga la fuente al iniciar la pantalla (los corchetes vacios hacen que solo pase una vez). */

    /* Retorna el JSX (código HTML con lógica de React) que dibuja la batalla en pantalla.*/
    return (
        <div className="batalla"> {/* Contenedor principal de la batalla. */}
            <div id="contenedor"> {/* Contenedor de la escena y el panel de mensajes. */}
                <div id="fondoEscena" ref={r.escena}> {/* Contenedor del fondo de la escena, que tiene varias capas (cielo, plataformas y Pokémon:3). */}
                    <div className="capa" id="fondoCielo" style={{ backgroundImage: `url(${IMG.fondoCielo})` }} /> {/* Capa del cielo, que se mueve más lento que las plataformas y los Pokémon para dar sensación de profundidad. */}
                    <div className="capa" id="plataformaRival" style={{ backgroundImage: `url(${IMG.plataformaRival})` }} /> {/* Capa de la plataforma del rival, que se mueve más rápido que el cielo pero más lento que los Pokémon para dar sensación de profundidad. */}
                    
                    
                    <div className="capa" id="plataformaJugador" style={{ backgroundImage: `url(${IMG.plataformaJugador})` }} /> {/* Capa de la plataforma del jugador, que se mueve más rápido que el cielo pero más lento que los Pokémon para dar sensación de profundidad. */}

                    <div className="pos" id="posRival" ref={r.posRival}><img id="pokemonRival" ref={r.sprRival} alt={nombreDe(POKEMON_RIVAL)} /></div> {/* Contenedor del Pokémon rival, que tiene un <img> con el sprite del Pokémon y un alt con el nombre de la especie. */}
                    <div className="pos" id="posJugador" ref={r.posJugador}><img id="pokemonJugador" ref={r.sprJugador} alt={nombreDe(POKEMON_ALIADO)} /></div> {/* Contenedor del Pokémon aliado, que tiene un <img> con el sprite del Pokémon y un alt con el nombre de la especie. */}
                
                    <div className="hud" id="hudRival" ref={r.hudRival}> {/* Contenedor del HUD (interfaz de usuario) del rival, que tiene el nombre del Pokémon, el nivel y la barra de vida. */}
                        <Ajustado className="nombre" texto={nombreDe(POKEMON_RIVAL)} /> {/* Muestra el nombre del Pokémon rival, ajustado al tamaño de la pantalla. */}
                        <Nivel /> {/* Muestra el nivel del Pokémon rival, con un icono y los números del nivel. */}
                        <i className="etiquetaPS" /> {/* Muestra la etiqueta de PS (puntos de salud) del Pokémon rival, que es un icono fijo. */}
                        <i className={'vida' + claseBarra(c.vida.e)} style={{ width: `calc(${c.vida.e * 48} * var(--u))` }} /> {/* Muestra la barra de vida del Pokémon rival, que cambia de color según el porcentaje de vida y se ajusta al tamaño de la pantalla. */}
                        {/* la logica tras la barra de vida es que c.vida.e es un numero entre 0 y 1 que representa el porcentaje de vida del rival, y se multiplica por 48 (el ancho en px de la barra) y por var(--u) (la medida base de la pantalla) para que se ajuste a cualquier pantalla sin perder calidad. */}
                    
                    </div>

                    <div className="hud" id="hudJugador" ref={r.hudJugador}> {/* Contenedor del HUD (interfaz de usuario) del jugador, que tiene el nombre del Pokémon, el nivel, la barra de vida y la barra de experiencia. */}
                        <Ajustado className="nombre" texto={nombreDe(POKEMON_ALIADO)} /> {/* Muestra el nombre del Pokémon aliado, ajustado al tamaño de la pantalla. */}
                        <Nivel /> {/* Muestra el nivel del Pokémon aliado, con un icono y los números del nivel. */}
                        <i className="etiquetaPS" /> {/* Muestra la etiqueta de PS (puntos de salud) del Pokémon aliado, que es un icono fijo. */}
                        <i className={'vida' + claseBarra(c.vida.p)} style={{ width: `calc(${c.vida.p * 48} * var(--u))` }} /> {/* Muestra la barra de vida del Pokémon aliado, que cambia de color según el porcentaje de vida y se ajusta al tamaño de la pantalla. */}
                        <Numeros texto={c.psTexto} /> {/* Muestra los números de PS del Pokémon aliado, que se actualizan según la vida actual y la vida máxima. */}
                        <span className="exp"><i style={{ width: `calc(${Math.round(EXP_ALIADO * ANCHO_EXP)} * var(--u))` }} /></span> {/* Muestra la barra de experiencia del Pokémon aliado, que es decorativa y no afecta el combate. Se ajusta al tamaño de la pantalla según la constante EXP_ALIADO y el ancho en px de la barra ANCHO_EXP. */}
                    </div>

                    <div id="efectos" ref={r.efectos} /> {/* Contenedor de los efectos visuales de la batalla, como los ataques, los cambios de estado y las animaciones. Se usa para superponer los efectos sobre la escena y los HUDs. */}

                    <div id="panel" onClick={c.saltarTexto}> {/* Contenedor del panel de mensajes y del menú de opciones, que se muestra al final de cada turno. Se puede hacer click para saltar el texto o avanzar al siguiente mensaje. */}
                        <div id="mensaje"> {/* Contenedor del mensaje de texto que se va mostrando poco a poco, como en los juegos de Pokémon. Se usa para mostrar los mensajes de ataque, cambio de estado y diálogo entre los entrenadores. */}
                            {/* Si hay un movimiento seleccionado (sobre) y tiene PP y tipo, se muestra la información del movimiento con el tipo, el icono de PP y los números de PP. Si no, se muestra el mensaje completo y el prompt de espera si corresponde. */}
                            {sobre?.pp && sobre.tipo
                                ? <span className="info"><ChipTipo tipo={sobre.tipo} /><i className="etPP" /><Numeros texto={`${sobre.pp[0]}/${sobre.pp[1]}`} /></span> /* Muestra la información del movimiento seleccionado, con el tipo, el icono de PP y los números de PP. */
                                : <>
                                    <Mensaje completo={c.mensajeCompleto} visible={c.mensaje} /> {/* Muestra el mensaje de texto completo, que se va mostrando poco a poco. */}
                                    {c.esperando && <i className="prompt" />} {/* Muestra el prompt de espera si el jugador necesita seleccionar una opción. */}
                                </>}
                        </div>
                        <div id="menu" className={c.menu.length > 4 ? 'denso' : undefined}> {/* Contenedor del menú de opciones, que se muestra al final de cada turno. Se ajusta a la cantidad de opciones disponibles. */}
                            {c.menu.map((it, i) => ( /* Mapea cada opción del menú y la renderiza como un botón. Se usa la clave i para que React no se confunda al dibujar la lista. Se deshabilita el botón si la opción está marcada como off. Se manejan los eventos de mouse y teclado para mostrar la información del movimiento seleccionado (sobre) y para elegir la opción al hacer click. */
                                <button
                                    key={i} /* Clave única para cada botón, que es el índice de la opción en el menú. */
                                    className={`btn v${it.ventana}`} /* clase css del botonito.*/
                                    disabled={!!it.off} /* Deshabilita el botón si la opción está marcada como off (no disponible), para evitar que el jugador abuse y rompa el juego ps. */
                                    onMouseEnter={() => setSobre(it)} /* Muestra la info del movimiento seleccionado.*/
                                    onMouseLeave={() => setSobre(null)} /* Oculta la info del movimiento seleccionado.*/
                                    onFocus={() => setSobre(it)}  /* Muestra la info del movimiento seleccionado al enfocar el boton con el teclado. */
                                    onBlur={() => setSobre(null)} /* Oculta la info del movimiento seleccionado al desenfocar el boton con el teclado. */
                                    onClick={() => { setSobre(null); c.elegirOpcion(it.v) }} /* Al hacer click en el botón, se oculta la info del movimiento seleccionado y se llama a la función elegirOpcion con el valor de la opción (it.v) para avanzar en el combate. */
                                >
                                    <Ajustado className="etq" texto={it.titulo} /> {/* Muestra el texto de la opción del menu. */}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Muestra la pantalla de selección de jugadores al inicio de la batalla, con los nombres de los entrenadores y un botón para comenzar el combate. Se muestra solo si c.seleccion es true. */}
                    {c.seleccion && ( 
                        <div className="cubierta" id="seleccion">
                            <div className="ventana">
                                <div className="versus">
                                    <Ajustado className="jugador" texto={jugadores.p} />
                                    <b>VS</b>
                                    <Ajustado className="jugador" texto={jugadores.e} />
                                </div>
                                <button id="comenzar" className="btn v2" onClick={() => void c.empezar()}>
                                    <Ajustado className="etq" texto="Comenzar combate" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
