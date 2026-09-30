import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Client/components/Navbar.jsx';

vi.mock('../Client/services/api.js', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchProducts: vi.fn().mockResolvedValue([]),
  fetchBcvRate: vi.fn().mockResolvedValue(36.5),
}));

const user = { id: 1, username: 'Ana', email: 'ana@test.com', role: 'user' };
const admin = { id: 2, username: 'Root', email: 'root@test.com', role: 'admin' };

function renderNavbar(sessionUser = null) {
  if (sessionUser) localStorage.setItem('user', JSON.stringify(sessionUser));
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  it('muestra "Iniciar sesión" sin usuario', () => {
    renderNavbar();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('muestra el saludo y el logout con usuario', () => {
    renderNavbar(user);
    expect(screen.getByText(/Hola, Ana/)).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
  });

  it('muestra el enlace Admin solo a administradores', () => {
    renderNavbar(admin);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('no muestra el enlace Admin a usuarios normales', () => {
    renderNavbar(user);
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('el botón del carrito está disponible siempre', () => {
    renderNavbar();
    expect(screen.getByRole('button', { name: 'Ver carrito' })).toBeInTheDocument();
  });

  it('Salir borra la sesión del almacenamiento', async () => {
    const u = userEvent.setup();
    renderNavbar(user);
    await u.click(screen.getByText('Salir'));
    expect(localStorage.getItem('user')).toBeNull();
  });
});
