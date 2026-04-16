import React from 'react';
import '../Style/ShippingInfo.css'; // Importa los estilos para este componente
import cartImage from '../assets/cart.png'; // Importa la imagen del carrito

const ShippingInfo = () => {
  return (
    <div className="shipping-info-container">
      <img src={cartImage} alt="Carrito de compras" className="shipping-cart-image" />
      <p className="shipping-text">Contamos con opción de envío gratis a nivel nacional</p>
    </div>
  );
};

export default ShippingInfo;
