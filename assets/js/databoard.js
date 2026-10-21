/* ============================================================
   数据看板：折线图 / 条形图 / 数字滚动
   - 纯手写 SVG，零依赖
   - 进入视区时生长一次；prefers-reduced-motion 直接给终值
   ============================================================ */
(function () {
  'use strict';

  var board = document.getElementById('databoard');
  if (!board) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 数据（来源见页脚注释） ---------------- */
  var EMP = [
    { y: '2022 届', v: 84.10 },
    { y: '2023 届', v: 87.90 },
    { y: '2024 届', v: 88.59 }
  ];
  var COLLEGE = [
    { n: '机电工程学院', v: 8 },
    { n: '信息工程学院', v: 7 },
    { n: '商学院', v: 7 },
    { n: '电子工程学院', v: 6 },
    { n: '创意设计学院', v: 6 },
    { n: '外贸与外语学院', v: 5 },
    { n: '体育与健康学院', v: 2 }
  ];

  /* ---------------- ① 就业折线 ---------------- */
  function drawLine(svg) {
    var W = 560, H = 190, PL = 46, PR = 58, PT = 30, PB = 40;
    var min = 83.4, max = 90;
    var iw = W - PL - PR, ih = H - PT - PB;
    var ns = 'http://www.w3.org/2000/svg';
    var pts = EMP.map(function (d, i) {
      return {
        x: PL + (EMP.length === 1 ? iw / 2 : iw * i / (EMP.length - 1)),
        y: PT + ih - (d.v - min) / (max - min) * ih,
        v: d.v, yl: d.y
      };
    });

    function el(tag, attrs, text) {
      var e = document.createElementNS(ns, tag);
      for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
      if (text != null) e.textContent = text;
      return e;
    }

    /* 网格 */
    [84, 86, 88].forEach(function (gv) {
      var gy = PT + ih - (gv - min) / (max - min) * ih;
      svg.appendChild(el('line', { x1: PL, y1: gy, x2: W - PR + 2, y2: gy, stroke: 'rgba(120,90,50,.13)', 'stroke-dasharray': '4 6' }));
      svg.appendChild(el('text', { x: PL - 8, y: gy + 3.5, 'text-anchor': 'end', fill: '#B6B0A6', 'font-size': '10' }, gv + '%'));
    });

    /* 90% 目标线 */
    var ty = PT + ih - (90 - min) / (max - min) * ih;
    svg.appendChild(el('line', { x1: PL, y1: ty, x2: W - PR + 2, y2: ty,
      stroke: 'rgba(201,161,94,.65)', 'stroke-width': '1.6', 'stroke-dasharray': '7 5' }));
    svg.appendChild(el('text', { x: PL + 4, y: ty - 7, 'text-anchor': 'start', 'font-size': '10.5',
      fill: '#B08A3E', 'font-weight': '600', 'letter-spacing': '.04em' }, '目标线 90%'));

    /* 面积 */
    var grad = el('linearGradient', { id: 'dbEmpGrad', x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(el('stop', { offset: '0%', 'stop-color': '#A61E28', 'stop-opacity': '.22' }));
    grad.appendChild(el('stop', { offset: '100%', 'stop-color': '#A61E28', 'stop-opacity': '0' }));
    var defs = el('defs', {});
    defs.appendChild(grad);
    svg.appendChild(defs);

    var dLine = pts.map(function (p, i) { return (i ? 'L' : 'M') + p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ');
    var dArea = dLine + ' L' + pts[pts.length - 1].x.toFixed(1) + ',' + (PT + ih) + ' L' + pts[0].x.toFixed(1) + ',' + (PT + ih) + ' Z';

    svg.appendChild(el('path', { d: dArea, fill: 'url(#dbEmpGrad)', class: 'db-area' }));
    var line = el('path', {
      d: dLine, fill: 'none', stroke: '#A61E28', 'stroke-width': '3',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'db-line-path'
    });
    svg.appendChild(line);

    /* 数值 + 圆点 + 年份 */
    pts.forEach(function (p, i) {
      var last = i === pts.length - 1;
      svg.appendChild(el('circle', { cx: p.x, cy: p.y, r: last ? 6.5 : 4.5, fill: '#fff', stroke: last ? '#A61E28' : '#C0392B', 'stroke-width': last ? 3.5 : 2.5, class: 'db-dot' }));
      if (last) svg.appendChild(el('circle', { cx: p.x, cy: p.y, r: 13, fill: 'none', stroke: 'rgba(166,30,40,.22)', 'stroke-width': 2 }));
      var first = i === 0;
      svg.appendChild(el('text', {
        x: p.x + (first ? 6 : 0),
        y: first ? p.y + 20 : p.y - 16,
        'text-anchor': first ? 'start' : 'middle',
        'font-size': last ? '15' : '12.5',
        'font-weight': last ? '700' : '600', fill: last ? '#A61E28' : '#3D434C'
      }, p.v.toFixed(last ? 2 : 1) + '%'));
      svg.appendChild(el('text', { x: p.x, y: H - 12, 'text-anchor': 'middle', 'font-size': '11.5', fill: '#878D96' }, p.yl));
    });

    /* 让虚线动画知道路径长度 */
    try {
      var len = line.getTotalLength();
      line.style.setProperty('--len', Math.ceil(len));
    } catch (e) {
      line.style.setProperty('--len', 900);
    }
  }

  /* ---------------- ③ 学院条形 ---------------- */
  function buildBars(box) {
    var maxV = Math.max.apply(null, COLLEGE.map(function (c) { return c.v; }));
    var html = COLLEGE.map(function (c) {
      var w = Math.round(c.v / maxV * 100);
      return '<div class="db-bar-row" title="' + c.n + '：' + c.v + ' 个本科专业">' +
        '<span class="db-bar-name">' + c.n + '</span>' +
        '<span class="db-bar-track"><i class="db-bar-fill" style="--w:' + w + '%"></i></span>' +
        '<span class="db-bar-val">' + c.v + '</span>' +
        '</div>';
    }).join('');
    box.innerHTML = html;
  }

  /* ---------------- 数字滚动 ---------------- */
  function countUp(node) {
    var target = parseFloat(node.getAttribute('data-count'));
    var dec = parseInt(node.getAttribute('data-dec') || '0', 10);
    if (isNaN(target)) return;
    if (reduced) { node.textContent = target.toFixed(dec); return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      node.textContent = (target * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------------- 初始化 ---------------- */
  var chart = document.getElementById('dbChart');
  if (chart) drawLine(chart);
  var barsBox = document.getElementById('dbBars');
  if (barsBox) buildBars(barsBox);

  function reveal() {
    board.classList.add('db-in');
    Array.prototype.forEach.call(board.querySelectorAll('[data-count]'), countUp);
  }

  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { reveal(); io.disconnect(); }
      });
    }, { threshold: 0.25 });
    io.observe(board);
  } else {
    reveal();
  }
})();
