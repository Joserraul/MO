import { useState, useEffect, useRef } from "react";
import Cart from "../pages/Cart.jsx";
import { fetchProducts } from "../services/api.js";
import { lockScroll, unlockScroll } from "../utils/scrollLock.js";
import type { Product } from "../types/index.js";

/** Carrito persistido en localStorage: id → cantidad */
type StoredCart = Record<string, number>;

/** Producto del catálogo enriquecido con la cantidad agregada */
type CartLine = Product & { quantity: number };

const readCart = (): StoredCart =>
  JSON.parse(localStorage.getItem("cart") || "{}") as StoredCart;

/**
 * Drawer del carrito para las páginas que no tienen uno propio
 * (admin, perfil, checkout, login). Se abre con el evento `open-cart`
 * que dispara el Navbar, sin navegar al home.
 */
function CartDrawerHost() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [, setCartVersion] = useState(0); // solo para re-render al cambiar el carrito
  const lockedRef = useRef(false);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {});

    const open = () => setIsOpen(true);
    const bump = () => setCartVersion((v) => v + 1);
    window.addEventListener("open-cart", open);
    window.addEventListener("cartUpdated", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("open-cart", open);
      window.removeEventListener("cartUpdated", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  useEffect(() => {
    if (isOpen && !lockedRef.current) {
      lockScroll();
      lockedRef.current = true;
    } else if (!isOpen && lockedRef.current) {
      unlockScroll();
      lockedRef.current = false;
    }
  }, [isOpen]);

  // Si se navega con el drawer abierto, liberar el bloqueo
  useEffect(() => () => {
    if (lockedRef.current) {
      unlockScroll();
      lockedRef.current = false;
    }
  }, []);

  const changeQty = (id: string | number, delta: number) => {
    const product = products.find((p) => String(p.id) === String(id));
    if (!product) return;
    const cart = readCart();
    const newQty = (cart[id] || 0) + delta;
    if (newQty > product.stock) return;
    if (newQty > 0) {
      cart[id] = newQty;
    } else {
      delete cart[id];
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setCartVersion((v) => v + 1);
  };

  const cart = readCart();
  const cartList: CartLine[] = Object.keys(cart)
    .filter((id) => cart[id] > 0)
    .map((id) => {
      const product = products.find((p) => String(p.id) === String(id));
      return product ? { ...product, quantity: cart[id] } : null;
    })
    .filter((p) => p !== null);

  return (
    <Cart
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      cartItems={cartList}
      onChangeQty={changeQty}
    />
  );
}

export default CartDrawerHost;
