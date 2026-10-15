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
  var st = { user: null, fb: null, draft: null, dirty: false, tab: null, root: null, view: 'site', busy: false };

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

  function objectEd(obj, key) {
    var box = h('div');
    Object.keys(obj).forEach(function (k) {
      var v = obj[k];
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
      var add = h('button', { class: 'oha-btn oha-add', type: 'button', text: '+ 추가' });
      add.onclick = function () {
        var tpl = arr.length ? blank(arr[arr.length - 1]) : '';
        arr.push(tpl); touch(); draw();
      };
      box.appendChild(add);
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
      b.dataset.k = k; b.onclick = function () { st.tab = k; show(); };
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
      top.appendChild(rs); top.appendChild(sv);
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
      renderEditor(root);
    }
    root.appendChild(h('div', { id: 'oha-toast', class: 'oha-toast' }));
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
