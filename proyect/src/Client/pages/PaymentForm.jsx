import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeliveryMethod from "./DeliveryMethod.jsx";
import { API_HOST, getToken, clearSession } from "../services/api.js";
import { isDemo, DEMO_PRODUCTS, pushDemoOrder } from "../demo/demo.js";
import Navbar from "../components/Navbar.jsx";
import '../styles/Checkout.css';
import { useBcvRate } from "../hooks/useBcvRate.js";
import { formatBs } from "../utils/format.js";

const PAYMENT_METHODS = [
  {
    value: "PAGOMOVIL",
    label: "Pago Móvil",
    details: ["0172 - 27208705 - 04122207221"],
  },
  {
    value: "TRANSFERENCIA",
    label: "Transferencia",
    details: ["01720710557108164554 - V26109050"],
  },
];

function PaymentForm() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
  const [products, setProducts] = useState([]);
  const [delivery, setDelivery] = useState("");
  const [payMethod, setPayMethod] = useState("");
  const [payDate, setPayDate] = useState("");
  const [payNumber, setPayNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const usdRate = useBcvRate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isDemo()) { setProducts(DEMO_PRODUCTS); return; } // modo demo: sin backend
    fetch(`${API_HOST}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {});
  }, []);

  const cartList = Object.keys(cart)
    .filter((id) => cart[id] > 0)
    .map((id) => {
      const product = products.find((p) => String(p.id) === String(id));
      return product ? { ...product, quantity: cart[id] } : null;
    })
    .filter((p) => p !== null);

  const total = cartList.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.value === payMethod);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!delivery || !payMethod || !payDate || !payNumber.trim()) {
      setError("Completa entrega, método de pago, fecha y número de pago");
      return;
    }

    const items = cartList.map((item) => ({
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      // Modo demo (GitHub Pages): el pedido se simula y se guarda en el navegador
      if (isDemo()) {
        pushDemoOrder({
          deliveryMethod: delivery,
          paymentMethod: payMethod,
          paymentDate: payDate,
          transferNumber: payNumber,
          items,
        });
        localStorage.removeItem("cart");
        localStorage.removeItem("transferNumber");
        setSuccess(true);
        return;
      }

      const res = await fetch(`${API_HOST}/api/orders/${user.id}`, {
        method: "POST",
        headers: getToken()
          ? { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }
          : { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryMethod: delivery,
          paymentMethod: payMethod,
          paymentDate: payDate,
          transferNumber: payNumber,
          items,
        }),
      });
      if (!res.ok) throw new Error("No se pudo registrar el pedido");

      localStorage.removeItem("cart");
      localStorage.removeItem("transferNumber");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="checkout-success">
          <h1>¡Gracias por tu compra!</h1>
          <p className="success-sub">
            Tu pedido fue registrado correctamente.
            <br />
            Te contactaremos para coordinar la entrega.
          </p>
          <button className="checkout-submit" onClick={() => navigate("/profile")}>
            Ver mi perfil
          </button>
          <button className="checkout-secondary" onClick={() => navigate("/")}>
            Seguir comprando
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="checkout-container">
      <h1>Finalizar compra</h1>

      <form onSubmit={handleSubmit}>
        <DeliveryMethod method={delivery} onChange={setDelivery} />

        <div className="pay-section">
          <h3>Método de pago</h3>
          {PAYMENT_METHODS.map((m) => (
            <button
              type="button"
              key={m.value}
              className={`pay-option ${payMethod === m.value ? "selected" : ""}`}
              onClick={() => setPayMethod(m.value)}
            >
              {m.label}
            </button>
          ))}

          {selectedMethod && (
            <div className="pay-details">
              <p>Datos para completar el pago:</p>
              {selectedMethod.details.map((line, i) => (
                <p key={i} className="pay-detail-line">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="pay-section">
          <h3>Fecha de pago</h3>
          <input
            type="date"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
            required
          />
        </div>

        <div className="pay-section">
          <h3>Número de pago</h3>
          <input
            type="text"
            value={payNumber}
            onChange={(e) => setPayNumber(e.target.value)}
            placeholder="Escribe el número de tu pago"
            required
          />
        </div>

        <div className="checkout-summary">
          <h3>Tu pedido</h3>
          {cartList.map((item) => (
            <p key={item.id}>
              {item.name} x {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
            </p>
          ))}
          <p>
            <strong>Total: ${total.toFixed(2)}</strong>
          </p>
          {usdRate && (
            <p>
              <strong>Total en Bs: Bs {formatBs(total * usdRate)}</strong>
            </p>
          )}
        </div>

        {error && <p className="checkout-error">{error}</p>}

        <button type="submit" className="checkout-submit">
          Enviar pedido
        </button>
      </form>
      </div>
    </>
  );
}

export default PaymentForm;