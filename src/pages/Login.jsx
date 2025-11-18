// Esto es provisional Gero, no podía probar mi front si no tenía el token de autenticación

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const API_URL = "https://inmobiliarymgmt-production.up.railway.app/api/Auth/login";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                throw new Error("Credenciales incorrectas");
            }

            const data = await res.json();

            // ❤ DEBUG: ver exactamente qué devuelve el backend
            console.log("LOGIN RESPONSE:", data);

            // Ajustar aquí cuando veamos qué propiedad contiene el token real
            const token = data.token || data.accessToken || data.result || data.authToken || null;

            if (!token) {
                throw new Error("El backend no devolvió un token válido");
            }

            localStorage.setItem("token", token);
            navigate("/properties");

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
