import React from 'react';
import debug from '../utils/debug.js';

const Cart = ({ isOpen, onClose, cartItems = [] }) => {
  debug.lifecycle('Cart', 'render', { isOpen, cartItemsCount: cartItems.length });
  
  // Mantenemos el return null si no está abierto para optimizar, 
  // pero si quieres animaciones de salida, deberías manejarlo solo con clases CSS.
  if (!isOpen) {
    debug.info('Cart', 'Cart is closed');
    return null;
  }
  
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      {/* QUITAMOS: style={{ border, background, display }} 
          Dejamos que el CSS maneje .cart-overlay.active 
      */}
      <div 
        className={`cart-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      ></div>

      <aside
        className={`cart-drawer ${isOpen ? 'active' : ''}`}
        /* QUITAMOS: Los estilos inline de debug (border blue, box-shadow, etc.)
           El CSS que te pasé antes ya tiene el z-index y el fondo blanco.
        */
      >
        <div className="cart-header">
          <h2 className="cart-title">Tu carrito (<span>{cartItems.length}</span>)</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p className="cart-empty-title">Carrito vacío</p>
              <p className="cart-empty-sub">Explora el catálogo y agrega productos</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    {/* Asegúrate de que esta ruta a las imágenes sea correcta */}
                    <img src={`/src/Client/assets/${item.id}.jpeg`} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-brand">{item.brand}</p>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-qty">
                    <span className="cart-item-qty-num">{item.quantity}</span>
                  </div>
                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <span className="cart-total-label">Total</span>
            <span className="cart-total-price">${total.toFixed(2)}</span>
          </div>
        )}
      </aside>
    </>
  );
};

export default Cart;