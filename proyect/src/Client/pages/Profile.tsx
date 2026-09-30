import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_HOST, getToken } from "../services/api.js";
import '../styles/Profile.css';
import Navbar from "../components/Navbar.jsx";
import { useBcvRate } from "../hooks/useBcvRate.js";
import { formatBs } from "../utils/format.js";
import type { Order, User } from "../types/index.js";

const METHOD_LABELS: Record<string, string> = {
  ENVIO: "Envío nacional",
  TIENDA: "Retiro por tienda",
  PAGOMOVIL: "Pago Móvil",
  TRANSFERENCIA: "Transferencia",
};

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null") as User | null;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const usdRate = useBcvRate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`${API_HOST}/api/orders/user/${user.id}`, {
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          throw new Error("Sesión expirada");
        }
        if (!res.ok) throw new Error("Error al cargar pedidos");
        return res.json() as Promise<Order[]>;
      })
      .then((data) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
      <h1>Mi perfil</h1>

      <Link to="/" className="profile-back">← Volver a la tienda</Link>

      <div className="profile-box">
        <h2>Mis datos</h2>
        <p>
          <strong>Nombre:</strong> {user.username} {user.lastName}
        </p>
        <p>
          <strong>Teléfono:</strong> {user.phone}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <div className="profile-box">
        <h2>Mis compras</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : orders.length === 0 ? (
          <p>Aún no has hecho compras.</p>
        ) : (
          <div className="timeline timeline-bg">
          {orders.map((order) => {
            const orderTotal = order.items.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            );
            const headerDate =
              order.paymentDate ||
              (order.orderDate ? order.orderDate.slice(0, 10) : null) ||
              `#${order.id}`;
            return (
            <div key={order.id} className="timeline-item">
              <p className="timeline-date">{headerDate}</p>
              <p className="timeline-sub">Pedido #{order.id}</p>
              <p>
                <strong>Fecha de pago:</strong> {order.paymentDate || "-"}
              </p>
              <p>
                <strong>Entrega:</strong>{" "}
                {METHOD_LABELS[order.deliveryMethod] || order.deliveryMethod || "-"}
              </p>
              <p>
                <strong>Pago:</strong>{" "}
                {METHOD_LABELS[order.paymentMethod] || order.paymentMethod || "-"}
              </p>
              <p>
                <strong>N° de pago:</strong> {order.transferNumber || "-"}
              </p>
              <p>
                <strong>Fecha de compra:</strong> {order.orderDate}
              </p>
              <ul className="order-items">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.productName} x {item.quantity} — $
                    {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="order-total">
                <strong>Total:</strong> ${orderTotal.toFixed(2)}
              </p>
              {usdRate && (
                <p className="order-total">
                  <strong>Total en Bs:</strong> Bs {formatBs(orderTotal * usdRate)}
                </p>
              )}
            </div>
          );
          })}
          </div>
        )}
      </div>
      </div>
    </>
  );
}

export default Profile;