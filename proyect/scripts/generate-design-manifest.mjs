/**
 * Sella el CSS aprobado: guarda el hash de cada hoja de estilos.
 *
 * src/test/design.test.js compara los hashes contra este manifiesto, asi que
 * cualquier cambio de estilo rompe la suite. Eso es intencional: el diseno
 * glass oscuro es el oficial y no debe alterarse sin revisarlo.
 *
 * Para cambiar el estilo a proposito:
 *   1. edita el CSS
 *   2. revisa la diferencia en el navegador
 *   3. npm run design:manifest   (re-sella el archivo)
 *   4. commit del CSS + del manifiesto, con larevision del usuario
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const stylesDir = join(root, 'src', 'Client', 'styles');

const files = [
  'src/Client/index.css',
  ...readdirSync(stylesDir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => `src/Client/styles/${f}`),
].sort();

const hashes = {};
for (const file of files) {
  hashes[file] = createHash('sha256').update(readFileSync(join(root, file))).digest('hex').slice(0, 16);
}

const out = {
  _nota:
    'Hashes del CSS aprobado. Cambiar el estilo exige re-sellar con ' +
    '"npm run design:manifest" y la revision del usuario.',
  files: hashes,
};

writeFileSync(join(root, 'src/test/design-manifest.json'), `${JSON.stringify(out, null, 2)}\n`);
console.log(`${files.length} hojas de estilos selladas en src/test/design-manifest.json`);
