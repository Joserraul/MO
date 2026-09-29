import React from 'react';
import '../styles/ProductModal.css';

const ProductModal = ({ product, quantity = 0, onClose, onAddToCart, onChangeQty }) => {
  if (!product) {
    return null;
  }

  const productDescription = product.description || "Descripción del producto no disponible.";
  const productTones = product.tones || [];

  return (
    <div className={`modal-overlay ${product ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>
        <div className="modal-hero">
          <img
            src={product.image || "https://placehold.co/400x400/FFFFFF/E8A0BF?text=Makeup+Oriente"}
            alt={product.name}
          />
        </div>
        <div className="modal-card">
          <p className="modal-brand">{product.brand} &bull; {product.category}</p>
          <h3 className="modal-name">{product.name}</h3>
          <p className="modal-price">${product.price.toFixed(2)}</p>
          <p className="modal-description">{productDescription}</p>
          {productTones.length > 0 && (
            <div className="modal-tones">
              <h4>TONOS DISPONIBLES</h4>
              <div className="tones-list">
                {productTones.map((tone, index) => (
                  <span key={index} className="tone-item">{tone}</span>
                ))}
              </div>
            </div>
          )}
          {quantity > 0 ? (
            <div className="qty-controls">
              <button onClick={() => onChangeQty(product.id, -1)} className="qty-btn">−</button>
              <span className="qty-num">{quantity}</span>
              <button
                onClick={() => onChangeQty(product.id, 1)}
                className="qty-btn"
                disabled={quantity >= product.stock}
              >+</button>
            </div>
          ) : (
            <button className="add-to-cart-btn" onClick={() => onAddToCart(product.id)}>
              + Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;