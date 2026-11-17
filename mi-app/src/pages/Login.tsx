import React, { useState } from "react";

interface LoginProps {
    onAuthSuccess: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Por favor completa todos los campos.");
            return;
        }

        if (isRegistering && password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            // Aquí conectarán con su backend (ej. POST /api/auth/login o /register)
            const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
            console.log(`Enviando a ${endpoint}:`, { username, password });

            // Simulación de éxito temporal:
            onAuthSuccess(username);
        } catch (err) {
            setError("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="login-container">
            <h2>{isRegistering ? "Crear Entrenador" : "Iniciar Sesión"}</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Usuario</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ej. Red99"
                    />
                </div>

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>

                {isRegistering && (
                    <div>
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                )}

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">
                    {isRegistering ? "Registrarse" : "Entrar"}
                </button>
            </form>

            <button
                type="button"
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError("");
                }}
            >
                {isRegistering
                    ? "¿Ya tienes cuenta? Inicia sesión"
                    : "¿No tienes cuenta? Regístrate"}
            </button>
        </div>
    );
};
