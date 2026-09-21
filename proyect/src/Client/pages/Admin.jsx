import { useState, useEffect } from "react";
import {
  createProduct,
  updateProduct,
  fetchOrders,
  fetchProducts,
} from "../services/api.js";
import '../styles/Admin.css';
import Navbar from "../components/Navbar.jsx";
import { useBcvRate } from "../hooks/useBcvRate.js";
import { formatBs } from "../utils/format.js";

const CATEGORIES = ["Rostro", "Labios", "Ojos", "Skincare", "Herramientas"];

const METHOD_LABELS = {
  ENVIO: "Envío nacional",
  TIENDA: "Retiro por tienda",
  PAGOMOVIL: "Pago Móvil",
  TRANSFERENCIA: "Transferencia",
};

// ---------- Sección 1: formulario de producto ----------
function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: CATEGORIES[0],
    description: "",
    price: "",
    stock: "",
  });
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result); // base64 data-url
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        name: form.name,
        brand: form.brand,
        category: form.category,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        image,
      });
      setMessage("Producto creado correctamente");
      setForm({
        name: "",
        brand: "",
        category: CATEGORIES[0],
        description: "",
        price: "",
        stock: "",
      });
      setImage("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Agregar producto</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Nombre
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>Marca
          <input name="brand" value={form.brand} onChange={handleChange} required />
        </label>
        <label>Categoría
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>Descripción
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <label>Precio ($)
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>Stock
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </label>
        <label>Imagen
          <input type="file" accept="image/*" onChange={handleImage} />
        </label>

        {image && (
          <img src={image} alt="Vista previa" className="admin-preview" />
        )}

        {message && <p className="admin-message">{message}</p>}

        <button type="submit" className="admin-btn">Guardar producto</button>
      </form>
    </div>
  );
}

// ---------- Sección 2: pedidos por día ----------
function OrdersByDay() {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(""); // "" = todas las fechas
  const usdRate = useBcvRate();

  useEffect(() => {
    fetchOrders()
      .then((orders) => {
        const g = {};
        orders.forEach((o) => {
          const day = o.paymentDate || (o.orderDate ? o.orderDate.slice(0, 10) : "Sin fecha");
          if (!g[day]) g[day] = [];
          g[day].push(o);
        });
        setGroups(g);
      })
      .catch(() => setGroups({}))
      .finally(() => setLoading(false));
  }, []);

  const allDays = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));
  const days = selectedDate
    ? (groups[selectedDate] ? [selectedDate] : [])
    : allDays;

  return (
    <div>
      <h2>Pedidos por día</h2>

      <div className="admin-date-filter">
        <label>
          Ver pedidos de una fecha
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        {selectedDate && (
          <button className="admin-btn" onClick={() => setSelectedDate("")}>
            Ver todas
          </button>
        )}
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : days.length === 0 ? (
        <p>{selectedDate ? `No hay pedidos para el ${selectedDate}.` : "No hay pedidos aún."}</p>
      ) : (
        days.map((day) => (
          <div key={day} className="admin-day">
            <h3>📅 {day}</h3>
            {groups[day].map((order) => {
              const orderTotalBcv = order.items.reduce(
                (acc, it) => acc + it.price * it.quantity,
                0
              );
              return (
              <div key={order.id} className="admin-order">
                <p>
                  <strong>Cliente:</strong> {order.clientName} — {order.clientPhone}
                </p>
                <p>
                  <strong>Entrega:</strong>{" "}
                  {METHOD_LABELS[order.deliveryMethod] || order.deliveryMethod || "-"} ·{" "}
                  <strong>Pago:</strong>{" "}
                  {METHOD_LABELS[order.paymentMethod] || order.paymentMethod || "-"} ·{" "}
                  <strong>N°:</strong> {order.transferNumber || "-"}
                </p>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.productName} x {item.quantity} — $
                      {(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total:</strong> ${orderTotalBcv.toFixed(2)}
                </p>
                {usdRate && (
                  <p>
                    <strong>Total en Bs:</strong> Bs {formatBs(orderTotalBcv * usdRate)}
                  </p>
                )}
              </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}

// ---------- Sección 3: stock ----------
const STOCK_CATEGORY_ORDER = ["Rostro", "Labios", "Ojos", "Skincare", "Herramientas"];

function StockManager() {
  const [products, setProducts] = useState([]);
  const [collapsed, setCollapsed] = useState(new Set()); // categorías plegadas

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {});
  }, []);

  const toggleCategory = (cat) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const adjustStock = async (product, delta) => {
    const newStock = Math.max(0, product.stock + delta);
    await updateField(product, { stock: newStock });
  };

  // Guarda cambios puntuales de un producto (stock, precio, categoría, imagen)
  const updateField = async (product, patch) => {
    try {
      const updated = await updateProduct({ ...product, ...patch });
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error("Error al guardar cambios:", err);
    }
  };

  // Cambiar la imagen del producto (se sube en base64 igual que al crearlo)
  const changeImage = (product, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      await updateField(product, { image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Cambiar precio: se guarda al salir del campo o al pulsar Enter
  const handlePriceBlur = (product, e) => {
    const price = parseFloat(e.target.value);
    if (!Number.isNaN(price) && price >= 0 && price !== product.price) {
      updateField(product, { price });
    }
  };

  // Agrupar productos por categoría (respetando el orden de STOCK_CATEGORY_ORDER + otras)
  const grouped = {};
  products.forEach((p) => {
    const cat = p.category || "Sin categoría";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  const categoryOrder = [
    ...STOCK_CATEGORY_ORDER,
    ...Object.keys(grouped).filter((c) => !STOCK_CATEGORY_ORDER.includes(c)),
  ];

  // Opciones del selector de categoría: las conocidas + las que existan en productos
  const categoryOptions = [
    ...new Set([
      ...CATEGORIES,
      ...Object.keys(grouped),
    ]),
  ];

  return (
    <div>
      <h2>Control de stock</h2>

      {categoryOrder.length === 0 ? (
        <p>No hay productos aún.</p>
      ) : (
        categoryOrder.map((cat) => {
          const items = grouped[cat] || [];
          const isOpen = !collapsed.has(cat);
          return (
            <div key={cat} className="admin-category">
              <button
                type="button"
                className="admin-cat-header"
                onClick={() => toggleCategory(cat)}
                aria-expanded={isOpen}
              >
                <span className="admin-cat-arrow">{isOpen ? "▾" : "▸"}</span>
                {cat} <span className="admin-cat-count">({items.length})</span>
              </button>

              {isOpen && (
                <div className="admin-cat-body">
                  {items.length === 0 ? (
                    <p className="admin-cat-empty">No hay productos en esta categoría.</p>
                  ) : (
                    items.map((p) => (
                    <div key={p.id} className="admin-stock-row">
                      <img
                        src={p.image || "https://placehold.co/100x100/FFFFFF/E8A0BF?text=No+img"}
                        alt={p.name}
                        className="admin-thumb"
                      />
                      <div className="admin-stock-info">
                        <span className="admin-stock-name">{p.name}</span>
                        <span className="admin-stock-brand">{p.brand}</span>

                        <select
                          className="admin-stock-cat"
                          defaultValue={p.category || "Sin categoría"}
                          onChange={(e) =>
                            updateField(p, { category: e.target.value })
                          }
                          aria-label={`Categoría de ${p.name}`}
                        >
                          {categoryOptions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-stock-price">
                        <span className="admin-stock-price-label">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={p.price}
                          onBlur={(e) => handlePriceBlur(p, e)}
                          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                          aria-label={`Precio de ${p.name}`}
                        />
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        className="admin-file-input"
                        onChange={(e) => changeImage(p, e)}
                        aria-label={`Cambiar imagen de ${p.name}`}
                      />

                      <button
                        className="admin-btn"
                        onClick={() => adjustStock(p, -1)}
                        aria-label={`Quitar stock a ${p.name}`}
                      >−</button>
                      <strong className="admin-stock-qty">{p.stock}</strong>
                      <button
                        className="admin-btn"
                        onClick={() => adjustStock(p, 1)}
                        aria-label={`Agregar stock a ${p.name}`}
                      >+</button>
                    </div>
                  )))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ---------- Panel principal ----------
function Admin() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [tab, setTab] = useState("products");

  if (!user || !user.role || user.role.toLowerCase() !== "admin") {
    return (
      <>
        <Navbar />
        <div className="admin-container">
          <h1>Acceso denegado</h1>
          <p>Debes iniciar sesión con una cuenta de administrador.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-container">
      <h1>Panel de administración</h1>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === "products" ? "active" : ""}`}
          onClick={() => setTab("products")}
        >
          Agregar producto
        </button>
        <button
          className={`admin-tab ${tab === "orders" ? "active" : ""}`}
          onClick={() => setTab("orders")}
        >
          Pedidos por día
        </button>
        <button
          className={`admin-tab ${tab === "stock" ? "active" : ""}`}
          onClick={() => setTab("stock")}
        >
          Stock
        </button>
      </div>

      {tab === "products" && <AddProduct />}
      {tab === "orders" && <OrdersByDay />}
      {tab === "stock" && <StockManager />}
      </div>
    </>
  );
}

export default Admin;