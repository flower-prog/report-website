/* DNA 双螺旋粒子背景(暗色辉光版) */
function initDna(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w, h, raf;

  function resize() {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const palette = {
    accent: [10, 147, 114],
    glow: [93, 227, 197],
    mint: [217, 255, 246],
  };
  const rgba = (c, a) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

  function glowDot(x, y, r, color, alpha) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5);
    g.addColorStop(0, rgba(color, alpha));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = rgba(color, Math.min(alpha + 0.3, 0.95));
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, w, h);

    /* 横向双螺旋带 */
    const cy = h * 0.5, amp = h * 0.3;
    const count = Math.max(28, Math.round(w / 30));
    for (let i = 0; i <= count; i++) {
      const x = (i / count) * w;
      const phase = t + i * 0.32;
      const y1 = cy + Math.sin(phase) * amp;
      const y2 = cy - Math.sin(phase) * amp;
      const depth = (Math.cos(phase) + 1) / 2;

      ctx.strokeStyle = rgba(palette.accent, 0.05 + depth * 0.1);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.stroke();

      glowDot(x, y1, 1.8 + depth * 2.4, palette.glow, 0.1 + depth * 0.22);
      glowDot(x, y2, 1.8 + (1 - depth) * 2.4, palette.mint, 0.06 + (1 - depth) * 0.16);
    }

    t += 0.01;
    if (!reduced) raf = requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('beforeunload', () => cancelAnimationFrame(raf));
}

/* 导航滚动升起(毛玻璃 + 描边) */
function initNavElevate() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 14);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* 顶部导航：参考 Isomorphic Labs 的描线按钮圆角变形 */
function initSegmentedNav() {
  const links = document.querySelector('.nav-links');
  if (!links) return;
  const items = [...links.querySelectorAll('a')];
  if (!items.length) return;

  const setIndicated = item => {
    items.forEach(link => link.classList.toggle('is-indicated', link === item));
  };

  items.forEach(item => {
    item.addEventListener('mouseenter', () => setIndicated(item));
    item.addEventListener('focus', () => setIndicated(item));
    item.addEventListener('blur', () => item.classList.remove('is-indicated'));
  });

  links.addEventListener('mouseleave', () => {
    items.forEach(link => link.classList.remove('is-indicated'));
  });
}

/* 滚动进入 */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

/* 数字滚动 */
function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const dur = 1400, start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  nums.forEach(el => io.observe(el));
}

/* FAQ 折叠 */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach((item, index) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;

    const answerId = a.id || `faq-answer-${index + 1}`;
    a.id = answerId;
    q.setAttribute('aria-controls', answerId);
    q.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');

    q.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
}

/* 定价页月付/年付切换 */
function initBilling() {
  const toggle = document.querySelector('.billing-toggle');
  if (!toggle) return;
  const apply = mode => {
    document.querySelectorAll('.price-num').forEach(el => {
      el.textContent = mode === 'yearly' ? el.dataset.yearly : el.dataset.monthly;
    });
    document.querySelectorAll('.price-note[data-note-yearly]').forEach(el => {
      el.textContent = mode === 'yearly' ? el.dataset.noteYearly : el.dataset.noteMonthly;
    });
    toggle.querySelectorAll('.bt-btn').forEach(b =>
      {
        const active = b.dataset.billing === mode;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
  };
  toggle.querySelectorAll('.bt-btn').forEach(b =>
    b.addEventListener('click', () => apply(b.dataset.billing)));
  apply('monthly');
}

/* 移动端导航 */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  if (!links.id) links.id = 'site-navigation';
  toggle.setAttribute('aria-controls', links.id);
  toggle.setAttribute('aria-expanded', links.classList.contains('open') ? 'true' : 'false');

  const setOpen = open => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => setOpen(false)));
}

document.addEventListener('DOMContentLoaded', () => {
  initDna('dna-canvas');
  initNavElevate();
  initSegmentedNav();
  initReveal();
  initCounters();
  initFaq();
  initBilling();
  initNav();
});
