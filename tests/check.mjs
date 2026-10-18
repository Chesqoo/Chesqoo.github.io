import { readFileSync } from 'node:fs';
import assert from 'node:assert';

const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const html = read('index.html');
const body = html.slice(html.indexOf('<body'));

// Cada check: [nombre, función]. Las tareas siguientes añaden entradas aquí.
const checks = [];
const check = (name, fn) => checks.push([name, fn]);
const count = (s, re) => (s.match(re) || []).length;

check('parity', () => {
  const en = count(body, /\blang="en"/g), es = count(body, /\blang="es"/g);
  assert.ok(en > 0 && en === es, `en=${en} es=${es}`);
});
check('links', () => {
  for (const u of [
    'https://chesqoo.github.io/savings-calculator/',
    'https://chesqoo.github.io/qrated/',
    'https://github.com/Chesqoo',
    'https://www.linkedin.com/in/francisco-javier-moralessp/',
    'mailto:francisco.j.moralessp@gmail.com',
  ]) assert.ok(html.includes(`href="${u}"`), `falta ${u}`);
  assert.ok(!html.includes('href="#"'), 'href="#"');
});
check('paperRepoNoLink', () => {
  const m = html.match(/<div class="proj soon">[\s\S]*?<\/div>/);
  assert.ok(m, 'no hay div.proj.soon');
  assert.ok(m[0].includes('Soon') && m[0].includes('Próximamente'));
});
check('noEmDash', () => assert.ok(!html.includes('—')));
check('noPhone', () => assert.ok(!/607|\+34/.test(html)));
check('noCv', () => assert.ok(!/CV|\.pdf/.test(html)));
check('defaultEn', () => assert.ok(html.includes('<html lang="en" class="en">')));
check('contrast', () => {
  const css = read('styles.css');
  const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
  const dark = css.match(/prefers-color-scheme: dark\)\s*\{[^{]*\{([^}]*)\}/);
  const light = css.match(/:root\s*\{([^}]*)\}/);
  assert.ok(dark && light, 'faltan bloques de tokens');
  for (const [theme, blk] of [['claro', light[1]], ['oscuro', dark[1]]]) {
    const v = (n) => (blk.match(new RegExp(`--${n}: *(#[0-9a-fA-F]{6})`)) || [])[1];
    for (const [t, min] of [['ink', 4.5], ['grey', 4.5], ['red-small', 4.5], ['red', 3]]) {
      assert.ok(v(t) && v('bg'), `${theme}: falta --${t} o --bg`);
      const r = contrast(v(t), v('bg'));
      assert.ok(r >= min, `${theme} ${t} ${v(t)} sobre ${v('bg')} = ${r.toFixed(2)}`);
    }
  }
});
check('langSafe', () => {
  const js = read('site.js');
  const n = count(js, /localStorage/g);
  assert.ok(n > 0, 'no usa localStorage');
  // cada localStorage va dentro de un try { ... } catch
  const tries = count(js, /try\s*\{[^}]*localStorage[^}]*\}\s*catch/g);
  assert.strictEqual(tries, n, `localStorage=${n}, dentro de try/catch=${tries}`);
  assert.ok(/===\s*'es'/.test(js), 'solo debe aceptar "es"');
  assert.ok(/===\s*'dark'\s*\|\|\s*\w+\s*===\s*'light'/.test(js), 'el tema guardado solo acepta "dark" o "light"');
});
check('themeTokens', () => {
  // El modo oscuro elegido a mano debe usar los mismos tokens que el del sistema.
  const css = read('styles.css');
  const sys = css.match(/:root:not\(\[data-theme="light"\]\)\s*\{([^}]*)\}/);
  const forced = css.match(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/);
  assert.ok(sys && forced, 'faltan los bloques de tema oscuro');
  assert.strictEqual(forced[1].trim(), sys[1].trim());
  for (const f of ['index.html', '404.html']) assert.ok(read(f).includes('class="theme"'), `${f} sin botón de tema`);
});
check('meta', () => {
  for (const s of [
    'name="description"', 'property="og:title"',
    'property="og:image" content="https://chesqoo.github.io/og.png"',
    'name="twitter:card" content="summary_large_image"',
    'rel="icon" href="favicon.svg"', 'name="theme-color"',
    'rel="canonical" href="https://chesqoo.github.io/"',
  ]) assert.ok(html.includes(s), `falta ${s}`);
  const nf = read('404.html');
  assert.ok(!nf.includes('—'), '404 con raya larga');
  for (const s of ['Nothing here.', 'Aquí no hay nada.', 'href="/"']) assert.ok(nf.includes(s), `404 sin ${s}`);
});

let failed = 0;
for (const [name, fn] of checks) {
  try { fn(); } catch (e) { failed++; console.error(`FAIL ${name}: ${e.message}`); }
}
if (failed) process.exit(1);
console.log('ok');
