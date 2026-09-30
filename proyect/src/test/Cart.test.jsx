import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Cart from '../Client/pages/Cart.jsx';

// El carrito consulta la tasa BCV: la stubbeamos para no hacer fetch real.
// importOriginal conserva el resto de exportaciones del módulo (getToken, etc).
vi.mock('../Client/services/api.js', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchBcvRate: vi.fn().mockResolvedValue(36.5),
}));

const sampleItems = [
  {
    id: 1,
    name: 'Velvet Lip Tint',
    brand: 'Rosé Studio',
    category: 'Labios',
    description: 'Tinte labial',
    price: 24.5,
    stock: 10,
    image: 'lip.png',
    quantity: 1,
  },
  {
    id: 2,
    name: 'Silk Foundation',
    brand: 'Rosé Studio',
    category: 'Rostro',
    description: 'Base sedosa',
    price: 42,
    stock: 3,
    image: 'foundation.png',
    quantity: 1,
  },
];

function renderCart(items = sampleItems, onChangeQty = vi.fn()) {
  const onClose = vi.fn();
  render(
    <MemoryRouter>
      <Cart isOpen onClose={onClose} cartItems={items} onChangeQty={onChangeQty} />
    </MemoryRouter>
  );
  return { onClose, onChangeQty };
}

describe('Cart', () => {
  it('muestra el número de ítems del carrito', () => {
    renderCart();
    expect(screen.getByText(/Tu carrito/)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /−|\+/ })).toHaveLength(4);
  });

  it('muestra estado vacío cuando no hay productos', () => {
    renderCart([]);
    expect(screen.getByText('Carrito vacío')).toBeInTheDocument();
    expect(screen.getByText('Explora el catálogo y agrega productos')).toBeInTheDocument();
  });

  it('calcula el total correctamente', () => {
    renderCart();
    // 24.50 + 42.00 = 66.50
    expect(screen.getAllByText('$66.50').length).toBeGreaterThan(0);
  });

  it('deshabilita el botón + cuando se alcanza el stock', () => {
    // El producto 2 tiene stock 3 y ya está en 3 → su + debe estar deshabilitado.
    const atStock = [{ ...sampleItems[1], quantity: 3 }];
    renderCart(atStock);
    const plusButtons = screen.getAllByRole('button', { name: '+' });
    const disabled = plusButtons.filter((b) => b.disabled);
    expect(disabled.length).toBeGreaterThan(0);
  });

  it('llama a onChangeQty con el id y el delta al pulsar +', async () => {
    const user = userEvent.setup();
    const { onChangeQty } = renderCart();
    const plusButtons = screen.getAllByRole('button', { name: '+' });
    await user.click(plusButtons[0]);
    expect(onChangeQty).toHaveBeenCalledWith(1, 1);
  });

  it('llama a onChangeQty con delta negativo al pulsar −', async () => {
    const user = userEvent.setup();
    const { onChangeQty } = renderCart();
    const minusButtons = screen.getAllByRole('button', { name: '−' });
    await user.click(minusButtons[0]);
    expect(onChangeQty).toHaveBeenCalledWith(1, -1);
  });

  it('llama a onClose al pulsar el botón de cerrar', async () => {
    const user = userEvent.setup();
    const { onClose } = renderCart();
    await user.click(screen.getByRole('button', { name: '✕' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('muestra el precio unitario de cada producto', () => {
    renderCart();
    expect(screen.getAllByText('$24.50').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$42.00').length).toBeGreaterThan(0);
  });

  it('el botón Ir a Pagar existe cuando hay productos', () => {
    renderCart();
    expect(screen.getByRole('button', { name: /Ir a Pagar/ })).toBeInTheDocument();
  });

  it('no muestra Ir a Pagar con el carrito vacío', () => {
    renderCart([]);
    expect(screen.queryByRole('button', { name: /Ir a Pagar/ })).not.toBeInTheDocument();
  });
});
