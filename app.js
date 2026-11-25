// 돌봄을 돌봄 시안 v4 — 입체 오브젝트와 스크롤 모션
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 아이소메트릭 오브젝트 ---------- */
  const iso = (k, ox, oy) => {
    const pt = (x, y, z) => [(x - y) * 0.866 * k + ox, (x + y) * 0.5 * k - z * k + oy];
    const poly = (pts, fill, op = 1, cls = '') =>
      `<polygon ${cls ? `class="${cls}"` : ''} points="${pts.map(p => pt(...p).map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${fill}" fill-opacity="${op}"/>`;
    const box = (x, y, z, dx, dy, dz, top, left, right) =>
      poly([[x, y, z + dz], [x + dx, y, z + dz], [x + dx, y + dy, z + dz], [x, y + dy, z + dz]], top) +
      poly([[x, y + dy, z], [x + dx, y + dy, z], [x + dx, y + dy, z + dz], [x, y + dy, z + dz]], left) +
      poly([[x + dx, y, z], [x + dx, y + dy, z], [x + dx, y + dy, z + dz], [x + dx, y, z + dz]], right);
    return { poly, box };
  };
  const grad = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

  const roomSvg = () => {
    const { poly, box } = iso(40, 330, 270);
    let s = `<defs>${grad('wr', '#5FB07E', '#3B8A5C')}${grad('wl', '#3A8058', '#235C3E')}${grad('fl', '#FFF9EC', '#E9DEC6')}${grad('gl', '#FFFBE0', '#FFE9A0')}${grad('sd', '#D9CFB6', '#BDB193')}</defs>`;
    s += box(0, 0, -0.45, 6, 6, 0.45, 'url(#fl)', 'url(#sd)', '#B5A98B');
    s += poly([[0, 0, 0], [6, 0, 0], [6, 0, 4.4], [0, 0, 4.4]], 'url(#wr)') + poly([[0, 0, 0], [0, 6, 0], [0, 6, 4.4], [0, 0, 4.4]], 'url(#wl)');
    s += poly([[0, 0, 4.4], [6, 0, 4.4], [6, -0.35, 4.4], [0, -0.35, 4.4]], '#A8DDB8') + poly([[0, 0, 4.4], [0, 6, 4.4], [-0.35, 6, 4.4], [-0.35, 0, 4.4]], '#7FC79A');
    s += poly([[6, 0, 0], [6, -0.35, 0], [6, -0.35, 4.4], [6, 0, 4.4]], '#2E7350') + poly([[0, 6, 0], [-0.35, 6, 0], [-0.35, 6, 4.4], [0, 6, 4.4]], '#1C4D33');
    s += poly([[1.5, 0, 1.3], [4.5, 0, 1.3], [4.5, 0, 3.6], [1.5, 0, 3.6]], '#FCF6EA');
    s += poly([[1.72, 0, 1.5], [2.9, 0, 1.5], [2.9, 0, 3.4], [1.72, 0, 3.4]], 'url(#gl)', 1, 'win-glow') + poly([[3.1, 0, 1.5], [4.28, 0, 1.5], [4.28, 0, 3.4], [3.1, 0, 3.4]], 'url(#gl)', 1, 'win-glow');
    s += poly([[1.3, 0, 1.15], [4.7, 0, 1.15], [4.7, 0.25, 1.15], [1.3, 0.25, 1.15]], '#FFFFFF');
    s += poly([[0, 3.5, 0], [0, 5.3, 0], [0, 5.3, 3.2], [0, 3.5, 3.2]], '#17432A') + poly([[0, 3.7, 0], [0, 5.1, 0], [0, 5.1, 3], [0, 3.7, 3]], '#0E2A1A') + poly([[0, 3.9, 1.4], [0, 4.05, 1.4], [0, 4.05, 1.6], [0, 3.9, 1.6]], '#A9DD72');
    s += poly([[1.7, 0.25, 0.01], [4.3, 0.25, 0.01], [5.7, 3.2, 0.01], [3.1, 3.2, 0.01]], '#FFF1A8', 0.5, 'win-glow');
    s += box(0.4, 0.6, 0, 2.9, 1.7, 0.5, '#FFFFFF', '#E7DFCC', '#D4CAB2') + box(1.4, 0.6, 0.5, 1.9, 1.7, 0.2, '#C7DDB0', '#A5C389', '#93B377') + box(0.45, 0.75, 0.5, 0.75, 1.4, 0.24, '#FFFFFF', '#E7DFCC', '#D4CAB2');
    s += box(4.6, 0.5, 0, 0.9, 0.9, 1, '#D9C49A', '#BFA878', '#A8915F') + box(4.8, 0.7, 1, 0.3, 0.3, 0.5, '#FFFFFF', '#E7DFCC', '#D4CAB2');
    s += box(3.9, 3.9, 0, 1.3, 1.3, 0.55, '#FFFFFF', '#E7DFCC', '#D4CAB2') + box(3.9, 3.9, 0.55, 0.25, 1.3, 1.1, '#5FA57A', '#3F8A5E', '#34774F');
    return `<svg viewBox="0 0 680 600" fill="none" role="img" aria-label="문이 닫힌 작은 방">${s}</svg>`;
  };

  const stairsSvg = (n, id) => {
    const { box } = iso(44, 270, 170);
    let s = `<defs>${grad(id + 't', '#D6F5B0', '#B4E285')}${grad(id + 'l', '#8FCF63', '#6FB446')}${grad(id + 'r', '#6AAE42', '#4C8E2C')}</defs>`;
    for (let i = 0; i < n; i++) s += `<g class="step" style="--i:${i}">${box(0, (n - 1 - i), 0, 2.8, 1, (i + 1) * 0.58, `url(#${id}t)`, `url(#${id}l)`, `url(#${id}r)`)}</g>`;
    return `<svg viewBox="0 0 560 430" fill="none" role="img" aria-label="위로 이어지는 계단">${s}</svg>`;
  };

  $('#room').innerHTML = roomSvg();
  $('#stairs1').innerHTML = stairsSvg(5, 'a');
  $('#stairs2').innerHTML = stairsSvg(4, 'b');

  /* ---------- 시계 ---------- */
  const ticks = () => {
    let t = '';
    for (let i = 0; i < 24; i++) {
      const a = i * 15 * Math.PI / 180, big = i % 6 === 0, r1 = 44, r2 = big ? 35 : 39;
      t += `<line x1="${(50 + r1 * Math.sin(a)).toFixed(2)}" y1="${(50 - r1 * Math.cos(a)).toFixed(2)}" x2="${(50 + r2 * Math.sin(a)).toFixed(2)}" y2="${(50 - r2 * Math.cos(a)).toFixed(2)}" stroke="#154327" stroke-opacity="${big ? 0.9 : 0.45}" stroke-width="${big ? 2 : 1.2}" stroke-linecap="round"/>`;
    }
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${t}</svg>`;
  };
  $$('.clock').forEach(c => {
    if (c.dataset.angle) c.style.setProperty('--a', c.dataset.angle + 'deg');
    c.innerHTML = (c.classList.contains('running') ? '<div class="trail"></div>' : '') + ticks() + '<div class="hand"></div><div class="hub"></div>';
  });

  /* ---------- 스크롤 등장 ---------- */
  $$('.notes .note').forEach((n, i) => n.style.setProperty('--n', i));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.matches('.stats')) countUp(e.target);
    io.unobserve(e.target);
  }), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .stairs, .notes, .stats, .hl').forEach(el => io.observe(el));

  function countUp(root) {
    if (reduce) return;
    $$('[data-count]', root).forEach(b => {
      const end = parseFloat(b.dataset.count), t0 = performance.now(), dur = 1400;
      const step = now => {
        const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        b.textContent = (end * e).toFixed(1);
        if (p < 1) requestAnimationFrame(step); else b.textContent = end.toFixed(1);
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- 진행 표시 ---------- */
  const rail = $('.rail'), marks = $$('.rail span'), chapters = $$('[data-ch]');
  const openTop = () => $('.open').getBoundingClientRect().top;
  const chIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const n = +e.target.dataset.ch;
    marks.forEach(m => m.classList.toggle('on', +m.dataset.i === n));
  }), { rootMargin: '-45% 0px -45% 0px' });
  chapters.forEach(c => chIO.observe(c));

  /* ---------- 패럴랙스 ---------- */
  const depthEls = $$('[data-depth]');
  let sy = 0, mx = 0, my = 0, ticking = false;
  const stage = $('#heroStage');
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    depthEls.forEach(el => {
      const d = parseFloat(el.dataset.depth), r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const off = (r.top + r.height / 2 - vh / 2) / vh;
      const inHero = stage.contains(el);
      const x = inHero ? mx * d * 26 : 0, y = -off * d * 70 + (inHero ? my * d * 18 : 0);
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    });
    $$('.ghost').forEach(g => {
      const r = g.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      g.style.transform = `translateY(${(((r.top + r.height / 2) - vh / 2) / vh * -40).toFixed(1)}px)`;
    });
    rail.classList.toggle('show', sy > innerHeight * 0.6);
    rail.classList.toggle('dark', openTop() < vh / 2 && $('.finale').getBoundingClientRect().top > vh / 2);
  };
  const req = () => { if (!ticking && !reduce) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', () => { sy = scrollY; req(); }, { passive: true });
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; req(); }, { passive: true });
  update();

  /* ---------- 응원 메시지 남기기 (화면에서만 동작하는 시연) ---------- */
  $('#msgForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#msgText'), v = input.value.trim();
    if (!v) { input.focus(); return; }
    const notes = $('#notes'), n = document.createElement('div');
    n.className = 'note lime new';
    n.style.setProperty('--r', (Math.random() * 4 - 2).toFixed(1) + 'deg');
    n.textContent = v;
    notes.prepend(n);
    notes.lastElementChild.remove();
    notes.classList.add('in');
    input.value = '';
    n.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  });

  /* ---------- 후원 금액 ---------- */
  const sum = $('#sum'), amts = $$('.amounts button'), custom = $('#customAmt');
  const setSum = v => {
    sum.textContent = '월 ' + v.toLocaleString('ko-KR') + '원';
    sum.classList.remove('bump'); void sum.offsetWidth; sum.classList.add('bump');
  };
  amts.forEach(b => b.addEventListener('click', () => {
    amts.forEach(x => x.classList.toggle('on', x === b));
    custom.value = '';
    setSum(+b.dataset.v);
  }));
  custom.addEventListener('input', () => {
    const v = +custom.value.replace(/[^0-9]/g, '');
    custom.value = v ? v.toLocaleString('ko-KR') : '';
    if (v) { amts.forEach(x => x.classList.remove('on')); setSum(v); }
    else { amts[0].classList.add('on'); setSum(10000); }
  });

  /* ---------- 시안 안내 ---------- */
  const toast = $('#toast'); let tt;
  const say = m => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2600); };
  $('#donateForm').addEventListener('submit', e => { e.preventDefault(); say('디자인 시안입니다. 실제 결제는 연결되어 있지 않습니다.'); });
  $$('.pager button').forEach(b => b.addEventListener('click', () => say('디자인 시안입니다. 첫 페이지만 준비되어 있습니다.')));

  /* ---------- 재생 버튼 (영상 자리 표시) ---------- */
  $$('.play').forEach(p => p.addEventListener('click', () => { say('영상은 준비 중입니다. (시안)'); p.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 260 }); }));
})();
