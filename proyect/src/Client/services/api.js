const API_URL = "http://localhost:8080/api";

export async function registerUser(userData) {
    const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("No se pudo registrar (¿email ya existe?)");
    return res.json();
}

export async function loginUser(email, password) {
    const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Credenciales incorrectas");
    return res.json();
}