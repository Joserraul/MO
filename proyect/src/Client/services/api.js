const API_HOST = `http://${window.location.hostname}:8080`;
const API_URL = `${API_HOST}/api`;

export { API_HOST };

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

export async function fetchProducts() {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error("Error al cargar productos");
    return res.json();
}

export async function createProduct(product) {
    const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("No se pudo crear el producto");
    return res.json();
}

export async function updateProduct(product) {
    const res = await fetch(`${API_URL}/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el producto");
    return res.json();
}

export async function fetchOrders() {
    const res = await fetch(`${API_URL}/orders`);
    if (!res.ok) throw new Error("Error al cargar pedidos");
    return res.json();
}