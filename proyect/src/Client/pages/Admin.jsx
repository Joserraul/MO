import { useState, useEffect } from "react";
import {
  createProduct,
  updateProduct,
  fetchOrders,
  fetchProducts,
} from "../services/api.js";

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

  const days = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div>
      <h2>Pedidos por día</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : days.length === 0 ? (
        <p>No hay pedidos aún.</p>
      ) : (
        days.map((day) => (
          <div key={day} className="admin-day">
            <h3>📅 {day}</h3>
            {groups[day].map((order) => (
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
                  <strong>Total:</strong> $
                  {order.items
                    .reduce((acc, it) => acc + it.price * it.quantity, 0)
                    .toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

// ---------- Sección 3: stock ----------
function StockManager() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {});
  }, []);

  const adjustStock = async (product, delta) => {
    const newStock = Math.max(0, product.stock + delta);
    try {
      const updated = await updateProduct({ ...product, stock: newStock });
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Control de stock</h2>
      {products.map((p) => (
        <div key={p.id} className="admin-stock-row">
          <span className="admin-stock-name">{p.name}</span>
          <button className="admin-btn" onClick={() => adjustStock(p, -1)}>−</button>
          <strong className="admin-stock-qty">{p.stock}</strong>
          <button className="admin-btn" onClick={() => adjustStock(p, 1)}>+</button>
        </div>
      ))}
    </div>
  );
}

// ---------- Panel principal ----------
function Admin() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [tab, setTab] = useState("products");

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-container">
        <h1>Acceso denegado</h1>
        <p>Debes iniciar sesión con una cuenta de administrador.</p>
      </div>
    );
  }

  return (
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
  );
}

export default Admin;