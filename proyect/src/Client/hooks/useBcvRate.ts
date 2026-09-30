import { useState, useEffect } from "react";
import { fetchBcvRate } from "../services/api.js";

/**
 * Hook que obtiene la tasa BCV vigente (usa el caché de fetchBcvRate).
 * Devuelve null mientras la tasa no ha llegado o si la peticion falla.
 */
export function useBcvRate(): number | null {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetchBcvRate()
      .then((r: number) => {
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
