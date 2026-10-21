/* ============================================================
   遇见桂信科 · AI 语音小助手「小信」
   - 会走路/会被拽的小人 + 圆钮 + 对话框（接 DeepSeek 大模型）
   - 说明：密钥写在前端，仅用于校内展示/比赛演示；正式上线建议改走自建代理。
   ============================================================ */
(function () {
  'use strict';
  if (window.__XA_READY__) return;
  window.__XA_READY__ = true;

  /* ============================================================
     0. 配置
     ============================================================ */
  var CFG = {
    apiKey: 'sk-ee832ddd62fc4e34a9495b05db5cd69d',
    apiUrl: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-flash',
    img: 'assets/img/assistant/xiaoxin.webp',
    head: 'assets/img/assistant/xiaoxin-head.webp',
    blink: 'assets/img/assistant/xiaoxin-blink.webp',
    name: '小信'
  };

  var PAGES = {
    'index.html': '首页（数据速览、八大专业集群、院系预览、办学成果、校园相册、校园路线、新闻动态、快捷入口、新生小测试）',
    'about.html': '走进信科（学校简介、校训与办学理念、历史沿革、办学条件、人才培养）',
    'majors.html': '院系与专业（专业建设成果、43 个本科专业总表、可按学院筛选）',
    'honors.html': '办学成果（学科竞赛、就业质量、产教融合、荣誉与媒体）',
    'campus.html': '校园相册（25 张照片，风光建筑 6、学生活动 16、教职工活动 3，可点开大图）',
    'route.html': '校园路线（可拖动插画地图、13 个点位、三条主题路线）',
    'contact.html': '联系我们（地址、招生咨询、综合联系、官方平台）'
  };

  var KB = [
    '【学校基本盘】桂林信息科技学院（Guilin Institute of Information Technology，GIIT），广西桂林市临桂区岩图路9号（邮编 541100）。2001 年创建，前身是桂林电子工业学院信息科技学院；2006 年更名桂林电子科技大学信息科技学院；2021 年 5 月经教育部批准转设为独立设置的民办普通本科高校；2023 年临桂新校区落成；2025 年通过教育部本科教学合格评估。',
    '【校训与定位】校训「自强 力行 求实 创新」；办学理念「以终为始、以生为本」；定位是电子信息特色鲜明的高水平应用型大学，以工为主，工、管、文、理、经济、艺术、教育 7 大学科门类协调发展。',
    '【规模】占地 1331 亩，校舍建筑总面积 58.72 万平方米，全日制在校生 2.2 万余人，专任教师 1330 余人（自有教师硕士及以上占 84.68%，高级职称占 24.48%），43 个本科专业，7 个二级教学单位。',
    '【学院】信息工程学院（7 个专业）、电子工程学院（6）、机电工程学院（8）、商学院（7）、创意设计学院（6）、外贸与外语学院（5）、体育与健康学院（2），另有通识教育学院与马克思主义学院。',
    '【八大专业集群】人工智能与大数据、新一代信息技术、智能制造与机器人、新能源与智能电气、数字创意设计、数智商科、国际服务与贸易、旅游与体育健康。',
    '【专业建设】自治区级一流本科专业建设点 6 个：机械设计制造及其自动化、计算机科学与技术、电子信息工程、机械电子工程、网络工程、市场营销；广西民办高校重点支持建设专业 4 个；优势特色专业 3 个；自治区级一流本科课程 12 门（如《C语言程序设计》《云计算和服务器应用》《逆向工程技术》）。',
    '【办学成果】近三学年学生获国家级奖项 428 项、自治区级奖项 2010 项；中国大学生工程实践与创新能力大赛、大学生电子设计竞赛、RoboMaster 机甲大师赛三大赛事均曾获全国一等奖；连续 12 年获评「广西高校毕业生就业创业工作突出单位」，毕业生初次去向落实率多年位居广西普通高校前列；2025 年校友会中国民办大学排名全国第 76 位，入选三星级中国高水平应用型大学；获「全国品牌影响力民办高校」「自治区文明校园」「平安校园」；央广网「2022 年度全国创新创业典范高校」；获批自治区众创空间、自治区深化创新创业教育改革示范高校。',
    '【培养与产教】「163N」高素质应用型人才培养模式；「课—创—赛」双创教育体系；「3+1」「2.5+0.5+1」校企协同育人；与中兴通讯、亿纬锂能等共建现代产业学院 11 个；当选广西能源电子行业产教融合共同体常务理事长单位。',
    '【就业案例】电子信息工程为优势特色专业，2025 届毕业生就业率保持高位，毕业半年后平均月收入约 7018 元，粤港澳大湾区部分毕业生达 2 万元；与广州粤嵌等企业共建产业学院与实习就业基地，2022—2024 年累计输送 150 余名毕业生。',
    '【联系方式】地址：广西桂林市临桂区岩图路 9 号；招生热线 0773-8100501、8100502、8100503、8100506、8100508；招生邮箱 zhaosheng@guit.edu.cn，招生网 www.guit.edu.cn/zs/；学校邮箱 xxkjxy@guet.edu.cn；校长信箱 xkyzxx@guet.edu.cn；党政办 0773-8100550；官网 www.guit.edu.cn；就业网 www.guit.edu.cn/xjy/。',
    '【校园相册】25 张实拍照片，分「风光建筑」6 张、「学生活动」16 张、「教职工活动」3 张；支持点开看大图、左右切换、Esc 关闭。',
    '【校园路线】一张可拖动缩放的校园插画地图、13 个精选点位、3 条主题路线：新生报到线（约 1 小时 5 站，东大门→文体活动中心→中苑宿舍→生活服务区→图文信息综合楼）、半小时打卡线（约 30 分钟 5 站）、活力运动线（约 40 分钟 5 站，田径场、风雨操场、宿舍区等）。路线为示意走向，实地以校园指示牌为准。',
    '【校园环境】校园山水与人文交融，教学楼、图书馆、学生宿舍、体育馆及食堂均配备冷暖空调；图书馆有阅读自习与研讨空间；学生公寓配空调与独立卫浴（房型与收费以招生章程为准）。',
    '【本站说明】《遇见桂信科》是在校学生参加「AI创想桂信科」AI 应用创意赛道的参赛作品，不是学校官方渠道；内容与图片来源为学校官网及公开资料，数据统计至 2026 年 6 月，如与官方不一致以官网为准。'
  ].join('\n');

  /* ============================================================
     1. 小工具
     ============================================================ */
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function pageKey() {
    var p = location.pathname.split('/').pop() || 'index.html';
    return PAGES[p] ? p : 'index.html';
  }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* 极简 markdown */
  function md(t) {
    t = esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
    var lines = t.split(/\n/), out = [], list = null;
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i].trim();
      if (!ln) { if (list) { out.push('</' + list + '>'); list = null; } continue; }
      var m = ln.match(/^(?:([*-])|(\d+)[.、)])\s+(.+)$/);
      if (m) {
        var kind = m[2] ? 'ol' : 'ul';
        if (list !== kind) { if (list) out.push('</' + list + '>'); out.push('<' + kind + '>'); list = kind; }
        out.push('<li>' + m[3] + '</li>');
      } else {
        if (list) { out.push('</' + list + '>'); list = null; }
        out.push('<p>' + ln + '</p>');
      }
    }
    if (list) out.push('</' + list + '>');
    return out.join('');
  }

  /* ============================================================
     2. 板块索引（供"讲解/定位"）
     ============================================================ */
  var SECS = [];
  function buildSecs() {
    SECS = [];
    var list = document.querySelectorAll('section');
    for (var i = 0; i < list.length; i++) {
      var s = list[i];
      if (s.closest('.xa-panel') || s.closest('.intro') || s.classList.contains('hero') || s.closest('.hero')) continue;
      var h = s.querySelector('h1, .sec-title, h2');
      if (!h) continue;
      var title = h.textContent.replace(/\s+/g, ' ').trim();
      if (!title) continue;
      var p = s.querySelector('p');
      var desc = p ? p.textContent.replace(/\s+/g, ' ').trim().slice(0, 40) : '';
      SECS.push({ el: s, title: title, desc: desc });
    }
  }

  var TIPS = [
    { k: /一所以电子信息|应用型大学|关于信科/, t: '这块是学校简介：2001 年建校，2021 年转设为独立民办本科，以工为主、电子信息特色突出。', go: ['about.html', '看完整简介'] },
    { k: /数据速览|创建于/, t: '这块是「数据速览」：1331 亩校园、58.72 万㎡校舍、43 个本科专业、2.2 万在校生——一眼看完学校的体量。' },
    { k: /八大专业集群|学科布局/, t: '八大专业集群是专业布局的骨架：AI 与大数据、新一代信息技术、智能制造……想深挖就点「院系与专业」。', go: ['majors.html', '看专业目录'] },
    { k: /院系与专业|7 个二级|教学单位/, t: '7 个二级教学单位、43 个本科专业，每张卡片都标了专业数，红色那个是热门专业。', go: ['majors.html', '完整专业表'] },
    { k: /办学成果|以赛促学|竞赛|就业/, t: '办学成果这块最亮眼：近三学年国家级奖项 428 项，还有连续 12 年就业先进单位的记录。', go: ['honors.html', '看办学成果'] },
    { k: /校园相册|山水与人文/, t: '校园相册有 25 张实拍，点开能看大图、左右切换。我最喜欢「云端瞰校」那张航拍。', go: ['campus.html', '逛相册'] },
    { k: /校园路线|三条路线/, t: '三条路线对应三种逛法：新生报到线约 1 小时、打卡线半小时、运动线 40 分钟，地图能拖动缩放。', go: ['route.html', '打开地图'] },
    { k: /新闻动态|近期校园新闻/, t: '这是近期校园新闻，标题都整理自学校官网，点官网可以看全文。' },
    { k: /你有多了解|互动小测|QUIZ/, t: '这是 8 道新生小测，答案都藏在站里。答完有彩蛋评语哦～' },
    { k: /我是新生|快速|入口/, t: '三个快捷入口：新生从哪看起、选专业、逛校园——不知道点哪就点第一个。' },
    { k: /学校简介|INTRODUCTION/, t: '这里是学校简介：2001 年建校，2021 年转设为独立民办本科，2023 年临桂新校区启用。' },
    { k: /历史沿革|HISTORY/, t: '历史沿革一条时间线：2001 建校 → 2004 独立学院 → 2006 更名 → 2021 转设 → 2023 新校区 → 2025 通过合格评估。' },
    { k: /专业建设|CONSTRUCTION/, t: '这些是专业建设成果：6 个自治区级一流专业建设点、12 门自治区级一流课程。' },
    { k: /专业总表|ALL MAJORS/, t: '专业总表可以按学院筛选，共 41 个普本招生专业，看代码和学位门类都在这儿。' },
    { k: /就业质量|EMPLOYMENT/, t: '就业这一块讲的是「双全」就业机制，还有电子信息工程专业的就业与薪资案例。' },
    { k: /互动地图|校园路线|一张地图/, t: '地图支持按住拖动、滚轮缩放，点三个路线卡片会自己飞过去。' },
    { k: /联系方式|怎么联系|CONTACT/, t: '地址、招生热线、邮箱都在这页；报考政策建议再看学校招生网。' }
  ];

  function tipFor(title) {
    for (var i = 0; i < TIPS.length; i++) if (TIPS[i].k.test(title)) return TIPS[i];
    return null;
  }

  /* ============================================================
     3. 注入 DOM
     ============================================================ */
  var root, doll, dollIn, dollBob, launcher, bubble, bubbleText, panel, bodyEl, inputEl, sendEl,
      micEl, speakEl, chipsEl, torch;

  function build() {
    root = el('div', 'xa-root');
    root.id = 'xaRoot';
    root.innerHTML =
      '<div class="xa-bubble" id="xaBubble" role="status" aria-live="polite"></div>' +
      '<div class="xa-doll" id="xaDoll" role="button" tabindex="0" aria-label="信科校园向导 小信，可以拖动我">' +
        '<span class="xa-doll-in" id="xaDollIn"><span class="xa-doll-bob" id="xaDollBob">' +
          '<img class="xa-face" src="' + CFG.img + '" alt="校园向导小信" draggable="false">' +
          '<img class="xa-lid" src="' + CFG.blink + '" alt="" draggable="false" aria-hidden="true">' +
        '</span></span>' +
      '</div>' +
      '<span class="xa-btn-wrap">' +
        '<button type="button" class="xa-launcher" id="xaLaunch" aria-expanded="false" aria-label="打开 AI 小助手">' +
          '<img class="xa-face" src="' + CFG.head + '" alt="" aria-hidden="true">' +
        '</button>' +
        '<span class="xa-badge">AI</span>' +
      '</span>';

    document.body.appendChild(root);
    bubble = $('#xaBubble', root);
    doll = $('#xaDoll', root);
    dollIn = $('#xaDollIn', root);
    dollBob = $('#xaDollBob', root);
    launcher = $('#xaLaunch', root);

    panel = el('div', 'xa-panel');
    panel.id = 'xaPanel';
    panel.innerHTML =
      '<div class="xa-head">' +
        '<span class="xa-ava"><img src="' + CFG.head + '" alt=""></span>' +
        '<span class="xa-meta">' +
          '<span class="xa-name">小信 <i>校园向导</i></span>' +
          '<span class="xa-st">在线 · DeepSeek 大模型</span>' +
        '</span>' +
        '<span class="xa-hbtns">' +
          '<button type="button" class="xa-hbtn" id="xaSpeak" title="朗读回复" aria-pressed="false">🔈</button>' +
          '<button type="button" class="xa-hbtn" id="xaClose" title="关闭" aria-label="关闭对话框">✕</button>' +
        '</span>' +
      '</div>' +
      '<div class="xa-body" id="xaBody" aria-live="polite"></div>' +
      '<div class="xa-chips" id="xaChips"></div>' +
      '<div class="xa-inbar">' +
        '<textarea class="xa-input" id="xaInput" rows="1" placeholder="问问我：专业、宿舍、路线、就业……" aria-label="输入问题"></textarea>' +
        '<button type="button" class="xa-send xa-mic" id="xaMic" title="语音输入" aria-label="语音输入">' +
          '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 15a3.2 3.2 0 003.2-3.2V6.2a3.2 3.2 0 10-6.4 0v5.6A3.2 3.2 0 0012 15z" fill="currentColor"/><path d="M6.3 11.4a.9.9 0 011.8 0 3.9 3.9 0 007.8 0 .9.9 0 011.8 0 5.7 5.7 0 01-4.8 5.6v2h2.4a.9.9 0 010 1.8H8.7a.9.9 0 010-1.8h2.4v-2a5.7 5.7 0 01-4.8-5.6z" fill="currentColor"/></svg>' +
        '</button>' +
        '<button type="button" class="xa-send" id="xaSend" title="发送" aria-label="发送">' +
          '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.3 11.2l14.2-6.9c1-.5 2 .5 1.6 1.5l-4.4 14c-.3 1-1.7 1.1-2.2.2l-2-4.2-4.2-2c-1-.5-.9-1.9 0-2.4z" fill="currentColor"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="xa-foot"><span>由 DeepSeek 大模型驱动 · 仅供参考</span><span>以学校官网为准</span></div>';
    document.body.appendChild(panel);

    bodyEl = $('#xaBody', panel);
    inputEl = $('#xaInput', panel);
    sendEl = $('#xaSend', panel);
    micEl = $('#xaMic', panel);
    speakEl = $('#xaSpeak', panel);
    chipsEl = $('#xaChips', panel);

    torch = el('div', 'xa-torch');
    torch.id = 'xaTorch';
    document.body.appendChild(torch);

    var closeBtn = $('#xaClose', panel);
    if (closeBtn) closeBtn.addEventListener('click', function () { openPanel(false); });
  }

  /* ============================================================
     4. 气泡说话
     ============================================================ */
  var bubbleTimer = null;
  function say(text, ms, opt) {
    opt = opt || {};
    bubble.innerHTML = '<span>' + esc(text) + '</span>';
    if (opt.go) {
      var b = el('button', 'xa-bub-go', esc(opt.go[1]));
      b.addEventListener('click', function () { location.href = opt.go[0]; });
      bubble.appendChild(document.createElement('br'));
      bubble.appendChild(b);
    }
    bubble.classList.add('show');
    flash('is-talk', 1400);
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.classList.remove('show'); }, ms || 3600);
  }
  function hideBubble() { bubble.classList.remove('show'); clearTimeout(bubbleTimer); }

  /* ============================================================
     4.5 小动作：眨眼、点头、踮脚、张望、跟随鼠标
     ============================================================ */
  var ACTS = ['is-nod', 'is-toe', 'is-look', 'is-hop'];
  var actBusy = false;

  var flashTimers = {};
  function flash(cls, ms) {
    if (!doll) return;
    doll.classList.add(cls);
    clearTimeout(flashTimers[cls]);
    flashTimers[cls] = setTimeout(function () { doll.classList.remove(cls); }, ms || 900);
  }

  function playAct(cls) {
    if (actBusy || !doll || doll.classList.contains('is-grab')) return;
    actBusy = true;
    doll.classList.add(cls);
    var ms = cls === 'is-look' ? 1500 : 1000;
    setTimeout(function () { doll.classList.remove(cls); actBusy = false; }, ms);
  }

  function scheduleActs() {
    var next = 5200 + Math.random() * 6200;
    setTimeout(function () {
      if (!document.hidden && !panel.classList.contains('open') &&
          !doll.classList.contains('is-grab') && !bubble.classList.contains('show')) {
        playAct(pick(ACTS));
      }
      scheduleActs();
    }, next);
  }

  function blinkOnce() {
    if (!doll || document.hidden) return;
    doll.classList.add('is-blink');
    setTimeout(function () { doll.classList.remove('is-blink'); }, 130);
    /* 偶尔连眨两下 */
    if (Math.random() < 0.28) {
      setTimeout(function () {
        doll.classList.add('is-blink');
        setTimeout(function () { doll.classList.remove('is-blink'); }, 110);
      }, 260);
    }
  }

  function scheduleBlink() {
    setTimeout(function () {
      if (!doll.classList.contains('is-grab')) blinkOnce();
      scheduleBlink();
    }, 2800 + Math.random() * 5200);
  }

  /* 鼠标在附近时，他会朝鼠标方向侧身看你 */
  var tiltT = 0;
  function bindLook() {
    if (!window.matchMedia || !window.matchMedia('(pointer:fine)').matches) return;
    document.addEventListener('mousemove', function (e) {
      var now = Date.now();
      if (now - tiltT < 70 || !doll || doll.classList.contains('is-grab')) return;
      tiltT = now;
      var r = doll.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height * 0.35;
      var dx = e.clientX - cx, dy = e.clientY - cy;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d > 460) { dollIn.style.transform = ''; return; }
      var k = Math.max(0, 1 - d / 460);
      var rot = Math.max(-7, Math.min(7, dx * 0.02)) * k;
      var ox = Math.max(-4, Math.min(4, dx * 0.012)) * k;
      var oy = Math.max(-3, Math.min(3, dy * 0.01)) * k;
      dollIn.style.transform = 'translate(' + ox.toFixed(1) + 'px,' + oy.toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)';
    }, { passive: true });
    document.addEventListener('mouseleave', function () { if (dollIn) dollIn.style.transform = ''; });
  }

  /* ============================================================
     5. 拖拽小人
     ============================================================ */
  var DRAG = [
    '哎呀！别拽我——', '你快放开我！', '帽子要掉了啦！', '喂喂喂，我还没站稳！',
    '再拉我就要摔啦！', '好啦好啦，我投降 🙌', '别拽我，我鞋都要掉了！', '轻、轻一点……我恐高！'
  ];
  var FREE = [
    '呼——终于自由了。', '站稳了！下次轻点嘛。', '差点摔个屁股蹲儿 😵', '行了行了，我站回原位吧。',
    '你这力气，够去搬行李了。'
  ];
  var IDLE = [
    '需要帮忙就点我旁边那个圆钮哦。', '我可以讲专业、讲路线，也能陪你聊聊校园生活～',
    '往下滑滑看，还有新生小测试呢！', '拉我可以，别拉太久啊。'
  ];

  function bindDoll() {
    var dragging = false, moved = false, sx = 0, sy = 0, lastSay = 0, pid = null;

    doll.addEventListener('pointerdown', function (e) {
      if (e.button && e.button !== 0) return;
      dragging = true; moved = false;
      sx = e.clientX; sy = e.clientY;
      pid = e.pointerId;
      try { doll.setPointerCapture(pid); } catch (err) {}
      doll.classList.add('is-grab');
      if (dollIn) dollIn.style.transform = '';
      doll.style.transition = 'none';
      lastSay = Date.now();
      say(pick(DRAG), 2200);
    });

    doll.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var rx = e.clientX - sx, ry = e.clientY - sy;
      var d = Math.sqrt(rx * rx + ry * ry);
      if (!moved && d > 6) {
        moved = true; doll.classList.add('is-pulled');
        say(pick(DRAG), 2400); lastSay = Date.now();
      }
      if (!moved) return;
      var max = 130, k = max / (max + d);
      var ox = rx * k * 0.92, oy = ry * k * 0.92;
      var rot = Math.max(-22, Math.min(22, rx * 0.14));
      doll.style.transform = 'translate(' + ox.toFixed(1) + 'px,' + oy.toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg) scale(1.04)';
      if (Date.now() - lastSay > 1800 && d > 30) { say(pick(DRAG), 2200); lastSay = Date.now(); }
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      doll.classList.remove('is-grab', 'is-pulled');
      try { if (pid != null) doll.releasePointerCapture(pid); } catch (err) {}
      doll.style.transition = 'transform .78s cubic-bezier(.34,1.5,.5,1)';
      doll.style.transform = '';
      setTimeout(function () { doll.style.transition = ''; }, 820);
      if (moved) { say(pick(FREE), 2600); moved = false; }
      else if (typeof tour !== 'undefined' && tour) { tourNext(); }
      else { explain(); }
    }
    doll.addEventListener('pointerup', endDrag);
    doll.addEventListener('pointercancel', endDrag);
    doll.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); explain(); }
    });
  }

  /* ============================================================
     6. 讲解：当前板块 / 巡游
     ============================================================ */
  function currentSec() {
    var cy = window.innerHeight * 0.42, best = null, bd = 1e9;
    for (var i = 0; i < SECS.length; i++) {
      var r = SECS[i].el.getBoundingClientRect();
      if (r.bottom < 40 || r.top > window.innerHeight - 40) continue;
      var d = Math.abs(r.top + Math.min(r.height, 420) / 2 - cy);
      if (d < bd) { bd = d; best = SECS[i]; }
    }
    return best;
  }

  function explain() {
    flash('is-point', 950);
    var s = currentSec();
    if (!s) { say('页面还在加载呢，稍等一下下～'); return; }
    var tip = tipFor(s.title);
    if (tip) say(tip.t, 6000, tip.go ? { go: tip.go } : null);
    else say('这里是「' + s.title + '」' + (s.desc ? '，' + s.desc + '……' : '') + '想知道细节就问我吧。', 6000);
  }

  function torchAt(node, label) {
    var r = node.getBoundingClientRect(), pad = 10;
    torch.style.left = (r.left - pad) + 'px';
    torch.style.top = (r.top - pad) + 'px';
    torch.style.width = Math.max(40, r.width + pad * 2) + 'px';
    torch.style.height = Math.max(40, r.height + pad * 2) + 'px';
    torch.setAttribute('data-label', label || '看这里');
    torch.classList.toggle('xa-torch-below', r.top < 52);
    torch.classList.add('on');
    clearTimeout(torch._t);
    torch._t = setTimeout(function () { torch.classList.remove('on'); }, 3600);
  }

  function pointAt(idx, label) {
    var s = SECS[idx];
    if (!s) return;
    s.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () { torchAt(s.el, label || s.title); }, 430);
  }

  /* 巡游讲解 */
  var tour = null;
  function startTour() {
    if (!SECS.length) return;
    tour = { i: -1 };
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(tourNext, 500);
  }
  function tourNext() {
    if (!tour) return;
    tour.i++;
    if (tour.i >= SECS.length) { tour = null; say('逛完啦！想细看哪一块就问我 😊', 5000); return; }
    var s = SECS[tour.i];
    s.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () { torchAt(s.el, (tour ? tour.i + 1 : 1) + ' / ' + SECS.length + ' · ' + s.title); }, 420);
    var tip = tipFor(s.title);
    var txt = tip ? tip.t : '「' + s.title + '」' + (s.desc ? '：' + s.desc : '');
    say(txt + '（点我继续）', 7000);
  }

  /* ============================================================
     7. 对话
     ============================================================ */
  var MSGS = [], busy = false, SPEAK = store('xa-speak') !== '0';   // 默认开朗读

  function sysPrompt() {
    var outline = SECS.map(function (s, i) { return i + '. ' + s.title; }).join('\n');
    return [
      '你是「小信」，桂林信息科技学院（GIIT）校园网站《遇见桂信科》的 AI 语音导览助手，服务对象是学生、家长和来访者。',
      '性格：机灵、热情、有点小幽默，像一位热心的学长。说话口语化、简洁，一般 2—4 句、不超过 130 字，可用少量 emoji，不要用 Markdown 标题。',
      '',
      '规则：',
      '1. 只依据下面的「站点知识」回答。知识里没有的（分数线、学费、宿舍收费标准、录取结果、具体课程表等）就直说没查到，并引导去学校官网 www.guit.edu.cn 或招生网 www.guit.edu.cn/zs/ 看最新通知。',
      '2. 绝不编造数据、电话、专业名、日期。',
      '3. 本站是学生参加「AI创想桂信科」AI 应用创意赛道的作品，非学校官方渠道，涉及政策时提醒以官网为准。',
      '4. 用户如果让你"带我看看/在哪里/怎么去"，就配合下面的指令按钮。',
      '',
      '【可选指令】回答最后可以另起一行输出最多一条指令，格式必须严格如下（不要解释）：',
      '    <<go:about.html|去看看学校简介>>      ← 跳转到站内其他页面',
      '    <<point:3|带我去看>>                 ← 滚动并高亮当前页面的第 3 个板块',
      '可用页面：index.html 首页 / about.html 走进信科 / majors.html 院系与专业 / honors.html 办学成果 / campus.html 校园相册 / route.html 校园路线 / contact.html 联系我们',
      '当前页面：' + PAGES[pageKey()] + '（' + pageKey() + '）',
      '当前页面板块编号：\n' + outline,
      '',
      '【站点知识】',
      KB
    ].join('\n');
  }

  function addMsg(who, text) {
    var row = el('div', 'xa-row' + (who === 'me' ? ' me' : ''));
    if (who === 'bot') {
      var fa = el('span', 'xa-fa', '<img src="' + CFG.head + '" alt="">');
      row.appendChild(fa);
    }
    var b = el('div', 'xa-bub');
    b.innerHTML = text ? md(text) : '<div class="xa-dots"><i></i><i></i><i></i></div>';
    row.appendChild(b);
    bodyEl.appendChild(row);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return b;
  }

  var GO_WHITELIST = {
    'index.html': '首页', 'about.html': '走进信科', 'majors.html': '院系与专业',
    'honors.html': '办学成果', 'campus.html': '校园相册', 'route.html': '校园路线', 'contact.html': '联系我们'
  };

  function parseDirectives(raw) {
    var acts = [], out = raw;
    var re = /<<\s*(go|point)\s*:\s*([^|>]+?)\s*\|\s*([^>]*?)\s*>>/g, m;
    while ((m = re.exec(raw))) {
      var kind = m[1], arg = m[2].trim(), label = (m[3] || '').trim();
      if (kind === 'go') {
        var f = arg.replace(/^\.?\//, '').split('/').pop();
        if (GO_WHITELIST[f]) acts.push({ type: 'go', href: f, label: label || ('去' + GO_WHITELIST[f]) });
      } else {
        var i = parseInt(arg, 10);
        if (!isNaN(i) && SECS[i]) acts.push({ type: 'point', idx: i, label: label || SECS[i].title });
      }
    }
    out = out.replace(re, '').replace(/<<[^>]*>>/g, '').replace(/\n{3,}/g, '\n\n').trim();
    return { text: out, acts: acts.slice(0, 2) };
  }

  function renderActs(bub, acts) {
    if (!acts || !acts.length) return;
    var box = el('div', 'xa-acts');
    acts.forEach(function (a) {
      var b = el('button', 'xa-act', esc(a.label));
      b.addEventListener('click', function () {
        if (a.type === 'go') { location.href = a.href; }
        else { pointAt(a.idx, a.label); }
      });
      box.appendChild(b);
    });
    bub.appendChild(box);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  /* ---- 大模型调用（流式） ---- */
  function askAI(msgs, onDelta, onDone, onFail) {
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    fetch(CFG.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CFG.apiKey },
      body: JSON.stringify({
        model: CFG.model, messages: msgs, stream: true,
        temperature: 0.9, max_tokens: 900
      }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error('HTTP ' + res.status + ' ' + String(t).slice(0, 120));
        });
      }
      if (!res.body || !res.body.getReader) {
        return res.json().then(function (j) {
          var txt = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content || '';
          onDelta(txt); onDone(txt);
        });
      }
      var reader = res.body.getReader(), dec = new TextDecoder('utf-8');
      var buf = '', all = '', finished = false;

      function pump() {
        return reader.read().then(function (r) {
          if (r.done) { if (!finished) { finished = true; onDone(all); } return; }
          buf += dec.decode(r.value, { stream: true });
          var nl;
          while ((nl = buf.indexOf('\n')) >= 0) {
            var line = buf.slice(0, nl).replace(/\r$/, '');
            buf = buf.slice(nl + 1);
            if (line.indexOf('data:') !== 0) continue;
            var data = line.slice(5).trim();
            if (!data) continue;
            if (data === '[DONE]') { finished = true; break; }
            try {
              var j = JSON.parse(data);
              var d = j.choices && j.choices[0] && j.choices[0].delta;
              if (d && typeof d.content === 'string' && d.content) {
                all += d.content;
                onDelta(all, d.content);
              }
            } catch (e) {}
          }
          if (finished) { onDone(all); return; }
          return pump();
        });
      }
      return pump();
    }).catch(function (err) { if (!/abort/i.test(err && err.message)) onFail(err); });
  }

  /* ---- 断网/失败时的兜底（本地知识速答） ---- */
  function localAnswer(q) {
    var s = q.replace(/\s/g, '');
    var rules = [
      [/宿舍|寝室|住宿|空调/, '学生公寓配空调与独立卫浴，教学楼、图书馆、体育馆、食堂也都有冷暖空调；具体房型和收费标准以学校招生章程为准。', 'campus.html'],
      [/专业|学科|学院|学什么/, '学校有 7 个二级教学单位、43 个本科专业，分八大专业集群。想按学院看完整目录，去「院系与专业」页最清楚。', 'majors.html'],
      [/路线|地图|怎么走|怎么逛|报到/, '校园路线页有可拖动的插画地图、13 个点位和 3 条路线：新生报到线约 1 小时、打卡线半小时、运动线 40 分钟。', 'route.html'],
      [/就业|工资|薪资|找工作/, '学校连续 12 年获评广西高校毕业生就业创业工作突出单位；电子信息工程专业 2025 届毕业半年后平均月收入约 7018 元，大湾区部分毕业生达 2 万元。', 'honors.html'],
      [/专业?成绩|奖|竞赛|成果|排名/, '近三学年国家级奖项 428 项、自治区级 2010 项；2025 年校友会民办大学排名全国第 76 位。', 'honors.html'],
      [/照片|相册|图片|校园环境|风景/, '校园相册有 25 张实拍：风光建筑 6 张、学生活动 16 张、教职工活动 3 张，点开可看大图。', 'campus.html'],
      [/电话|联系|地址|邮箱|招生办|咨询/, '学校地址：桂林市临桂区岩图路 9 号；招生热线 0773-8100501、8100502、8100503；招生邮箱 zhaosheng@guit.edu.cn。', 'contact.html'],
      [/历史|建校|多少年|简介|学校怎么样|介绍/, '学校 2001 年创建，2021 年转设为独立设置的民办本科高校，占地 1331 亩，在校生 2.2 万余人，以电子信息为特色。', 'about.html'],
      [/你是谁|名字|小信|助手/, '我是小信，这个网站的 AI 校园向导，能讲学校情况、专业、路线，还能带你在页面里逛。']
    ];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i][0].test(s)) return { text: rules[i][1], go: rules[i][2] };
    }
    return { text: '这个问题我暂时没查到准确答案，建议去学校官网 www.guit.edu.cn 看看，或者问我学校情况、专业、路线、联系方式这些～', go: 'about.html' };
  }

  function send(text, shown) {
    text = (text || '').trim();
    if (!text || busy) return;
    var wasClosed = !panel.classList.contains('open');
    if (wasClosed) openPanel(true);

    busy = true;
    sendEl.disabled = true;
    tour = null;
    hideBubble();
    inputEl.value = '';
    autogrow();

    addMsg('me', shown || text);
    MSGS.push({ role: 'user', content: text });

    var bub = addMsg('bot', '');
    var raw = '', started = false;

    var msgs = [{ role: 'system', content: sysPrompt() }].concat(MSGS.slice(-10));

    askAI(msgs, function (all) {
      raw = all;
      if (!started) { started = true; bub.innerHTML = ''; }
      bub.innerHTML = md(all);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }, function (all) {
      raw = all || raw;
      var p = parseDirectives(raw);
      bub.innerHTML = md(p.text || '（这次没收到内容，再问我一次？）');
      renderActs(bub, p.acts);
      MSGS.push({ role: 'assistant', content: p.text || '' });
      if (MSGS.length > 12) MSGS = MSGS.slice(-12);
      busy = false; sendEl.disabled = false;
      if (SPEAK) speak(p.text);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }, function (err) {
      var f = localAnswer(text);
      bub.innerHTML = md('😵 我和大模型之间的信号断了（' + esc(String(err && err.message || err)).slice(0, 70) + '）。先把我记得的告诉你：\n' + f.text);
      bub.classList.add('xa-err');
      if (f.go) renderActs(bub, [{ type: 'go', href: f.go, label: '去看看 ' + GO_WHITELIST[f.go] }]);
      MSGS.push({ role: 'assistant', content: f.text });
      busy = false; sendEl.disabled = false;
      bodyEl.scrollTop = bodyEl.scrollHeight;
    });
  }

  /* ============================================================
     8. 语音朗读 / 语音输入
     ============================================================ */
  var VOICE = null;
  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    var vs = window.speechSynthesis.getVoices() || [];
    for (var i = 0; i < vs.length; i++) {
      if (/zh[-_]?CN|zh_Hans|Xiaoxiao|Yaoyao|Huihui|Kangkang|Chinese/i.test(vs[i].lang + ' ' + vs[i].name)) { VOICE = vs[i]; break; }
    }
  }
  function speak(t) {
    if (!('speechSynthesis' in window) || !t) return;
    try {
      window.speechSynthesis.cancel();
      var clean = String(t).replace(/[*_`#>]/g, '').replace(/https?:\/\/\S+/g, '').replace(/[🙌😵😊👋🎓📚📍🗺️🧭🤖✨]/g, '');
      var u = new SpeechSynthesisUtterance(clean);
      u.lang = 'zh-CN'; u.rate = 1.05; u.pitch = 1.06;
      if (!VOICE) loadVoices();
      if (VOICE) u.voice = VOICE;
      window.speechSynthesis.speak(u);
      flash('is-talk', Math.max(1200, clean.length * 190));
      u.onend = function () { doll.classList.remove('is-talk'); };
    } catch (e) {}
  }
  function toggleSpeak() {
    SPEAK = !SPEAK;
    store('xa-speak', SPEAK ? '1' : '0');
    speakEl.classList.toggle('on', SPEAK);
    speakEl.textContent = SPEAK ? '🔊' : '🔈';
    speakEl.setAttribute('aria-pressed', SPEAK ? 'true' : 'false');
    if (!SPEAK && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    else speak('好的，我会把回答念出来。');
  }

  var rec = null;
  function toggleMic() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { say('这个浏览器不支持语音输入，用 Chrome 或者 Edge 试试～', 4200); return; }
    if (rec) {
      try { rec.stop(); } catch (e) {}
      rec = null; micEl.classList.remove('rec');
      return;
    }
    try {
      rec = new SR();
      rec.lang = 'zh-CN'; rec.interimResults = false; rec.maxAlternatives = 1;
      rec.onresult = function (e) {
        var t = e.results[0][0].transcript;
        inputEl.value = t;
        micEl.classList.remove('rec');
        rec = null;
        send(t);
      };
      rec.onerror = function () {
        micEl.classList.remove('rec'); rec = null;
        say('没听清，再说一次或者直接打字吧～', 3200);
      };
      rec.onend = function () { micEl.classList.remove('rec'); rec = null; };
      rec.start();
      micEl.classList.add('rec');
      say('我在听，说慢一点～', 3000);
    } catch (e) {
      micEl.classList.remove('rec'); rec = null;
    }
  }

  /* ============================================================
     9. 面板开关 / 快捷问题
     ============================================================ */
  var CHIPS = [
    ['学校怎么样？', '用三句话介绍桂林信息科技学院，适合新生看'],
    ['有哪些专业？', '学校有哪些学院和专业？给我一个概览'],
    ['带我逛一圈', '__TOUR__'],
    ['宿舍条件如何？', '学校的宿舍和校园生活条件怎么样'],
    ['怎么去学校？', '从地址、交通和校园路线讲讲怎么到学校']
  ];

  function buildChips() {
    chipsEl.innerHTML = '';
    CHIPS.forEach(function (c) {
      var b = el('button', 'xa-chip', esc(c[0]));
      b.addEventListener('click', function () {
        if (c[1] === '__TOUR__') {
          openPanel(false);
          startTour();
          return;
        }
        send(c[1], c[0]);
      });
      chipsEl.appendChild(b);
    });
  }

  function openPanel(open) {
    var isOpen = open === undefined ? !panel.classList.contains('open') : open;
    panel.classList.toggle('open', isOpen);
    launcher.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    root.classList.toggle('xa-talking', isOpen);
    if (isOpen) {
      hideBubble();
      flash('is-bow', 820);
      if (!bodyEl.childNodes.length) {
        var b = addMsg('bot', '你好，我是小信 👋 桂林信息科技学院的校园向导。想了解学校、专业、就业、路线，直接问我就好，也可以让我带你逛这个网站。');
        bodyEl.scrollTop = 0;
      }
      setTimeout(function () { try { inputEl.focus(); } catch (e) {} }, 260);
    }
  }

  /* ============================================================
     10. 启动
     ============================================================ */
  function autogrow() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(92, inputEl.scrollHeight) + 'px';
  }

  function bindPanel() {
    sendEl.addEventListener('click', function () { send(inputEl.value); });
    inputEl.addEventListener('input', autogrow);
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(inputEl.value); }
    });
    micEl.addEventListener('click', toggleMic);
    speakEl.addEventListener('click', toggleSpeak);
    launcher.addEventListener('click', function () { openPanel(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') openPanel(false);
    });
  }

  var idleCount = 0, idleTimer = null;
  function startIdle() {
    clearInterval(idleTimer);
    idleTimer = setInterval(function () {
      if (idleCount >= 3 || document.hidden || panel.classList.contains('open')) return;
      if (bubble.classList.contains('show')) return;
      idleCount++;
      say(pick(IDLE), 4600);
    }, 38000);
  }

  function greet() {
    var seen = false;
    try { seen = sessionStorage.getItem('xa-greet') === '1'; sessionStorage.setItem('xa-greet', '1'); } catch (e) {}
    if (seen) return;
    setTimeout(function () {
      say('嗨，我是小信 👋 点我旁边那个圆钮就能问我问题，也可以拉我一把（我不会生气的）。', 7000);
      doll.classList.add('is-hop');
      setTimeout(function () { doll.classList.remove('is-hop'); }, 700);
    }, 1200);
  }

  function init() {
    build();
    buildSecs();
    buildChips();
    bindDoll();
    bindPanel();
    if (SPEAK) { speakEl.classList.add('on'); speakEl.textContent = '🔊'; }
    else { speakEl.textContent = '🔈'; }
    if ('speechSynthesis' in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    window.addEventListener('resize', function () { torch.classList.remove('on'); });
    setTimeout(function () { root.classList.add('xa-in'); }, 120);
    scheduleBlink();
    scheduleActs();
    bindLook();

    /* 片头短片期间先藏起来 */
    var intro = document.getElementById('intro');
    if (intro) {
      root.classList.add('xa-hidden');
      var t = setInterval(function () {
        if (!document.getElementById('intro')) {
          clearInterval(t);
          root.classList.remove('xa-hidden');
          buildSecs();
          greet();
        }
      }, 400);
    } else {
      greet();
    }
    startIdle();
  }

  /* ============================================================
     11. 对外接口：页面里其它模块调用（办事指引 / 报修看板）
     ============================================================ */
  /* 打开助手并直接把问题发出去 */
  window.xaAsk = function (q) {
    if (!q) return;
    openPanel(true);
    setTimeout(function () { send(q); }, 320);
  };

  /* 图片识别：传入 dataURL + 提示词，返回模型输出的 Promise<string> */
  window.xaVision = function (dataUrl, prompt) {
    return fetch(CFG.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CFG.apiKey },
      body: JSON.stringify({
        model: CFG.model,
        temperature: 0.2,
        max_tokens: 1800,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl } }
          ]
        }]
      })
    }).then(function (r) {
      return r.text().then(function (raw) {
        if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + String(raw).slice(0, 100));
        var j;
        try { j = JSON.parse(raw); } catch (e) { throw new Error('返回不是 JSON'); }
        var c = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        if (!c) throw new Error('空回复');
        return c;
      });
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
