/* ==========================================================
   admin.js : 사이트 안 관리자 편집기
   ----------------------------------------------------------
   - 주소 뒤에 #admin 을 붙여 열어요.   예) https://내사이트/#admin
   - 구글 로그인 → data.js 의 admin.email 과 같은 계정만 편집할 수 있어요.
   - 저장하면 Firestore(site/config)에 올라가고, 이미지는 Storage 에 올라가요.
   - 방명록(비밀글 읽기 / 답글 / 삭제)도 여기서 관리해요.
   ※ 진짜 권한 확인은 Firebase 보안 규칙이 해요. (firestore.rules, storage.rules)
   ========================================================== */
(function () {
  'use strict';

  var VER = (window.SITE && window.SITE.firebaseSdk) || '13.0.0';
  var BASE = 'https://www.gstatic.com/firebasejs/' + VER + '/';
  var SKIP = { firebase: 1, admin: 1, firebaseSdk: 1 };      /* 편집기에서 건드리지 않는 항목 */
  var ORDER = ['title', 'home', 'logo', 'illust', 'menu', 'works', 'oc', 'pair', 'owner', 'guest',
               'music', 'calendar', 'colors', 'bgImage', 'mobileWidth'];
  var TAB_NAME = {
    title: '탭 제목', home: '메인 소개', logo: '로고', illust: '메인 일러스트', menu: '메뉴',
    works: 'Works', oc: 'Oc', pair: 'Pair', owner: 'Owner', guest: 'Guest 안내',
    music: '음악', calendar: '캘린더', colors: '색상', bgImage: '바탕 이미지', mobileWidth: '모바일 기준'
  };
  var LABEL = {
    title: '제목', subtitle: '부제목', intro: '안내 글', text: '글', name: '이름', en: '영문 이름',
    desc: '설명', tag: '태그 글자', image: '이미지', thumb: '작은 이미지', cover: '커버 이미지',
    file: '파일', url: '주소', link: '링크', date: '날짜', status: '배지', tags: '꼬리표',
    items: '목록', categories: '분류', links: '링크 버튼', list: '목록', tabs: '탭', sections: '내용 덩어리',
    rows: '표', images: '이미지 목록', caption: '이미지 설명', columns: '한 줄에 몇 장', members: '멤버',
    portraits: '클로즈업', standing: '스탠딩', standings: '스탠딩 목록', standingSize: '스탠딩 크기',
    relation: '관계', color: '대표색', theme: '세부 색', about: '짧은 소개', hello: '인사말',
    tagline: '한 줄 소개', facts: '정보 표', icon: '아이콘', sort: '정렬', subTitle: '부제목',
    boardTitle: '방명록 제목', ownerName: '답글 이름', mode: '방식', profile: '프로필', banner: '배너',
    groups: '묶음', enable: '사용', autoplay: '자동 재생', volume: '볼륨', events: '기념일',
    counters: '함께한 날', artist: '아티스트', faction: '진영', badge: '배지 이미지', stats: '능력치',
    id: '아이디(영문)', size: '크기', frame: '액자', shadow: '그림자', position: '위치', point: '지정색'
  };
  var LONG_KEYS = { text: 1, desc: 1, intro: 1, about: 1, raw: 1, message: 1, tagline: 1 };
  var IMAGE_KEYS = { image: 1, thumb: 1, cover: 1, file: 1, standing: 1, portraits: 1, images: 1 };

  var S = window.SITE || {};
  var st = { user: null, fb: null, draft: null, dirty: false, tab: null, root: null, view: 'site', busy: false,
             preview: window.innerWidth >= 1000, pvMobile: false, pvFrame: null, pvBody: null, pvRoute: '', pvTimer: null };
  /* 편집 탭 → 미리보기에서 보여줄 화면 */
  var TAB_ROUTE = { home: '', logo: '', illust: '', menu: '', title: '', works: 'works', oc: 'oc', pair: 'pair',
                    owner: 'owner', guest: 'guest', __gb: 'guest' };

  function $(sel, el) { return (el || document).querySelector(sel); }
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') e[k] = attrs[k];
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function blank(v) {
    if (Array.isArray(v)) return [];
    if (v && typeof v === 'object') { var o = {}; Object.keys(v).forEach(function (k) { o[k] = blank(v[k]); }); return o; }
    if (typeof v === 'number') return 0;
    if (typeof v === 'boolean') return false;
    return '';
  }
  function toast(msg, bad) {
    var t = $('#oha-toast'); if (!t) return;
    t.textContent = msg; t.className = 'oha-toast is-on' + (bad ? ' is-bad' : '');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.className = 'oha-toast'; }, 3200);
  }
  function touch() {
    st.dirty = true;
    var b = $('#oha-save'); if (b) b.disabled = false;
    var d = $('#oha-dirty'); if (d) d.hidden = false;
    schedulePreview();
  }

  /* ---------- 실시간 미리보기 ---------- */
  function schedulePreview() {
    if (!st.preview || !st.pvFrame) return;
    clearTimeout(st.pvTimer);
    st.pvTimer = setTimeout(function () {
      try { st.pvFrame.contentWindow.location.reload(); } catch (e) {}
    }, 600);
  }
  function setRoute(r) {
    st.pvRoute = r || '';
    var sel = $('#oha-route'); if (sel && sel.value !== st.pvRoute) sel.value = st.pvRoute;
    if (!st.pvFrame) return;
    try { st.pvFrame.contentWindow.location.hash = st.pvRoute ? '#' + st.pvRoute : '#'; } catch (e) {}
  }
  function layoutPreview() {
    if (!st.pvFrame || !st.pvBody) return;
    var w = st.pvMobile ? 390 : 1280;
    var pw = st.pvBody.clientWidth, ph = st.pvBody.clientHeight;
    if (!pw || !ph) return;                 /* 아직 화면에 안 나온 상태 → 크기가 잡히면 다시 계산 */
    var s = Math.min(pw / w, 1);
    st.pvFrame.style.width = w + 'px';
    st.pvFrame.style.height = (ph / s) + 'px';
    st.pvFrame.style.transform = 'scale(' + s + ')';
    st.pvFrame.style.marginLeft = Math.max(0, (pw - w * s) / 2) + 'px';
  }
  function previewPane() {
    var base = location.href.split('#')[0].split('?')[0];
    var pane = h('div', { class: 'oha-pv' });
    var routes = [['', '메인'], ['works', 'Works'], ['oc', 'Oc 목록'], ['pair', 'Pair 목록'], ['owner', 'Owner'], ['guest', 'Guest']];
    var oc = (st.draft.oc && st.draft.oc.list) || [], pr = (st.draft.pair && st.draft.pair.list) || [];
    oc.forEach(function (c) { if (c.id) routes.push(['oc/' + c.id, 'Oc · ' + (c.name || c.id)]); });
    pr.forEach(function (p) { if (p.id) routes.push(['pair/' + p.id, 'Pair · ' + (p.name || p.id)]); });
    var sel = h('select', { id: 'oha-route', class: 'oha-in', style: 'width:auto;flex:1;min-width:0' },
      routes.map(function (r) { return h('option', { value: r[0], text: r[1] }); }));
    sel.value = st.pvRoute;
    sel.onchange = function () { setRoute(sel.value); };
    var mob = h('button', { class: 'oha-btn', type: 'button', text: st.pvMobile ? 'PC 로 보기' : '모바일로 보기' });
    mob.onclick = function () { st.pvMobile = !st.pvMobile; mob.textContent = st.pvMobile ? 'PC 로 보기' : '모바일로 보기'; layoutPreview(); };
    var rf = h('button', { class: 'oha-btn', type: 'button', text: '새로고침' });
    rf.onclick = function () { try { st.pvFrame.contentWindow.location.reload(); } catch (e) {} };
    var bar = h('div', { class: 'oha-pvbar' }, [h('b', { text: '미리보기' }), sel, mob, rf]);
    var body = h('div', { class: 'oha-pvbody' });
    var fr = h('iframe', { title: '사이트 미리보기', src: base + '?preview=1' + (st.pvRoute ? '#' + st.pvRoute : '') });
    body.appendChild(fr);
    pane.appendChild(bar); pane.appendChild(body);
    st.pvFrame = fr; st.pvBody = body;
    setTimeout(layoutPreview, 0);
    if (window.ResizeObserver) new ResizeObserver(layoutPreview).observe(body);
    return pane;
  }

  /* ---------- Firebase 연결 (index.html 의 OHFB 공유) ---------- */
  function fb() {
    if (st.fb) return st.fb;
    var cfg = window.SITE_FB;
    if (!cfg || !cfg.apiKey) return Promise.reject(new Error('Firebase 설정이 없어요. data.js 의 firebase.config 를 채워 주세요.'));
    st.fb = Promise.all([
      import(BASE + 'firebase-app.js'), import(BASE + 'firebase-auth.js'),
      import(BASE + 'firebase-firestore.js'), import(BASE + 'firebase-storage.js')
    ]).then(function (m) {
      var app = m[0].getApps().length ? m[0].getApps()[0] : m[0].initializeApp(cfg);
      return { app: app, auth: m[1], fs: m[2], store: m[3],
               a: m[1].getAuth(app), db: m[2].getFirestore(app), sg: m[3].getStorage(app) };
    });
    return st.fb;
  }
  function adminEmail() { return ((S.admin || {}).email || '').trim().toLowerCase(); }
  function isAdmin() {
    return !!(st.user && adminEmail() && (st.user.email || '').toLowerCase() === adminEmail());
  }

  /* ---------- 스타일 ---------- */
  function injectCss() {
    if ($('#oha-css')) return;
    var point = ((S.colors || {}).point) || '#2b2b2b';
    var css =
      '#oha{position:fixed;inset:0;z-index:100000;background:#f6f6f6;color:#222;font:14px/1.5 Pretendard,system-ui,sans-serif;overflow:auto}' +
      '#oha *{box-sizing:border-box}#oha[hidden]{display:none}' +
      '.oha-top{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 18px;background:#fff;border-bottom:1px solid #ddd}' +
      '.oha-top h1{font-size:16px;margin:0 8px 0 0}.oha-sp{flex:1}' +
      '.oha-btn{border:1px solid #ccc;background:#fff;border-radius:999px;padding:7px 14px;font:600 13px inherit;cursor:pointer;color:#222}' +
      '.oha-btn:hover{border-color:' + point + '}.oha-btn[disabled]{opacity:.45;cursor:default}' +
      '.oha-btn.is-main{background:' + point + ';border-color:' + point + ';color:#fff}' +
      '.oha-btn.is-bad{color:#b3261e;border-color:#e3b3af}' +
      '.oha-main{display:grid;grid-template-columns:200px 1fr;gap:18px;max-width:1200px;margin:18px auto;padding:0 18px}' +
      '.oha-nav{display:flex;flex-direction:column;gap:6px;position:sticky;top:70px;align-self:start}' +
      '.oha-nav button{text-align:left;border:1px solid #ddd;background:#fff;border-radius:10px;padding:9px 12px;font:600 13px inherit;cursor:pointer}' +
      '.oha-nav button.is-on{background:' + point + ';border-color:' + point + ';color:#fff}' +
      '.oha-panel{background:#fff;border:1px solid #ddd;border-radius:14px;padding:18px}' +
      '.oha-panel h2{margin:0 0 12px;font-size:18px}' +
      '.oha-row{display:grid;grid-template-columns:130px 1fr;gap:10px;margin:8px 0;align-items:start}' +
      '.oha-lab{font-weight:700;font-size:12px;color:#555;padding-top:8px;word-break:keep-all}' +
      '.oha-in,.oha-ta{width:100%;border:1px solid #ccc;border-radius:8px;padding:8px 10px;font:inherit;background:#fff}' +
      '.oha-ta{min-height:76px;resize:vertical}' +
      '.oha-img{display:flex;gap:8px;align-items:center}.oha-img img{width:38px;height:38px;object-fit:cover;border-radius:6px;border:1px solid #ddd;background:#eee}' +
      '.oha-box{border:1px solid #e2e2e2;border-radius:10px;padding:10px 12px;margin:8px 0;background:#fcfcfc}' +
      '.oha-box>summary{cursor:pointer;font-weight:700;display:flex;gap:8px;align-items:center}' +
      '.oha-box>summary .oha-sp{flex:1}.oha-mini{border:1px solid #ccc;background:#fff;border-radius:6px;padding:2px 8px;font-size:12px;cursor:pointer}' +
      '.oha-add{margin-top:6px}.oha-note{color:#777;font-size:12px;margin:4px 0}' +
      '.oha-nav{max-height:calc(100vh - 90px);overflow:auto}' +
      '#oha.is-split{display:flex;flex-direction:column;overflow:hidden}' +
      '#oha.is-split .oha-top{position:relative;flex:none}' +
      '.oha-split{display:flex;flex:1 1 auto;min-height:0}.oha-ed{flex:1 1 46%;min-width:380px;min-height:0;overflow:auto}' +
      '.oha-split .oha-main{grid-template-columns:140px 1fr;max-width:none;margin:12px;padding:0}' +
      '.oha-split .oha-nav{top:12px;max-height:calc(100vh - 150px);overflow:auto}' +
      '.oha-pv{flex:1 1 54%;min-width:0;display:flex;flex-direction:column;border-right:1px solid #ccc;background:#e4e4e4}' +
      '.oha-pvbar{display:flex;gap:8px;align-items:center;padding:8px 10px;background:#fff;border-bottom:1px solid #ddd}' +
      '.oha-pvbody{flex:1;position:relative;overflow:hidden}' +
      '.oha-pvbody iframe{position:absolute;left:0;top:0;border:0;background:#fff;transform-origin:0 0;box-shadow:0 0 0 1px #ccc}' +
      '@media(max-width:999px){#oha.is-split{display:block;overflow:auto}#oha.is-split .oha-top{position:sticky}' +
      '.oha-split{flex-direction:column;height:auto}.oha-pv{height:60vh}.oha-ed{overflow:visible}.oha-split .oha-nav{max-height:none}}' +
      '.oha-menu{display:flex;flex-direction:column;gap:4px;margin-top:6px;padding:8px;border:1px solid #ddd;border-radius:10px;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.08)}' +
      '.oha-menu[hidden]{display:none}.oha-menu-item{text-align:left;border:1px solid #e5e5e5;background:#fafafa;border-radius:8px;padding:8px 10px;cursor:pointer;font:inherit;display:flex;flex-direction:column;gap:2px}' +
      '.oha-menu-item:hover{border-color:' + point + ';background:#fff}.oha-menu-item small{color:#777}' +
      '.oha-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);background:#222;color:#fff;padding:10px 16px;border-radius:10px;opacity:0;pointer-events:none;transition:.25s;z-index:100001;max-width:90vw}' +
      '.oha-toast.is-on{opacity:1;transform:translateX(-50%)}.oha-toast.is-bad{background:#b3261e}' +
      '.oha-login{max-width:420px;margin:12vh auto;background:#fff;border:1px solid #ddd;border-radius:16px;padding:28px;text-align:center}' +
      '.oha-login p{color:#555}' +
      '.oha-gb{border:1px solid #e2e2e2;border-radius:10px;padding:10px 12px;margin:8px 0;background:#fff}' +
      '.oha-gb.is-secret{background:#fff7f5;border-color:#efc9c3}.oha-gb small{color:#777}' +
      '.oha-tag{display:inline-block;background:#b3261e;color:#fff;border-radius:999px;padding:1px 8px;font-size:11px;margin-left:6px}' +
      '@media(max-width:760px){.oha-main{grid-template-columns:1fr}.oha-nav{position:static;flex-direction:row;flex-wrap:wrap}.oha-row{grid-template-columns:1fr}}';
    document.head.appendChild(h('style', { id: 'oha-css', text: css }));
  }

  /* ---------- 이미지 올리기 ---------- */
  function upload(file) {
    if (file.size > 10 * 1024 * 1024) return Promise.reject(new Error('파일이 10MB 보다 커요.'));
    return fb().then(function (c) {
      var name = Date.now() + '-' + file.name.replace(/[^\w.\-]/g, '_');
      var r = c.store.ref(c.sg, 'uploads/' + name);
      return c.store.uploadBytes(r, file, { contentType: file.type }).then(function () {
        return c.store.getDownloadURL(r);
      });
    });
  }

  /* ---------- 값 편집기 (재귀) ---------- */
  function title(item, i) {
    if (item && typeof item === 'object') {
      var k = ['name', 'title', 'label', 'id', 'en', 'date'].filter(function (x) { return item[x] && typeof item[x] === 'string'; })[0];
      if (k) return (i + 1) + '. ' + item[k];
    }
    return (i + 1) + '번';
  }

  function stringEd(val, set, key, pkey) {
    var wrap = h('div');
    var isImg = !!(IMAGE_KEYS[key] || IMAGE_KEYS[pkey]);
    var long = LONG_KEYS[key] || String(val).indexOf('\n') >= 0;
    var inp = long ? h('textarea', { class: 'oha-ta' }) : h('input', { class: 'oha-in', type: 'text' });
    inp.value = val;
    inp.oninput = function () { set(inp.value); touch(); if (prev) prev.src = inp.value; };
    var prev = null;
    if (isImg) {
      prev = h('img', { alt: '' }); prev.src = val || '';
      prev.onerror = function () { prev.style.visibility = 'hidden'; };
      prev.onload = function () { prev.style.visibility = 'visible'; };
      var file = h('input', { type: 'file', accept: 'image/*,audio/*', hidden: 'hidden' });
      var up = h('button', { class: 'oha-btn', type: 'button', text: '올리기' });
      up.onclick = function () { file.click(); };
      file.onchange = function () {
        var f = file.files[0]; if (!f) return;
        up.textContent = '올리는 중…'; up.disabled = true;
        upload(f).then(function (url) {
          inp.value = url; set(url); touch(); prev.src = url; toast('올렸어요. 저장을 눌러 주세요.');
        }).catch(function (e) { toast('올리지 못했어요: ' + (e.message || e), true); })
          .then(function () { up.textContent = '올리기'; up.disabled = false; file.value = ''; });
      };
      var row = h('div', { class: 'oha-img' }, [prev, inp, up, file]);
      wrap.appendChild(row);
    } else wrap.appendChild(inp);
    return wrap;
  }

  function valueEd(val, set, key, pkey) {
    if (Array.isArray(val)) return arrayEd(val, key, pkey);
    if (val && typeof val === 'object') return objectEd(val, key);
    if (typeof val === 'boolean') {
      var c = h('input', { type: 'checkbox' }); c.checked = val;
      c.onchange = function () { set(c.checked); touch(); };
      return h('label', null, [c, ' 사용']);
    }
    if (typeof val === 'number') {
      var n = h('input', { class: 'oha-in', type: 'number', step: 'any' }); n.value = val;
      n.oninput = function () { set(n.value === '' ? 0 : Number(n.value)); touch(); };
      return n;
    }
    return stringEd(val == null ? '' : String(val), set, key, pkey);
  }

  /* ==========================================================
     기능 추가 메뉴 : 지금은 없앤 기능(AU / 성장 버전, 타임라인, TRPG 로그 …)을
     필요할 때 다시 꺼내 쓸 수 있게, "+ 추가" 에서 고르는 틀(템플릿) 모음이에요.
     ========================================================== */
  function secBlock(title, en, extra) {
    var o = { title: title, en: en }; Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; }); return o;
  }
  var LOG_TPL = {
    title: '시나리오 이름', date: '', system: 'CoC 7th', gm: '', players: '', desc: '', link: '', embed: '',
    speakers: { '캐릭터 이름': { image: '' }, 'GM': { image: '' } },
    raw: '# 1장. 시작\n캐릭터 이름: 대사가 들어갑니다.\n> 듣기 판정 (1D100<=50) → 32 성공\nGM: 안쪽에서 발소리가 들립니다.'
  };
  var T_PROFILE = { name: '프로필', sections: [
    secBlock('기본 정보', 'INFORMATION', { rows: [['나이', ''], ['키', ''], ['생일', ''], ['좋아하는 것', ''], ['싫어하는 것', '']] }),
    secBlock('성격', 'CHARACTER', { text: '' }), secBlock('배경', 'BACKGROUND', { text: '' })] };
  var T_GALLERY = { name: '갤러리', sections: [{ title: '', en: '', columns: 3, images: [{ image: '', caption: '' }] }] };
  var T_TIMELINE = { name: '타임라인', timelines: [{ name: '본편', desc: '', events: [
    { date: '', title: '첫 만남', text: '', size: 3 }, { date: '', title: '사건 이름', text: '', size: 2 }] }] };
  var T_LOG = { name: '로그', logs: [LOG_TPL] };

  function templatesFor(key, pkey) {
    var area = st.tab;   /* oc / pair / owner */
    if (key === 'standing') return [
      { name: '의상 / 표정 버전', desc: '이미지만 바꿔서 왼쪽 버튼으로 전환', value: { label: '의상', image: '', thumb: '' } },
      { name: 'AU 버전', desc: '다른 색 · 소개 · 탭까지 따로 적는 버전', value: {
        label: 'AU', image: '', thumb: '', color: '', tag: 'AU', subtitle: '', desc: '',
        badge: { image: '', title: 'AU 진영', sub: '', size: 160 },
        tabs: [{ name: 'AU 설정', sections: [secBlock('세계관', 'WORLD', { text: '' }), secBlock('성격', 'CHARACTER', { text: '' })] }] } },
      { name: '성장 버전', desc: '능력치와 본문 일부를 바꾼 버전', value: {
        label: '성장', image: '', thumb: '', tag: '성장 후', subtitle: '',
        stats: [{ name: '근력', value: 50 }, { name: '민첩', value: 50 }, { name: '지능', value: 50 }, { name: '매력', value: 50 }, { name: '운', value: 50 }],
        tabs: [clone(T_PROFILE)] } }
    ];
    if (key === 'standings') return [
      { name: '기본 스탠딩', desc: '', value: { label: '기본', image: '' } },
      { name: 'AU', desc: '뒤 필기체 글자와 색도 바꾸는 버전', value: { label: 'AU', image: '', script: 'AU Name', color: '' } },
      { name: '성장', desc: '크기를 다르게', value: { label: '성장', image: '', size: 900 } },
      { name: '표정 차분', desc: '', value: { label: '표정 차분', image: '' } }
    ];
    if (key === 'tabs') {
      var base = [
        { name: '프로필 탭', desc: '기본 정보 표 + 성격 + 배경', value: clone(T_PROFILE) },
        { name: '관계 탭 (자동)', desc: '페어 / 같은 진영을 자동으로 보여줘요', value: { name: '관계', auto: true, sections: [] } },
        { name: '비밀설정 탭', desc: '', value: { name: '비밀설정', sections: [secBlock('비밀설정', 'SECRET', { text: '' })] } },
        { name: '갤러리 탭', desc: '이미지 · 커미션 백업', value: clone(T_GALLERY) }
      ];
      if (area === 'pair') base.push(
        { name: '타임라인 탭', desc: '가로 타임라인 (본편 / AU 여러 개 가능)', value: clone(T_TIMELINE) },
        { name: 'TRPG 로그 탭', desc: '세션별 로그 백업 (말풍선)', value: clone(T_LOG) });
      return base;
    }
    if (key === 'timelines') return [
      { name: '본편 타임라인', desc: '', value: { name: '본편', desc: '', events: [{ date: '', title: '', text: '', size: 2 }] } },
      { name: 'AU 타임라인', desc: '', value: { name: 'AU', desc: '', events: [{ date: '', title: '', text: '', size: 2 }] } }
    ];
    if (key === 'logs') return [{ name: 'TRPG 로그 한 세션', desc: '말풍선 / 장면 / 판정을 붙여 넣는 형식', value: clone(LOG_TPL) }];
    if (key === 'stats') return [{ name: '능력치 막대', desc: '0 ~ 100', value: { name: '', value: 50 } }];
    if (key === 'members') {
      var ocs = (st.draft.oc && st.draft.oc.list) || [];
      var out = ocs.map(function (c) { return { name: '내 OC : ' + (c.name || c.id), desc: 'id = ' + c.id + ' (OC 와 자동 연동)', value: c.id }; });
      out.push({ name: '상대 오너 캐릭터', desc: '내 OC 목록에 없는 캐릭터', value: { name: '', en: '', thumb: '', link: '' } });
      return out;
    }
    if (key === 'list' && area === 'oc') return [{ name: '새 캐릭터', desc: '프로필 · 관계 · 갤러리 탭 포함', value: {
      id: '', name: '', en: '', tag: '', subtitle: '', desc: '', thumb: '', standingSize: 920, color: '',
      standing: [{ label: '기본', image: '', thumb: '' }], stats: [], faction: '',
      badge: { image: '', title: '', sub: '', size: 160 },
      tabs: [clone(T_PROFILE), { name: '관계', auto: true, sections: [] }, clone(T_GALLERY)] } }];
    if (key === 'list' && area === 'pair') return [{ name: '새 페어', desc: '멤버는 OC id 로 연결', value: {
      id: '', name: '', en: '', thumb: '', relation: '', color: '', members: [], portraits: [],
      standings: [{ label: '기본', image: '' }], script: '', desc: '',
      stamp: { title: '', text: '' }, date: { big: '', sub: '', small: '' }, tabs: [clone(T_GALLERY)] } }];
    return [];
  }

  /* 칸이 없는 항목을 나중에 다시 꺼내 쓰는 "+ 항목 추가" 목록 */
  var STAND_BADGE = { image: '', title: '', sub: '', size: 160 };
  var OPTIONAL = {
    standing: { tag: '', name: '', en: '', subtitle: '', desc: '', stats: [], badge: STAND_BADGE, tabs: [], color: '', theme: { background: '' }, standingSize: 920 },
    standings: { portraits: [], script: '', color: '', theme: { background: '' }, size: 860 },
    tabs: { auto: true, sections: [], timelines: [], logs: [] },
    logs: { embed: '', link: '', desc: '', speakers: { '캐릭터 이름': { image: '' } }, raw: '' },
    ocitem: { color: '', theme: { background: '' }, faction: '', badge: STAND_BADGE, stats: [], standingSize: 920, thumb: '' }
  };
  Object.assign(LABEL, { auto: '관계 자동 목록', timelines: '타임라인', logs: 'TRPG 로그', system: '룰', gm: 'GM',
    players: '참가자', embed: '로그 파일(html)', raw: '로그 글', speakers: '말하는 사람', side: '말풍선 위치',
    script: '뒤 필기체 글자', stamp: '도장', label: '버튼 이름', scriptFont: '필기체' });

  function objectEd(obj, key) {
    var box = h('div');
    var optKey = (key === 'list' && st.tab === 'oc') ? 'ocitem' : key;
    function draw() {
      box.innerHTML = '';
      Object.keys(obj).forEach(function (k) {
        var v = obj[k];
        if (k === 'speakers' && v && typeof v === 'object' && !Array.isArray(v)) {
          var sd = h('details', { class: 'oha-box' }, [h('summary', { text: LABEL[k] }), speakersEd(v)]);
          box.appendChild(sd); return;
        }
        var complex = v && typeof v === 'object';
        var ed = valueEd(v, function (nv) { obj[k] = nv; }, k, key);
        if (complex) {
          var d = h('details', { class: 'oha-box' }, [h('summary', { text: LABEL[k] || k }), ed]);
          if (!Array.isArray(v)) d.open = false;
          box.appendChild(d);
        } else {
          box.appendChild(h('div', { class: 'oha-row' }, [h('div', { class: 'oha-lab', text: LABEL[k] || k }), ed]));
        }
      });
      var opt = OPTIONAL[optKey];
      if (opt) {
        var missing = Object.keys(opt).filter(function (k) { return !(k in obj); });
        if (missing.length) {
          var sel = h('select', { class: 'oha-in', style: 'width:auto;display:inline-block' },
            [h('option', { value: '', text: '+ 항목 추가…' })].concat(missing.map(function (k) {
              return h('option', { value: k, text: LABEL[k] || k });
            })));
          sel.onchange = function () {
            if (!sel.value) return;
            obj[sel.value] = clone(opt[sel.value]); touch(); draw();
          };
          box.appendChild(h('div', { class: 'oha-add' }, [sel]));
        }
      }
    }
    draw();
    return box;
  }

  /* 말하는 사람 : 이름(칸 이름)을 직접 고칠 수 있어야 해서 따로 */
  function speakersEd(obj) {
    var box = h('div');
    function draw() {
      box.innerHTML = '';
      Object.keys(obj).forEach(function (name) {
        var v = obj[name] || (obj[name] = { image: '' });
        var nm = h('input', { class: 'oha-in', type: 'text', placeholder: '이름 (로그 글의 이름과 똑같이)' }); nm.value = name;
        nm.onchange = function () {
          var nn = nm.value.trim(); if (!nn || nn === name || obj[nn]) { nm.value = name; return; }
          var next = {}; Object.keys(obj).forEach(function (k) { next[k === name ? nn : k] = obj[k]; });
          Object.keys(obj).forEach(function (k) { delete obj[k]; }); Object.assign(obj, next); touch(); draw();
        };
        var rm = h('button', { class: 'oha-mini', type: 'button', text: '✕' });
        rm.onclick = function () { delete obj[name]; touch(); draw(); };
        var side = h('select', { class: 'oha-in', style: 'width:auto' }, [
          h('option', { value: '', text: '왼쪽' }), h('option', { value: 'right', text: '오른쪽' })]);
        side.value = v.side || '';
        side.onchange = function () { if (side.value) v.side = side.value; else delete v.side; touch(); };
        box.appendChild(h('div', { class: 'oha-box' }, [
          h('div', { class: 'oha-img' }, [nm, side, rm]),
          h('div', { class: 'oha-row' }, [h('div', { class: 'oha-lab', text: '프사 이미지' }), valueEd(v.image || '', function (nv) { v.image = nv; }, 'image', 'speakers')])
        ]));
      });
      var add = h('button', { class: 'oha-btn oha-add', type: 'button', text: '+ 말하는 사람 추가' });
      add.onclick = function () {
        var n = '새 인물', i = 1; while (obj[n]) n = '새 인물 ' + (++i);
        obj[n] = { image: '' }; touch(); draw();
      };
      box.appendChild(add);
    }
    draw();
    return box;
  }

  function arrayEd(arr, key, pkey) {
    var box = h('div');
    function draw() {
      box.innerHTML = '';
      var simple = arr.every(function (x) { return typeof x !== 'object'; });
      arr.forEach(function (item, i) {
        var ctl = function () {
          var up = h('button', { class: 'oha-mini', type: 'button', text: '↑' });
          var dn = h('button', { class: 'oha-mini', type: 'button', text: '↓' });
          var rm = h('button', { class: 'oha-mini', type: 'button', text: '✕' });
          up.onclick = function (e) { e.preventDefault(); if (i > 0) { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); touch(); draw(); } };
          dn.onclick = function (e) { e.preventDefault(); if (i < arr.length - 1) { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); touch(); draw(); } };
          rm.onclick = function (e) { e.preventDefault(); if (confirm('이 항목을 지울까요?')) { arr.splice(i, 1); touch(); draw(); } };
          return [up, dn, rm];
        };
        if (simple) {                                   /* 문자열 / 숫자 목록 : 한 줄 */
          var ed = valueEd(item, function (nv) { arr[i] = nv; }, key, key);
          var line = h('div', { class: 'oha-img' }, [h('div', { style: 'flex:1' }, [ed])].concat(ctl()));
          box.appendChild(line);
        } else if (Array.isArray(item) && item.every(function (x) { return typeof x !== 'object'; })) {   /* 표 한 줄 [항목, 내용] */
          var cells = item.map(function (c, j) {
            return h('div', { style: 'flex:1' }, [valueEd(c, function (nv) { item[j] = nv; }, key, key)]);
          });
          box.appendChild(h('div', { class: 'oha-img' }, cells.concat(ctl())));
        } else {                                        /* 객체 목록 : 카드 */
          var sum = h('summary', null, [h('span', { text: title(item, i) }), h('span', { class: 'oha-sp' })].concat(ctl()));
          var d = h('details', { class: 'oha-box' }, [sum, valueEd(item, function (nv) { arr[i] = nv; }, key, key)]);
          box.appendChild(d);
        }
      });
      var tpls = templatesFor(key, pkey);
      var add = h('button', { class: 'oha-btn oha-add', type: 'button', text: tpls.length ? '+ 추가 ▾' : '+ 추가' });
      var menu = h('div', { class: 'oha-menu' }); menu.hidden = true;
      function push(v) { arr.push(v); touch(); menu.hidden = true; draw(); }
      add.onclick = function () {
        if (!tpls.length) { push(arr.length ? blank(arr[arr.length - 1]) : ''); return; }
        if (!menu.hidden) { menu.hidden = true; return; }
        menu.innerHTML = '';
        tpls.forEach(function (t) {
          var b = h('button', { class: 'oha-menu-item', type: 'button' }, [h('b', { text: t.name }), t.desc ? h('small', { text: t.desc }) : null]);
          b.onclick = function () { push(clone(t.value)); };
          menu.appendChild(b);
        });
        if (arr.length && typeof arr[arr.length - 1] === 'object') {
          var bl = h('button', { class: 'oha-menu-item', type: 'button' }, [h('b', { text: '마지막 항목과 같은 빈 칸' })]);
          bl.onclick = function () { push(blank(arr[arr.length - 1])); };
          menu.appendChild(bl);
        }
        menu.hidden = false;
      };
      box.appendChild(add);
      box.appendChild(menu);
    }
    draw();
    return box;
  }

  /* ---------- 화면 ---------- */
  function tabs() {
    var keys = Object.keys(st.draft).filter(function (k) { return !SKIP[k]; });
    keys.sort(function (a, b) {
      var ia = ORDER.indexOf(a), ib = ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    return keys;
  }

  function renderEditor(body) {
    var nav = h('div', { class: 'oha-nav' });
    var panel = h('div', { class: 'oha-panel' });
    var keys = tabs();
    if (!st.tab || keys.indexOf(st.tab) < 0) st.tab = keys[0];
    function show() {
      [].forEach.call(nav.children, function (b) { b.classList.toggle('is-on', b.dataset.k === st.tab); });
      panel.innerHTML = '';
      if (st.tab === '__gb') return renderGuestbook(panel);
      panel.appendChild(h('h2', { text: TAB_NAME[st.tab] || st.tab }));
      var v = st.draft[st.tab];
      var ed = valueEd(v, function (nv) { st.draft[st.tab] = nv; }, st.tab, '');
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        /* 최상위 객체는 펼쳐서 보여주기 */
        ed.querySelectorAll(':scope > details.oha-box').forEach(function (d, i) { if (i < 1) d.open = true; });
      }
      panel.appendChild(ed);
    }
    keys.concat(['__gb']).forEach(function (k) {
      var b = h('button', { type: 'button', text: k === '__gb' ? '방명록 관리' : (TAB_NAME[k] || k) });
      b.dataset.k = k; b.onclick = function () {
        st.tab = k; show();
        if (st.preview) setRoute(TAB_ROUTE[k] || '');
      };
      nav.appendChild(b);
    });
    body.appendChild(h('div', { class: 'oha-main' }, [nav, panel]));
    show();
  }

  /* ---------- 방명록 관리 ---------- */
  function renderGuestbook(panel) {
    panel.appendChild(h('h2', { text: '방명록 관리' }));
    panel.appendChild(h('p', { class: 'oha-note', text: '비밀글을 포함해 모든 글이 보여요. 답글을 쓰고 저장하면 방문자 화면에 표시돼요.' }));
    var list = h('div', null, [h('p', { text: '불러오는 중…' })]);
    panel.appendChild(list);
    var col = (S.guest && S.guest.firebase && S.guest.firebase.collection) || 'guests';
    fb().then(function (c) {
      var q = c.fs.query(c.fs.collection(c.db, col), c.fs.orderBy('createdAt', 'desc'), c.fs.limit(200));
      return c.fs.getDocs(q).then(function (snap) {
        list.innerHTML = '';
        if (snap.empty) { list.appendChild(h('p', { text: '아직 글이 없어요.' })); return; }
        snap.forEach(function (d) {
          var v = d.data();
          var when = v.createdAt && v.createdAt.toDate ? v.createdAt.toDate().toLocaleString('ko-KR') : '';
          var card = h('div', { class: 'oha-gb' + (v.secret ? ' is-secret' : '') });
          card.appendChild(h('div', null, [h('b', { text: v.name || '익명' }),
            v.secret ? h('span', { class: 'oha-tag', text: '비밀글' }) : null,
            h('small', { text: '  ' + when })]));
          card.appendChild(h('p', { text: v.message || '', style: 'white-space:pre-wrap;margin:6px 0' }));
          var rp = h('textarea', { class: 'oha-ta', placeholder: '답글 (비우고 저장하면 답글이 지워져요)' });
          rp.value = v.reply || '';
          var sv = h('button', { class: 'oha-btn', type: 'button', text: '답글 저장' });
          var rm = h('button', { class: 'oha-btn is-bad', type: 'button', text: '글 삭제' });
          sv.onclick = function () {
            c.fs.updateDoc(c.fs.doc(c.db, col, d.id), { reply: rp.value.trim() })
              .then(function () { toast('답글을 저장했어요.'); })
              .catch(function (e) { toast('저장하지 못했어요: ' + e.message, true); });
          };
          rm.onclick = function () {
            if (!confirm('이 글을 지울까요? 되돌릴 수 없어요.')) return;
            c.fs.deleteDoc(c.fs.doc(c.db, col, d.id)).then(function () { card.remove(); toast('지웠어요.'); })
              .catch(function (e) { toast('지우지 못했어요: ' + e.message, true); });
          };
          card.appendChild(rp);
          card.appendChild(h('div', { style: 'display:flex;gap:8px;margin-top:8px' }, [sv, rm]));
          list.appendChild(card);
        });
      });
    }).catch(function (e) {
      list.innerHTML = '';
      list.appendChild(h('p', { text: '불러오지 못했어요: ' + (e.message || e) }));
    });
  }

  /* ---------- 저장 / 되돌리기 ---------- */
  function save() {
    if (!isAdmin()) return toast('관리자만 저장할 수 있어요.', true);
    var btn = $('#oha-save'); btn.disabled = true; btn.textContent = '저장 중…';
    var data = clone(st.draft); Object.keys(SKIP).forEach(function (k) { delete data[k]; });
    var json = JSON.stringify(data);
    fb().then(function (c) {
      var rev = Date.now();
      return c.fs.setDoc(c.fs.doc(c.db, 'site', 'config'), { json: json, rev: rev, by: st.user.email }).then(function () {
        try { localStorage.setItem('site-override-v1', JSON.stringify({ rev: rev, data: data })); } catch (e) {}
        st.dirty = false; $('#oha-dirty').hidden = true;
        toast('저장했어요! 사이트를 새로고침하면 반영돼요.');
      });
    }).catch(function (e) { btn.disabled = false; toast('저장하지 못했어요: ' + (e.message || e), true); })
      .then(function () { btn.textContent = '저장'; });
  }

  function reset() {
    if (!isAdmin()) return;
    if (!confirm('저장된 설정을 지우고 data.js 의 기본값으로 되돌릴까요?')) return;
    fb().then(function (c) { return c.fs.deleteDoc(c.fs.doc(c.db, 'site', 'config')); })
      .then(function () {
        try { localStorage.removeItem('site-override-v1'); } catch (e) {}
        toast('기본값으로 되돌렸어요. 새로고침해 주세요.');
      }).catch(function (e) { toast('되돌리지 못했어요: ' + (e.message || e), true); });
  }

  /* ---------- 로그인 화면 / 전체 ---------- */
  function draw() {
    var root = st.root; root.innerHTML = '';
    var top = h('div', { class: 'oha-top' });
    top.appendChild(h('h1', { text: '사이트 편집기' }));
    var close = h('button', { class: 'oha-btn', type: 'button', text: '← 사이트로' });
    close.onclick = function () {
      if (st.dirty && !confirm('저장하지 않은 변경이 있어요. 나갈까요?')) return;
      location.hash = '#';
    };
    top.appendChild(close);
    top.appendChild(h('span', { class: 'oha-sp' }));
    if (st.user) {
      top.appendChild(h('span', { class: 'oha-note', text: st.user.email + (isAdmin() ? '' : ' (관리자가 아니에요)') }));
      var lo = h('button', { class: 'oha-btn', type: 'button', text: '로그아웃' });
      lo.onclick = function () { fb().then(function (c) { return c.auth.signOut(c.a); }); };
      top.appendChild(lo);
    }
    if (isAdmin()) {
      top.appendChild(h('span', { id: 'oha-dirty', class: 'oha-note', text: '● 저장 안 됨', hidden: 'hidden' }));
      var rs = h('button', { class: 'oha-btn is-bad', type: 'button', text: '기본값으로' }); rs.onclick = reset;
      var sv = h('button', { id: 'oha-save', class: 'oha-btn is-main', type: 'button', text: '저장', disabled: 'disabled' }); sv.onclick = save;
      var pv = h('button', { class: 'oha-btn', type: 'button', text: st.preview ? '미리보기 끄기' : '미리보기 켜기' });
      pv.onclick = function () { st.preview = !st.preview; draw(); };
      top.appendChild(pv); top.appendChild(rs); top.appendChild(sv);
    }
    root.appendChild(top);

    if (!adminEmail()) {
      root.appendChild(h('div', { class: 'oha-login' }, [h('h2', { text: '관리자 이메일이 비어 있어요' }),
        h('p', { text: 'data.js 의 admin.email 에 내 구글 계정 이메일을 적고 다시 올려 주세요.' })]));
    } else if (!st.user) {
      var go = h('button', { class: 'oha-btn is-main', type: 'button', text: 'Google 로 로그인' });
      go.onclick = function () {
        fb().then(function (c) { return c.auth.signInWithPopup(c.a, new c.auth.GoogleAuthProvider()); })
          .catch(function (e) { toast('로그인하지 못했어요: ' + (e.message || e), true); });
      };
      root.appendChild(h('div', { class: 'oha-login' }, [h('h2', { text: '관리자 로그인' }),
        h('p', { text: '관리자 계정으로 로그인하면 사이트를 편집할 수 있어요.' }), go]));
    } else if (!isAdmin()) {
      root.appendChild(h('div', { class: 'oha-login' }, [h('h2', { text: '권한이 없어요' }),
        h('p', { text: '이 계정은 관리자가 아니에요. 로그아웃하고 관리자 계정으로 다시 로그인해 주세요.' })]));
    } else {
      if (!st.draft) {
        st.draft = clone(S);
        Object.keys(SKIP).forEach(function (k) { delete st.draft[k]; });
      }
      if (st.preview) {
        var ed = h('div', { class: 'oha-ed' });
        renderEditor(ed);
        var split = h('div', { class: 'oha-split' }, [previewPane(), ed]);
        root.appendChild(split);
      } else {
        st.pvFrame = null; st.pvBody = null;
        renderEditor(root);
      }
    }
    root.appendChild(h('div', { id: 'oha-toast', class: 'oha-toast' }));
    root.classList.toggle('is-split', !!(st.preview && isAdmin()));
  }

  function mount() {
    injectCss();
    if (!st.root) {
      st.root = h('div', { id: 'oha' });
      document.body.appendChild(st.root);
      window.addEventListener('hashchange', function () {
        st.root.hidden = !/^#\/?admin/.test(location.hash);
      });
      window.addEventListener('beforeunload', function (e) {
        if (st.dirty) { e.preventDefault(); e.returnValue = ''; }
      });
      if (adminEmail() && window.SITE_FB) {
        fb().then(function (c) {
          c.auth.onAuthStateChanged(c.a, function (u) { st.user = u; draw(); });
        }).catch(function () { draw(); });
      }
    }
    st.root.hidden = false;
    draw();
  }

  window.OHAdmin = { mount: mount, _state: st, _draw: draw };
})();
