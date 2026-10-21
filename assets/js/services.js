/* ============================================================
   校园服务 · 办事指引
   数据来自学校官网公开信息；未核实的字段标 tbc（页面上显示"待核实"）
   ============================================================ */
(function () {
  'use strict';

  var root = document.getElementById('services');
  if (!root) return;

  /* ---------------- 业务数据 ---------------- */
  var SVC = [
    {
      id: 'card', cat: '一卡通', name: '校园卡补办', sub: '丢卡、坏卡后的补办与工本费',
      place: '一站式学生服务中心 · 信网服务窗口',
      hours: '周一至周五 8:30–11:30 / 14:00–17:00', hoursTbc: true,
      duration: '现场约 10 分钟，当场领卡',
      materials: [
        { n: '学生证 或 身份证', must: true, can: true,
          alt: '两证有其一即可；都没有可报学号，由窗口核验身份' },
        { n: '一寸照片 1 张', must: false, can: true,
          alt: '校内自助拍照点或现场补拍' },
        { n: '工本费 15 元', must: true, can: false,
          alt: '按学校标准收取（首次办证不收工本费，遗失补办才收费）' }
      ],
      steps: ['窗口取号', '填写补卡申请单', '缴费', '现场制卡领取'],
      notice: '挂失后找回可申请解挂；补卡后原卡作废。火车票优惠磁条另按 7 元/卡收取。',
      src: '2026 年招生章程（补办工本费标准）· 一站式学生服务中心窗口设置'
    },
    {
      id: 'stu', cat: '学籍教务', name: '学生证补办', sub: '遗失、更名、转专业后的学生证补办',
      place: '一站式学生服务中心 · 学籍服务窗口',
      hours: '周一至周五 8:30–11:30 / 14:00–17:00', hoursTbc: true,
      duration: '材料齐全后约 3–5 个工作日',
      materials: [
        { n: '学生证补办申请表', must: true, can: true,
          alt: '官网「下载专区」可下载打印，也可到窗口领空白表现场填写' },
        { n: '一寸照片 1 张', must: true, can: true,
          alt: '校内自助拍照点或现场补拍' },
        { n: '学院签字 / 盖章', must: true, can: true,
          alt: '多数情况下可由窗口协调，先受理后补签，具体听窗口安排' },
        { n: '工本费 5 元', must: true, can: false,
          alt: '其他证书类工本费 5 元/证（2026 年招生章程）' }
      ],
      steps: ['下载/领取表格', '填写并找学院签字', '窗口提交材料', '按通知领取新证'],
      notice: '更名、转专业需附相关证明材料；需要火车票优惠磁条的要另行申请。',
      src: '学工部「下载专区 · 学生证相关模版」· 2026 年招生章程'
    },
    {
      id: 'aid', cat: '资助奖助', name: '国家助学金 / 助学贷款', sub: '家庭经济困难认定与奖助申请',
      place: '一站式学生服务中心 · 学生资助窗口',
      hours: '按当学年通知集中受理',
      duration: '认定后按学期发放',
      materials: [
        { n: '家庭经济困难学生认定申请表', must: true, can: true,
          alt: '学院统一发放，也可在学工部「下载专区」获取' },
        { n: '身份证 / 学生证', must: true, can: true,
          alt: '证件缺失可先用学号登记，后续补交' },
        { n: '生源地助学贷款回执', must: false, can: false,
          alt: '仅申请了生源地贷款的同学需要，回执由贷款银行提供' },
        { n: '家庭情况相关证明', must: false, can: true,
          alt: '如低保证明、突发困难说明等；不确定就先问辅导员' }
      ],
      steps: ['提交申请', '班级民主评议', '学院审核公示', '学校审批发放'],
      notice: '材料清单与截止时间每个学年可能调整，以当年通知为准；可拨学工部 0773-8100530 咨询。',
      src: '学工部「业务流程」栏目（国家助学金、生源地信用助学贷款等）· 一站式学生服务中心'
    },
    {
      id: 'fix', cat: '后勤保障', name: '宿舍报修', sub: '水电、家具、空调等宿舍设施报修',
      place: '一站式学生服务中心 · 后勤服务窗口 / 本楼宿舍管理员',
      hours: '工作日窗口时间；紧急情况随时联系宿管',
      duration: '一般 24 小时内响应，漏水断电即时处理',
      materials: [
        { n: '宿舍楼栋 + 房号', must: true, can: false,
          alt: '报修时必填，写清楚位置师傅才能上门' },
        { n: '故障描述 / 现场照片', must: false, can: true,
          alt: '拍照能少跑一趟：师傅可提前带配件' },
        { n: '可联系到的电话', must: true, can: true,
          alt: '写上电话，师傅上门前会先联系你' }
      ],
      steps: ['报修登记', '派单给维修班', '师傅上门', '修好签字确认'],
      notice: '紧急漏水、断电请直接找宿管或拨打宿舍公示的后勤值班电话；非人为损坏一般不收费。',
      src: '一站式学生服务中心窗口设置（后勤服务窗口）'
    },
    {
      id: 'clinic', cat: '医疗健康', name: '校医室就诊', sub: '日常门诊、简单处置与转诊',
      place: '校医室 · 红色操场旁边',
      hours: '9:00–12:00 / 14:00–20:00',
      duration: '门诊即时；需要转诊按医院流程',
      materials: [
        { n: '学生证 / 校园卡', must: true, can: true,
          alt: '忘带可先报学号登记，下次补验' },
        { n: '医保卡或电子医保凭证', must: false, can: true,
          alt: '需要走医保报销时出示；没有则按自费' },
        { n: '既往病历 / 过敏史说明', must: false, can: true,
          alt: '有慢性病或药物过敏的，口头告知医生即可' }
      ],
      steps: ['登记挂号', '医生问诊', '取药或开转诊单', '留好票据以便报销'],
      notice: '门诊时间为 9:00–12:00 / 14:00–20:00，其余时段安排以校医室公示为准；急重症请直接拨打 120。',
      src: '校医室现场信息（位置：红色操场旁；开放时间 9:00–12:00 / 14:00–20:00）'
    }
  ];

  var CATS = ['全部', '医疗健康', '后勤保障', '学籍教务', '资助奖助', '一卡通'];
  var ICONS = {
    '一卡通': '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18"/><path d="M6.5 14.5h4"/>',
    '学籍教务': '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4"/>',
    '资助奖助': '<path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.6l5.9-.8L12 3.5z"/>',
    '后勤保障': '<path d="M14.7 6.3a4 4 0 015.2 5.2l-8 8a2.1 2.1 0 01-3-3l8-8z"/><path d="M5 19l3.2-3.2"/>',
    '医疗健康': '<path d="M12 4.5v15M4.5 12h15"/>'
  };

  var cur = 0, cat = '全部';

  /* ---------------- 渲染清单 ---------------- */
  var listBox = document.getElementById('svcList');
  var catsBox = document.getElementById('svcCats');
  var detail = document.getElementById('svcDetail');

  function renderCats() {
    catsBox.innerHTML = CATS.map(function (c) {
      var n = c === '全部' ? SVC.length : SVC.filter(function (s) { return s.cat === c; }).length;
      return '<button type="button" class="svc-cat' + (c === cat ? ' on' : '') + '" data-cat="' + c + '">' +
        c + '<i>' + n + '</i></button>';
    }).join('');
  }

  function renderList() {
    var items = SVC.filter(function (s) { return cat === '全部' || s.cat === cat; });
    listBox.innerHTML = items.map(function (s) {
      var i = SVC.indexOf(s);
      return '<button type="button" class="svc-item' + (i === cur ? ' on' : '') + '" data-i="' + i + '">' +
        '<span class="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[s.cat] || '') + '</svg></span>' +
        '<span class="svc-item-t"><b>' + s.name + '</b><span>' + s.place + '</span></span>' +
        '<span class="svc-item-tag">' + s.cat + '</span>' +
        '</button>';
    }).join('');
  }

  /* ---------------- 渲染详情 ---------------- */
  function renderDetail() {
    var s = SVC[cur];
    var mats = s.materials.map(function (m, i) {
      var cls = 'svc-mat' + (m.can ? ' ok' : ' no');
      return '<li class="' + cls + '" data-m="' + i + '">' +
        '<input type="checkbox" id="svcMat' + i + '" aria-label="已准备 ' + m.n + '">' +
        '<label class="svc-mat-main" for="svcMat' + i + '">' +
          '<span class="svc-mat-n">' + m.n + (m.must ? '' : '<i>可后补</i>') + '</span>' +
          '<span class="svc-mat-alt">' + (m.can ? '✅ 可以办：' : '⛔ 不能办：') + m.alt + '</span>' +
        '</label>' +
        '<button type="button" class="svc-miss">没有？</button>' +
        '</li>';
    }).join('');

    detail.innerHTML =
      '<div class="svc-dhead"><h3>' + s.name + '</h3><span class="svc-item-tag">' + s.cat + '</span></div>' +
      '<p class="svc-dsub">' + s.sub + '</p>' +
      '<dl class="svc-meta">' +
        '<dt>办理地点</dt><dd><b>' + s.place + '</b>' + (s.placeTbc ? '<span class="svc-tbc">待核实</span>' : '') + '</dd>' +
        '<dt>办理时间</dt><dd>' + s.hours + (s.hoursTbc ? '<span class="svc-tbc">待核实</span>' : '') + '</dd>' +
        '<dt>办理时长</dt><dd>' + s.duration + '</dd>' +
      '</dl>' +
      '<div class="svc-sec-t"><h4>需要材料 <em>' + s.materials.length + ' 项</em></h4>' +
        '<label class="svc-switch"><input type="checkbox" id="svcMissing"> 我缺材料</label></div>' +
      '<ul class="svc-mats">' + mats + '</ul>' +
      '<p class="svc-miss-hint">打开「我缺材料」后：<b style="color:#1E7A4E">绿边</b>＝可以先用替代材料或先办后补；' +
        '<b style="color:#A61E28">红边</b>＝这一项必须先补齐才能办。</p>' +
      '<div class="svc-sec-t"><h4>办理流程</h4></div>' +
      '<ol class="svc-steps">' + s.steps.map(function (st, i) {
        return '<li><b>' + (i + 1) + '</b>' + st + '</li>';
      }).join('') + '</ol>' +
      '<p class="svc-note">' + s.notice + '</p>' +
      '<div class="svc-acts">' +
        '<button type="button" class="svc-btn svc-btn-ai" id="svcAsk">问问 AI：要带什么材料？</button>' +
        '<a class="svc-btn svc-btn-ghost" href="route.html">在校园路线图里看位置 →</a>' +
      '</div>' +
      '<p class="svc-src">资料来源：' + s.src + '　·　本页只做查询展示，不支持线上提交/预约；具体以学校最新通知为准。</p>';

    bindDetail(s);
  }

  function bindDetail(s) {
    Array.prototype.forEach.call(detail.querySelectorAll('.svc-mat'), function (li) {
      var cb = li.querySelector('input');
      var missBtn = li.querySelector('.svc-miss');
      cb.addEventListener('change', function () { li.classList.toggle('done', cb.checked); });
      missBtn.addEventListener('click', function () {
        li.classList.toggle('open');
        missBtn.textContent = li.classList.contains('open') ? '收起' : '没有？';
      });
    });
    var sw = document.getElementById('svcMissing');
    if (sw) sw.addEventListener('change', function () {
      detail.classList.toggle('missing', sw.checked);
    });
    var ask = document.getElementById('svcAsk');
    if (ask) ask.addEventListener('click', function () {
      var q = '我' + s.name.replace(/（.*?）/g, '') + '要带什么材料？在哪办？';
      if (window.xaAsk) window.xaAsk(q);
      else if (window.alert) window.alert('接入 AI 助手后，这里会带着问题打开对话框：\n\n' + q);
    });
  }

  /* ---------------- 事件 ---------------- */
  catsBox.addEventListener('click', function (e) {
    var b = e.target.closest('.svc-cat');
    if (!b) return;
    cat = b.getAttribute('data-cat');
    var first = SVC.filter(function (s) { return cat === '全部' || s.cat === cat; })[0];
    if (first) cur = SVC.indexOf(first);
    renderCats(); renderList(); renderDetail();
  });

  listBox.addEventListener('click', function (e) {
    var b = e.target.closest('.svc-item');
    if (!b) return;
    cur = parseInt(b.getAttribute('data-i'), 10);
    renderList(); renderDetail();
  });

  renderCats();
  renderList();
  renderDetail();
})();
