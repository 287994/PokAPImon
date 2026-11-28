import React, { useEffect, useState } from 'react';
import { cargarSpritePokemon } from '../batalla/recursos';
import { especieDe } from '../batalla/datos';

interface SpritePokemonProps {
    id: number;
    size?: number;
}

export const SpritePokemon: React.FC<SpritePokemonProps> = ({ id, size = 72 }) => {
    const [src, setSrc] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let activo = true;
        setSrc(null);
        setError(false);

        cargarSpritePokemon(id, 'frente')
            .then((anim) => {
                if (activo && anim.frames.length > 0) {
                    setSrc(anim.frames[0]);
                }
            })
            .catch(() => {
                if (activo) setError(true);
            });

        return () => {
            activo = false;
        };
    }, [id]);

    const nombre = especieDe(id).n;

    if (error) {
        return (
            <div
                style={{
                    width: size,
                    height: size,
                    display: 'grid',
                    placeItems: 'center',
                    background: '#0f172a',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    border: '1px dashed #334155',
                }}
                title={`Sin sprite para ${nombre}`}
            >
                #{id}
            </div>
        );
    }

    if (!src) {
        return <div style={{ width: size, height: size }} />;
    }

    return (
        <img
            src={src}
            alt={nombre}
            style={{
                width: size,
                height: size,
                objectFit: 'contain',
                imageRendering: 'pixelated',
            }}
        />
    );
};