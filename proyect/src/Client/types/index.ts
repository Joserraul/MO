/**
 * Tipos de dominio compartidos por toda la aplicación.
 * Fuente única de verdad: si un campo cambia aquí, el compilador
 * señala todos los lugares afectados.
 */

export type ProductCategory = 'Rostro' | 'Labios' | 'Ojos' | 'Skincare' | 'Herramientas';

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  tones?: string[];
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  /** El Navbar saluda con username; el backend usa first_name/last_name. */
  username?: string;
  lastName?: string;
  phone?: string;
  age?: number;
  tone?: string;
}

export interface Session {
  token: string;
  user: User;
}

export type DeliveryMethodCode = 'ENVIO' | 'TIENDA';
export type PaymentMethodCode = 'PAGOMOVIL' | 'TRANSFERENCIA';

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  clientName?: string;
  clientPhone?: string;
  deliveryMethod: string;
  paymentMethod: string;
  paymentDate?: string;
  orderDate?: string;
  transferNumber?: string;
  items: OrderItem[];
  total?: number;
}

/** Producto con la cantidad que el usuario agrego al carrito. */
export interface CartItem extends Product {
  quantity: number;
}

/** El carrito se guarda en localStorage como un mapa id -> cantidad. */
export type CartMap = Record<string, number>;
