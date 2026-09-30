import { describe, it, expect, beforeEach } from 'vitest';
import { lockScroll, unlockScroll } from '../Client/utils/scrollLock.js';

describe('scrollLock', () => {
  beforeEach(() => {
    // El módulo mantiene un contador interno entre tests: liberamos todos
    // los locks pendientes y limpiamos los estilos.
    for (let i = 0; i < 5; i++) unlockScroll();
    document.body.style.position = '';
    document.body.style.top = '';
  });

  it('fija el body al bloquear', () => {
    lockScroll();
    expect(document.body.style.position).toBe('fixed');
  });

  it('restaura los estilos al liberar', () => {
    lockScroll();
    unlockScroll();
    expect(document.body.style.position).toBe('');
  });

  it('no restaura hasta que todos los locks se liberan (anidamiento)', () => {
    lockScroll();
    lockScroll();
    unlockScroll();
    // Aún queda un lock activo: el body debe seguir fijo.
    expect(document.body.style.position).toBe('fixed');
    unlockScroll();
    expect(document.body.style.position).toBe('');
  });

  it('nunca baja de cero el contador de locks', () => {
    unlockScroll();
    expect(document.body.style.position).toBe('');
  });
});
