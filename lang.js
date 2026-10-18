(function () {
  var root = document.documentElement;
  function setLang(l) {
    root.className = l;
    root.lang = l;
    var b = document.querySelectorAll('button[data-set]');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', String(b[i].dataset.set === l));
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  // Corre en <head>: aún no hay botones, solo clase y lang (evita el parpadeo).
  if (saved === 'es') { root.className = 'es'; root.lang = 'es'; }
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.querySelectorAll('button[data-set]');
    for (var i = 0; i < b.length; i++) {
      b[i].setAttribute('aria-pressed', String(b[i].dataset.set === root.lang));
      b[i].addEventListener('click', function () { setLang(this.dataset.set); });
    }
  });
})();
