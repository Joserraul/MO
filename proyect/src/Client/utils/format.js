// Formatea un número como monto en bolívares (es-VE, 2 decimales, separador de miles)
export function formatBs(n) {
  return new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}