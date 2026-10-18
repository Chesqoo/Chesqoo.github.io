(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var busy = false;

  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  // Corre en <head>: aplica lo guardado antes de pintar (sin parpadeo). Solo valores conocidos.
  if (load('lang') === 'es') { root.className = 'es'; root.lang = 'es'; }
  var savedTheme = load('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') root.setAttribute('data-theme', savedTheme);

  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function sync() {
    var b = document.querySelectorAll('button[data-set]');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', String(b[i].dataset.set === root.lang));
    var t = document.querySelector('.theme');
    if (t) { t.setAttribute('aria-pressed', String(isDark())); t.setAttribute('aria-label', isDark() ? 'Light mode' : 'Dark mode'); }
  }

  // Idioma: las letras se funden en manchas (desenfoque + umbral de alfa) y de ahí salen las del otro idioma.
  // Solo se filtran los textos bilingües; filetes, números y botones no se mueven.
  function blob(change) {
    var els = document.querySelectorAll('.wrap [lang]');
    var blur = document.querySelector('#goo feGaussianBlur');
    var PEAK = 7, HALF = 420, t0 = null, swapped = false;
    for (var i = 0; i < els.length; i++) els[i].classList.add('gooing');
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var t = ts - t0, k;
      if (t < HALF) { k = t / HALF; k = k * k; }
      else {
        if (!swapped) { change(); swapped = true; }
        k = 1 - Math.min(1, (t - HALF) / (HALF * 1.3)); k = k * k * k;
      }
      blur.setAttribute('stdDeviation', (PEAK * k).toFixed(2));
      if (t < HALF * 2.3) requestAnimationFrame(frame);
      else { for (var j = 0; j < els.length; j++) els[j].classList.remove('gooing'); busy = false; }
    }
    requestAnimationFrame(frame);
  }

  // Tema: máscara SVG con una figura por celda (círculo, cuadrado, rombo, triángulo, semicírculo)
  // que crece desde el botón hasta cubrir la pantalla. La usa ::view-transition-new(root) vía --geo.
  function geoMask(ox, oy) {
    var W = innerWidth, H = innerHeight, S = W < 700 ? 64 : 88;
    var shapes = [
      function (s) { return '<circle r="' + (0.72 * s) + '"/>'; },
      function (s) { var h = 0.53 * s; return '<rect x="' + -h + '" y="' + -h + '" width="' + 2 * h + '" height="' + 2 * h + '"/>'; },
      function (s) { return '<polygon points="0,' + -s + ' ' + s + ',0 0,' + s + ' ' + -s + ',0"/>'; },
      function (s) { return '<polygon points="0,' + (-1.6 * s) + ' ' + (1.6 * s) + ',' + s + ' ' + (-1.6 * s) + ',' + s + '"/>'; },
      function (s) { var r = 1.5 * s, y = -0.5 * s; return '<path d="M' + -r + ',' + y + ' A' + r + ',' + r + ' 0 0 0 ' + r + ',' + y + ' Z"/>'; }
    ];
    var maxD = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy)), out = [];
    for (var y = 0; y < H + S; y += S) for (var x = 0; x < W + S; x += S) {
      var cx = x + S / 2, cy = y + S / 2;
      var begin = (Math.hypot(cx - ox, cy - oy) / maxD) * 0.5 + Math.random() * 0.08;
      var rot = 90 * Math.floor(Math.random() * 4);
      out.push('<g transform="translate(' + cx + ' ' + cy + ') rotate(' + rot + ')"><g transform="scale(0)">' +
        '<animateTransform attributeName="transform" type="scale" from="0" to="1" begin="' + begin.toFixed(3) + 's" dur="0.42s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".5 0 .2 1"/>' +
        shapes[Math.floor(Math.random() * shapes.length)](S) + '</g></g>');
    }
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' + out.join('') + '</svg>';
    root.style.setProperty('--geo', 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
  }

  function setLang(l) {
    if (l === root.lang || busy) return;
    var change = function () { root.className = l; root.lang = l; save('lang', l); sync(); };
    if (reduce) return change();
    busy = true; blob(change);
  }
  function toggleTheme(btn) {
    if (busy) return;
    var next = isDark() ? 'light' : 'dark';
    var change = function () { root.setAttribute('data-theme', next); save('theme', next); sync(); };
    // shortcut: sin View Transitions (Firefox antiguo) el cambio es instantáneo.
    if (reduce || !document.startViewTransition) return change();
    var r = btn.getBoundingClientRect();
    geoMask(r.left + r.width / 2, r.top + r.height / 2);
    busy = true;
    root.setAttribute('data-vt', 'geo');
    document.startViewTransition(change).finished.then(function () { root.removeAttribute('data-vt'); busy = false; });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    var f = document.createElementNS(ns, 'filter'); f.id = 'goo';
    f.setAttribute('x', '-25%'); f.setAttribute('y', '-40%'); f.setAttribute('width', '150%'); f.setAttribute('height', '180%');
    var b = document.createElementNS(ns, 'feGaussianBlur'); b.setAttribute('in', 'SourceGraphic'); b.setAttribute('stdDeviation', '0'); b.setAttribute('result', 'b');
    var m = document.createElementNS(ns, 'feColorMatrix'); m.setAttribute('in', 'b'); m.setAttribute('mode', 'matrix');
    m.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8');
    f.appendChild(b); f.appendChild(m); svg.appendChild(f); document.body.appendChild(svg);

    var btns = document.querySelectorAll('button[data-set]');
    for (var i = 0; i < btns.length; i++) btns[i].addEventListener('click', function () { setLang(this.dataset.set); });
    var t = document.querySelector('.theme');
    if (t) t.addEventListener('click', function () { toggleTheme(this); });
    sync();
  });
})();
