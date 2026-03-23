import Navbar from "../Components/navbar.jsx"; // Asegúrate de que la ruta sea correcta
import Cart from "./cart.jsx"; // Asegúrate de que la ruta sea correcta
import { useState } from "react";
import { debug } from "../utils/debug.js"; // Importa tu utilidad de debug

function Home() {
  const [cartItems, setCartItems] = useState({}); // { '1': 2, '3': 1 }
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado para abrir/cerrar carrito

  const products = [
    { id: '1', name: 'Velvet Lip Tint', brand: 'Rosé Studio', price: 24.50, category: 'Labios' },
    { id: '2', name: 'Luminous Skin Serum', brand: 'Glow Lab', price: 38.00, category: 'Rostro' },
    { id: '3', name: 'Silk Foundation', brand: 'Rosé Studio', price: 42.00, category: 'Rostro' },
    { id: '4', name: 'Brow Sculptor', brand: 'Arch Atelier', price: 18.00, category: 'Cejas' },
    { id: '5', name: 'Cloud Blush', brand: 'Petal Beauty', price: 28.00, category: 'Mejillas' },
    { id: '6', name: 'Midnight Mascara', brand: 'Lash Co.', price: 22.00, category: 'Ojos' },
    { id: '7', name: 'Palette Terre', brand: 'Rosé Studio', price: 45.00, category: 'Ojos' },
    { id: '8', name: 'Dewy Setting Spray', brand: 'Glow Lab', price: 19.50, category: 'Rostro' }
  ];

  // En home.jsx
const changeQty = (id, delta) => {
  debug.info('Home', 'Changing quantity', { productId: id, delta });
  
  setCartItems(prev => {
    const newQty = (prev[id] || 0) + delta;
    debug.info('Home', 'New quantity calculated', { productId: id, newQty });
    return newQty > 0 ? { ...prev, [id]: newQty } : Object.fromEntries(Object.entries(prev).filter(([key]) => key !== id));
  });
};

  // Función para transformar el objeto cartItems en una lista de objetos de productos reales
  const getCartList = () => {
    return Object.keys(cartItems)
      .filter(id => cartItems[id] > 0)
      .map(id => {
        const product = products.find(p => p.id === id);
        return { ...product, quantity: cartItems[id] };
      });
  };

  const filteredProducts = selectedCategory === 'Todos' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <>
      {/* Pasamos la función para abrir el carrito al Navbar si tienes un icono ahí */}
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      {/* Componente Carrito */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={getCartList()} 
      />

      {/* Botón temporal de prueba */}
      <button 
        onClick={() => setIsCartOpen(true)} 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 1001,
          padding: '10px 20px',
          background: '#d63384',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        PROBAR CARRITO
      </button>

      <main className="container main">
        <div className="hero">
          <h2 className="hero-title">Belleza que habla por ti</h2>
          <p className="hero-sub">Descubre nuestra colección curada de productos de maquillaje premium.</p>
        </div>

        {/* ... (Tus botones de categorías se mantienen igual) ... */}
        <div className="categories">
          {['Todos', 'Labios', 'Rostro', 'Ojos', 'Cejas', 'Mejillas'].map(cat => (
            <button 
              key={cat}
              className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`} 
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-img-wrap">
                <img src={`/src/Client/assets/${product.id}.jpeg`} alt={product.name} />
              </div>
              <div className="product-info">
                <p className="product-brand">{product.brand}</p>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
              <div className="product-actions">
                {cartItems[product.id] > 0 ? (
                  <div className="qty-controls flex">
                    <button onClick={() => changeQty(product.id, -1)} className="qty-btn">−</button>
                    <span className="qty-num">{cartItems[product.id]}</span>
                    <button onClick={() => changeQty(product.id, 1)} className="qty-btn">+</button>
                  </div>
                ) : (
                  <button className="add-btn" onClick={() => changeQty(product.id, 1)}>
                    + Agregar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Home;