/* =========================================================
   研修スライド 共通の動き
   - → / Space / クリック：進む　← ：戻る　F：全画面　N：進行メモ
   - [data-step="n"] の要素は n 回目の操作で表示
   - [data-until="n"] の要素は n 回目より後で消える（場面の入れ替え）
   - [data-count="365"] は表示時に数え上げ、[data-countdown="10"] は数え下げ
   - <section data-embers> で火の粉、data-germs で光がなぞると浮かぶ粒、data-pun/data-life で天秤、
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
    person: '<circle cx="12" cy="7" r="3.5"/><path d="M5 21v-1.5a7 7 0 0 1 14 0V21"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14a5 5 0 0 1 4 5v1"/>',
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
        if (!shown && e._timer) { clearInterval(e._timer); e._timer = null; e.textContent = e.dataset.countdown; }
      });
    });
    const s = slides[cur];
    const m = steps(s);
    dotsEl.innerHTML = m ? Array.from({ length: m }, (_, k) => `<i class="${k < step ? 'on' : ''}"></i>`).join('') : '';
    pageEl.textContent = `${cur + 1} / ${slides.length}`;
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
  function countDown(e) {
    let n = +e.dataset.countdown;
    e.textContent = n;
    e._timer = setInterval(() => {
      n -= 1; e.textContent = Math.max(n, 0);
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
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (editing(e.target)) { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); e.target.blur(); } return; }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1, true);
    else if (e.key === 'f' || e.key === 'F') fullscreen();
    else if (e.key === 'n' || e.key === 'N') { notes.hidden = !notes.hidden; renderNotes(); }
  });
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
    const list = slides.filter(s => s.hasAttribute('data-embers') || s.hasAttribute('data-germs')).map(s => {
      const cv = document.createElement('canvas');
      cv.className = 'd-embers'; cv.width = 1920; cv.height = 1080;
      cv.setAttribute('aria-hidden', 'true');
      s.prepend(cv);
      const germs = s.hasAttribute('data-germs');
      const count = +(germs ? s.dataset.germs : s.dataset.embers) || (germs ? 220 : 90);
      const P = Array.from({ length: count }, () => ({ x: rand(germs ? 0 : 700, 1920), y: rand(0, 1080), v: rand(.4, 1.6), r: rand(germs ? 2 : 1, germs ? 6 : 3.6), w: rand(0, 6.28), a: rand(.25, .9) }));
      const rgb = getComputedStyle(deck).getPropertyValue('--accent').trim() || '#22915c';
      return { s, ctx: cv.getContext('2d'), P, germs, rgb, t0: performance.now() };
    });
    let running = false;
    function frame(now) {
      now = now || performance.now();
      const live = list.filter(e => e.s.classList.contains('active'));
      for (const e of live) {
        const c = e.ctx;
        c.clearRect(0, 0, 1920, 1080);
        if (e.germs) {
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
