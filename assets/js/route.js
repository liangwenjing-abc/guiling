/* ============================================================
   质感增强 + 校园路线互动地图 route.js
   （在 main.js 之后加载）
   ============================================================ */

/* ---------- 质感增强：滚动进度条 / 页脚水印 / 图片渐显 ---------- */
(function () {
  'use strict';
  var bar = document.createElement('div');
  bar.className = 'sp-bar';
  document.body.appendChild(bar);
  function upd() {
    var h = document.documentElement;
    var max = (h.scrollHeight - h.clientHeight) || 1;
    var p = Math.min(1, Math.max(0, window.scrollY / max));
    bar.style.width = (p * 100) + '%';
  }
  window.addEventListener('scroll', upd, { passive: true });
  window.addEventListener('resize', upd);
  upd();

  var f = document.querySelector('.footer');
  if (f && !f.querySelector('.f-mark')) {
    var m = document.createElement('div');
    m.className = 'f-mark';
    m.textContent = 'GUILIN INSTITUTE OF INFORMATION TECHNOLOGY';
    f.appendChild(m);
  }

  Array.prototype.forEach.call(document.images, function (im) {
    im.classList.add('imgfade');
    var done = function () { im.classList.add('img-in'); };
    if (im.complete && im.naturalWidth > 0) { done(); }
    else {
      im.addEventListener('load', done);
      im.addEventListener('error', done);
    }
  });
})();

/* ---------- 校园路线互动地图 ---------- */
(function () {
  'use strict';
  var vp = document.getElementById('mapViewport');
  if (!vp) return;
  var stage = document.getElementById('mapStage');
  var svg = document.getElementById('mapSvg');
  var NS = 'http://www.w3.org/2000/svg';
  var W = 1295, H = 1275;
  var RED = '#A61E28', GOLD = '#C9A15E', TEAL = '#3E7C8F', GREY = '#8A8F98';

  /* ---- 数据 ---- */
  var STOPS = [
    { id: 'gate', name: '东大门（新校门）', x: 1198, y: 1022, tag: '校门', ph: '信', photo: 'assets/img/map/stop-gate.jpg',
      desc: '学校主校门之一，门楼气势开阔。新生报到从这里进校，也是毕业照的经典背景板。' },
    { id: 'activity', name: '文体活动中心', x: 648, y: 587, tag: '活动', ph: '动', photo: 'assets/img/gallery/hc-5.jpg',
      desc: '校园大型活动的“心脏”——迎新晚会、新生红歌比赛、社团文化节都在这里上演。' },
    { id: 'dorm_m', name: '中苑宿舍（崇信·崇善·崇礼楼）', x: 751, y: 383, tag: '生活', ph: '宿',
      desc: '校园中部的宿舍组团，紧邻文体活动中心，去上课、去运动都方便，是温暖的“第二个家”。' },
    { id: 'service', name: '生活服务区', x: 440, y: 268, tag: '生活', ph: '食',
      desc: '食堂、超市等生活配套集中在宿舍区旁，一日三餐、日常采买都在这一带解决。' },
    { id: 'dorm_n', name: '北苑宿舍（崇仁·崇义楼）', x: 557, y: 80, tag: '生活', ph: '宿',
      desc: '北苑宿舍组团。宿舍配备空调与独立卫浴等设施，生活便利。' },
    { id: 'dorm_w', name: '西苑宿舍（崇贤·崇德楼）', x: 337, y: 306, tag: '生活', ph: '宿',
      desc: '西苑宿舍组团，靠近湖景步道，环境安静宜居。' },
    { id: 'library', name: '图文信息综合楼（图书馆）', x: 259, y: 893, tag: '学习', ph: '书', photo: 'assets/img/gallery/fg-1.jpg',
      desc: '全校的“充电站”。图书馆新馆 2023 年建成，馆藏图书 215 万余册、阅览座位近 5000 个，每周开放 105 小时。' },
    { id: 'teach_s', name: '教学区（3·4·5·6号楼）', x: 790, y: 880, tag: '学习', ph: '教', photo: 'assets/img/banner-b.jpg',
      desc: '明志楼、德远楼、敬思楼、博文楼——智慧教室与实践实验室集中在这一片。' },
    { id: 'teach_w', name: '教学区（7·8号楼）', x: 315, y: 920, tag: '学习', ph: '教', photo: 'assets/img/banner-a.jpg',
      desc: '敦明楼与信义楼，实训与研讨空间集中，是上课常来的地方。' },
    { id: 'lake', name: '校园湖景', x: 576, y: 816, tag: '风景', ph: '景', photo: 'assets/img/gallery/fg-6.jpg',
      desc: '山水与人文交融的湖景步道，晨读、散步、拍照的好去处。' },
    { id: 'stadium', name: '田径场', x: 1075, y: 472, tag: '运动', ph: '跑', photo: 'assets/img/gallery/qc-4.jpg',
      desc: '标准田径场与足球场，校运会和傍晚夜跑的主场。' },
    { id: 'gym', name: '风雨操场', x: 1114, y: 204, tag: '运动', ph: '动',
      desc: '室内运动空间，风雨无阻——球类运动与日常锻炼都在这儿。' },
    { id: 'training', name: '实训·产教融合区', x: 1191, y: 1071, tag: '实践', ph: '训',
      desc: '实训与实践教学区域，动手实践、对接产业的舞台。' }
  ];

  var ROUTES = {
    a: { color: RED, name: '新生报到线', stops: ['gate', 'activity', 'dorm_m', 'service', 'library'],
      path: [[1198, 1022], [1090, 905], [960, 770], [648, 587], [690, 480], [751, 383], [620, 330], [510, 300], [440, 268], [350, 430], [300, 620], [270, 760], [259, 893]] },
    b: { color: GOLD, name: '半小时打卡线', stops: ['gate', 'activity', 'lake', 'library', 'teach_w'],
      path: [[1198, 1022], [1080, 890], [930, 780], [780, 690], [648, 587], [610, 680], [592, 760], [576, 816], [500, 850], [380, 880], [259, 893], [315, 920]] },
    c: { color: TEAL, name: '活力运动线', stops: ['gate', 'stadium', 'gym', 'dorm_n', 'dorm_w'],
      path: [[1198, 1022], [1150, 930], [1120, 760], [1090, 610], [1075, 472], [1085, 360], [1100, 270], [1114, 204], [980, 150], [800, 110], [650, 90], [557, 80], [500, 160], [430, 220], [380, 260], [337, 306]] }
  };

  /* ---- 构建 SVG ---- */
  var gRoutes = document.createElementNS(NS, 'g');
  var gStops = document.createElementNS(NS, 'g');
  svg.appendChild(gRoutes);
  svg.appendChild(gStops);

  function ptstr(pts) {
    return pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ');
  }
  var pathEls = {}, glowEls = {};
  Object.keys(ROUTES).forEach(function (k) {
    var r = ROUTES[k];
    var glow = document.createElementNS(NS, 'polyline');
    glow.setAttribute('points', ptstr(r.path));
    glow.setAttribute('class', 'route-glow');
    glow.setAttribute('stroke', r.color);
    glow.setAttribute('stroke-width', '24');
    var p = document.createElementNS(NS, 'polyline');
    p.setAttribute('points', ptstr(r.path));
    p.setAttribute('class', 'route-path');
    p.setAttribute('stroke', r.color);
    p.setAttribute('stroke-width', '9');
    gRoutes.appendChild(glow);
    gRoutes.appendChild(p);
    glowEls[k] = glow;
    pathEls[k] = p;
  });

  STOPS.forEach(function (s) {
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'stop');
    g.setAttribute('data-id', s.id);
    var halo = document.createElementNS(NS, 'circle');
    halo.setAttribute('class', 'halo');
    halo.setAttribute('cx', s.x); halo.setAttribute('cy', s.y); halo.setAttribute('r', '19');
    var dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('class', 'dot');
    dot.setAttribute('cx', s.x); dot.setAttribute('cy', s.y); dot.setAttribute('r', '12');
    var num = document.createElementNS(NS, 'text');
    num.setAttribute('x', s.x); num.setAttribute('y', s.y + 1);
    var lbl = document.createElementNS(NS, 'text');
    lbl.setAttribute('class', 'lbl');
    if (s.x > 930) { lbl.setAttribute('x', s.x - 26); lbl.setAttribute('y', s.y - 22); lbl.style.textAnchor = 'end'; }
    else { lbl.setAttribute('x', s.x + 26); lbl.setAttribute('y', s.y - 22); }
    lbl.textContent = s.name;
    var t = document.createElementNS(NS, 'title');
    t.textContent = s.name;
    g.appendChild(halo); g.appendChild(dot); g.appendChild(num); g.appendChild(lbl); g.appendChild(t);
    gStops.appendChild(g);
    s._g = g; s._num = num; s._dot = dot;
  });

  /* ---- 视图变换（拖动 / 缩放 / 飞行动画） ---- */
  var view = { x: 0, y: 0, s: 1 };
  var fitS = 1, MIN = 0.1, MAX = 3.2;

  function vpW() { return vp.clientWidth; }
  function vpH() { return vp.clientHeight; }
  function apply(fly) {
    stage.classList.toggle('fly', !!fly);
    stage.style.transform = 'translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.s + ')';
  }
  function fitAll(fly) {
    var s = Math.min(vpW() / W, vpH() / H) * 0.985;
    fitS = s; MIN = s * 0.92;
    view.s = s;
    view.x = (vpW() - W * s) / 2;
    view.y = (vpH() - H * s) / 2;
    apply(fly);
  }
  function zoomAt(mx, my, k) {
    var ns = Math.max(MIN, Math.min(MAX, view.s * k));
    k = ns / view.s;
    view.x = mx - (mx - view.x) * k;
    view.y = my - (my - view.y) * k;
    view.s = ns;
    apply(false);
  }
  function bboxOfStops(ids) {
    var xs = ids.map(function (id) {
      for (var i = 0; i < STOPS.length; i++) if (STOPS[i].id === id) return STOPS[i];
      return STOPS[0];
    });
    var minx = Math.min.apply(null, xs.map(function (s) { return s.x; })) - 50;
    var maxx = Math.max.apply(null, xs.map(function (s) { return s.x; })) + 50;
    var miny = Math.min.apply(null, xs.map(function (s) { return s.y; })) - 50;
    var maxy = Math.max.apply(null, xs.map(function (s) { return s.y; })) + 50;
    return { x: minx, y: miny, w: maxx - minx, h: maxy - miny };
  }
  function flyTo(box) {
    var vw = vpW(), vh = vpH();
    var s = Math.min(vw / (box.w * 1.35), vh / (box.h * 1.35));
    s = Math.max(Math.min(s, 2.6), MIN);
    view.s = s;
    view.x = vw / 2 - (box.x + box.w / 2) * s;
    view.y = vh / 2 - (box.y + box.h / 2) * s;
    apply(true);
  }

  /* ---- 指针交互 ---- */
  var pointers = {}, drag = null, pinch = null, lastMoved = 0;

  vp.addEventListener('pointerdown', function (e) {
    if (e.target.closest && e.target.closest('.map-zoombar')) return;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pointers);
    if (ids.length === 1) {
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 };
      lastMoved = 0;
      stage.classList.remove('fly');
      vp.classList.add('grabbing');
    } else if (ids.length === 2) {
      drag = null;
      var a = pointers[ids[0]], b = pointers[ids[1]];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: view.s };
    }
  });
  vp.addEventListener('pointermove', function (e) {
    if (!(e.pointerId in pointers)) return;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pointers);
    if (pinch && ids.length >= 2) {
      var a = pointers[ids[0]], b = pointers[ids[1]];
      var d = Math.hypot(a.x - b.x, a.y - b.y);
      var rect = vp.getBoundingClientRect();
      var mx = (a.x + b.x) / 2 - rect.left;
      var my = (a.y + b.y) / 2 - rect.top;
      zoomAt(mx, my, (pinch.s * d / pinch.d) / view.s);
      return;
    }
    if (drag && e.pointerId === drag.id) {
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      drag.x = e.clientX; drag.y = e.clientY;
      view.x += dx; view.y += dy;
      if (!drag.captured && drag.moved > 8) {
        try { vp.setPointerCapture(e.pointerId); drag.captured = true; } catch (err) {}
      }
      apply(false);
    }
  });
  function endPointer(e) {
    if (drag && e.pointerId === drag.id) { lastMoved = drag.moved; vp.classList.remove('grabbing'); }
    delete pointers[e.pointerId];
    if (Object.keys(pointers).length < 2) pinch = null;
    if (Object.keys(pointers).length === 0) drag = null;
  }
  vp.addEventListener('pointerup', endPointer);
  vp.addEventListener('pointercancel', endPointer);
  vp.addEventListener('wheel', function (e) {
    e.preventDefault();
    var rect = vp.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0016));
  }, { passive: false });

  /* ---- 缩放按钮 ---- */
  Array.prototype.forEach.call(document.querySelectorAll('.map-zoombar button'), function (b) {
    b.addEventListener('click', function () {
      var act = b.dataset.z;
      if (act === 'in') zoomAt(vpW() / 2, vpH() / 2, 1.35);
      else if (act === 'out') zoomAt(vpW() / 2, vpH() / 2, 1 / 1.35);
      else fitAll(true);
    });
  });

  /* ---- 站点详情面板 ---- */
  var curIdx = 0;
  function showStop(id) {
    var idx = 0;
    for (var i = 0; i < STOPS.length; i++) { if (STOPS[i].id === id) { idx = i; break; } }
    curIdx = idx;
    var s = STOPS[idx];
    var ph = document.getElementById('stopPh');
    if (s.photo) {
      ph.innerHTML = '';
      var im = document.createElement('img');
      im.alt = s.name;
      im.className = 'imgfade';
      im.addEventListener('load', function () { im.classList.add('img-in'); });
      im.src = s.photo;
      ph.appendChild(im);
    } else {
      ph.innerHTML = '<span>' + s.ph + '</span>';
    }
    document.getElementById('stopTag').textContent = s.tag;
    document.getElementById('stopName').textContent = s.name;
    document.getElementById('stopDesc').textContent = s.desc;
    document.getElementById('stopIdx').textContent = (idx + 1) + ' / ' + STOPS.length;
    STOPS.forEach(function (x) { x._g.classList.remove('active'); });
    s._g.classList.add('active');
  }
  document.getElementById('stopPrev').addEventListener('click', function () {
    showStop(STOPS[(curIdx - 1 + STOPS.length) % STOPS.length].id);
  });
  document.getElementById('stopNext').addEventListener('click', function () {
    showStop(STOPS[(curIdx + 1) % STOPS.length].id);
  });
  svg.addEventListener('click', function (e) {
    var g = e.target.closest ? e.target.closest('.stop') : null;
    if (!g) return;
    if (lastMoved > 8) { lastMoved = 0; return; }
    showStop(g.getAttribute('data-id'));
  });

  /* ---- 路线切换 ---- */
  function setRoute(key, fly) {
    Array.prototype.forEach.call(document.querySelectorAll('.route-tab'), function (t) {
      t.classList.toggle('active', t.dataset.route === key);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.route-card'), function (c) {
      c.classList.toggle('active', c.dataset.route === key);
    });
    Object.keys(ROUTES).forEach(function (k) {
      var on = (k === key);
      pathEls[k].classList.toggle('on', on);
      glowEls[k].classList.toggle('on', on);
    });
    var r = ROUTES[key];
    STOPS.forEach(function (s) {
      s._g.classList.remove('active');
      s._num.textContent = '';
      var inRoute = key !== 'all' && r && r.stops.indexOf(s.id) >= 0;
      s._g.style.opacity = (key === 'all' || inRoute) ? '1' : '0.55';
      s._dot.setAttribute('fill', inRoute ? r.color : GREY);
    });
    if (key !== 'all' && r) {
      r.stops.forEach(function (id, i) {
        for (var j = 0; j < STOPS.length; j++) {
          if (STOPS[j].id === id) { STOPS[j]._num.textContent = String(i + 1); }
        }
      });
    }
    var lg = document.getElementById('mapLegend');
    lg.innerHTML = '';
    var sp = document.createElement('span');
    if (key === 'all') {
      sp.innerHTML = '<i style="--rc:#8A8F98"></i>全部 ' + STOPS.length + ' 个点位 · 自由探索';
    } else {
      sp.innerHTML = '<i style="--rc:' + r.color + '"></i>' + r.name + ' · ' + r.stops.length + ' 站';
    }
    lg.appendChild(sp);
    if (fly) {
      if (key === 'all') fitAll(true);
      else flyTo(bboxOfStops(r.stops));
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll('.route-tab'), function (t) {
    t.addEventListener('click', function () { setRoute(t.dataset.route, true); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('.route-card'), function (c) {
    c.addEventListener('click', function () {
      setRoute(c.dataset.route, true);
      document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---- 初始化 ---- */
  fitAll(false);
  setRoute('a', true);
  showStop('gate');

  var rsz;
  window.addEventListener('resize', function () {
    clearTimeout(rsz);
    rsz = setTimeout(function () { fitAll(false); }, 180);
  });
})();
