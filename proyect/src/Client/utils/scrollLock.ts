/**
 * Bloquea el scroll de la página conservando la posición actual,
 * para que al abrir/cerrar drawer o modal no salte al inicio.
 */
let locks = 0;
let savedY = 0;

export function lockScroll(): void {
  if (locks === 0) {
    savedY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
  }
  locks++;
}

export function unlockScroll(): void {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    window.scrollTo(0, savedY);
  }
}
