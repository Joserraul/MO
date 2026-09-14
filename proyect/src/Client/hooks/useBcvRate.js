import { useState, useEffect } from "react";
import { fetchBcvRate } from "../services/api.js";

// Hook que obtiene la tasa BCV vigente (usa el caché de fetchBcvRate)
export function useBcvRate() {
  const [rate, setRate] = useState(null);

  useEffect(() => {
    let active = true;
    fetchBcvRate()
      .then((r) => {
        if (active) setRate(r);
      })
      .catch(() => {
        console.warn("No se pudo obtener la tasa BCV");
      });
    return () => {
      active = false;
    };
  }, []);

  return rate;
}