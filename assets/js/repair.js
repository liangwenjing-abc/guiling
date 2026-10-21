/* ============================================================
   校园报修 · 登记与进度看板（方案 3）
   - 表单：地点 / 类型 / 描述 / 图片 / 紧急程度
   - AI：识别图片故障、生成描述与标签（调 assistant.js 暴露的 xaVision）
   - 看板：状态筛选、KPI 统计、状态可点击推进（仅演示，不推送后勤系统）
   - 数据存 localStorage，本地演示
   ============================================================ */
(function () {
  'use strict';

  var box = document.getElementById('repair');
  if (!box) return;

  var KEY = 'guit-repairs-v1';
  var TYPES = ['桌椅家具', '灯管照明', '空调设备', '门窗门锁', '水电卫浴', '网络设备', '其他'];
  var STATUS = ['待处理', '处理中', '已完成'];

  /* ---------------- 演示数据 ---------------- */
  function seed() {
    var now = Date.now();
    return [
      { id: 'BX-1008', area: '中苑 3 栋 402', type: '门窗门锁', desc: '宿舍门锁转动很涩，钥匙要拔好几次才出得来。', tags: ['门锁', '卡涩'], urgency: '普通', status: '已完成', ts: now - 1000 * 60 * 60 * 52, img: '' },
      { id: 'BX-1012', area: '博文楼 F305 教室', type: '灯管照明', desc: '靠窗第二排灯管一闪一闪，晚上上课影响看黑板。', tags: ['灯管', '闪烁'], urgency: '普通', status: '处理中', ts: now - 1000 * 60 * 60 * 20, img: '' },
      { id: 'BX-1017', area: '崇德楼 506 机房', type: '空调设备', desc: '机房空调不制冷，室内闷热，机器风扇声变大。', tags: ['空调', '不制冷'], urgency: '紧急', status: '待处理', ts: now - 1000 * 60 * 90, img: '' },
      { id: 'BX-1019', area: '中苑 5 栋 311', type: '桌椅家具', desc: '书桌抽屉滑轨断了，抽屉掉下来卡住。', tags: ['桌椅', '滑轨'], urgency: '普通', status: '待处理', ts: now - 1000 * 60 * 25, img: '' }
    ];
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) { var s = seed(); save(s); return s; }
      var arr = JSON.parse(raw);
      return Array.isArray(arr) && arr.length ? arr : seed();
    } catch (e) { return seed(); }
  }
  function save(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {}
  }

  var DB = load();
  var filter = '全部';
  var picked = '桌椅家具';
  var imgData = '';

  /* ---------------- KPI ---------------- */
  function renderKpi() {
    var total = DB.length;
    var doing = DB.filter(function (d) { return d.status === '处理中'; }).length;
    var done = DB.filter(function (d) { return d.status === '已完成'; }).length;
    var days = 1.6;
    var el = document.getElementById('rpKpi');
    if (!el) return;
    el.innerHTML =
      '<div><b>' + total + '<i>单</i></b><span>累计报修（演示数据）</span></div>' +
      '<div><b>' + doing + '<i>单</i></b><span>处理中</span></div>' +
      '<div><b>' + done + '<i>单</i></b><span>已完成</span></div>' +
      '<div><b>' + days + '<i>天</i></b><span>平均处理时长</span></div>';
  }

  /* ---------------- 看板 ---------------- */
  function fmt(ts) {
    var d = new Date(ts);
    function p(n) { return n < 10 ? '0' + n : n; }
    return (d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function renderBoard() {
    var list = document.getElementById('rpList');
    var items = DB.filter(function (d) { return filter === '全部' || d.status === filter; })
      .sort(function (a, b) { return b.ts - a.ts; });
    if (!items.length) {
      list.innerHTML = '<div class="rp-empty">这个状态下还没有报修单</div>';
      return;
    }
    list.innerHTML = items.map(function (d) {
      return '<article class="rp-item" data-st="' + d.status + '" data-id="' + d.id + '">' +
        '<div class="rp-item-top">' +
          '<span class="rp-id">' + d.id + '</span>' +
          '<span class="rp-place">' + d.area + '</span>' +
          '<button type="button" class="rp-st" data-st="' + d.status + '" title="演示：点击推进状态（不会推送后勤系统）">' + d.status + '</button>' +
        '</div>' +
        '<p class="rp-item-desc">' + d.desc + '</p>' +
        (d.tags && d.tags.length ? '<div class="rp-tags">' + d.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' : '') +
        '<div class="rp-item-foot">' +
          (d.img ? '<img src="' + d.img + '" alt="报修现场照片">' : '') +
          '<span>' + d.type + ' · ' + d.urgency + ' · ' + fmt(d.ts) + '</span>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ---------------- 表单 ---------------- */
  function renderTypes() {
    var el = document.getElementById('rpTypes');
    el.innerHTML = TYPES.map(function (t) {
      return '<button type="button" class="rp-type' + (t === picked ? ' on' : '') + '" data-t="' + t + '">' + t + '</button>';
    }).join('');
  }

  function nextId() {
    var n = 1000;
    DB.forEach(function (d) {
      var m = /BX-(\d+)/.exec(d.id);
      if (m) n = Math.max(n, parseInt(m[1], 10));
    });
    return 'BX-' + (n + 1);
  }

  function collect() {
    var sel = document.getElementById('rpArea').value.trim();
    var sub = document.getElementById('rpAreaSub').value.trim();
    var key = sel.replace(/(宿舍|楼|区)$/, '').slice(0, 2);
    var area = sub ? (sub.indexOf(key) === 0 ? sub : sel + ' · ' + sub) : sel;
    var urgBtn = document.querySelector('.rp-type.urg.on');
    return {
      area: area,
      type: picked,
      desc: document.getElementById('rpDesc').value.trim(),
      urgency: (urgBtn && urgBtn.dataset.u === '紧急') ? '紧急' : '普通',
      img: imgData
    };
  }

  function submit() {
    var f = collect();
    var msg = document.getElementById('rpFormMsg');
    if (!f.area) { msg.textContent = '请先填写具体位置（哪栋哪间）'; msg.style.color = '#A61E28'; return; }
    if (!f.desc) { msg.textContent = '请简单描述一下故障，方便师傅带工具'; msg.style.color = '#A61E28'; return; }
    var rec = {
      id: nextId(), area: f.area, type: f.type, desc: f.desc,
      tags: aiTags.length ? aiTags : [f.type], urgency: f.urgency,
      status: '待处理', ts: Date.now(), img: f.img
    };
    DB.push(rec); save(DB);
    renderKpi(); filter = '全部'; document.querySelectorAll('.rp-tab').forEach(function (b) { b.classList.toggle('on', b.dataset.st === '全部'); });
    renderBoard();
    msg.textContent = '已记录报修单 ' + rec.id + '（仅本地保存，不会推送到后勤系统）';
    msg.style.color = '#1E7A4E';
    /* 清空表单 */
    document.getElementById('rpDesc').value = '';
    document.getElementById('rpAreaSub').value = '';
    imgData = ''; aiTags = [];
    document.getElementById('rpPreview').classList.remove('show');
    document.getElementById('rpFile').value = '';
    document.getElementById('rpAi').classList.remove('show');
    document.getElementById('rpAiMsg').classList.remove('show');
  }

  /* ---------------- 图片 + AI ---------------- */
  var aiTags = [];

  function compress(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () {
        var img = new Image();
        img.onload = function () {
          var max = 760;
          var s = Math.min(1, max / Math.max(img.width, img.height));
          var c = document.createElement('canvas');
          c.width = Math.round(img.width * s);
          c.height = Math.round(img.height * s);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL('image/jpeg', 0.72));
        };
        img.onerror = reject;
        img.src = fr.result;
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  var AI_PROMPT = '你是校园后勤报修助手。看这张照片，判断故障属于哪一类（只能从中选一个：' +
    TYPES.join('、') + '），用一句中文描述故障现象、可能原因、建议师傅带什么配件。' +
    '只输出 JSON，不要任何多余文字：{"type":"上面列表中的一个","desc":"一句描述","tags":["标签1","标签2"],"urgency":"普通或紧急"}';

  function askAI() {
    var btn = document.getElementById('rpAi');
    var msg = document.getElementById('rpAiMsg');
    if (!imgData) return;
    if (!window.xaVision) {
      msg.textContent = 'AI 识别需要在接入助手（assistant.js）的页面使用，这里先手动填写描述也可以。';
      msg.className = 'rp-ai-msg show err';
      return;
    }
    btn.disabled = true;
    msg.className = 'rp-ai-msg show';
    msg.textContent = 'AI 正在看这张照片…';
    window.xaVision(imgData, AI_PROMPT).then(function (txt) {
      var j = null;
      try { j = JSON.parse(String(txt).replace(/```json|```/g, '').trim()); } catch (e) {
        var m = /\{[\s\S]*\}/.exec(txt);
        if (m) { try { j = JSON.parse(m[0]); } catch (e2) {} }
      }
      if (!j) throw new Error('返回格式看不懂');
      if (j.type && TYPES.indexOf(j.type) >= 0) { picked = j.type; renderTypes(); }
      if (j.desc) document.getElementById('rpDesc').value = j.desc;
      aiTags = Array.isArray(j.tags) ? j.tags.slice(0, 4) : [];
      if (j.urgency === '紧急') {
        document.querySelectorAll('.rp-type.urg').forEach(function (b) { b.classList.toggle('on', b.dataset.u === '紧急'); });
      }
      msg.textContent = '✓ 已识别为「' + (j.type || picked) + '」，描述和标签已自动填好，可再手动改。';
      msg.className = 'rp-ai-msg show';
    }).catch(function (err) {
      msg.textContent = 'AI 识别没成功（' + (err && err.message ? err.message : err) + '），可以手动写一句描述。';
      msg.className = 'rp-ai-msg show err';
    }).then(function () {
      btn.disabled = false;
    });
  }

  /* ---------------- 事件 ---------------- */
  function bind() {
    document.getElementById('rpTypes').addEventListener('click', function (e) {
      var b = e.target.closest('.rp-type');
      if (!b) return;
      picked = b.dataset.t;
      renderTypes();
    });

    document.querySelectorAll('.rp-type.urg').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.rp-type.urg').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      });
    });

    document.querySelectorAll('.rp-tab').forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.dataset.st;
        document.querySelectorAll('.rp-tab').forEach(function (x) { x.classList.toggle('on', x === b); });
        renderBoard();
      });
    });

    document.getElementById('rpList').addEventListener('click', function (e) {
      var st = e.target.closest('.rp-st');
      if (!st) return;
      var card = st.closest('.rp-item');
      var id = card.dataset.id;
      var rec = DB.filter(function (d) { return d.id === id; })[0];
      if (!rec) return;
      var i = STATUS.indexOf(rec.status);
      rec.status = STATUS[(i + 1) % STATUS.length];
      save(DB); renderKpi(); renderBoard();
    });

    var file = document.getElementById('rpFile');
    file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      if (!f) return;
      compress(f).then(function (dataUrl) {
        imgData = dataUrl;
        var pv = document.getElementById('rpPreview');
        pv.querySelector('img').src = dataUrl;
        pv.classList.add('show');
        document.getElementById('rpAi').classList.add('show');
        document.getElementById('rpAiMsg').classList.remove('show');
      });
    });

    document.getElementById('rpClear').addEventListener('click', function () {
      imgData = '';
      document.getElementById('rpPreview').classList.remove('show');
      document.getElementById('rpFile').value = '';
      document.getElementById('rpAi').classList.remove('show');
      document.getElementById('rpAiMsg').classList.remove('show');
    });

    document.getElementById('rpAi').addEventListener('click', askAI);
    document.getElementById('rpSubmit').addEventListener('click', submit);
  }

  renderKpi();
  renderTypes();
  renderBoard();
  bind();
})();
