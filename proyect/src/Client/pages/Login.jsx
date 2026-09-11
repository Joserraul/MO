import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api.js";

function Login() {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [form, setForm] = useState({
        username: "", lastName: "", phone: "", email: "", password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            let user;
            if (mode === "register") {
                await registerUser(form);
                user = await loginUser(form.email, form.password); // auto-login
            } else {
                user = await loginUser(form.email, form.password);
            }
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h1>Makeup Oriente</h1>
            <h2>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>

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

            <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "¿No tienes cuenta? Regístrate" : "Ya tengo cuenta, entrar"}
            </button>
        </div>
    );
}

export default Login;