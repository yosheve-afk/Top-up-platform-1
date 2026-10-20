/* ==========================================================================
   Topline — Robux top-up prototype
   Vanilla JS. State machine: order → payment → processing → success
   Nothing is stored or transmitted. Credentials never leave the DOM.
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- Config ---------- */

  const PACKAGES = [
    { robux: 100,   price: 14000 },
    { robux: 500,   price: 68000 },
    { robux: 1000,  price: 130000, tag: 'Popular' },
    { robux: 2000,  price: 255000 },
    { robux: 5000,  price: 625000 },
    { robux: 10000, price: 1240000 }
  ];
  const SERVICE_FEE = 1000;
  const GAMEPASS_CUT = 0.7;               // seller receives 70% of gamepass price
  const PAY_WINDOW_MS = 15 * 60 * 1000;

  const METHODS = {
    username: { label: 'Via Username', prefix: 'u' },
    gamepass: { label: 'Via Gamepass', prefix: 'g' },
    login:    { label: 'Via Login',    prefix: 'l' }
  };

  const VIEWS = ['order', 'payment', 'processing', 'success'];

  /* ---------- Helpers ---------- */

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const idr = n => 'Rp ' + n.toLocaleString('id-ID');
  const rbx = n => n.toLocaleString('en-US') + ' R$';

  const makeOrderId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return 'TL-' + out;
  };

  const RULES = {
    username: v => /^[A-Za-z0-9_]{3,20}$/.test(v) || 'Use 3–20 letters, numbers or underscores.',
    gamepass: v => /^https?:\/\/(www\.)?roblox\.com\/game-pass\/\d+/i.test(v)
                   || 'Enter a valid gamepass link, e.g. roblox.com/game-pass/123456789.',
    password: v => v.length >= 6 || 'Enter your account password.',
    codes:    v => v.split(/\s+/).filter(Boolean).length >= 1 || 'Enter at least one backup code.'
  };

  /* ---------- State ---------- */

  const state = {
    view: 'order',
    method: 'username',
    pkg: null,          // index into PACKAGES
    order: null,        // { id, method, account, robux, subtotal, fee, total, status, hasCredentials, expiresAt }
    timerId: null
  };

  /* ---------- Elements ---------- */

  const form = $('#order-form');
  const pkgGrid = $('#pkg-grid');
  const tabs = $$('.tab');
  const notice = $('#order-notice');

  /* ======================================================================
     VIEW MANAGEMENT
     ====================================================================== */

  function setView(name) {
    state.view = name;
    VIEWS.forEach(v => { $('#view-' + v).hidden = v !== name; });

    const idx = VIEWS.indexOf(name);
    $$('#progress li').forEach((li, i) => {
      li.classList.toggle('current', i === idx);
      li.classList.toggle('done', i < idx);
      if (i === idx) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });

    window.scrollTo({ top: 0 });
    const h = $('#view-' + name + ' h1');
    if (h) h.focus({ preventScroll: true });
  }

  /* ======================================================================
     STATE 1 · ORDER
     ====================================================================== */

  function renderPackages() {
    pkgGrid.innerHTML = '';
    PACKAGES.forEach((p, i) => {
      const label = document.createElement('label');
      label.className = 'pkg';
      label.innerHTML =
        '<input type="radio" name="package" value="' + i + '">' +
        '<span class="pkg-face">' +
          '<span class="pkg-top">' +
            '<span class="pkg-amount">' + p.robux.toLocaleString('en-US') + '<span class="pkg-unit">R$</span></span>' +
            (p.tag ? '<span class="pkg-tag">' + p.tag + '</span>' : '') +
          '</span>' +
          '<span class="pkg-price">' + idr(p.price) + '</span>' +
        '</span>';
      pkgGrid.appendChild(label);
    });
  }

  function activePanelInputs() {
    return $$('#panel-' + state.method + ' [data-rule]');
  }

  function accountValue(method = state.method) {
    const el = $('#' + METHODS[method].prefix + '-username');
    return el ? el.value.trim() : '';
  }

  function setMethod(method, focusTab) {
    state.method = method;
    tabs.forEach(t => {
      const on = t.dataset.method === method;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focusTab) t.focus();
    });
    Object.keys(METHODS).forEach(m => { $('#panel-' + m).hidden = m !== method; });
    renderSummary();
  }

  function renderSummary() {
    const p = state.pkg !== null ? PACKAGES[state.pkg] : null;
    const acct = accountValue();

    $('#sum-method').textContent = METHODS[state.method].label;
    $('#sum-account').textContent = acct ? '@' + acct : '—';
    $('#sum-package').textContent = p ? rbx(p.robux) : '—';
    $('#sum-subtotal').textContent = p ? idr(p.price) : '—';
    $('#sum-fee').textContent = p ? idr(SERVICE_FEE) : '—';
    $('#sum-total').textContent = p ? idr(p.price + SERVICE_FEE) : 'Rp 0';

    $('#gp-hint-value').textContent = p
      ? Math.ceil(p.robux / GAMEPASS_CUT).toLocaleString('en-US') + ' R$'
      : 'Select a package';
  }

  /* ---- Validation ---- */

  function fieldError(input) {
    const rule = RULES[input.dataset.rule];
    const value = input.dataset.rule === 'password' ? input.value : input.value.trim();
    const result = rule(value);
    return result === true ? '' : result;
  }

  function showFieldError(input, msg) {
    const out = $('#' + input.id + '-error');
    if (out) out.textContent = msg;
    input.classList.toggle('invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validateOrder() {
    let firstBad = null;

    activePanelInputs().forEach(input => {
      const msg = fieldError(input);
      showFieldError(input, msg);
      if (msg && !firstBad) firstBad = input;
    });

    const pkgErr = $('#pkg-error');
    if (state.pkg === null) {
      pkgErr.textContent = 'Select a package to continue.';
      if (!firstBad) firstBad = $('input[name="package"]');
    } else {
      pkgErr.textContent = '';
    }

    if (firstBad) { firstBad.focus(); return false; }
    return true;
  }

  /* ---- Create order ---- */

  function createOrder() {
    const p = PACKAGES[state.pkg];
    return {
      id: makeOrderId(),
      method: state.method,
      account: accountValue(),
      robux: p.robux,
      subtotal: p.price,
      fee: SERVICE_FEE,
      total: p.price + SERVICE_FEE,
      status: 'awaiting',                      // awaiting → processing → done
      hasCredentials: state.method === 'login', // flag only; secrets are never read into state
      expiresAt: Date.now() + PAY_WINDOW_MS
    };
  }

  /* ======================================================================
     STATE 2 · PAYMENT (mock dynamic QRIS)
     ====================================================================== */

  function hashSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildQr(seed) {
    const N = 29;
    const rnd = mulberry32(hashSeed(seed));
    const inFinder = (x, y) => (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
    let rects = '';

    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (inFinder(x, y)) continue;
        if (rnd() > 0.52) rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
      }
    }

    const finder = (ox, oy) =>
      '<rect x="' + ox + '" y="' + oy + '" width="7" height="7" fill="#000"/>' +
      '<rect x="' + (ox + 1) + '" y="' + (oy + 1) + '" width="5" height="5" fill="#fff"/>' +
      '<rect x="' + (ox + 2) + '" y="' + (oy + 2) + '" width="3" height="3" fill="#000"/>';

    return '<svg viewBox="0 0 ' + N + ' ' + N + '" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
      '<rect width="' + N + '" height="' + N + '" fill="#fff"/>' +
      '<g fill="#000">' + rects + '</g>' +
      finder(0, 0) + finder(N - 7, 0) + finder(0, N - 7) +
      '</svg>';
  }

  function renderPayment() {
    const o = state.order;
    $('#qr-frame').innerHTML = buildQr(o.id);
    $('#pay-id').textContent = o.id;
    $('#pay-method').textContent = METHODS[o.method].label;
    $('#pay-account').textContent = '@' + o.account;
    $('#pay-robux').textContent = rbx(o.robux);
    $('#pay-subtotal').textContent = idr(o.subtotal);
    $('#pay-fee').textContent = idr(o.fee);
    $('#pay-total').textContent = idr(o.total);
    $('#pay-amount').textContent = idr(o.total);
  }

  function startTimer() {
    stopTimer();
    const out = $('#pay-timer');
    const tick = () => {
      const left = state.order ? state.order.expiresAt - Date.now() : 0;
      if (left <= 0) { expireOrder(); return; }
      const m = String(Math.floor(left / 60000)).padStart(2, '0');
      const s = String(Math.floor((left % 60000) / 1000)).padStart(2, '0');
      out.textContent = m + ':' + s;
      out.classList.toggle('warn', left < 60000);
    };
    tick();
    state.timerId = setInterval(tick, 1000);
  }

  function stopTimer() {
    if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
  }

  function expireOrder() {
    stopTimer();
    state.order = null;
    renderAdmin();
    setView('order');
    showNotice('Your invoice expired. Review your order and try again.');
  }

  function showNotice(msg) {
    notice.textContent = msg;
    notice.hidden = !msg;
  }

  /* ======================================================================
     STATE 3 · PROCESSING  /  STATE 4 · SUCCESS
     ====================================================================== */

  function userPaid() {
    if (!state.order || state.order.status !== 'awaiting') return;
    stopTimer();
    state.order.status = 'processing';

    const o = state.order;
    $('#proc-id').textContent = o.id;
    $('#proc-account').textContent = '@' + o.account;
    $('#proc-robux').textContent = rbx(o.robux);

    setView('processing');
    renderAdmin(true);
  }

  function adminComplete() {
    if (!state.order || state.order.status !== 'processing') return;
    state.order.status = 'done';

    const o = state.order;
    $('#success-lede').textContent = rbx(o.robux) + ' ' +
      (o.method === 'gamepass' ? 'will appear in your pending balance after Roblox releases the sale.'
                               : 'has been sent to @' + o.account + '.');
    $('#succ-id').textContent = o.id;
    $('#succ-account').textContent = '@' + o.account;
    $('#succ-robux').textContent = rbx(o.robux);
    $('#succ-total').textContent = idr(o.total);

    setView('success');
    renderAdmin();
  }

  function resetAll() {
    stopTimer();
    state.order = null;
    state.pkg = null;
    form.reset();
    $$('[data-rule]').forEach(i => showFieldError(i, ''));
    $('#pkg-error').textContent = '';
    showNotice('');
    setMethod('username');
    renderSummary();
    renderAdmin();
    setView('order');
  }

  /* ======================================================================
     ADMIN / DEBUG PANEL
     ====================================================================== */

  function renderAdmin(flash) {
    const o = state.order;
    const status = $('#admin-status');
    const dot = $('#admin-dot');
    const details = $('#admin-details');
    const btn = $('#admin-action');

    status.classList.remove('pending', 'flash');
    dot.className = 'dot';
    btn.disabled = true;

    if (!o) {
      status.textContent = 'No active orders';
      details.hidden = true;
      return;
    }

    details.hidden = false;
    $('#adm-id').textContent = o.id;
    $('#adm-method').textContent = METHODS[o.method].label;
    $('#adm-account').textContent = '@' + o.account;
    $('#adm-robux').textContent = rbx(o.robux);
    $('#adm-cred-row').hidden = !o.hasCredentials;

    if (o.status === 'awaiting') {
      status.textContent = 'Order awaiting payment';
      dot.classList.add('blue');
    } else if (o.status === 'processing') {
      status.textContent = 'New Order Pending';
      status.classList.add('pending');
      if (flash) { void status.offsetWidth; status.classList.add('flash'); }
      dot.classList.add('amber');
      btn.disabled = false;
      // Make sure the panel is visible when something needs attention.
      setAdminCollapsed(false);
    } else if (o.status === 'done') {
      status.textContent = 'Order completed';
      dot.classList.add('green');
    }
  }

  function setAdminCollapsed(collapsed) {
    $('#admin').classList.toggle('collapsed', collapsed);
    $('#admin-toggle').setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    $('#admin-collapse-label').textContent = collapsed ? 'Show' : 'Hide';
  }

  /* ======================================================================
     EVENTS
     ====================================================================== */

  // Tabs (click + arrow-key navigation)
  tabs.forEach(tab => {
    tab.addEventListener('click', () => setMethod(tab.dataset.method));
    tab.addEventListener('keydown', e => {
      const i = tabs.indexOf(tab);
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft')  next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End')  next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); setMethod(next.dataset.method, true); }
    });
  });

  // Package selection
  pkgGrid.addEventListener('change', e => {
    if (e.target.name !== 'package') return;
    state.pkg = Number(e.target.value);
    $('#pkg-error').textContent = '';
    renderSummary();
  });

  // Live inputs: clear errors as they become valid, keep summary fresh
  form.addEventListener('input', e => {
    const input = e.target;
    if (input.dataset && input.dataset.rule && input.classList.contains('invalid') && !fieldError(input)) {
      showFieldError(input, '');
    }
    renderSummary();
  });

  // Checkout
  form.addEventListener('submit', e => {
    e.preventDefault();
    showNotice('');
    if (!validateOrder()) return;

    state.order = createOrder();
    renderPayment();
    startTimer();
    setView('payment');
    renderAdmin();
  });

  // Payment actions
  $('#btn-paid').addEventListener('click', userPaid);
  $('#btn-cancel').addEventListener('click', () => {
    stopTimer();
    state.order = null;
    renderAdmin();
    setView('order');
  });

  // Success
  $('#btn-new').addEventListener('click', resetAll);

  // Admin
  $('#admin-action').addEventListener('click', adminComplete);
  $('#admin-toggle').addEventListener('click', () => {
    setAdminCollapsed(!$('#admin').classList.contains('collapsed'));
  });

  /* ======================================================================
     LEADERBOARD
     ====================================================================== */

  const LEADERBOARD_DATA = [
    { rank: 1, username: 'Builderman', transactions: 47, points: 125000 },
    { rank: 2, username: 'RobloxGamer', transactions: 38, points: 98500 },
    { rank: 3, username: 'ProPlayer', transactions: 32, points: 87200 },
    { rank: 4, username: 'TopUpKing', transactions: 28, points: 72000 },
    { rank: 5, username: 'RobuxHunter', transactions: 24, points: 65400 },
    { rank: 6, username: 'GameMaster', transactions: 21, points: 58900 },
    { rank: 7, username: 'MegaBuyer', transactions: 19, points: 51200 },
    { rank: 8, username: 'EliteGamer', transactions: 17, points: 47800 },
    { rank: 9, username: 'SpeedRunner', transactions: 15, points: 42500 },
    { rank: 10, username: 'NightOwl', transactions: 13, points: 38100 }
  ];

  function maskUsername(username) {
    if (username.length <= 3) return username;
    const visible = Math.ceil(username.length / 3);
    const masked = '*'.repeat(username.length - visible);
    return username.substring(0, visible) + masked;
  }

  function renderLeaderboard() {
    const grid = $('#leaderboard-grid');
    grid.innerHTML = '';
    
    LEADERBOARD_DATA.forEach(entry => {
      const item = document.createElement('div');
      item.className = 'leaderboard-item' + (entry.rank <= 3 ? ' top-3' : '');
      
      item.innerHTML = `
        <div class="leaderboard-rank rank-${entry.rank}">#${entry.rank}</div>
        <div class="leaderboard-user">
          <div class="leaderboard-username">${maskUsername(entry.username)}</div>
          <div class="leaderboard-transactions">${entry.transactions} transaksi</div>
        </div>
        <div class="leaderboard-points">${entry.points.toLocaleString('id-ID')} pts</div>
      `;
      
      grid.appendChild(item);
    });
  }

  /* ======================================================================
     NAVIGATION - PANDUAN PAGE
     ====================================================================== */

  function showPanduanPage() {
    $('main.container').hidden = true;
    $('.site-header').hidden = true;
    $('#panduan-page').hidden = false;
    $('.site-footer').hidden = true;
    $('#floating-cs').hidden = true;
    $('.admin').hidden = true;
    window.scrollTo({ top: 0 });
  }

  function showHomePage() {
    $('main.container').hidden = false;
    $('.site-header').hidden = false;
    $('#panduan-page').hidden = true;
    $('.site-footer').hidden = false;
    $('#floating-cs').hidden = false;
    $('.admin').hidden = false;
    window.scrollTo({ top: 0 });
  }

  $('#nav-panduan').addEventListener('click', e => {
    e.preventDefault();
    showPanduanPage();
  });

  $('#nav-home').addEventListener('click', e => {
    e.preventDefault();
    showHomePage();
  });

  $('#btn-back-panduan').addEventListener('click', showHomePage);

  /* ======================================================================
     FLOATING CS BUTTON
     ====================================================================== */

  const csToggle = $('#cs-toggle');
  const csMenu = $('#cs-menu');
  let csMenuOpen = false;

  csToggle.addEventListener('click', () => {
    csMenuOpen = !csMenuOpen;
    csMenu.hidden = !csMenuOpen;
    csToggle.setAttribute('aria-expanded', csMenuOpen);
  });

  // Close menu when clicking outside
  document.addEventListener('click', e => {
    if (!$('#floating-cs').contains(e.target) && csMenuOpen) {
      csMenuOpen = false;
      csMenu.hidden = true;
      csToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Init ---------- */

  renderPackages();
  setMethod('username');
  renderSummary();
  renderAdmin();
  renderLeaderboard();
  setView('order');
})();
