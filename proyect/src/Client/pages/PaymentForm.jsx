import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeliveryMethod from "./DeliveryMethod.jsx";

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

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch("http://localhost:8080/api/products")
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
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch(`http://localhost:8080/api/orders/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <div className="checkout-container">
        <h1>¡Pedido registrado!</h1>
        <p>Tu pedido fue guardado correctamente.</p>
        <button className="checkout-submit" onClick={() => navigate("/")}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
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
        </div>

        {error && <p className="checkout-error">{error}</p>}

        <button type="submit" className="checkout-submit">
          Enviar
        </button>
      </form>
    </div>
  );
}

export default PaymentForm;