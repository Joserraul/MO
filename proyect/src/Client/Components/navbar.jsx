import { useState, useEffect } from "react";

function Navbar({ onCartClick }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Actualizar contador del carrito desde localStorage
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '{}');
      const total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
      setCartCount(total);
    };

    updateCartCount();
    
    // Escuchar cambios en el carrito
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const toggleCart = () => {
    console.log('Toggle cart');
    if (onCartClick) {
      onCartClick();
    }
  };

  return (
    <nav className="Navbar">
      <div className="container header-inner">
        <h1 className="logo">Rosé Beauty</h1>
        <button className="cart-toggle" onClick={toggleCart}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" x2="21" y1="6" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span className="cart-badge" id="cart-badge">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;