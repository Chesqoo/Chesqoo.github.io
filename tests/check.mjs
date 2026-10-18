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

let failed = 0;
for (const [name, fn] of checks) {
  try { fn(); } catch (e) { failed++; console.error(`FAIL ${name}: ${e.message}`); }
}
if (failed) process.exit(1);
console.log('ok');
