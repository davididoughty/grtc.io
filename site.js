/* GRTC site behaviour: mobile navigation + footer year */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  function init() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
    if (!toggle || !nav) return;
    var mq = window.matchMedia('(max-width: 900px)');
    function links() { return nav.querySelectorAll('a'); }
    function setOpen(open, returnFocus) {
      root.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (mq.matches) {
        nav.toggleAttribute('inert', !open);
        nav.setAttribute('aria-hidden', String(!open));
      }
      if (open) { var f = links()[0]; if (f) f.focus(); }
      else if (returnFocus) { toggle.focus(); }
    }
    function sync() {
      if (mq.matches) { if (!root.classList.contains('nav-open')) { nav.setAttribute('inert', ''); nav.setAttribute('aria-hidden', 'true'); } }
      else { root.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false'); nav.removeAttribute('inert'); nav.removeAttribute('aria-hidden'); }
    }
    toggle.addEventListener('click', function () { setOpen(!root.classList.contains('nav-open'), true); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a') && mq.matches) setOpen(false, false); });
    document.addEventListener('keydown', function (e) {
      if (!root.classList.contains('nav-open')) return;
      if (e.key === 'Escape') { setOpen(false, true); return; }
      if (e.key === 'Tab') {
        var items = [toggle].concat(Array.prototype.slice.call(links()));
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    (mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync));
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
