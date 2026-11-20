export const dormir = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
