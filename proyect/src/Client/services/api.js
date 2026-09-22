const API_HOST = `http://${window.location.hostname}:8080`;
const API_URL = `${API_HOST}/api`;
const TOKEN_KEY = "token";

export { API_HOST };

// Modo demostración (GitHub Pages, sin backend): datos simulados aislados.
// Ver src/Client/demo/demo.js — en local con backend esto no se activa.
import {
  isDemo,
  DEMO_PRODUCTS,
  DEMO_USER,
  DEMO_TOKEN,
  getDemoOrders,
} from "../demo/demo.js";

// ---------- Sesión / token JWT ----------

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Guarda el token y el usuario tras un login exitoso.
 * El token es la "credencial" que el backend valida en cada petición.
 */
export function saveSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem("user", JSON.stringify(user));
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");
}

/**
 * Headers con el token: "Authorization: Bearer <token>".
 * Este header es lo que el backend usa para saber quién eres.
 */
function authHeaders(extra = {}) {
    const token = getToken();
    return token
        ? { ...extra, Authorization: `Bearer ${token}` }
        : extra;
}

// ---------- Autenticación ----------

export async function registerUser(userData) {
    if (isDemo()) return DEMO_USER;
    const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("No se pudo registrar (¿email ya existe?)");
    return res.json();
}

export async function loginUser(email, password) {
    if (isDemo()) return { token: DEMO_TOKEN, user: DEMO_USER };
    const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Credenciales incorrectas");
    return res.json();
}

// ---------- Productos (el catálogo es público) ----------

export async function fetchProducts() {
    if (isDemo()) return DEMO_PRODUCTS;
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error("Error al cargar productos");
    return res.json();
}

// Crear producto: solo ADMIN (requiere token)
export async function createProduct(product) {
    if (isDemo()) return { ...product, id: Date.now() };
    const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("No se pudo crear el producto (¿sin permisos?)");
    return res.json();
}

// Actualizar producto (stock): solo ADMIN (requiere token)
export async function updateProduct(product) {
    if (isDemo()) return product;
    const res = await fetch(`${API_URL}/products/${product.id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el producto (¿sin permisos?)");
    return res.json();
}

// Pedidos de TODOS los usuarios: solo ADMIN (requiere token)
export async function fetchOrders() {
    if (isDemo()) return getDemoOrders();
    const res = await fetch(`${API_URL}/orders`, {
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Error al cargar pedidos (¿sin permisos?)");
    return res.json();
}

// Tasa oficial del BCV (a través de DolarAPI, se actualiza a diario).
// Se guarda en localStorage para no consultarla en cada render.
const BCV_CACHE_KEY = "bcvRate";
const BCV_CACHE_MS = 6 * 60 * 60 * 1000; // 6 horas

export async function fetchBcvRate() {
    const cached = localStorage.getItem(BCV_CACHE_KEY);
    if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < BCV_CACHE_MS) {
            return data.promedio;
        }
    }

    const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
    if (!res.ok) throw new Error("No se pudo obtener la tasa BCV");

    const data = await res.json();
    localStorage.setItem(
        BCV_CACHE_KEY,
        JSON.stringify({ promedio: data.promedio, timestamp: Date.now() })
    );
    return data.promedio;
}