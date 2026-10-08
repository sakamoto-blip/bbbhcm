/* =========================================================
   研修スライド 共通の動き
   - → / Space / クリック：進む　← ：戻る　F：全画面　N：進行メモ　P：発表者ウィンドウ
   - 画面の下にマウスを近づけると、スライド一覧のバーが出る（クリックで移動）
   - [data-step="n"] の要素は n 回目の操作で表示
   - [data-until="n"] の要素は n 回目より後で消える（場面の入れ替え）
   - [data-count="365"] は表示時に数え上げ、[data-countdown="10"] は数え下げ
   - <section data-embers> で火の粉、data-germs で光がなぞると浮かぶ粒、data-ticks で時間の目盛り、data-pun/data-life で天秤、
     contenteditable の要素はクリックで入力（Enterで確定）、data-min="3" で予定時間、data-no-footer でロゴ以外のフッターを隠す
   ========================================================= */
(function () {
  const ICONS = {
    fire: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.3 1.2-3.6 2.2-4.6 0 1.8.8 2.8 1.6 3.1C10.5 8.6 11 5.6 12 3z"/>',
    extinguisher: '<rect x="8" y="8" width="8" height="13" rx="3"/><path d="M12 8V5h-2M12 5h3l3-1M16 11c3 1 3 6 1 8"/>',
    phone: '<path d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    exit: '<path d="M4 21V3h10v18"/><path d="M10 12h10M17 9l3 3-3 3"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM8 12h8M8 16h5"/>',
    building: '<path d="M4 21V5l8-3 8 3v16M2 21h20"/><path d="M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4"/>',
    person: '<g fill="currentColor" stroke="none"><circle cx="12" cy="3.4" r="2.5"/><path d="M8.7 6.9h6.6a2 2 0 0 1 2 2v5.6a1.15 1.15 0 0 1-2.3 0V10h-.5v11.8a1.45 1.45 0 0 1-2.9 0v-6.6h-.2v6.6a1.45 1.45 0 0 1-2.9 0V10H8v4.5a1.15 1.15 0 0 1-2.3 0V8.9a2 2 0 0 1 2-2z"/></g>',
    run: '<g fill="currentColor" stroke="none"><circle cx="15.2" cy="3.3" r="2.3"/><path d="M13.6 6.4c.8-.2 1.6.1 2.1.8l1.9 2.9 2.4.7a1 1 0 0 1-.6 1.9l-2.8-.8a1 1 0 0 1-.5-.4l-.9-1.3-1 3.6 2.4 2.4c.2.2.3.4.3.7l.6 5a1.1 1.1 0 0 1-2.2.3l-.5-4.6-2.6-2.6-2.2 3.2-3.7 1.4a1.1 1.1 0 0 1-.8-2l3.3-1.3 3.1-4.6.7-2.4-1.4.6-1.6 2.4a1 1 0 0 1-1.7-1.1l1.8-2.7c.1-.2.3-.3.5-.4z"/></g>',
    users: '<g fill="currentColor" stroke="none"><circle cx="7.5" cy="4.6" r="2.1"/><path d="M4.7 7.6h5.6a1.7 1.7 0 0 1 1.7 1.7v4.4a1 1 0 0 1-2 0v-3.3h-.4v10a1.2 1.2 0 0 1-2.4 0v-5.5h-.2v5.5a1.2 1.2 0 0 1-2.4 0v-10h-.4v3.3a1 1 0 0 1-2 0V9.3a1.7 1.7 0 0 1 1.7-1.7z"/><circle cx="16.5" cy="4.6" r="2.1"/><path d="M13.7 7.6h5.6a1.7 1.7 0 0 1 1.7 1.7v4.4a1 1 0 0 1-2 0v-3.3h-.4v10a1.2 1.2 0 0 1-2.4 0v-5.5h-.2v5.5a1.2 1.2 0 0 1-2.4 0v-10h-.4v3.3a1 1 0 0 1-2 0V9.3a1.7 1.7 0 0 1 1.7-1.7z"/></g>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    water: '<path d="M12 3C9 8 6 11 6 14a6 6 0 0 0 12 0c0-3-3-6-6-11z"/>',
    plug: '<path d="M9 3v5M15 3v5"/><rect x="6" y="8" width="12" height="6" rx="2"/><path d="M12 14v3a3 3 0 0 1-3 3"/>',
    battery: '<rect x="7" y="4" width="10" height="17" rx="2"/><path d="M10 2h4M13 9l-2 4h3l-2 4"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
    yen: '<circle cx="12" cy="12" r="9"/><path d="M8 7l4 5 4-5M12 12v6M9 13h6M9 16h6"/>',
    gavel: '<path d="M13 4l7 7M10 7l7 7M12 5l-5 5 3 3 5-5M8.5 11.5L3 17l2 2 5.5-5.5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8"/>',
    duct: '<path d="M4 21v-8h7V3h10"/><path d="M8 21v-4h7V7h6"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    tool: '<path d="M14 6a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3l9-9a4 4 0 0 0-2-2z"/>',
    store: '<path d="M3 9l2-5h14l2 5M4 9v11h16V9M3 9h18"/><path d="M9 20v-6h6v6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    volume: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
    door: '<path d="M5 21V3h11v18M3 21h18"/><path d="M13 12h.5"/>'
  };
  const sprite = document.createElement('div');
  sprite.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  sprite.setAttribute('aria-hidden', 'true');
  sprite.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><defs>' +
    Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('') +
    '</defs></svg>';
  document.body.prepend(sprite);

  const deck = document.querySelector('.deck');
  if (!deck) return;
  /* 大きなアイコンタイル（.ico）は、アイコンの種類に合わせて小さく動き続ける */
  const MOTION = { bell: 'a-ring', phone: 'a-ring', fire: 'a-flick', extinguisher: 'a-bob', water: 'a-bob', exit: 'a-nudge', run: 'a-nudge',
    clock: 'a-tick', search: 'a-scan', alert: 'a-pulse', shield: 'a-pulse', yen: 'a-flip', calendar: 'a-flip', person: 'a-breath',
    users: 'a-breath', duct: 'a-pulse', chat: 'a-bob', clipboard: 'a-tilt', doc: 'a-tilt', building: 'a-breath', store: 'a-breath', tool: 'a-tilt', plug: 'a-tilt', battery: 'a-pulse', check: 'a-pulse', eye: 'a-scan' };
  deck.querySelectorAll('.ico svg.i use').forEach(u => {
    const k = (u.getAttribute('href') || '').replace('#i-', '');
    if (MOTION[k]) u.parentNode.classList.add(MOTION[k]);
  });
  const slides = Array.from(deck.querySelectorAll(':scope > .slide'));

  const viewport = document.createElement('div');
  viewport.className = 'd-viewport';
  const stage = document.createElement('div');
  stage.className = 'd-stage';
  stage.setAttribute('role', 'region');
  stage.setAttribute('aria-label', deck.dataset.chapter || '研修スライド');
  slides.forEach(s => stage.appendChild(s));
  const footer = document.createElement('div');
  footer.className = 'd-footer';
  const logo = deck.dataset.logo || 'assets/logo.svg';
  const company = deck.dataset.company || 'BALNIBARBI';
  footer.innerHTML = `<span class="d-chapter">${deck.dataset.chapter || ''}</span><span class="d-brand"><img src="${logo}" alt="${company}"></span><span class="d-right"><span class="d-dots"></span><span class="d-page"></span></span>`;
  const progress = document.createElement('div');
  progress.className = 'd-progress';
  stage.append(footer, progress);
  viewport.appendChild(stage);
  deck.appendChild(viewport);
  deck.classList.add('ready');

  const titleOf = s => s.dataset.title || ((s.querySelector('h1, h2, .eyebrow') || {}).textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);

  /* スライド一覧のバー：画面の下にマウスを近づけると出る。クリックでそのスライドへ */
  const nav = document.createElement('div');
  nav.className = 'd-nav';
  nav.innerHTML = slides.map((s, i) => `<button type="button" data-i="${i}" title="${(i + 1) + '. ' + titleOf(s).replace(/"/g, '')}">${i + 1}</button>`).join('');
  deck.appendChild(nav);
  nav.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); go(+b.dataset.i); } });
  let navTimer = null;
  document.addEventListener('mousemove', e => {
    if (e.clientY > window.innerHeight - 110 || nav.matches(':hover')) {
      nav.classList.add('show'); clearTimeout(navTimer);
      navTimer = setTimeout(() => { if (!nav.matches(':hover')) nav.classList.remove('show'); }, 2500);
    }
  });

  /* 発表者ウィンドウ（P キー）：台本・時間・次のスライド・一覧を、別のウィンドウに出す */
  let pw = null;
  function openPresenter() {
    try { pw = window.open('', 'presenter-' + location.pathname, 'width=1180,height=780'); } catch (e) { pw = null; }
    if (!pw) { notes.hidden = false; notes.innerHTML = '<p>発表者ウィンドウを開けませんでした。ブラウザのポップアップを許可するか、HTMLファイルをパソコンに保存して開いてください。</p>'; return; }
    const d = pw.document;
    d.open();
    d.write(`<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>発表者用｜${deck.dataset.chapter || ''}</title><style>
      body{margin:0;font-family:"Hiragino Sans","Yu Gothic","Meiryo",sans-serif;background:#f3f5f8;color:#1d2128;display:grid;grid-template-rows:auto 1fr auto;height:100vh}
      header{display:flex;gap:20px;align-items:center;padding:12px 20px;background:#fff;border-bottom:1px solid #d9dee5;font-variant-numeric:tabular-nums}
      header b{font-size:22px} header .t{font-size:28px;font-weight:700} header .sp{flex:1}
      main{display:grid;grid-template-columns:1fr 320px;min-height:0}
      #pn{overflow:auto;padding:18px 24px;font-size:22px;line-height:1.8;white-space:pre-wrap;color:#59606b}
      #pn .now{color:#1d2128;background:#fff2b3;border-radius:6px}
      aside{border-left:1px solid #d9dee5;background:#fff;display:flex;flex-direction:column;min-height:0}
      aside h3{margin:0;padding:12px 16px 4px;font-size:14px;color:#59606b}
      #nx{padding:0 16px 12px;font-size:18px;font-weight:700}
      #ls{overflow:auto;flex:1;padding:0 8px 8px}
      #ls button{display:block;width:100%;text-align:left;border:0;background:none;padding:8px 10px;border-radius:8px;font-size:15px;cursor:pointer;color:#1d2128}
      #ls button.cur{background:#e9e6fd;font-weight:700}
      footer{display:flex;gap:12px;padding:12px 20px;background:#fff;border-top:1px solid #d9dee5}
      footer button{font-size:20px;padding:12px 28px;border-radius:10px;border:1px solid #d9dee5;background:#fff;cursor:pointer}
      footer button.next{background:#1d2128;color:#fff;border-color:#1d2128;flex:1}
      .hint{font-size:13px;color:#59606b;align-self:center}
    </style></head><body>
      <header><b id="pg"></b><span class="t" id="tt"></span><span class="sp"></span><span id="st"></span><span id="tm"></span></header>
      <main><div id="pn"></div><aside><h3>次のスライド</h3><div id="nx"></div><h3>スライド一覧（クリックで移動）</h3><div id="ls"></div></aside></main>
      <footer><button id="bp">← 戻る</button><button id="bn" class="next">進む →</button><span class="hint">このウィンドウで → ← キーでも操作できます</span></footer>
    </body></html>`);
    d.close();
    d.getElementById('bp').onclick = () => prev();
    d.getElementById('bn').onclick = () => next();
    d.getElementById('ls').innerHTML = slides.map((s, i) => `<button type="button" data-i="${i}">${i + 1}. ${titleOf(s)}</button>`).join('');
    d.getElementById('ls').onclick = e => { const b = e.target.closest('button'); if (b) go(+b.dataset.i); };
    d.addEventListener('keydown', onKey);
    renderPresenter();
  }
  function renderPresenter() {
    if (!pw || pw.closed) return;
    const d = pw.document, s = slides[cur], m = steps(s);
    d.getElementById('pg').textContent = `${cur + 1} / ${slides.length}`;
    d.getElementById('tt').textContent = titleOf(s);
    d.getElementById('st').textContent = m ? `クリック ${step} / ${m}` : '';
    d.getElementById('nx').textContent = cur < slides.length - 1 ? titleOf(slides[cur + 1]) : '（最後のスライド）';
    d.querySelectorAll('#ls button').forEach((b, i) => b.classList.toggle('cur', i === cur));
    const pn = d.getElementById('pn'); pn.innerHTML = '';
    const n = s.querySelector('aside.notes');
    (n ? n.textContent.trim() : '（メモなし）').split('［クリック］').forEach((t, k) => {
      const sp = d.createElement('span'); sp.textContent = (k ? '［クリック］' : '') + t;
      if (k === step) sp.className = 'now';
      pn.appendChild(sp);
    });
    const now = pn.querySelector('.now'); if (now) now.scrollIntoView({ block: 'center' });
    tickPresenter();
  }
  function tickPresenter() {
    if (!pw || pw.closed) return;
    const el = Math.floor((Date.now() - started) / 1000);
    const plan = slides.slice(0, cur + 1).reduce((a, x) => a + (+x.dataset.min || 0), 0);
    pw.document.getElementById('tm').textContent = `経過 ${Math.floor(el / 60)}:${String(el % 60).padStart(2, '0')}　予定（ここまで）${plan}分　このスライド ${slides[cur].dataset.min || '–'}分`;
  }
  setInterval(tickPresenter, 1000);

  const notes = document.createElement('div');
  notes.className = 'd-notes';
  notes.hidden = true;
  document.body.appendChild(notes);

  const dotsEl = footer.querySelector('.d-dots');
  const pageEl = footer.querySelector('.d-page');
  let cur = 0, step = 0;
  const started = Date.now();

  function fit() {
    const g = window.innerWidth < 700 ? 16 : 0;
    const s = Math.min((window.innerWidth - g * 2) / 1920, window.innerHeight / 1080);
    stage.style.transform = `scale(${s}) translate(-50%, -50%)`;
  }
  window.addEventListener('resize', fit);
  fit();

  const steps = s => Math.max(0, ...Array.from(s.querySelectorAll('[data-step]'), e => +e.dataset.step || 0));

  function renderNotes() {
    if (notes.hidden) return;
    const s = slides[cur];
    const n = s.querySelector('aside.notes');
    const el = Math.floor((Date.now() - started) / 1000);
    const plan = slides.slice(0, cur + 1).reduce((a, x) => a + (+x.dataset.min || 0), 0);
    notes.innerHTML = `<header><span><b>${cur + 1} / ${slides.length}</b></span><span>このスライド ${s.dataset.min || '–'}分</span><span>経過 ${Math.floor(el / 60)}:${String(el % 60).padStart(2, '0')}</span><span>予定（ここまで） ${plan}分</span></header><p></p>`;
    const p = notes.querySelector('p');
    const segs = (n ? n.textContent.trim() : '（メモなし）').split('［クリック］');
    segs.forEach((t, k) => {
      const span = document.createElement('span');
      span.textContent = (k ? '［クリック］' : '') + t;
      if (k === step) span.className = 'now';
      p.appendChild(span);
    });
    const now = p.querySelector('.now');
    if (now && notes.dataset.last !== cur + ':' + step) { notes.dataset.last = cur + ':' + step; now.scrollIntoView({ block: 'nearest' }); }
  }
  setInterval(() => { const h = notes.querySelector('header'); if (h && !notes.hidden) { const el = Math.floor((Date.now() - started) / 1000); h.children[2].textContent = `経過 ${Math.floor(el / 60)}:${String(el % 60).padStart(2, '0')}`; } }, 1000);

  function render() {
    slides.forEach((s, i) => {
      const at = i === cur ? step : (i < cur ? 999 : -1);
      s.classList.toggle('active', i === cur);
      s.querySelectorAll('[data-step]').forEach(e => e.classList.toggle('on', +e.dataset.step <= at));
      s.querySelectorAll('[data-until]').forEach(e => e.classList.toggle('gone', at > +e.dataset.until));
      s.dataset.at = Math.max(at, 0);
      s.querySelectorAll('[data-count]').forEach(e => {
        const shown = i === cur && !e.closest('.gone') && (!e.closest('[data-step]') || e.closest('[data-step]').classList.contains('on'));
        if (shown && !e._counted) { e._counted = true; countUp(e); }
        if (i !== cur) { e._counted = false; e.textContent = e.dataset.count; }
      });
      s.querySelectorAll('[data-countdown]').forEach(e => {
        const host = e.closest('[data-step]');
        const shown = i === cur && (!host || host.classList.contains('on')) && !e.closest('.gone');
        if (shown && !e._timer) countDown(e);
        if (!shown && e._timer) { clearInterval(e._timer); e._timer = null; e.textContent = cdText(e, +e.dataset.countdown); }
      });
    });
    const s = slides[cur];
    const m = steps(s);
    dotsEl.innerHTML = m ? Array.from({ length: m }, (_, k) => `<i class="${k < step ? 'on' : ''}"></i>`).join('') : '';
    pageEl.textContent = `${cur + 1} / ${slides.length}`;
    nav.querySelectorAll('button').forEach((b, i) => b.classList.toggle('cur', i === cur));
    footer.classList.toggle('on-light', s.classList.contains('light'));
    footer.classList.toggle('brand-only', s.hasAttribute('data-no-footer'));
    progress.style.width = ((cur + (m ? step / m : 1)) / slides.length * 100) + '%';
    slides.forEach((x, i) => {
      if (!x.hasAttribute('data-pun')) return;
      const at = i === cur ? step : -1;
      x.classList.toggle('s-pun', at >= +x.dataset.pun && at < +x.dataset.life);
      x.classList.toggle('s-life', at >= +x.dataset.life);
    });
    deck.dispatchEvent(new CustomEvent('slidechange', { detail: { index: cur, step, slide: s } }));
    try { history.replaceState(null, '', '#s' + (cur + 1)); } catch (e) {}
    renderNotes();
    renderPresenter();
    embers.wake();
  }

  function countUp(e) {
    const to = +e.dataset.count, dur = +e.dataset.dur || 1200, t0 = performance.now();
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) { e.textContent = to; return; }
    (function tick(t) {
      const k = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
      e.textContent = v.toLocaleString('ja-JP');
      if (k < 1 && e._counted) requestAnimationFrame(tick);
    })(t0);
  }
  const cdText = (e, v) => e.dataset.fmt === 'mmss' ? Math.floor(v / 60) + ':' + String(v % 60).padStart(2, '0') : v;
  function countDown(e) {
    let n = +e.dataset.countdown;
    e.textContent = cdText(e, n);
    e._timer = setInterval(() => {
      n -= 1; e.textContent = cdText(e, Math.max(n, 0));
      if (n <= 0) { clearInterval(e._timer); e._timer = 'done'; }
    }, 1000);
  }

  function go(n, atEnd) {
    if (n < 0 || n >= slides.length) return;
    cur = n; step = atEnd ? steps(slides[n]) : 0;
    render();
  }
  const next = () => step < steps(slides[cur]) ? (step++, render()) : go(cur + 1);
  const prev = () => step > 0 ? (step--, render()) : go(cur - 1, true);

  function fullscreen() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else { const p = document.documentElement.requestFullscreen?.(); p && p.catch(() => {}); }
    } catch (e) {}
  }

  const editing = t => t && t.closest && t.closest('[contenteditable]');
  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (editing(e.target)) { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); e.target.blur(); } return; }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1, true);
    else if (e.key === 'f' || e.key === 'F') fullscreen();
    else if (e.key === 'n' || e.key === 'N') { notes.hidden = !notes.hidden; renderNotes(); }
    else if (e.key === 'p' || e.key === 'P') openPresenter();
  }
  document.addEventListener('keydown', onKey);
  viewport.addEventListener('click', e => { if (editing(e.target)) return; e.clientX < window.innerWidth / 3 ? prev() : next(); });
  let tx = null;
  document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  });

  /* ---------- 背景の動き（火の粉・浮かび上がる粒） ---------- */
  const embers = (() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = (a, b) => a + Math.random() * (b - a);
    const list = slides.filter(s => s.hasAttribute('data-embers') || s.hasAttribute('data-germs') || s.hasAttribute('data-ticks')).map(s => {
      const cv = document.createElement('canvas');
      cv.className = 'd-embers'; cv.width = 1920; cv.height = 1080;
      cv.setAttribute('aria-hidden', 'true');
      s.prepend(cv);
      const germs = s.hasAttribute('data-germs');
      const ticks = s.hasAttribute('data-ticks');
      const count = +(germs ? s.dataset.germs : s.dataset.embers) || (germs ? 220 : 90);
      const P = Array.from({ length: count }, () => ({ x: rand(germs ? 0 : 700, 1920), y: rand(0, 1080), v: rand(.4, 1.6), r: rand(germs ? 2 : 1, germs ? 6 : 3.6), w: rand(0, 6.28), a: rand(.25, .9) }));
      const rgb = getComputedStyle(deck).getPropertyValue('--accent').trim() || '#22915c';
      return { s, ctx: cv.getContext('2d'), P, germs, ticks, rgb, t0: performance.now() };
    });
    let running = false;
    function frame(now) {
      now = now || performance.now();
      const live = list.filter(e => e.s.classList.contains('active'));
      for (const e of live) {
        const c = e.ctx;
        c.clearRect(0, 0, 1920, 1080);
        if (e.ticks) {
          /* 時間の目盛りが、下の帯をゆっくり左へ流れる */
          const off = still ? 0 : ((now - e.t0) / 60) % 240;
          c.strokeStyle = e.rgb; c.lineWidth = 2;
          for (let k = -1; k < 90; k++) {
            const x = k * 24 - off % 24, n = Math.round((k * 24 - off % 24 + off) / 24);
            const big = n % 10 === 0, mid = n % 5 === 0;
            c.globalAlpha = big ? .28 : mid ? .18 : .1;
            const h = big ? 70 : mid ? 44 : 24;
            c.beginPath(); c.moveTo(x, 1080); c.lineTo(x, 1080 - h); c.stroke();
          }
          c.globalAlpha = 1;
        } else if (e.germs) {
          /* 光の帯が左から右へなぞり、帯の近くだけ粒が見える */
          const band = still ? 1300 : ((now - e.t0) / 7000 % 1) * 2600 - 340;
          const g = c.createLinearGradient(band - 260, 0, band + 260, 0);
          g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
          c.fillStyle = g; c.fillRect(band - 260, 0, 520, 1080);
          c.fillStyle = e.rgb;
          for (const p of e.P) {
            if (!still) { p.w += .01; p.x += Math.sin(p.w) * .15; p.y += Math.cos(p.w) * .15; }
            const d = (p.x - band) / 200;
            c.globalAlpha = Math.min(.75, .03 + .7 * Math.exp(-d * d)) * p.a;
            c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.283); c.fill();
          }
          c.globalAlpha = 1;
        } else {
          for (const p of e.P) {
            if (!still) { p.y -= p.v; p.w += .02; p.x += Math.sin(p.w) * .6; if (p.y < -10) { p.y = 1090; p.x = rand(700, 1920); } }
            const fade = Math.min(1, p.y / 700);
            c.beginPath();
            c.fillStyle = `rgba(${230 + Math.round(p.r * 6)},${100 + Math.round(p.r * 22)},20,${(p.a * fade * .75).toFixed(3)})`;
            c.arc(p.x, p.y, p.r, 0, 6.283);
            c.fill();
          }
        }
      }
      running = live.length > 0 && !still;
      if (running) requestAnimationFrame(frame);
    }
    return { wake() { if (!running) frame(); } };
  })();

  const m = /^#s(\d+)$/.exec(location.hash);
  cur = m ? Math.min(slides.length, Math.max(1, +m[1])) - 1 : 0;
  render();
})();
