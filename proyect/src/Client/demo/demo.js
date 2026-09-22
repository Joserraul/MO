import {
  DEMO_TOKEN,
  DEMO_USER,
  DEMO_PRODUCTS,
  DEMO_ORDERS,
} from "./demoData.js";

/**
 * MODO DEMOSTRACIÓN — lógica aislada del desarrollo real.
 * Se activa SOLO cuando el backend no responde. En local (con el backend
 * corriendo) todo sigue funcionando exactamente igual que siempre.
 */

export { DEMO_TOKEN, DEMO_USER, DEMO_PRODUCTS };

const DEMO_KEY = "demo-mode";
const ORDERS_KEY = "demo-orders";

export function isDemo() {
  return localStorage.getItem(DEMO_KEY) === "1";
}

/**
 * Comprueba si el backend está disponible. Si NO lo está, activa el modo demo.
 * Se llama una sola vez al arrancar la app.
 */
export async function detectBackend() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`http://${window.location.hostname}:8080/api/products`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      localStorage.setItem(DEMO_KEY, "0");
      return false;
    }
  } catch {
    /* sin backend */
  }
  localStorage.setItem(DEMO_KEY, "1");
  return true;
}

/** En modo demo garantiza una sesión admin ya iniciada */
export function ensureDemoSession() {
  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", DEMO_TOKEN);
    localStorage.setItem("user", JSON.stringify(DEMO_USER));
  }
}

/** Botón de /login: entra como el usuario demo (admin) */
export function demoLogin() {
  localStorage.setItem("token", DEMO_TOKEN);
  localStorage.setItem("user", JSON.stringify(DEMO_USER));
}

/** Pedidos demo: los de ejemplo + los creados en la sesión (se guardan local) */
export function getDemoOrders() {
  try {
    const extra = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    return [...DEMO_ORDERS, ...extra];
  } catch {
    return DEMO_ORDERS;
  }
}

/** Simula la creación de un pedido guardándolo en el navegador (sin backend) */
export function pushDemoOrder({ deliveryMethod, paymentMethod, paymentDate, transferNumber, items }) {
  const extra = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  const order = {
    id: 1000 + extra.length + 1,
    clientName: `${DEMO_USER.username} ${DEMO_USER.lastName}`,
    clientPhone: DEMO_USER.phone,
    orderDate: new Date().toISOString(),
    paymentDate,
    paymentMethod,
    deliveryMethod,
    transferNumber,
    items,
  };
  extra.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(extra));
  return order;
}