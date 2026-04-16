import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch, faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../css/home.css';
import logo from '../assets/logo.png';
import bannerImage from '../assets/banner.png';
import bannerImage2 from '../assets/banner2.png';
import bannerImage3 from '../assets/banner3.png';
import bannerImage4 from '../assets/banner4.png';
import bannerImage5 from '../assets/banner5.png';
import video1 from '../assets/video/Download.mp4';
import video2 from '../assets/video/Download 1.mp4';
import video3 from '../assets/video/Download 2.mp4';
import video4 from '../assets/video/Download 3.mp4';
import video5 from '../assets/video/Download 4.mp4';
import video6 from '../assets/video/Download 5.mp4';
import video7 from '../assets/video/Download 6.mp4';
import video8 from '../assets/video/Download 7.mp4';

import rostroImage from '../assets/rostro.png';
import labiosImage from '../assets/labios.png';
import ojosImage from '../assets/ojos.png';
import skincareImage from '../assets/skincare.png';
import herramientasImage from '../assets/herramientas.png';

function Home() {
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('cart') || '{}')); // Inicializar desde localStorage
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const productsData = [
    {
      id: 1,
      name: 'Base de Maquillaje',
      category: 'Rostro',
      price: 25.00,
      imageSrc: 'https://via.placeholder.com/150',
      description: 'Base de maquillaje de larga duración con acabado natural.',
    },
    {
      id: 2,
      name: 'Labial Rojo Intenso',
      category: 'Labios',
      price: 15.00,
      imageSrc: 'https://via.placeholder.com/150',
      description: 'Labial cremoso con color vibrante y alta pigmentación.',
    },
    {
      id: 3,
      name: 'Máscara de Pestañas',
      category: 'Ojos',
      price: 18.00,
      imageSrc: 'https://via.placeholder.com/150',
      description: 'Máscara que alarga y da volumen a tus pestañas sin grumos.',
    },
    {
      id: 4,
      name: 'Crema Hidratante',
      category: 'Skincare',
      price: 30.00,
      imageSrc: 'https://via.placeholder.com/150',
      description: 'Crema facial que hidrata profundamente y protege la piel.',
    },
    {
      id: 5,
      name: 'Set de Brochas',
      category: 'Herramientas',
      price: 40.00,
      imageSrc: 'https://via.placeholder.com/150',
      description: 'Set profesional de brochas para una aplicación impecable.',
    },
    {
      id: 6,
      name: 'Corrector de Ojeras',
      category: 'Rostro',
      price: 20.00,
      imageSrc: 'https://via.placeholder.com/150',
      description: 'Corrector de alta cobertura que ilumina la zona de los ojos.',
    },
    {
      id: 7,
      name: 'Delineador Líquido',
      category: 'Ojos',
      price: 12.00,
      imageSrc: 'https://via.placeholder.com/150',
      description: 'Delineador de ojos de larga duración con punta precisa.',
    },
    {
      id: 8,
      name: 'Exfoliante Facial',
      category: 'Skincare',
      price: 22.00,
      imageSrc: 'https://via.placeholder.com/150',
      description: 'Exfoliante suave que limpia los poros y renueva la piel.',
    },
  ];

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const newItems = { ...prevItems };
      if (newItems[product.id]) {
        newItems[product.id].quantity += 1;
      } else {
        newItems[product.id] = { ...product, quantity: 1 };
      }
      return newItems;
    });
  };

  const getTotalItemsInCart = () => {
    return Object.values(cartItems).reduce((total, item) => total + item.quantity, 0);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="top-bar">
          <div className="contact-info">
            <span>+57 311 2345678</span>
            <span>info@glamoura.com</span>
          </div>
          <div className="social-media">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
          </div>
        </div>
        <nav className="navbar">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Glamoura Logo" />
            </Link>
          </div>
          <div className="menu-icon" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </div>
          <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <li><Link to="/" onClick={toggleMenu}>Inicio</Link></li>
            <li><Link to="/shop" onClick={toggleMenu}>Tienda</Link></li>
            <li><Link to="/about" onClick={toggleMenu}>Nosotros</Link></li>
            <li><Link to="/contact" onClick={toggleMenu}>Contacto</Link></li>
          </ul>
          <div className="nav-icons">
            <FontAwesomeIcon icon={faSearch} className="icon" />
            <Link to="/cart" className="cart-icon-link">
              <FontAwesomeIcon icon={faShoppingCart} className="icon" />
              {getTotalItemsInCart() > 0 && (
                <span className="cart-count">{getTotalItemsInCart()}</span>
              )}
            </Link>
            <FontAwesomeIcon icon={faUser} className="icon" />
          </div>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="banner-carousel">
            <div className="carousel-item active">
              <img src={bannerImage} alt="Banner 1" />
              <div className="banner-text">
                <h1>Descubre tu Belleza Interior</h1>
                <p>Productos de maquillaje y cuidado de la piel de alta calidad.</p>
                <button className="shop-now-button">Comprar Ahora</button>
              </div>
            </div>
            <div className="carousel-item">
              <img src={bannerImage2} alt="Banner 2" />
              <div className="banner-text">
                <h1>Nuevas Colecciones</h1>
                <p>Explora las últimas tendencias en maquillaje.</p>
                <button className="shop-now-button">Ver Colección</button>
              </div>
            </div>
            <div className="carousel-item">
              <img src={bannerImage3} alt="Banner 3" />
              <div className="banner-text">
                <h1>Cuidado de la Piel</h1>
                <p>Rutinas personalizadas para una piel radiante.</p>
                <button className="shop-now-button">Descubrir Skincare</button>
              </div>
            </div>
            <div className="carousel-item">
              <img src={bannerImage4} alt="Banner 4" />
              <div className="banner-text">
                <h1>Ofertas Exclusivas</h1>
                <p>No te pierdas nuestros descuentos especiales.</p>
                <button className="shop-now-button">Ver Ofertas</button>
              </div>
            </div>
            <div className="carousel-item">
              <img src={bannerImage5} alt="Banner 5" />
              <div className="banner-text">
                <h1>Maquillaje Profesional</h1>
                <p>Herramientas y productos para expertos y principiantes.</p>
                <button className="shop-now-button">Explorar</button>
              </div>
            </div>
          </div>
        </section>

        <section className="categories-section">
          <h2>Explora por Categoría</h2>
          <div className="categories-grid">
            {categoriesData.map((category, index) => (
              <div key={index} className="category-item">
                <img src={category.imageSrc} alt={category.name} />
                <h3>{category.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="featured-products-section">
          <h2>Productos Destacados</h2>
          <div className="products-grid">
            {productsData.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.imageSrc} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <div className="product-actions">
                  <button onClick={() => openModal(product)} className="view-details-button">Ver Detalles</button>
                  <button onClick={() => handleAddToCart(product)} className="add-to-cart-button">
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="video-gallery-section">
          <h2>Inspiración y Tutoriales</h2>
          <div className="video-grid">
            <div className="video-item">
              <video src={video1} controls muted autoPlay loop></video>
              <p>Tutorial de Maquillaje Natural</p>
            </div>
            <div className="video-item">
              <video src={video2} controls muted autoPlay loop></video>
              <p>Rutina de Skincare para Piel Grasa</p>
            </div>
            <div className="video-item">
              <video src={video3} controls muted autoPlay loop></video>
              <p>Maquillaje de Ojos Ahumados</p>
            </div>
            <div className="video-item">
              <video src={video4} controls muted autoPlay loop></video>
              <p>Cómo Aplicar Base Perfectamente</p>
            </div>
            <div className="video-item">
              <video src={video5} controls muted autoPlay loop></video>
              <p>Reseña de Productos Favoritos</p>
            </div>
            <div className="video-item">
              <video src={video6} controls muted autoPlay loop></video>
              <p>Transformación con Maquillaje</p>
            </div>
            <div className="video-item">
              <video src={video7} controls muted autoPlay loop></video>
              <p>Consejos para Labios Voluminosos</p>
            </div>
            <div className="video-item">
              <video src={video8} controls muted autoPlay loop></video>
              <p>Guía de Brochas Esenciales</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>Glamoura</h3>
            <p>Tu destino para productos de belleza de alta calidad. Descubre lo mejor en maquillaje y cuidado de la piel.</p>
            <div className="contact">
              <span><i className="fas fa-phone"></i> +57 311 2345678</span>
              <span><i className="fas fa-envelope"></i> info@glamoura.com</span>
            </div>
          </div>
          <div className="footer-section links">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/shop">Tienda</Link></li>
              <li><Link to="/about">Nosotros</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
              <li><Link to="/privacy">Política de Privacidad</Link></li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Síguenos</h3>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Glamoura. Todos los derechos reservados.
        </div>
      </footer>

      {isModalOpen && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h2>{selectedProduct.name}</h2>
            <img src={selectedProduct.imageSrc} alt={selectedProduct.name} className="modal-product-image" />
            <p className="modal-product-category">{selectedProduct.category}</p>
            <p className="modal-product-description">{selectedProduct.description}</p>
            <p className="modal-product-price">${selectedProduct.price.toFixed(2)}</p>
            <button onClick={() => { handleAddToCart(selectedProduct); closeModal(); }} className="add-to-cart-button">
              Añadir al Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;