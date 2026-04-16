import { useState, useEffect } from "react";
import '../Style/Header.css'; // Asegúrate de que este archivo tenga el position: fixed

function Navbar({ onCartClick }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Función para actualizar contador del carrito
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '{}');
      // Si el carrito es un objeto de IDs y cantidades:
      const total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
      setCartCount(total);
    };

    updateCartCount();
    
    // Escuchar cambios personalizados en el carrito
    window.addEventListener('cartUpdated', updateCartCount);
    // También escuchamos cambios directos en localStorage (útil entre pestañas)
    window.addEventListener('storage', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const handleToggleCart = (e) => {
    e.preventDefault(); // Evita comportamientos extraños si estuviera en un form
    console.log('📦 Abriendo carrito...');
    if (onCartClick) {
      onCartClick();
    }
  };

  return (
    /* La clase "Navbar" debe tener position: fixed en Header.css */
    <nav className="Navbar">
      <div className="header-inner">
        <h1 className="logo">Makeup Oriente</h1>
        
        <div className="header-actions">
          <button 
            className="cart-toggle" 
            onClick={handleToggleCart}
            aria-label="Ver carrito"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" x2="21" y1="6" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="cart-badge" id="cart-badge">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;