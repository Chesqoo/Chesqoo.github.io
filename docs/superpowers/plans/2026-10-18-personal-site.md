# Web personal chesqoo.github.io: plan de construcción

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar en `https://chesqoo.github.io/` la web personal de una sola página, estilo cartel suizo, bilingüe EN/ES, tal como la fijan el documento de diseño y el boceto aprobado.

**Architecture:** Sitio estático servido por GitHub Pages desde `main`, en la raíz. Un `index.html` con los dos idiomas en el marcado (cada texto duplicado con `lang="en"` y `lang="es"`, y el que no toca oculto por CSS), un `styles.css` y un `lang.js` mínimo. Sin build ni dependencias. Un script de comprobación en Node, sin paquetes, vigila el contenido y el contraste.

**Tech Stack:** HTML, CSS, JS sin librerías, Node 24 (solo para `tests/check.mjs`) y Edge sin interfaz (solo para generar `og.png`).

**Spec:** `docs/superpowers/specs/2026-10-18-personal-site-design.md`. Boceto: `docs/superpowers/specs/2026-10-18-personal-site-mockup.html`, que es la fuente de textos, marcado y CSS.

## Global Constraints

- Sin framework, sin paso de build y sin dependencias npm.
- Inglés por defecto: `<html lang="en" class="en">`. Sin JS, la web se ve completa en inglés.
- Tokens claros: fondo `#f2f1ed`, tinta `#111111`, gris `#6f6d67`, filete `#cfcdc6`, rojo `#d8371f`.
- Fuente única: Archivo, alojada en el repo y precargada.
- El rojo solo aparece en: la última palabra del titular, los números de sección, el subrayado del idioma activo, el subrayado del correo y los estados hover.
- Copy: los textos exactos del boceto. Sin raya larga (—), sin MAYÚSCULAS con tracking, sin cifras de trabajo, sin teléfono y sin enlace a CV.
- Nada salta: sin cambios de layout al cargar la fuente ni al cambiar de idioma. Solo hay animaciones de color, de transform y la entrada del titular, que se anula con `prefers-reduced-motion`.
- Enlaces: Montepío `https://chesqoo.github.io/savings-calculator/`, QRated `https://chesqoo.github.io/qrated/`, GitHub `https://github.com/Chesqoo`, LinkedIn `https://www.linkedin.com/in/francisco-javier-moralessp/` y correo `mailto:francisco.j.moralessp@gmail.com`. paper-repo va sin enlace y con «Soon» / «Próximamente».
- Crear el repo en GitHub y publicar requiere el OK explícito de Francisco en el chat.

## Review Focus

- **320 px de ancho**: «cyberintelligence», el correo y los nombres de proyecto no deben provocar scroll horizontal. Comprobación en el navegador, Task 3.
- **`localStorage` bloqueado** (modo privado, cookies bloqueadas): el cambio de idioma funciona y no lanza error, solo no se recuerda. Asserts en `check.mjs` y prueba en el navegador, Task 3.
- **Paridad de idiomas**: cada texto en inglés tiene su par en español; si falta uno, al cambiar de idioma queda un hueco. `check.mjs`, Task 1.
- **Tema oscuro**: el rojo y el gris en texto pequeño deben llegar a 4.5:1 sobre el fondo oscuro. `check.mjs`, Task 2.
- **Fuente que no carga**: la página sigue legible con la fuente de respaldo y sin solapes. Comprobación en el navegador bloqueando el woff2, Task 2.

---

### Task 1: Página en HTML con contenido bilingüe y comprobaciones de contenido

**Files:**
- Create: `index.html`, `tests/check.mjs`, `.nojekyll` (vacío; evita que Jekyll procese el sitio)

**Interfaces:**
- Produces: `index.html` con las clases del boceto (`.wrap`, `.grid`, `.bar`, `.hero`, `.intro`, `section.s`, `.lab`, `.body`, `.now`, `.proj`, `.proj.soon`, `.ar`, `.i`, `.contact`, `.big`, `.mail`, `.links`, `.foot`) y los botones `button[data-set="en"|"es"][aria-pressed]`. `<link rel="stylesheet" href="styles.css">` y `<script src="lang.js"></script>` en `<head>`, sin `defer`. Así `lang.js` aplica el idioma antes de pintar.
- Produces: `node tests/check.mjs`, que sale con código 0 si todo pasa e imprime cada fallo. Tasks 2 y 4 le añaden asserts.

- [ ] **Step 1: Escribir `tests/check.mjs` con estos asserts sobre `index.html`** (solo `node:fs` y `node:assert`, con regex sobre el texto; sin parser)
  - `parity`: número de elementos con `lang="en"` dentro de `<body>` === número con `lang="es"`.
  - `links`: contiene cada URL de Global Constraints y no contiene `href="#"`.
  - `paperRepoNoLink`: el bloque de paper-repo es `<div class="proj soon">` y contiene `Soon` y `Próximamente`.
  - `noEmDash`: no aparece `—`.
  - `noPhone`: no aparece `607` ni `+34`.
  - `noCv`: no aparece `/CV|\.pdf/`.
  - `defaultEn`: contiene `<html lang="en" class="en">`.
- [ ] **Step 2: Ejecutar `node tests/check.mjs`.** Esperado: falla porque `index.html` no existe.
- [ ] **Step 3: Crear `index.html`** con el `<body>` del boceto, sustituyendo los `href="#"` por las URLs reales. Los enlaces externos llevan `rel="noopener"` y `target="_blank"`, salvo el `mailto:`. Quitar el `<style>` y el `<script>` en línea, que pasan a Tasks 2 y 3. En `<head>`: `charset`, `viewport` y `<title>Francisco Javier Morales</title>`.
- [ ] **Step 4: Ejecutar `node tests/check.mjs`.** Esperado: `ok`, código 0.
- [ ] **Step 5: Commit** `feat: página con contenido bilingüe y comprobaciones`

### Task 2: Estilos, fuente local, tema oscuro y entrada del titular

**Files:**
- Create: `styles.css`, `fonts/archivo-latin.woff2`
- Modify: `index.html` (`<link rel="preload">` de la fuente), `tests/check.mjs` (contraste)

**Interfaces:**
- Consumes: las clases de Task 1.
- Produces: custom properties `--bg --ink --grey --hair --rule --red` en `:root`, redefinidas en `@media (prefers-color-scheme: dark)`.

- [ ] **Step 1: Añadir a `check.mjs` el assert `contrast`.** Lee los valores de `--bg`, `--ink`, `--grey` y `--red` de cada bloque (claro y oscuro) en `styles.css` y exige un contraste WCAG ≥ 4.5 para ink, grey y red contra bg. Implementar `contrast(hexA, hexB): number` con la fórmula de luminancia relativa de WCAG 2.x.
- [ ] **Step 2: Ejecutar.** Esperado: falla porque falta `styles.css`.
- [ ] **Step 3: Descargar Archivo variable (pesos 100–900), subconjunto latino, a `fonts/archivo-latin.woff2`.** Se obtiene la URL pidiendo `https://fonts.googleapis.com/css2?family=Archivo:wght@400..900&display=block` con un User-Agent de Chrome y cogiendo el bloque `/* latin */`. Comprobar que el archivo pesa menos de 100 KB.
- [ ] **Step 4: Crear `styles.css`.** Contiene:
  - el CSS del boceto;
  - `@font-face { font-family: 'Archivo'; src: url(fonts/archivo-latin.woff2) format('woff2'); font-weight: 100 900; font-display: block; }`;
  - la regla `html.en [lang="es"], html.es [lang="en"] { display: none; }`;
  - el tema oscuro: `--bg: #121211; --ink: #f2f1ed; --grey: #9a978f; --hair: #34332f; --rule: #f2f1ed; --red: #e5492f`;
  - la entrada `.hero h1 { animation: rise .7s cubic-bezier(.2,.7,.2,1) both }` con `@keyframes rise { from { opacity: 0; transform: translateY(14px) } }`;
  - y `@media (prefers-reduced-motion: reduce) { .hero h1 { animation: none } * { transition: none !important } }`.

  En `index.html`, añadir `<link rel="preload" href="fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>`.
- [ ] **Step 5: Ejecutar `node tests/check.mjs`.** Esperado: `ok`. Si un contraste falla, oscurecer o aclarar solo ese token hasta que pase y anotar el valor final en el commit.
- [ ] **Step 6: Comprobar en el navegador** (`python -m http.server 4173`; desde `file://` la fuente no se precarga):
  - claro y oscuro (`prefers-color-scheme`) a 1280 px: coincide con el boceto;
  - con el woff2 bloqueado en DevTools: texto legible en la fuente de respaldo y sin solapes.
- [ ] **Step 7: Commit** `feat: estilos, fuente local, tema oscuro y entrada del titular`

### Task 3: Cambio de idioma recordado

**Files:**
- Create: `lang.js`

**Interfaces:**
- Consumes: `button[data-set]` de Task 1 y la regla `html.en/html.es` de Task 2.
- Produces: el idioma activo en `localStorage['lang']` (`"en"` o `"es"`).

- [ ] **Step 1: Añadir a `check.mjs` el assert `langSafe`.** Sobre `lang.js`: cada aparición de `localStorage` está dentro de un `try { … } catch`, y el script solo acepta `"en"` o `"es"` (contiene `=== 'es'` o equivalente; cualquier otro valor guardado se ignora).
- [ ] **Step 2: Ejecutar.** Esperado: falla porque falta `lang.js`.
- [ ] **Step 3: Crear `lang.js`.** Contiene:
  - `setLang(l: 'en' | 'es'): void`, que pone `document.documentElement.className = l`, `.lang = l` y `aria-pressed` en los dos botones, e intenta guardar `l` en `localStorage`;
  - en la primera ejecución (dentro de `<head>`), lee `localStorage['lang']` y, si es `'es'`, aplica la clase y `lang` sin tocar botones, que aún no existen;
  - en `DOMContentLoaded`, sincroniza `aria-pressed` y engancha los clics a `setLang`.
- [ ] **Step 4: Ejecutar `node tests/check.mjs`.** Esperado: `ok`.
- [ ] **Step 5: Comprobar en el navegador:**
  - ES cambia todos los textos y nada que no sea texto se mueve;
  - al recargar sigue en ES;
  - en ventana privada con cookies bloqueadas funciona sin errores en consola;
  - a 320 px y a 375 px, `document.documentElement.scrollWidth === innerWidth` en EN y en ES.
- [ ] **Step 6: Commit** `feat: cambio de idioma recordado`

### Task 4: Metadatos, favicon, imagen para compartir y 404

**Files:**
- Create: `favicon.svg`, `og.png`, `tools/og.html`, `404.html`
- Modify: `index.html` (`<head>`), `tests/check.mjs`

**Interfaces:**
- Consumes: `styles.css`, `lang.js` y la fuente de Tasks 2 y 3.

- [ ] **Step 1: Añadir a `check.mjs` el assert `meta`.** `index.html` contiene `name="description"`, `property="og:title"`, `property="og:image"` con `https://chesqoo.github.io/og.png`, `name="twitter:card"` con `summary_large_image`, `rel="icon"` con `favicon.svg`, `name="theme-color"` y `rel="canonical"` con `https://chesqoo.github.io/`. Además, `404.html` existe y cumple `noEmDash`.
- [ ] **Step 2: Ejecutar.** Esperado: falla.
- [ ] **Step 3: Crear los archivos:**
  - **`favicon.svg`**: cuadrado `#d8371f` de 32×32 con radio 3.
  - **`tools/og.html`**: 1200×630, fondo `#f2f1ed`, la barra con el nombre y el titular «Local AI, useful and *secure.*» en Archivo 900 con el rojo, usando `../styles.css` y la fuente local.
  - **`og.png`**: generado con `"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu --screenshot="$PWD/og.png" --window-size=1200,630 "file:///$PWD/tools/og.html"`.
  - **`404.html`**: la misma barra, «404.» en el tamaño del titular con el punto en rojo, «Nothing here.» / «Aquí no hay nada.» y un enlace «Back home» / «Volver al inicio» a `/`.
  - **Metadatos** en `index.html`:
    - description: «Francisco Javier Morales. Researching local AI and building things that add value.»
    - og:title: «Francisco Javier Morales»
- [ ] **Step 4: Ejecutar `node tests/check.mjs`.** Esperado: `ok`. Abrir `og.png`: el titular entra entero, sin recortes.
- [ ] **Step 5: Commit** `feat: metadatos, favicon, imagen para compartir y 404`

### Task 5: Publicar en GitHub Pages

**Files:** ninguno nuevo.

- [ ] **Step 1: Pedir OK a Francisco en el chat** para crear el repo público `Chesqoo/Chesqoo.github.io` y publicar. Avisarle de que `docs/` (diseño, plan y boceto) también quedará visible en el repo y en la web.
- [ ] **Step 2: Crear y subir:** `gh repo create Chesqoo/Chesqoo.github.io --public --source . --push`.
- [ ] **Step 3: Activar Pages si no lo está.** Comprobar con `gh api repos/Chesqoo/Chesqoo.github.io/pages`. Si da 404: `gh api -X POST repos/Chesqoo/Chesqoo.github.io/pages -f "source[branch]=main" -f "source[path]=/"`.
- [ ] **Step 4: Verificar en vivo**, cuando el último despliegue de `gh api repos/Chesqoo/Chesqoo.github.io/pages/builds/latest` esté en `built`:
  - `https://chesqoo.github.io/` carga, con la fuente y en EN;
  - `https://chesqoo.github.io/qrated/` y `https://chesqoo.github.io/savings-calculator/` siguen funcionando;
  - `https://chesqoo.github.io/no-existe` muestra el 404 propio.
