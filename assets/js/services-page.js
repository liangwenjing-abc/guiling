/* ============================================================
   校园服务页：A/B/C 三个 Tab 的切换
   ============================================================ */
(function () {
  'use strict';
  var bar = document.getElementById('svcTabbar');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.svc-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-panel]'));
  if (!tabs.length || !panels.length) return;

  var IDS = ['tab-a', 'tab-b', 'tab-c'];

  function show(id, scroll) {
    if (IDS.indexOf(id) < 0) return;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-target') === id;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (p) { p.hidden = (p.id !== id); });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    if (scroll) {
      var panel = document.getElementById(id);
      var header = document.querySelector('.site-header');
      var headerH = header ? header.offsetHeight : 0;
      var barH = bar ? bar.offsetHeight : 60;
      var mobile = window.innerWidth <= 980;
      var offset = (mobile ? 0 : headerH) + barH + 10;
      if (panel) {
        var top = panel.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { show(t.getAttribute('data-target'), true); });
  });

  window.addEventListener('hashchange', function () {
    var h = location.hash.replace('#', '');
    if (IDS.indexOf(h) >= 0) show(h, true);
  });

  var init = location.hash.replace('#', '');
  if (IDS.indexOf(init) >= 0) show(init, false);

  /* 页面里指向某个 Tab 的链接（如顶部公告） */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#tab-"]') : null;
    if (!a) return;
    e.preventDefault();
    show(a.getAttribute('href').slice(1), true);
  });
})();
