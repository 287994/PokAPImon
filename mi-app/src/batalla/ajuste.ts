import { useEffect, useLayoutEffect, useRef } from 'react'

export const EVENTO_FUENTE = 'pokefuente'

export function ajustarTexto(el: HTMLElement | null, minimo = 0.5) {
    if (!el) return
    let k = 1
    el.style.setProperty('--k', '1')
    const sobra = () => el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1
    while (k > minimo && sobra()) {
        k = Math.round((k - 0.04) * 100) / 100
        el.style.setProperty('--k', String(k))
    }
}

export function useAjuste<T extends HTMLElement>(dep: unknown) {
    const ref = useRef<T>(null)
    useLayoutEffect(() => { ajustarTexto(ref.current) }, [dep])
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const rehacer = () => ajustarTexto(el)
        const ro = new ResizeObserver(rehacer)
        ro.observe(el)
        const fuentes = document.fonts
        void fuentes?.ready.then(rehacer)
        fuentes?.addEventListener('loadingdone', rehacer)
        window.addEventListener(EVENTO_FUENTE, rehacer)
        return () => {
            ro.disconnect()
            fuentes?.removeEventListener('loadingdone', rehacer)
            window.removeEventListener(EVENTO_FUENTE, rehacer)
        }
    }, [])
    return ref
}
