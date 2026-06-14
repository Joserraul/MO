import Navbar from "../Components/navbar.jsx"; // Asegúrate de que la ruta sea correcta
import Cart from "./cart.jsx"; // Asegúrate de que la ruta sea correcta
import ProductModal from "../Components/ProductModal"; // Importar el nuevo componente Modal
import { useState } from "react";
import { debug } from "../utils/debug.js"; // Importa tu utilidad de debug
import '../Style/hero.css'; // Importa los estilos del Hero
import '../Style/Categories.css'; // Importa los estilos de Categories
import '../Style/ProductGrid.css'; // Importa los estilos de Product Grid
import '../Style/AddQty.css'; // Importa los estilos de Add / Qty
import '../Style/Modal.css'; // Importa los estilos del Modal
import '../Style/CartDrawer.css'; // Importa los estilos del Cart Drawer
import '../Style/ProductModal.css'; // Importa los estilos del ProductModal
import VideoBanner from '../Components/VideoBanner.jsx'; // Importar el nuevo componente VideoBanner
import ShippingInfo from '../Components/ShippingInfo.jsx'; // Importar el nuevo componente ShippingInfo
import Footer from '../Components/Footer.jsx';

import video1 from '../assets/video/Download.mp4';
import video2 from '../assets/video/Download 1.mp4';
import video3 from '../assets/video/Download 2.mp4';
import video4 from '../assets/video/Download 3.mp4';
import video5 from '../assets/video/Download 4.mp4';
import video6 from '../assets/video/Download 5.mp4';
import video7 from '../assets/video/Download 6.mp4';
import video8 from '../assets/video/Download 7.mp4';

// Importaciones de imágenes para las categorías
import rostroImage from '../assets/rostro.png';
import labiosImage from '../assets/labios.png';
import ojosImage from '../assets/ojos.png';
import skincareImage from '../assets/skincare.png';
import herramientasImage from '../assets/herramientas.png';

function Home() {
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('cart') || '{}')); // Inicializar desde localStorage
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado para abrir/cerrar carrito
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado en el modal

  const categoriesData = [
    { name: 'Rostro', imageSrc: rostroImage },
    { name: 'Labios', imageSrc: labiosImage },
    { name: 'Ojos', imageSrc: ojosImage },
    { name: 'Skincare', imageSrc: skincareImage },
    { name: 'Herramientas', imageSrc: herramientasImage },
  ];

  // Asegúrate de que los productos también usen las categorías actualizadas
  const products = [
    { id: '1', name: 'Velvet Lip Tint', brand: 'Rosé Studio', price: 24.50, category: 'Labios', description: 'Un tinte labial aterciopelado de larga duración que deja un acabado mate suave y natural. Fórmula hidratante enriquecida con aceite de jojoba.', tones: ['Rosewood', 'Berry Crush', 'Nude Petal', 'Crimson'], imageExtension: 'jpeg' },
    { id: '2', name: 'Luminous Skin Serum', brand: 'Glow Lab', price: 38.00, category: 'Rostro', imageExtension: 'jpeg' },
    { id: '3', name: 'Silk Foundation', brand: 'Rosé Studio', price: 42.00, category: 'Rostro', imageExtension: 'jpeg' },
    { id: '4', name: 'Brow Sculptor', brand: 'Arch Atelier', price: 18.00, category: 'Ojos', imageExtension: 'jpeg' },
    { id: '5', name: 'prubea color', brand: 'Petal Beauty', price: 28.00, category: 'Rostro', imageExtension: 'png' }, // Cambiado a .png
    { id: '6', name: 'Midnight Mascara', brand: 'Lash Co.', price: 22.00, category: 'Ojos', imageExtension: 'png' },
    { id: '7', name: 'Palette Terre', brand: 'Rosé Studio', price: 45.00, category: 'Ojos', imageExtension: 'png' },
    { id: '8', name: 'Dewy Setting Spray', brand: 'Glow Lab', price: 19.50, category: 'Skincare', imageExtension: 'png' },
    { id: '9', name: 'Beauty Blender', brand: 'BlendIt', price: 12.00, category: 'Herramientas', imageExtension: 'png' }
  ];

  const bannerVideos = [
    { id: '1', videoSrc: video1, link: 'https://www.tiktok.com/@makeup_oriente/video/7588339575207005452?is_from_webapp=1&sender_device=pc' },
    { id: '2', videoSrc: video2, link: 'https://www.tiktok.com/@makeup_oriente/video/7620600491642277141?is_from_webapp=1&sender_device=pc' },
    { id: '3', videoSrc: video3, link: 'https://www.tiktok.com/@makeup_oriente/video/7615395285304429845?is_from_webapp=1&sender_device=pc' },
    { id: '4', videoSrc: video4, link: 'https://www.tiktok.com/@makeup_oriente/video/7611589555476630805?is_from_webapp=1&sender_device=pc' },
    { id: '5', videoSrc: video5, link: 'https://www.tiktok.com/@makeup_oriente/video/7606844083121786133?is_from_webapp=1&sender_device=pc' },
    { id: '6', videoSrc: video6, link: 'https://www.tiktok.com/@makeup_oriente/video/7608698844221623572?is_from_webapp=1&sender_device=pc' },
    { id: '7', videoSrc: video7, link: 'https://www.tiktok.com/@makeup_oriente/video/7594647289067605259?is_from_webapp=1&sender_device=pc' },
    { id: '8', videoSrc: video8, link: 'https://www.tiktok.com/@makeup_oriente/video/7588648668337556748?is_from_webapp=1&sender_device=pc' },
  ];

  // Añadir un console.log para depurar el valor de videoSrc
  bannerVideos.forEach(video => {
    console.log(`Video ID: ${video.id}, videoSrc:`, video.videoSrc, `Type: ${typeof video.videoSrc}`);
  });

  // En home.jsx
const changeQty = (id, delta) => {
  debug.info('Home', 'Changing quantity', { productId: id, delta });
  
  setCartItems(prev => {
    const updatedCart = { ...prev };
    const newQty = (updatedCart[id] || 0) + delta;
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
        const product = products.find(p => p.id === id);
        return { ...product, quantity: cartItems[id] };
      });
  };

  const filteredProducts = selectedCategory === null
    ? products
    : products.filter(product => product.category === selectedCategory);

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
        <div className="hero">
          <h2 className="hero-title">Makeup Oriente</h2>
          <p className="hero-sub">Catalogo de productos disponibles.</p>
        </div>

        {/* ... (Tus botones de categorías se mantienen igual) ... */}
        <div className="categories">
          {categoriesData.map(cat => (
            <div
              key={cat.name}
              className={`category-item ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => {
                if (selectedCategory === cat.name) {
                  setSelectedCategory(null); // Si ya está seleccionada, deseleccionar (mostrar todos)
                } else {
                  setSelectedCategory(cat.name); // Seleccionar la nueva categoría
                }
              }}
              style={{ backgroundImage: `url(${cat.imageSrc})` }} // Establecer la imagen como fondo
            >
              <div className="category-overlay">
                <span className="category-name">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-img-wrap" onClick={() => openProductModal(product)}>
                <img src={`/src/Client/assets/${product.id}.${product.imageExtension}`} alt={product.name} />
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

        <VideoBanner videos={bannerVideos} />

        <ShippingInfo />
      </main>
      <Footer />
    </>
  );
}

export default Home;