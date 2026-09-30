import { describe, it, expect } from 'vitest';
import { formatBs } from '../Client/utils/format.js';

describe('formatBs', () => {
  it('formatea con 2 decimales', () => {
    expect(formatBs(10.5)).toBe('10,50');
  });

  it('usa el separador de miles es-VE', () => {
    expect(formatBs(1234.5)).toBe('1.234,50');
  });

  it('maneja cero', () => {
    expect(formatBs(0)).toBe('0,00');
  });

  it('redondea a 2 decimales', () => {
    expect(formatBs(3.456)).toBe('3,46');
  });
});
