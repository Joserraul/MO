import { useState, useEffect } from "react";
import Cart from "../pages/Cart.jsx";
import { fetchProducts } from "../services/api.js";

/**
 * Drawer del carrito para las páginas que no tienen uno propio
 * (admin, perfil, checkout, login). Se abre con el evento `open-cart`
 * que dispara el Navbar, sin navegar al home.
 */
function CartDrawerHost() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [, setCartVersion] = useState(0); // solo para re-render al cambiar el carrito

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
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const changeQty = (id, delta) => {
    const product = products.find((p) => String(p.id) === String(id));
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
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

  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
  const cartList = Object.keys(cart)
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
