export interface EquipoGuardado {
    idEquipo: number;
    Pk1: string;
    Pk2: string;
    Pk3: string;
    Pk4: string;
    Pk5: string;
    Pk6: string;
    idUser: string;
}

export type PayloadEquipo = Omit<EquipoGuardado, 'idEquipo'>;

const API_URL = 'http://localhost:3000/api/equipos'; // Ajusta el puerto/ruta de tu backend
const STORAGE_KEY = 'pokapimon_equipos_local';

function leerLocal(idUser: string): EquipoGuardado[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const todos: EquipoGuardado[] = raw ? JSON.parse(raw) : [];
        return todos.filter((e) => e.idUser === idUser);
    } catch {
        return [];
    }
}

function guardarLocal(todos: EquipoGuardado[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export async function obtenerEquiposUsuario(idUser: string): Promise<EquipoGuardado[]> {
    try {
        const res = await fetch(`${API_URL}/${encodeURIComponent(idUser)}`);
        if (!res.ok) throw new Error('Backend no disponible');
        return await res.json();
    } catch {
        return leerLocal(idUser);
    }
}

export async function crearEquipo(payload: PayloadEquipo): Promise<EquipoGuardado> {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error al crear equipo');
        return await res.json();
    } catch {
        const raw = localStorage.getItem(STORAGE_KEY);
        const todos: EquipoGuardado[] = raw ? JSON.parse(raw) : [];
        const nuevo: EquipoGuardado = { ...payload, idEquipo: Date.now() };
        guardarLocal([...todos, nuevo]);
        return nuevo;
    }
}

export async function actualizarEquipo(idEquipo: number, payload: PayloadEquipo): Promise<EquipoGuardado> {
    try {
        const res = await fetch(`${API_URL}/${idEquipo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error al actualizar equipo');
        return await res.json();
    } catch {
        const raw = localStorage.getItem(STORAGE_KEY);
        const todos: EquipoGuardado[] = raw ? JSON.parse(raw) : [];
        const actualizado: EquipoGuardado = { ...payload, idEquipo };
        guardarLocal(todos.map((e) => (e.idEquipo === idEquipo ? actualizado : e)));
        return actualizado;
    }
}

export async function eliminarEquipo(idEquipo: number): Promise<void> {
    try {
        const res = await fetch(`${API_URL}/${idEquipo}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar equipo');
    } catch {
        const raw = localStorage.getItem(STORAGE_KEY);
        const todos: EquipoGuardado[] = raw ? JSON.parse(raw) : [];
        guardarLocal(todos.filter((e) => e.idEquipo !== idEquipo));
    }
}