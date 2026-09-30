import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Limpia el DOM y los mocks entre pruebas para evitar fugas de estado.
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});

// jsdom no implementa scrollTo: lo stubamos para no romper los componentes.
window.scrollTo = vi.fn();

// jsdom no implementa matchMedia.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});
