function DeliveryMethod({ method, onChange }) {
  const options = [
    { value: "ENVIO", label: "Envío nacional" },
    { value: "TIENDA", label: "Retiro por tienda" },
  ];

  return (
    <div className="pay-section">
      <h3>¿Cómo quieres recibir tu pedido?</h3>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`pay-option ${method === opt.value ? "selected" : ""}`}
        >
          <input
            type="radio"
            name="delivery"
            checked={method === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export default DeliveryMethod;