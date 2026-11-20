import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
    onAuthSuccess: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('ERROR: COMPLETA TODOS LOS CAMPOS');
            return;
        }

        if (isRegistering && password !== confirmPassword) {
            setError('ERROR: LAS CONTRASEÑAS NO COINCIDEN');
            return;
        }

        onAuthSuccess(username);
    };

    return (
        <div className="login-wrapper">
            <div className="pokedex-body">
                <div className="pokedex-header">
                    <div className="camera-lens"></div>
                    <div className="led-lights">
                        <span className="led red"></span>
                        <span className="led yellow"></span>
                        <span className="led green"></span>
                    </div>
                </div>

                <div className="pokedex-screen">
                    <h2>{isRegistering ? 'NUEVO ENTRENADOR' : 'INICIAR SESIÓN'}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">ID ENTRENADOR</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ej. AshMostaza67"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">CONTRASEÑA</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        {isRegistering && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">CONFIRMAR CONTRASEÑA</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {error && <p className="error-msg">{error}</p>}

                        <button type="submit" className="btn-pokedex">
                            {isRegistering ? 'REGISTRAR DATOS' : 'INICIAR POKAPIMON'}
                        </button>
                    </form>
                </div>

                {/* Botón inferior de la carcasa */}
                <button
                    type="button"
                    className="btn-toggle"
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError('');
                    }}
                >
                    {isRegistering
                        ? 'VOLVER A INICIAR SESIÓN'
                        : 'REGISTRAR NUEVO ENTRENADOR'}
                </button>
            </div>
        </div>
    );
};