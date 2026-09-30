/* ============================================================
   遇见桂信科 · 桂林信息科技学院校园风采展示网站
   交互脚本 main.js
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 顶部公告条关闭 ---------- */
  var topbar = document.getElementById('topbar');
  if (topbar) {
    if (localStorage.getItem('guit-topbar') === '1') {
      topbar.remove();
    } else {
      var tbc = topbar.querySelector('.tb-close');
      if (tbc) tbc.addEventListener('click', function () {
        topbar.remove();
        try { localStorage.setItem('guit-topbar', '1'); } catch (e) {}
      });
    }
  }

  /* ---------- 移动端导航 ---------- */
  var burger = document.querySelector('.nav-burger');
  if (burger) burger.addEventListener('click', function () {
    document.body.classList.toggle('nav-open');
  });
  Array.prototype.forEach.call(document.querySelectorAll('.nav-menu a'), function (a) {
    a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
  });

  /* ---------- 页头滚动阴影 ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
      if (backtop) backtop.classList.toggle('show', window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 滚动出现动画 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(revealEls, function (el) {
      if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + 'ms';
      io.observe(el);
    });
  } else {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('in'); });
  }

  /* ---------- 数字滚动 ---------- */
  var counters = document.querySelectorAll('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        cio.unobserve(el);
        var target = parseFloat(el.dataset.count || '0');
        var dec = parseInt(el.dataset.dec || '0', 10);
        var dur = 1500, t0 = null;
        function step(t) {
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toFixed(dec);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
  } else {
    Array.prototype.forEach.call(counters, function (el) {
      el.textContent = parseFloat(el.dataset.count || '0').toFixed(parseInt(el.dataset.dec || '0', 10));
    });
  }

  /* ---------- 相册筛选 + 灯箱 ---------- */
  var gItems = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  var gFilter = document.querySelector('.g-filter');
  if (gFilter && gItems.length) {
    gFilter.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      Array.prototype.forEach.call(gFilter.querySelectorAll('button'), function (b) {
        b.classList.toggle('active', b === btn);
      });
      var cat = btn.dataset.cat;
      gItems.forEach(function (it) {
        var show = (cat === 'all' || it.dataset.cat === cat);
        it.classList.toggle('hide', !show);
      });
    });
  }

  var lb = document.getElementById('lightbox');
  if (lb && gItems.length) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lb-cap');
    var lbCount = lb.querySelector('.lb-count');
    var cur = 0;
    function visibleItems() { return gItems.filter(function (i) { return !i.classList.contains('hide'); }); }
    function render() {
      var vs = visibleItems();
      if (!vs.length) return;
      cur = (cur + vs.length) % vs.length;
      var it = vs[cur];
      var im = it.querySelector('img');
      lbImg.src = im.dataset.full || im.src;
      lbImg.alt = im.alt || '';
      lbCap.textContent = im.alt || '';
      lbCount.textContent = (cur + 1) + ' / ' + vs.length;
    }
    function openLb(item) {
      var vs = visibleItems();
      var idx = vs.indexOf(item);
      if (idx < 0) return;
      cur = idx; render();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
    gItems.forEach(function (it) {
      it.addEventListener('click', function () { openLb(it); });
    });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); cur -= 1; render(); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); cur += 1; render(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') { cur -= 1; render(); }
      if (e.key === 'ArrowRight') { cur += 1; render(); }
    });
  }

  /* ---------- 专业表筛选 ---------- */
  var mFilter = document.querySelector('.m-filter');
  if (mFilter) {
    var rows = document.querySelectorAll('.m-table tbody tr');
    mFilter.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      Array.prototype.forEach.call(mFilter.querySelectorAll('button'), function (b) {
        b.classList.toggle('active', b === btn);
      });
      var cat = btn.dataset.cat;
      Array.prototype.forEach.call(rows, function (r) {
        r.classList.toggle('hide', !(cat === 'all' || r.dataset.college === cat));
      });
    });
  }

  /* ---------- 新生小测试 ---------- */
  var QUIZ = [
    { q: '桂林信息科技学院创建于哪一年？', o: ['2001年', '1999年', '2005年', '2010年'], a: 0,
      tip: '学校创建于2001年，前身为桂林电子工业学院信息科技学院。' },
    { q: '学校的校训是？', o: ['自强 力行 求实 创新', '博学 笃行 明德 至善', '厚德 博学 自强 创新', '求真 务实 开拓 进取'], a: 0,
      tip: '校训：自强 力行 求实 创新。' },
    { q: '学校目前全日制在校生规模约为？', o: ['2.2万余人', '1.2万余人', '3.2万余人', '8千余人'], a: 0,
      tip: '目前全日制在校生2.2万余人。' },
    { q: '校园占地总面积约为多少？', o: ['1331亩', '531亩', '2331亩', '831亩'], a: 0,
      tip: '校园占地总面积1331亩，校舍建筑总面积58.72万平方米。' },
    { q: '学校坐落在桂林市哪个区？', o: ['临桂区', '雁山区', '秀峰区', '阳朔县'], a: 0,
      tip: '学校位于桂林市临桂区，校址：岩图路9号。' },
    { q: '学校的英文缩写是？', o: ['GIIT', 'GUET', 'GLIT', 'GIET'], a: 0,
      tip: '英文名 Guilin Institute of Information Technology，缩写 GIIT。' },
    { q: '2025年学校在艾瑞深校友会中国民办大学排名中位列？', o: ['全国第76位', '全国第16位', '全国第176位', '全国第760位'], a: 0,
      tip: '2025年跻身校友会民办大学排名全国第76位，入选三星级中国高水平应用型大学。' },
    { q: '学校现有几个二级教学单位（学院）？', o: ['7个', '5个', '9个', '12个'], a: 0,
      tip: '下设信息工程学院、电子工程学院、机电工程学院、商学院、创意设计学院、通识教育学院、马克思主义学院等7个二级教学单位。' }
  ];
  var quizEl = document.getElementById('quiz');
  if (quizEl) {
    var qi = 0, score = 0, locked = false;
    var qText = quizEl.querySelector('.q-text');
    var qOpts = quizEl.querySelector('.q-opts');
    var qProg = quizEl.querySelector('.quiz-progress');
    var qBar = quizEl.querySelector('.quiz-bar i');
    var qFeed = quizEl.querySelector('.q-feedback');
    var qRes = quizEl.querySelector('.quiz-result');
    var qBody = quizEl.querySelector('.quiz-body');

    function renderQ() {
      locked = false;
      var item = QUIZ[qi];
      qText.textContent = item.q;
      qFeed.textContent = '';
      qProg.textContent = '第 ' + (qi + 1) + ' / ' + QUIZ.length + ' 题　答对 ' + score + ' 题';
      qBar.style.width = ((qi) / QUIZ.length * 100) + '%';
      qOpts.innerHTML = '';
      var letters = ['A', 'B', 'C', 'D'];
      item.o.forEach(function (text, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.innerHTML = '<span class="oi">' + letters[i] + '</span><span>' + text + '</span>';
        b.addEventListener('click', function () { answer(i, b); });
        qOpts.appendChild(b);
      });
    }
    function answer(i, btn) {
      if (locked) return;
      locked = true;
      var item = QUIZ[qi];
      var btns = qOpts.querySelectorAll('.opt');
      btns[item.a].classList.add('right');
      if (i !== item.a) btn.classList.add('wrong');
      else score += 1;
      qFeed.textContent = (i === item.a ? '答对了！' : '再记一下：') + item.tip;
      qBar.style.width = ((qi + 1) / QUIZ.length * 100) + '%';
      qProg.textContent = '第 ' + (qi + 1) + ' / ' + QUIZ.length + ' 题　答对 ' + score + ' 题';
      setTimeout(function () {
        if (qi < QUIZ.length - 1) { qi += 1; renderQ(); }
        else finish();
      }, i === item.a ? 900 : 1900);
    }
    function finish() {
      qBody.style.display = 'none';
      qRes.style.display = 'block';
      var msg, sub;
      var r = score / QUIZ.length;
      if (r === 1) { msg = '满分！你就是「信科通」🎉'; sub = '厉害！欢迎把这个网站分享给更多同学。'; }
      else if (r >= 0.75) { msg = '很了解桂信科嘛！'; sub = '离满分只差一点点，再来一次？'; }
      else if (r >= 0.5) { msg = '还不错，继续探索～'; sub = '逛一逛本站的「走进信科」和「校园相册」会有新发现。'; }
      else { msg = '新朋友你好呀 👋'; sub = '别急，慢慢逛，你会发现桂信科很多惊喜。'; }
      qRes.querySelector('.score').innerHTML = score + '<small> / ' + QUIZ.length + '</small>';
      qRes.querySelector('.msg').textContent = msg;
      qRes.querySelector('.sub').textContent = sub;
    }
    var again = quizEl.querySelector('.quiz-again');
    if (again) again.addEventListener('click', function () {
      qi = 0; score = 0;
      qRes.style.display = 'none';
      qBody.style.display = 'block';
      renderQ();
    });
    renderQ();
  }

  /* ---------- 返回顶部 ---------- */
  var backtop = document.querySelector('.backtop');
  if (backtop) backtop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 年份 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.js-year'), function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
