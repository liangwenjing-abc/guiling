/* ============================================================
   校园相册 · 扇形封面流
   - 整组卡片按"距中心远近"逐级旋转 / 缩小 / 降亮
   - 拖动与切换都是连续转动（拖拽时实时跟随，松手吸附到最近一张）
   - 点中心卡放大：大图 + 基础信息
   ============================================================ */
(function () {
  'use strict';

  var stage = document.getElementById('fanStage');
  if (!stage) return;
  var track = document.getElementById('fanTrack');
  var cards = Array.prototype.slice.call(track.querySelectorAll('.fan-card'));
  var n = cards.length;
  if (!n) return;

  var prevBtn = document.getElementById('fanPrev');
  var nextBtn = document.getElementById('fanNext');
  var dotsBox = document.getElementById('fanDots');
  var idxEl = document.getElementById('fanIdx');
  var modal = document.getElementById('fanModal');
  var modalImg = document.getElementById('fanModalImg');
  var modalTitle = document.getElementById('fanModalTitle');
  var modalDesc = document.getElementById('fanModalDesc');
  var modalCat = document.getElementById('fanModalCat');
  var modalCount = document.getElementById('fanModalCount');
  var modalClose = document.getElementById('fanModalClose');
  var modalPrev = document.getElementById('fanModalPrev');
  var modalNext = document.getElementById('fanModalNext');

  var cur = 0;          // 当前索引（拖动时可为小数）
  var unitX = 0;
  var dragging = false, dragMoved = false, startX = 0, startPos = 0, downCard = null;

  /* ---------- 圆点 ---------- */
  cards.forEach(function (c, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', '第 ' + (i + 1) + ' 张：' + (c.dataset.title || ''));
    b.addEventListener('click', function () { go(i, true); });
    dotsBox.appendChild(b);
  });
  var dots = Array.prototype.slice.call(dotsBox.children);

  /* ---------- 几何：把"距中心的偏移"换算成 transform ---------- */
  function metrics() {
    var w = window.innerWidth;
    var cardW = cards[0].offsetWidth || 480;
    unitX = cardW * 0.5;                       // 相邻两张的中心距（卡片宽的一半）
    var step2 = cardW * 0.32;                  // 第二圈再往外探一点
    return {
      x: function (off) {
        var s = off < 0 ? -1 : 1, a = Math.abs(off);
        var d = a <= 1 ? a * unitX : unitX + (a - 1) * step2;
        return s * Math.min(d, unitX + step2 * 2);
      },
      rot: function (off) {
        var s = off < 0 ? -1 : 1, a = Math.abs(off);
        var deg = a <= 1 ? a * 38 : 38 + (a - 1) * 20;
        return -s * Math.min(deg, 62);
      },
      z: function (off) { return -Math.min(Math.abs(off), 3) * 170; },
      sc: function (off) { return 1 - Math.min(Math.abs(off), 3) * 0.13; },
      br: function (off) { return Math.max(0.30, 1 - Math.min(Math.abs(off), 3) * 0.30); },
      sa: function (off) { return Math.max(0.45, 1 - Math.min(Math.abs(off), 3) * 0.24); },
      op: function (off) { return Math.abs(off) > 2.55 ? 0 : 1; }
    };
  }

  function wrap(off) {
    while (off > n / 2) off -= n;
    while (off <= -n / 2) off += n;
    return off;
  }

  function render(pos) {
    var m = metrics();
    cards.forEach(function (card, i) {
      var off = wrap(i - pos);
      var abs = Math.abs(off);
      card.style.transform =
        'translate(-50%,-50%) translateX(' + m.x(off).toFixed(2) + 'px) ' +
        'translateZ(' + m.z(off).toFixed(1) + 'px) ' +
        'rotateY(' + m.rot(off).toFixed(2) + 'deg) ' +
        'scale(' + m.sc(off).toFixed(3) + ')';
      card.style.filter = 'brightness(' + m.br(off).toFixed(3) + ') saturate(' + m.sa(off).toFixed(3) + ')';
      card.style.opacity = m.op(off);
      card.style.zIndex = String(2000 - Math.round(abs * 100));
      card.classList.toggle('is-active', abs < 0.5);
      card.setAttribute('aria-hidden', abs > 2.55 ? 'true' : 'false');
      card.tabIndex = abs < 0.5 ? 0 : -1;
    });
    var active = ((Math.round(pos) % n) + n) % n;
    if (idxEl) idxEl.textContent = active + 1;
    dots.forEach(function (d, i) { d.classList.toggle('on', i === active); });
  }

  function go(i, animate) {
    cur = ((i % n) + n) % n;
    stage.classList.remove('is-dragging');
    render(cur);
    if (animate) stage.focus({ preventScroll: true });
  }
  function next() { go(Math.round(cur) + 1); }
  function prev() { go(Math.round(cur) - 1); }

  /* ---------- 按钮 / 键盘 ---------- */
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  stage.setAttribute('tabindex', '0');
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); openModal(Math.round(cur));
    }
  });

  /* ---------- 拖拽：实时跟手，松手吸附 ---------- */
  stage.addEventListener('pointerdown', function (e) {
    if (e.button && e.button !== 0) return;
    if (modal.classList.contains('open')) return;
    dragging = true; dragMoved = false;
    startX = e.clientX; startPos = cur;
    downCard = e.target.closest ? e.target.closest('.fan-card') : null;
    stage.classList.add('is-dragging');
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
  });

  stage.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    if (!dragMoved && Math.abs(dx) > 6) dragMoved = true;
    if (!dragMoved) return;
    cur = startPos - dx / (unitX || 300);
    render(cur);
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging');
    try { stage.releasePointerCapture(e.pointerId); } catch (err) {}

    if (dragMoved) {
      var target = Math.round(cur);
      if (target === Math.round(startPos) && Math.abs(cur - startPos) > 0.18) {
        target = startPos + (cur > startPos ? 1 : -1);
      }
      go(target);
      dragMoved = false;
      return;
    }
    /* 没有拖动 = 点击 */
    if (downCard) {
      var i = cards.indexOf(downCard);
      if (i < 0) return;
      if (Math.abs(wrap(i - cur)) < 0.5) openModal(i);   // 点中间：放大
      else go(i);                                        // 点两侧：转到中间
    }
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', function (e) {
    dragging = false; stage.classList.remove('is-dragging');
    try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
    render(cur);
  });

  cards.forEach(function (c, i) {
    c.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (Math.abs(wrap(i - cur)) < 0.5) openModal(i); else go(i);
      }
    });
  });

  /* ---------- 放大查看 ---------- */
  var lastFocus = null;

  function fillModal(i) {
    var c = cards[i];
    if (!c) return;
    var img = c.querySelector('img');
    modalImg.src = (c.dataset.full || img.getAttribute('src'));
    modalImg.alt = img.getAttribute('alt') || c.dataset.title || '';
    modalTitle.textContent = c.dataset.title || '';
    modalDesc.textContent = c.dataset.desc || '';
    modalCat.textContent = c.dataset.cat || '校园风光';
    modalCount.textContent = (i + 1) + ' / ' + n;
  }

  function openModal(i) {
    fillModal(i);
    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('fan-lock');
    if (modalClose) modalClose.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('fan-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function stepModal(d) {
    var i = (Math.round(cur) + d + n) % n;
    go(i);
    fillModal(i);
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalPrev) modalPrev.addEventListener('click', function (e) { e.stopPropagation(); stepModal(-1); });
  if (modalNext) modalNext.addEventListener('click', function (e) { e.stopPropagation(); stepModal(1); });
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); stepModal(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); stepModal(-1); }
  });

  /* ---------- 初始化 / 自适应 ---------- */
  var rt = null;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { render(cur); }, 120);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { render(cur); });
  }
  go(0);
  setTimeout(function () { render(cur); }, 60);   // 等图片占位撑开后再算一次

  window.fanGallery = { go: go, open: openModal };
})();
