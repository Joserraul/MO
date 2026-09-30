/**
 * Contrato del diseno oficial: GLASS OSCURO.
 *
 * Este archivo es la red de seguridad del proyecto. El estilo actual es el
 * principal y no se modifica por accidente: si un `.css` cambia, la suite
 * falla y hay que re-sellar el manifiesto a proposito (npm run design:manifest).
 *
 * Tres capas:
 *   A. Los tokens del `:root` de index.css siguen siendo los del glass oscuro.
 *   B. Los valores concretos del diseno aprobado se mantienen exactos.
 *   C. Ninguna hoja de estilos cambio de bytes.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import manifest from './design-manifest.json';

const root = process.cwd();
const stylesDir = join(root, 'src', 'Client', 'styles');

const readCss = (rel: string) => readFileSync(join(root, rel), 'utf8');
const indexCss = readCss('src/Client/index.css');

/** Los tokens viven en el `:root` de index.css (no hay tokens.css). */
const rootBlock = indexCss.match(/:root\s*\{([^}]*)\}/)?.[1] ?? '';

function token(name: string) {
  const m = rootBlock.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  return m ? m[1].trim() : '';
}

/* ---------------- A. tokens del glass oscuro ---------------- */

describe('el estilo oficial sigue siendo glass oscuro', () => {
  it('declara fondo negro profundo', () => {
    expect(token('bg')).toBe('#0a0a0a');
  });

  it('declara texto claro sobre el fondo oscuro', () => {
    expect(token('fg').toLowerCase()).toBe('#e0e0e0');
  });

  it('declara el radio caracteristico del glass', () => {
    expect(token('radius')).toBe('24px');
  });

  it('usa Cormorant Garamond para titulos y DM Sans para texto', () => {
    expect(token('font-display')).toContain('Cormorant Garamond');
    expect(token('font-body')).toContain('DM Sans');
  });

  it('fuerza los controles nativos en modo oscuro', () => {
    expect(rootBlock).toContain('color-scheme: dark');
  });

  it('el body pinta el fondo con el token, no con un color literal', () => {
    expect(indexCss).toMatch(/background-color:\s*var\(--bg\)/);
  });

  it('no existe ningun token de tema claro', () => {
    expect(rootBlock.match(/--(?:bg|surface)-\w*light\w*\s*:/g)).toBeNull();
  });

  it('el fondo es mas oscuro que el texto (contraste correcto)', () => {
    const bg = parseInt(token('bg').replace('#', ''), 16);
    const fg = parseInt(token('fg').replace('#', ''), 16);
    expect(bg).toBeLessThan(fg);
  });
});

/* ---------------- B. valores congelados ---------------- */

const tokenMap = new Map<string, string>();
for (const m of rootBlock.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
  tokenMap.set(m[1], m[2].trim());
}

function resolveVars(value: string, depth = 0): string {
  if (depth > 10) return value;
  return value.replace(
    /var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^)]*))?\)/gi,
    (whole: string, name: string, fallback?: string) => {
      const v = tokenMap.get(name);
      if (v === undefined) return fallback !== undefined ? fallback.trim() : whole;
      return resolveVars(v, depth + 1);
    }
  );
}

/**
 * Valor final de una propiedad, con los var() ya resueltos. Toma la ultima
 * regla que contenga el selector exacto, para que `body` no se confunda con
 * `html, body` ni `.cart-drawer` con `.cart-drawer.open`.
 */
function resolved(file: string, selector: string, prop: string) {
  const css = readCss(file).replace(/\/\*[\s\S]*?\*\//g, '');
  const target = selector.trim();
  const declRe = new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`);

  let value = null;
  let sawSelector = false;
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = ruleRe.exec(css)) !== null) {
    const selectorList = m[1]
      .split(',')
      .map((s) => s.trim().replace(/\s+/g, ' '))
      .filter((s) => s.length > 0);
    if (!selectorList.includes(target)) continue;
    sawSelector = true;
    const decl = declRe.exec(m[2]);
    if (decl) value = decl[1];
  }
  if (!sawSelector) throw new Error(`No se encontro el selector ${target} en ${file}`);
  if (value === null) throw new Error(`No se encontro ${prop} en ${target} (${file})`);

  return resolveVars(value.trim()).replace(/\s+/g, ' ').trim();
}

describe('los valores del diseno original se conservan', () => {
  it('el body mantiene fondo negro y espacio para el navbar', () => {
    expect(resolved('src/Client/index.css', 'body', 'background-color')).toBe('#0a0a0a');
    expect(resolved('src/Client/index.css', 'body', 'padding-top')).toBe('4rem');
  });

  it('el contenedor mantiene su ancho maximo', () => {
    expect(resolved('src/Client/index.css', '.container', 'max-width')).toBe('80rem');
  });

  it('el titulo de seccion mantiene su tamaño original', () => {
    // Regresion ya corregida en el pasado: habia bajado a 1.375rem.
    expect(resolved('src/Client/index.css', '.section-title', 'font-size')).toBe('1.5rem');
  });

  it('el numero de cantidad del catalogo conserva su color original', () => {
    // Negro sobre el vidrio del catalogo: es el diseno aprobado.
    expect(resolved('src/Client/styles/AddQty.css', '.qty-num', 'color')).toBe('#000000');
  });

  it('el navbar conserva su fondo translucido', () => {
    expect(resolved('src/Client/styles/header.css', '.Navbar', 'background')).toBe(
      'rgba(10, 10, 10, 0.7)'
    );
  });

  it('el carrito lateral conserva su fondo', () => {
    expect(resolved('src/Client/styles/CartDrawer.css', '.cart-drawer', 'background')).toBe(
      'rgba(14, 14, 14, 0.92)'
    );
  });

  it('el banner mantiene su altura', () => {
    expect(resolved('src/Client/styles/hero.css', '.hero-banner img', 'height')).toBe(
      'clamp(280px, 45vw, 620px)'
    );
  });

  it('las fotos de producto se muestran completas, sin recortarse', () => {
    expect(
      resolved('src/Client/styles/productgrid.css', '.product-img-wrap img', 'object-fit')
    ).toBe('contain');
  });
});

/* ---------------- C. sello de bytes ---------------- */

const cssFiles = [
  'src/Client/index.css',
  ...readdirSync(stylesDir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => `src/Client/styles/${f}`),
].sort();

/** El manifiesto se indexa por ruta de hoja; el sellado lo recorre con cssFiles. */
const approvedHashes = manifest.files as Record<string, string>;

describe('ninguna hoja de estilos cambio sin aprobacion', () => {
  it('no hay hojas de estilo nuevas fuera del manifiesto', () => {
    expect(cssFiles).toEqual(Object.keys(manifest.files).sort());
  });

  it.each(cssFiles)('%s conserva exactamente su contenido aprobado', (file) => {
    const hash = createHash('sha256')
      .update(readFileSync(join(root, file)))
      .digest('hex')
      .slice(0, 16);
    expect(hash).toBe(approvedHashes[file]);
  });
});
