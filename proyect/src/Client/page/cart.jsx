import React from 'react';
import debug from '../utils/debug.js';

const Cart = ({ isOpen, onClose, cartItems = [], onChangeQty }) => {
  debug.lifecycle('Cart', 'render', { isOpen, cartItemsCount: cartItems.length });
  
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      <div 
        className={`cart-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      ></div>

      <aside
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
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
                    <div className="qty-controls">
                      <button onClick={() => onChangeQty(item.id, -1)} className="qty-btn">−</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button onClick={() => onChangeQty(item.id, 1)} className="qty-btn">+</button>
                    </div>
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
            <div className="cart-total">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-price">${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn">Ir a Pagar</button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Cart;