import productImage from "../assets/1.jpeg";

/**
 * MODO DEMOSTRACIÓN — datos simulados.
 * Este módulo NO participa del funcionamiento real: solo se activa
 * cuando el backend no responde (p. ej. en GitHub Pages) para que
 * cualquier visitante pueda explorar la app completa.
 */

export const DEMO_TOKEN = "demo-token-no-valido-en-backend";

export const DEMO_USER = {
  id: 9001,
  username: "Demo Admin",
  lastName: "Makeup Oriente",
  phone: "0412-000-0000",
  email: "demo@makeuporiente.com",
  role: "ADMIN",
};

export const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Solución de Vitamina C",
    brand: "The Ordinary",
    price: 9.99,
    description:
      "Serum antioxidante con vitamina C al 8% + ácido hialurónico, para iluminar y uniformar el tono.",
    category: "Rostro",
    image: productImage,
    stock: 15,
  },
  {
    id: 2,
    name: "Hidratante Glow",
    brand: "The Ordinary",
    price: 11.99,
    description:
      "Crema hidratante de acabado luminoso, ligera y sin grasa. Ideal para pieles mixtas.",
    category: "Rostro",
    image: productImage,
    stock: 8,
  },
  {
    id: 3,
    name: "Tinte Labial Mate",
    brand: "Rosé Studio",
    price: 24.5,
    description: "Tinte labial aterciopelado de larga duración con acabado mate suave.",
    category: "Labios",
    image: productImage,
    stock: 20,
  },
  {
    id: 4,
    name: "Paleta de Ojos",
    brand: "Eyes Co",
    price: 18.0,
    description: "Paleta con 12 tonos neutros, pigmentación intensa y fácil difuminado.",
    category: "Ojos",
    image: productImage,
    stock: 5,
  },
];

// Pedidos falsos con la MISMA forma que devuelve GET /api/orders (OrderSummary)
export const DEMO_ORDERS = [
  {
    id: 101,
    clientName: "Demo Admin Makeup Oriente",
    clientPhone: "0412-000-0000",
    orderDate: "2026-09-20T10:30:00",
    paymentDate: "2026-09-20",
    paymentMethod: "PAGOMOVIL",
    deliveryMethod: "ENVIO",
    transferNumber: "DEMO-101",
    items: [
      { productId: 1, productName: "Solución de Vitamina C", price: 9.99, quantity: 2 },
      { productId: 3, productName: "Tinte Labial Mate", price: 24.5, quantity: 1 },
    ],
  },
  {
    id: 102,
    clientName: "Demo Admin Makeup Oriente",
    clientPhone: "0424-111-2222",
    orderDate: "2026-09-18T15:05:00",
    paymentDate: "2026-09-18",
    paymentMethod: "TRANSFERENCIA",
    deliveryMethod: "TIENDA",
    transferNumber: "DEMO-102",
    items: [
      { productId: 4, productName: "Paleta de Ojos", price: 18.0, quantity: 1 },
    ],
  },
];