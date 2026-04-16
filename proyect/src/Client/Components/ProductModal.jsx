import React from 'react';
import '../Style/ProductModal.css'; // Asegúrate de crear este archivo CSS

const ProductModal = ({ product, onClose, onAddToCart }) => {
  if (!product) {
    return null;
  }

  // Asumiendo que la descripción y los tonos pueden no estar presentes en los datos iniciales del producto
  const productDescription = product.description || "Descripción del producto no disponible.";
  const productTones = product.tones || [];

  return (
    <div className={`modal-overlay ${product ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="modal-body">
          <div className="modal-img-wrap">
            <img src={`/src/Client/assets/${product.id}.${product.imageExtension}`} alt={product.name} />
          </div>
          <div className="modal-info">
            <p className="modal-brand">{product.brand} &bull; {product.category}</p>
            <h3 className="modal-name">{product.name}</h3>
            <p className="modal-price">${product.price.toFixed(2)}</p>
            <p className="modal-description">
              {productDescription}
            </p>
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
            <button className="add-to-cart-btn" onClick={() => onAddToCart(product.id)}>
              + Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
