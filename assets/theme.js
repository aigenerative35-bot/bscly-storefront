/* ============================================================
   BSCLY — interactions (white edition)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Ticker duplicate ---------- */
  document.querySelectorAll('.ticker__track').forEach(function (t) {
    t.innerHTML = t.innerHTML + t.innerHTML;
  });

  /* ---------- 1b. Sticky header state ---------- */
  const headerEl = document.querySelector('[data-header]');
  if (headerEl) {
    const onScroll = () => headerEl.classList.toggle('is-stuck', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. Mobile nav ---------- */
  const drawer = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.overlay');
  function openDrawer() { if (drawer) drawer.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { if (drawer) drawer.classList.remove('is-open'); document.body.style.overflow = ''; }
  document.querySelectorAll('[data-open-nav]').forEach(b => b.addEventListener('click', openDrawer));
  document.querySelectorAll('[data-close-nav]').forEach(b => b.addEventListener('click', closeDrawer));

  /* ---------- 3. Cart ---------- */
  const FREE_SHIP = 499;
  const cartEl = document.querySelector('.cart');
  function money(n) { return '₹' + n.toLocaleString('en-IN'); }
  function getCart() { try { return JSON.parse(localStorage.getItem('bscly_cart_v2') || '[]'); } catch (e) { return []; } }
  function setCart(c) { localStorage.setItem('bscly_cart_v2', JSON.stringify(c)); renderCart(); }

  function addToCart(item) {
    const c = getCart();
    const key = item.id + '|' + (item.variant || '');
    const found = c.find(x => x.key === key);
    if (found) found.qty += item.qty || 1;
    else c.push({ key: key, id: item.id, title: item.title, price: item.price, img: item.img, variant: item.variant || '', qty: item.qty || 1 });
    setCart(c);
    openCart();
    toast('Added to bag');
  }

  function openCart() { if (cartEl) { cartEl.classList.add('is-open'); overlay && overlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; } }
  function closeCart() { if (cartEl) { cartEl.classList.remove('is-open'); overlay && overlay.classList.remove('is-open'); document.body.style.overflow = ''; } }

  function renderCart() {
    const c = getCart();
    const items = document.querySelector('[data-cart-items]');
    const countEls = document.querySelectorAll('[data-bag-count]');
    const totalQty = c.reduce((s, i) => s + i.qty, 0);
    countEls.forEach(e => { e.textContent = totalQty; e.style.display = totalQty ? 'grid' : 'none'; });
    if (!items) return;

    if (!c.length) {
      items.innerHTML = '<div class="cart-empty">Your bag is empty.<br><br><a class="link-u" href="collection.html">Explore the shelf</a></div>';
    } else {
      items.innerHTML = c.map(i => `
        <div class="cart-item">
          <div class="cart-item__img">${i.img ? `<img src="${i.img}" alt="">` : ''}</div>
          <div>
            <h4>${i.title}</h4>
            <div class="small">${i.variant || 'Standard'} · ${money(i.price)}</div>
            <div class="cart-item__qty">
              <button data-dec="${i.key}" aria-label="Decrease">–</button>
              <span class="mono">${i.qty}</span>
              <button data-inc="${i.key}" aria-label="Increase">+</button>
            </div>
          </div>
          <div style="text-align:right">
            <div class="small mono">${money(i.price * i.qty)}</div>
            <button data-rm="${i.key}" class="small" style="margin-top:8px;text-decoration:underline;text-underline-offset:3px">Remove</button>
          </div>
        </div>`).join('');
    }

    const subtotal = c.reduce((s, i) => s + i.price * i.qty, 0);
    document.querySelectorAll('[data-subtotal]').forEach(el => el.textContent = money(subtotal));
    const bar = document.querySelector('[data-ship-bar]');
    const msg = document.querySelector('[data-ship-msg]');
    if (bar) bar.style.width = Math.min(100, (subtotal / FREE_SHIP) * 100) + '%';
    if (msg) msg.textContent = subtotal >= FREE_SHIP
      ? 'Complimentary shipping unlocked'
      : `₹${FREE_SHIP - subtotal} away from complimentary shipping`;

    items.querySelectorAll('[data-inc]').forEach(b => b.onclick = () => {
      const c2 = getCart(); const it = c2.find(x => x.key === b.dataset.inc); if (it) it.qty++; setCart(c2);
    });
    items.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => {
      const c2 = getCart(); const it = c2.find(x => x.key === b.dataset.dec);
      if (it) it.qty--; setCart(c2.filter(x => x.qty > 0));
    });
    items.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => {
      setCart(getCart().filter(x => x.key !== b.dataset.rm));
    });
  }

  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', openCart));
  document.querySelectorAll('[data-close-cart]').forEach(b => b.addEventListener('click', closeCart));
  overlay && overlay.addEventListener('click', function () { closeCart(); closeDrawer(); });

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    e.preventDefault();
    addToCart({
      id: btn.dataset.id, title: btn.dataset.title, price: Number(btn.dataset.price),
      img: btn.dataset.img, variant: btn.dataset.variant || ''
    });
  });

  renderCart();

  /* ---------- 4. Toast ---------- */
  let toastT;
  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('is-open');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-open'), 2200);
  }

  /* ---------- 5. PDP ---------- */
  document.querySelectorAll('[data-thumb]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-thumb]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const main = document.querySelector('[data-gallery-main]');
      if (main && btn.dataset.src) main.src = btn.dataset.src;
    });
  });

  document.querySelectorAll('.variant').forEach(function (v) {
    v.addEventListener('click', function () {
      document.querySelectorAll('.variant').forEach(x => x.classList.remove('is-active'));
      v.classList.add('is-active');
      const priceEl = document.querySelector('[data-pdp-price]');
      if (priceEl && v.dataset.price) priceEl.textContent = money(Number(v.dataset.price));
      const addBtn = document.querySelector('[data-pdp-add]');
      if (addBtn) {
        if (v.dataset.price) addBtn.dataset.price = v.dataset.price;
        addBtn.dataset.variant = v.dataset.variant || v.textContent.trim();
      }
    });
  });

  let qty = 1;
  const qtyEl = document.querySelector('[data-qty]');
  document.querySelectorAll('[data-qty-inc]').forEach(b => b.onclick = () => { qty++; if (qtyEl) qtyEl.textContent = qty; });
  document.querySelectorAll('[data-qty-dec]').forEach(b => b.onclick = () => { qty = Math.max(1, qty - 1); if (qtyEl) qtyEl.textContent = qty; });

  const pdpAdd = document.querySelector('[data-pdp-add]');
  if (pdpAdd) pdpAdd.addEventListener('click', function (e) {
    e.preventDefault();
    addToCart({ id: pdpAdd.dataset.id, title: pdpAdd.dataset.title, price: Number(pdpAdd.dataset.price), img: pdpAdd.dataset.img, variant: pdpAdd.dataset.variant || '', qty: qty });
  });

  document.querySelectorAll('.acc__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.parentElement;
      const panel = item.querySelector('.acc__panel');
      const open = item.classList.contains('is-open');
      document.querySelectorAll('.acc__item').forEach(function (i) {
        i.classList.remove('is-open');
        i.querySelector('.acc__panel').style.maxHeight = null;
      });
      if (!open) { item.classList.add('is-open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
    });
  });

  /* ---------- 6. Collection filters ---------- */
  const grid = document.querySelector('[data-grid]');
  if (grid) {
    const cards = Array.from(grid.children);
    const boxes = document.querySelectorAll('[data-filter]');
    const countEl = document.querySelector('[data-product-count]');
    const sortSel = document.querySelector('[data-sort]');

    function apply() {
      const active = {};
      boxes.forEach(b => { if (b.checked) (active[b.dataset.filter] = active[b.dataset.filter] || []).push(b.value); });
      let shown = 0;
      cards.forEach(card => {
        let ok = true;
        Object.keys(active).forEach(key => {
          const vals = card.dataset[key] ? card.dataset[key].split(',') : [];
          if (!active[key].some(v => vals.includes(v))) ok = false;
        });
        card.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      if (countEl) countEl.textContent = shown + ' pieces';
    }
    boxes.forEach(b => b.addEventListener('change', apply));

    const c = (new URLSearchParams(location.search)).get('c');
    const map = { cats: ['pet', 'cat'], grooming: ['concern', 'grooming'], paws: ['concern', 'paws'], outdoor: ['concern', 'ticks'] };
    if (c && map[c]) {
      const [key, val] = map[c];
      boxes.forEach(b => { if (b.dataset.filter === key && b.value === val) b.checked = true; });
    }

    if (sortSel) sortSel.addEventListener('change', function () {
      let list = Array.from(grid.children);
      if (sortSel.value === 'price-asc') list.sort((a, b) => +a.dataset.price - +b.dataset.price);
      else if (sortSel.value === 'price-desc') list.sort((a, b) => +b.dataset.price - +a.dataset.price);
      else if (sortSel.value === 'name') list.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
      list.forEach(n => grid.appendChild(n));
    });
    apply();
  }

  /* ---------- 7. Scroll reveal ---------- */
  if (location.search.indexOf('static') > -1) {
    document.documentElement.classList.add('is-static');
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ---------- 7b. Count-up numbers ---------- */
  const isStatic = location.search.indexOf('static') > -1;
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (isStatic || isNaN(target)) { el.textContent = target.toFixed(dec) + suffix; return; }
    const dur = 1400, t0 = performance.now();
    function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(step);
  }
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if ('IntersectionObserver' in window && !isStatic) {
      const cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(el => cio.observe(el));
    } else {
      counters.forEach(countUp);
    }
  }

  /* ---------- 8. Forms ---------- */
  document.querySelectorAll('[data-newsletter]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      toast('Thank you — notes from the shelf, monthly');
      f.reset();
    });
  });

  const checkoutBtn = document.querySelector('[data-checkout]');
  if (checkoutBtn) checkoutBtn.addEventListener('click', function () {
    if (!getCart().length) return toast('Your bag is empty');
    toast('Demo store — connect Shopify checkout to go live');
  });

  /* ---------- 9. Horizontal rails (hero banner + product rail) ---------- */
  document.querySelectorAll('[data-rail-prev],[data-rail-next]').forEach(function (btn) {
    const id = btn.dataset.railPrev || btn.dataset.railNext;
    const rail = document.getElementById(id);
    if (!rail) return;
    const dir = btn.dataset.railPrev ? -1 : 1;
    btn.addEventListener('click', function () {
      const first = rail.firstElementChild;
      const step = first ? first.getBoundingClientRect().width + 12 : rail.clientWidth * 0.8;
      rail.scrollBy({ left: dir * step, behavior: 'smooth' });
    });
  });

  /* ---------- 10. Banner dots ---------- */
  document.querySelectorAll('[data-dots]').forEach(function (dots) {
    const rail = document.getElementById(dots.dataset.dots);
    if (!rail) return;
    const slides = Array.from(rail.children);
    dots.innerHTML = slides.map((_, i) => '<button aria-label="Slide ' + (i + 1) + '"></button>').join('');
    const btns = Array.from(dots.children);
    function sync() {
      const i = Math.round(rail.scrollLeft / rail.clientWidth);
      btns.forEach((b, n) => b.classList.toggle('is-active', n === i));
    }
    btns.forEach((b, i) => b.addEventListener('click', () => rail.scrollTo({ left: i * rail.clientWidth, behavior: 'smooth' })));
    rail.addEventListener('scroll', sync, { passive: true });
    sync();
  });
})();
