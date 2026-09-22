import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/header.css'; // Asegúrate de que este archivo tenga el position: fixed
import { isDemo } from "../demo/demo.js";

function Navbar({ onCartClick }) {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const navigate = useNavigate();

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
    } else {
      // En páginas sin drawer de carrito, el icono lleva al inicio
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      {isDemo() && (
        <div style={{
          background: "#111", color: "#f5e6ee", textAlign: "center",
          padding: "6px 10px", fontSize: "12px", letterSpacing: "0.3px",
        }}>
          Modo demostración: datos y sesión (admin) simulados para explorar la app
        </div>
      )}
      {/* La clase "Navbar" debe tener position: fixed en Header.css */}
      <nav className="Navbar">
        <div className="header-inner">
          <Link to="/" className="logo-link">
            <h1 className="logo">Makeup Oriente</h1>
          </Link>
          
          <div className="header-actions">
            {user ? (
              <>
                {user.role?.toLowerCase() === "admin" && (
                  <Link to="/admin" className="nav-link">Admin</Link>
                )}
                <Link to="/profile" className="nav-link">
                  Hola, {user.username}
                </Link>
                <button className="nav-link nav-logout" onClick={handleLogout}>
                  Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link">
                Iniciar sesión
              </Link>
            )}

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
    </>
  );
}

export default Navbar;