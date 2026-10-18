# Web personal en chesqoo.github.io: diseño

Fecha: 2026-10-18
Boceto aprobado: [2026-10-18-personal-site-mockup.html](2026-10-18-personal-site-mockup.html). Es la referencia visual y de textos; este documento explica el porqué y lo que el boceto no muestra.

## Intención

Francisco Javier Morales quiere una web personal en `https://chesqoo.github.io/` para que reclutadores y gente interesada en su perfil sepan quién es y qué hace.

Lo que la hace suya:

- **Distinta a sus apps.** paper-repo, Montepío y QRated comparten una estética de papel y tinta. Aquí no la quiere: «no quiero que parezca un folio».
- **Cartel suizo.** Eligió esta dirección frente a un portfolio oscuro clásico, un plano técnico y una página de manual. Tipografía grotesca enorme, rejilla, filetes negros y un solo rojo.
- **Misterio, no currículum.** Rechazó las cifras de su trabajo y los detalles concretos («demasiado cantoso»). La web insinúa; el detalle está en el CV y en LinkedIn.
- **Sobria.** Rechazó las metáforas ingeniosas («IA que guarda secretos» le pareció cheesy y cutre). Frases llanas y cortas.
- **Lo que le importa es aportar valor**, no cuánta gente usa lo que hace.

## Objetivos

- Que en unos segundos quede claro: investiga IA local y ciberinteligencia, hace cosas útiles y se le puede escribir.
- Bilingüe: inglés por defecto y un botón EN / ES.
- Que se vea profesional: nada salta, con buena tipografía, y funciona en móvil.

## No objetivos

- Ni blog ni artículos.
- Ni cifras, ni logros, ni nombres de empresas o puestos detallados.
- Ni formulario de contacto: basta un enlace `mailto:`.
- Ni analítica ni cookies.

## Antiobjetivos (fallaría aunque funcione)

- Parecer de la familia de sus apps: papel, Literata o IBM Plex.
- Lo que «grita IA»: degradados, tarjetas con sombra, emojis como iconos, etiquetas en MAYÚSCULAS con tracking, raya larga (—) en los textos, pastillas de color rellenas, botones enormes a todo el ancho y copy de landing.
- Que algo salte al cargar: el cambio de fuente, el cambio de idioma o las imágenes.
- Textos con metáforas o con tono vendedor.
- Publicar su teléfono.

## Restricciones

- Repo `Chesqoo/Chesqoo.github.io` (ya existe en local; aún no en GitHub), publicado con GitHub Pages desde `main`, en la raíz.
- Las páginas de proyecto que ya existen (`/qrated/` y `/savings-calculator/`) siguen funcionando, porque viven en sus propios repos.
- HTML y CSS estáticos, sin framework ni paso de build. Un poco de JS solo para el idioma.
- Debe verse bien desde 320 px de ancho hasta escritorio grande, sin scroll horizontal.

## Lo decidido

### Estructura (una sola página, en este orden)

| Bloque | Contenido |
|---|---|
| **Barra** | Nombre a la izquierda, «Madrid» y el selector EN / ES a la derecha. Debajo, un filete negro de 2 px |
| **Titular** | «Local AI, useful and *secure.*» / «IA local, útil y *segura.*», en tres líneas y con la última palabra en rojo |
| **Entradilla** | «I research artificial intelligence and cyberintelligence. The rest of the time I build things I believe are worth having.» / «Investigo en inteligencia artificial y ciberinteligencia. El resto del tiempo hago cosas que creo que aportan valor.» |
| **01 Now / Ahora** | Tres frases grandes y paralelas (ver abajo) |
| **02 Things I made / Cosas que he hecho** | paper-repo, Montepío y QRated |
| **03 Contact / Contacto** | «Let's talk.» / «Hablemos.» en grande, el correo debajo y los enlaces GitHub, LinkedIn y CV |
| **Pie** | «Madrid, 2026» y «Set in Archivo» / «Compuesto en Archivo» |

### Ahora / Now

| EN | ES | Pie en gris |
|---|---|---|
| Researching local AI. | Investigar IA local. | PhD research, Universidad Politécnica de Madrid / Doctorado, Universidad Politécnica de Madrid |
| Building things that add value. | Hacer cosas que aporten valor. | Engineering in industry / Ingeniería en empresa |
| Teaching what I learn. | Enseñar lo que aprendo. | Sin pie |

### Proyectos

| # | Nombre | EN | ES | Enlace |
|---|---|---|---|---|
| 01 | paper-repo | Talk to your research papers without them leaving your machine. | Habla con tus papers sin que salgan de tu ordenador. | Ninguno: es privado. En lugar de la flecha lleva «Soon» / «Próximamente» en gris y no reacciona al ratón |
| 02 | Montepío | See where your savings could go. | Mira hasta dónde pueden llegar tus ahorros. | `https://chesqoo.github.io/savings-calculator/` |
| 03 | QRated | QR codes that look good in print. | Códigos QR que quedan bien impresos. | `https://chesqoo.github.io/qrated/` |

Las filas con enlace son enteras clicables. Al pasar el ratón, el nombre y la flecha se vuelven rojos y la flecha se desplaza 6 px.

### Contacto

- Correo: `francisco.j.moralessp@gmail.com`, como `mailto:`.
- GitHub: `https://github.com/Chesqoo`.
- LinkedIn: **pendiente**; Francisco pasará la URL.
- CV: **pendiente** (ver «Abierto»).

### Sistema visual

| Token | Valor |
|---|---|
| Fondo | `#f2f1ed` |
| Tinta | `#111111` |
| Gris | `#6f6d67` |
| Filete fino | `#cfcdc6` |
| Rojo, único acento | `#d8371f` |
| Fuente | Archivo, 400, 500, 700 y 900 (Schibsted Grotesk se descartó porque deja huecos delante de comas y puntos) |
| Rejilla | 12 columnas, 20 px de separación, ancho máximo 1280 px y margen lateral `clamp(16px, 4vw, 48px)` |
| Secciones | Filete superior de 2 px, etiqueta «01 Now» con el número en rojo en las columnas 1–3 y contenido en las 4–12 |

Los tamaños y espaciados exactos están en el CSS del boceto: tómalos de ahí.

El rojo solo aparece en: la última palabra del titular, los números de sección, el subrayado del idioma activo, el subrayado del correo y los estados hover.

### Idioma

- Inglés por defecto (`<html lang="en">`).
- El botón ES cambia todos los textos al momento, sin recargar y sin que se mueva nada que no sea texto.
- `lang` del `<html>` y `aria-pressed` de los botones se actualizan.

### Movimiento

- Nada salta. Solo hay transiciones de color y el desplazamiento de la flecha en hover.
- El titular entra al cargar con un deslizamiento suave hacia arriba. Con `prefers-reduced-motion`, no hay animación.

### Tema oscuro

La misma rejilla sobre un fondo casi negro, con el mismo rojo (ajustado si hace falta para el contraste).

## Lo que decide quien lo construya (y mis decisiones, marcadas)

- **Mía:** el tema oscuro sigue `prefers-color-scheme`, sin botón. En un cartel, cuantos menos controles, mejor.
- **Mía:** el idioma elegido se recuerda en `localStorage`, envuelto en try/catch. No se autodetecta: el inglés es lo que pidió por defecto.
- **Mía:** Archivo se aloja en el repo (woff2, subconjunto latino) con `preload`, para que la fuente no cambie de golpe al cargar. Si se usa una fuente de respaldo, con `size-adjust`.
- Cómo se guardan los textos bilingües: el boceto duplica cada texto con `lang` y lo oculta por CSS. Vale mantenerlo así.
- Valores exactos del tema oscuro.
- Comprobar el contraste del rojo sobre el fondo en textos pequeños (los «01») y oscurecerlo solo ahí si no llega a 4.5:1.
- Metadatos: `<title>`, descripción, Open Graph con una imagen que imite el titular del cartel, y favicon sobrio (por ejemplo, un cuadrado rojo).
- Página 404 con el mismo estilo.

## Abierto (lo decide Francisco)

- **URL de LinkedIn.**
- **CV público.** El PDF actual incluye su teléfono. Hay que decidir si se publica una versión sin teléfono, se enlaza a LinkedIn o no hay enlace al CV.

**Mía:** mientras no haya respuesta, el enlace afectado no se muestra. La web puede publicarse sin ellos.

Crear el repo en GitHub y publicar son pasos que Francisco confirma antes de hacerlos.
