import React from 'react';
import debug from '../utils/debug.js';

const Cart = ({ isOpen, onClose, cartItems = [] }) => {
  debug.lifecycle('Cart', 'render', { isOpen, cartItemsCount: cartItems.length });
  
  if (!isOpen) {
    debug.info('Cart', 'Cart is closed');
    return null;
  }
  
  debug.cartState(cartItems, 'render');
  
  // Calcular el total del carrito
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      {/* Overlay: Solo se muestra si isOpen es true */}
      <div 
        className={`cart-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
        style={{
          border: isOpen ? '10px solid red' : 'none',
          background: isOpen ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
          display: isOpen ? 'block' : 'none'
        }}
      ></div>

      {console.log('🔍 DRAWER DEBUG - isOpen:', isOpen, 'clase activa:', isOpen ? 'active' : 'sin active')}
      <aside
        className={`cart-drawer ${isOpen ? 'active' : ''}`}
        style={{
          border: '5px solid blue',
          background: 'white', // Aseguramos que el fondo sea blanco para ver el contenido
          boxShadow: '0 0 20px 5px blue',
          zIndex: 10001, // Aseguramos que esté por encima del overlay
          right: isOpen ? '0 !important' : undefined // Forzar right: 0 cuando está abierto
        }}
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