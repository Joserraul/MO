import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveSession, getToken, clearSession, loginUser } from '../Client/services/api.js';

const sampleUser = {
  id: 1,
  username: 'Ana',
  email: 'ana@test.com',
  role: 'user',
};

describe('api - sesión', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('saveSession guarda el token y el usuario', () => {
    saveSession('jwt-123', sampleUser);
    expect(getToken()).toBe('jwt-123');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(sampleUser);
  });

  it('clearSession elimina token y usuario', () => {
    saveSession('jwt-123', sampleUser);
    clearSession();
    expect(getToken()).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('getToken devuelve null si no hay sesión', () => {
    expect(getToken()).toBeNull();
  });
});

describe('api - loginUser', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('devuelve token y usuario al hacer login correcto', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'jwt-abc', user: sampleUser }),
      })
    );

    const result = await loginUser('ana@test.com', '123456');
    expect(result.token).toBe('jwt-abc');
    expect(result.user.email).toBe('ana@test.com');
  });

  it('lanza error con credenciales incorrectas', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      })
    );

    await expect(loginUser('ana@test.com', 'mala')).rejects.toThrow('Credenciales incorrectas');
  });
});
