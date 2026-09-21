import Navbar from "../components/Navbar.jsx"; // Asegúrate de que la ruta sea correcta
import Cart from "./Cart.jsx"; // Asegúrate de que la ruta sea correcta
import ProductModal from "../components/ProductModal"; // Importar el nuevo componente Modal
import { useState, useEffect } from "react";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { debug } from "../utils/debug.js"; // Importa tu utilidad de debug
import { API_HOST } from "../services/api.js";
import '../styles/Categories.css'; // Importa los estilos de Categories
import '../styles/ProductGrid.css'; // Importa los estilos de Product Grid
import '../styles/AddQty.css'; // Importa los estilos de Add / Qty
import '../styles/Modal.css'; // Importa los estilos del Modal
import '../styles/CartDrawer.css'; // Importa los estilos del Cart Drawer
import '../styles/ProductModal.css'; // Importa los estilos del ProductModal
import VideoBanner from '../components/VideoBanner.jsx'; // Importar el nuevo componente VideoBanner
import ShippingInfo from '../components/ShippingInfo.jsx'; // Importar el nuevo componente ShippingInfo
import Footer from '../components/Footer.jsx';

import SkinConcerns from '../components/SkinConcerns.jsx'; // Importar la sección "Sobre tu piel"

function Home() {
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('cart') || '{}')); // Inicializar desde localStorage
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado para abrir/cerrar carrito
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado en el modal

  const categoriesData = ['Rostro', 'Labios', 'Ojos', 'Skincare', 'Herramientas'];

  // Asegúrate de que los productos también usen las categorías actualizadas
/*  const products = [
    { id: '1', name: 'Velvet Lip Tint', brand: 'Rosé Studio', price: 24.50, category: 'Labios', description: 'Un tinte labial aterciopelado de larga duración que deja un acabado mate suave y natural. Fórmula hidratante enriquecida con aceite de jojoba.', tones: ['Rosewood', 'Berry Crush', 'Nude Petal', 'Crimson'], imageExtension: 'jpeg' },
    { id: '2', name: 'Luminous Skin Serum', brand: 'Glow Lab', price: 38.00, category: 'Rostro', imageExtension: 'jpeg' },
    { id: '3', name: 'Silk Foundation', brand: 'Rosé Studio', price: 42.00, category: 'Rostro', imageExtension: 'jpeg' },
    { id: '4', name: 'Brow Sculptor', brand: 'Arch Atelier', price: 18.00, category: 'Ojos', imageExtension: 'jpeg' },
    { id: '5', name: 'prubea color', brand: 'Petal Beauty', price: 28.00, category: 'Rostro', imageExtension: 'png' }, // Cambiado a .png
    { id: '6', name: 'Midnight Mascara', brand: 'Lash Co.', price: 22.00, category: 'Ojos', imageExtension: 'png' },
    { id: '7', name: 'Palette Terre', brand: 'Rosé Studio', price: 45.00, category: 'Ojos', imageExtension: 'png' },
    { id: '8', name: 'Dewy Setting Spray', brand: 'Glow Lab', price: 19.50, category: 'Skincare', imageExtension: 'png' },
    { id: '9', name: 'Beauty Blender', brand: 'BlendIt', price: 12.00, category: 'Herramientas', imageExtension: 'png' }
  ];*/

  const [products, setProducts] = useState([]);


  useEffect(() => {                                // ← B2 VA AQUÍ, debajo
    fetch(`${API_HOST}/api/products`)
        .then(response => response.json())
        .then(data => setProducts(data));
  }, []);

  useEffect(() => {
    const client = new StompJs.Client({
      webSocketFactory: () => new SockJS(`${API_HOST}/ws`),
      onConnect: () => {
        client.subscribe("/topic/stock", (message) => {
          const data = JSON.parse(message.body);

          // ¿El backend avisó que el producto fue ELIMINADO?
          if (data.deleted) {
            setProducts(prev => prev.filter(p => p.id !== data.id));
          } else {
            setProducts(prev =>
                prev.map(p => (p.id === data.id ? { ...p, stock: data.stock } : p))
            );

            fetch(`${API_HOST}/api/products/${data.id}`)
                .then(response => response.json())
                .then(fullProduct => {
                  if (fullProduct.stock > 0) {
                    setProducts(prev =>
                        prev.some(p => p.id === data.id) ? prev : [...prev, fullProduct]
                    );
                  }
                })
                .catch(() => {});
          }
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  // Videos directamente de TikTok: solo basta el enlace (la app los convierte en reproductor embed)
  const bannerVideos = [
    { id: '1', link: 'https://vt.tiktok.com/ZSq4waPr2/' },
    { id: '2', link: 'https://vt.tiktok.com/ZSq4wxJy9/' },
    { id: '3', link: 'https://vt.tiktok.com/ZSq4w4uBa/' },
    { id: '4', link: 'https://vt.tiktok.com/ZSq4KYjHW/' },
    { id: '5', link: 'https://vt.tiktok.com/ZSq4KYru8/' },
    { id: '6', link: 'https://vt.tiktok.com/ZSq4wpWVy/' },
    { id: '7', link: 'https://vt.tiktok.com/ZSq4KYnJT/' },
    { id: '8', link: 'https://vt.tiktok.com/ZSq4KeWgP/' },
  ];

  // En home.jsx
const changeQty = (id, delta) => {
  // Límite de stock: no puedes agregar más de lo que hay disponible
  const product = products.find((p) => String(p.id) === String(id));
  if (!product) return;
  debug.info('Home', 'Changing quantity', { productId: id, delta, stock: product.stock });

  setCartItems(prev => {
    const current = prev[id] || 0;
    const newQty = current + delta;
    if (newQty > product.stock) return prev; // no pasar del stock

    const updatedCart = { ...prev };
    if (newQty > 0) {
      updatedCart[id] = newQty;
    } else {
      delete updatedCart[id];
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Guardar en localStorage
    window.dispatchEvent(new Event('cartUpdated')); // Disparar evento
    debug.info('Home', 'New quantity calculated and cart updated', { productId: id, newQty, updatedCart });
    return updatedCart;
  });
};

  // Funciones para abrir y cerrar el modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Evitar scroll en el body
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset'; // Restaurar scroll en el body
  };

  // Funciones para abrir y cerrar el carrito
  const openCart = () => {
    setIsCartOpen(true);
    document.body.style.overflow = 'hidden'; // Evitar scroll en el body
  };

  const closeCart = () => {
    setIsCartOpen(false);
    document.body.style.overflow = 'unset'; // Restaurar scroll en el body
  };

  // Función para transformar el objeto cartItems en una lista de objetos de productos reales
  const getCartList = () => {
    return Object.keys(cartItems)
        .filter(id => cartItems[id] > 0)
        .map(id => {
          const product = products.find(p => String(p.id) === String(id));
          return product ? { ...product, quantity: cartItems[id] } : null;
        })
        .filter(p => p !== null);
  };

  const visibleProducts = products.filter(product => product.stock > 0);

  const filteredProducts = selectedCategory === null
      ? visibleProducts
      : visibleProducts.filter(product => product.category === selectedCategory);

  return (
    <>
      {/* Pasamos la función para abrir el carrito al Navbar si tienes un icono ahí */}
      <Navbar onCartClick={openCart} />
      
      {/* Componente Carrito */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={closeCart} 
        cartItems={getCartList()}
        onChangeQty={changeQty} // Pasar la función changeQty al Cart
      />

      {/* Componente Modal de Producto */}
      <ProductModal
        product={selectedProduct}
        onClose={closeProductModal}
        onAddToCart={(productId) => {
          changeQty(productId, 1);
          closeProductModal(); // Cerrar modal después de agregar al carrito
        }}
      />

      <main className="container main">
        {/* Categorías: estilo The Ordinary, solo texto */}
        <nav className="categories" aria-label="Categorías">
          <span className="categories-label">Categorías</span>
          {categoriesData.map(cat => (
            <button
              key={cat}
              type="button"
              className={`category-link ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-img-wrap" onClick={() => openProductModal(product)}>
                <img   src={product.image || "https://placehold.co/400x400/FFFFFF/E8A0BF?text=Makeup+Oriente"}
                       alt={product.name} />
              </div>
              <div className="product-info">
                <p className="product-brand">{product.brand}</p>
                <h3 className="product-name" onClick={() => openProductModal(product)}>{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
              <div className="product-actions">
                {cartItems[product.id] > 0 ? (
                  <div className="qty-controls flex">
                    <button onClick={() => changeQty(product.id, -1)} className="qty-btn">−</button>
                    <span className="qty-num">{cartItems[product.id]}</span>
                    <button onClick={() => changeQty(product.id, 1)} className="qty-btn" disabled={cartItems[product.id] >= product.stock}>+</button>
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

        <SkinConcerns />

        <VideoBanner videos={bannerVideos} />

        <ShippingInfo />
      </main>
      <Footer />
    </>
  );
}

export default Home;