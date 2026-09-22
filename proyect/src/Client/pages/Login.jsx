import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, saveSession } from "../services/api.js";
import { isDemo, demoLogin } from "../demo/demo.js";
import '../styles/Login.css';
import Navbar from "../components/Navbar.jsx";

function Login() {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [form, setForm] = useState({
        username: "", lastName: "", phone: "", email: "", password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const demo = isDemo();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            let session;
            if (mode === "register") {
                await registerUser(form);
                session = await loginUser(form.email, form.password); // auto-login
            } else {
                session = await loginUser(form.email, form.password);
            }
            // El backend devuelve { token, user }: guardamos ambas cosas.
            // El token es lo que autoriza las peticiones protegidas.
            saveSession(session.token, session.user);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-container">
                <h1>Makeup Oriente</h1>
                <h2>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>

            {demo && (
                <div style={{
                    background: "#f7e8f0", border: "1px solid #e8a0bf",
                    borderRadius: 8, padding: "12px 14px", marginBottom: 16,
                    fontSize: 13, textAlign: "center",
                }}>
                    <p style={{ margin: "0 0 8px" }}>
                        Estás en el <strong>modo demostración</strong> (sin backend).
                        Entra con la cuenta de prueba para explorarlo todo, incluido el panel admin.
                    </p>
                    <button
                        type="button" style={{ cursor: "pointer", padding: "8px 14px" }}
                        onClick={() => { demoLogin(); navigate("/"); }}
                    >
                        Entrar como demo (admin)
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {mode === "register" && (
                    <>
                        <input name="username" placeholder="Nombre" onChange={handleChange} required />
                        <input name="lastName" placeholder="Apellido" onChange={handleChange} required />
                        <input name="phone" placeholder="Teléfono" onChange={handleChange} required />
                    </>
                )}

                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />

                {error && <p className="login-error">{error}</p>}

                <button type="submit">{mode === "login" ? "Entrar" : "Registrarme"}</button>
            </form>

            <button type="button" className="login-toggle" onClick={() => setMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "¿No tienes cuenta? Regístrate" : "Ya tengo cuenta, entrar"}
            </button>
        </div>
        </>
    );
}

export default Login;