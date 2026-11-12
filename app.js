'use strict';
/* =====================================================================
   Fitcheck — Closet · Wishlist · Outfits · Planner  (vanilla JS, no build)
   Works on laptop + phone browsers. Photos: live camera or upload.
   ===================================================================== */
const TOKEN_KEY = 'fitcheck_token';
const CATS = ['Tops','Bottoms','Dresses','Outerwear','Shoes','Bags','Accessories'];
const LEGACY = { Top:'Tops', Bottom:'Bottoms', Dress:'Dresses', Accessory:'Accessories' };
const COLORS = [['#ffffff','White'],['#111111','Black'],['#7a7a7a','Grey'],['#c98b5a','Tan'],['#e8d9c0','Cream'],['#ff3d94','Pink'],['#d6455d','Red'],['#e98a2b','Orange'],['#e8c547','Yellow'],['#2e7d4f','Green'],['#6b8fff','Blue'],['#1f3a6b','Navy'],['#8b6bff','Violet']];
const SEASONS = ['All season','Summer','Winter','Monsoon'];
const OCCASIONS = ['Casual','College','Work','Party','Formal','Sport'];
const PRIORITY = { love:'Love it', want:'Want', maybe:'Maybe' };
const DEF_POS = { Tops:[28,4,44], Outerwear:[24,4,50], Dresses:[27,6,46], Bottoms:[30,38,40], Shoes:[36,76,28], Bags:[64,44,30], Accessories:[66,6,24] };

const I = {
  hanger:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7a2.5 2.5 0 1 0-2.5-2.5"/><path d="M12 7v2l9 6.2a1.3 1.3 0 0 1-.75 2.3H3.75A1.3 1.3 0 0 1 3 15.2L12 9"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-8-4.8-8-11A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8 2.7c0 6.2-8 11-8 11z"/></svg>',
  heartFill:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5s-8-4.8-8-11A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8 2.7c0 6.2-8 11-8 11z"/></svg>',
  looks:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7.5" height="9" rx="1.5"/><rect x="13" y="3.5" width="7.5" height="5.5" rx="1.5"/><rect x="13" y="11" width="7.5" height="9.5" rx="1.5"/><rect x="3.5" y="14.5" width="7.5" height="6" rx="1.5"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.6-2.5h6.8L17 8h3a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.7"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  left:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  out:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.500v13A1.5 1.5 0 0 0 5.500 20H9M16 16l4-4-4-4M20 12H9"/></svg>',
  link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  sun:'<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
  moon:'<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>',
  flip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="26" height="26"><path d="M4 12a8 8 0 0 1 13.5-5.800L20 8.500M20 4v4.500h-4.500M20 12a8 8 0 0 1-13.500 5.800L4 15.500M4 20v-4.500h4.500"/></svg>'
};

/* ---------------- theme (dark / light) ---------------- */
const THEME_KEY = 'fitcheck_theme';
const getTheme = () => document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
function applyTheme(t, animate) {
  const root = document.documentElement;
  if (animate) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 450); }
  root.setAttribute('data-theme', t);
  try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', t === 'light' ? '#f6f4fb' : '#0b0b12');
  document.querySelectorAll('.theme-toggle').forEach(b => { b.setAttribute('aria-pressed', t === 'dark'); b.title = t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'; });
}
const themeToggle = () => `<button class="theme-toggle" data-act="toggleTheme" role="switch" aria-label="Dark theme" aria-pressed="${getTheme() === 'dark'}" title="${getTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}"><span class="knob"></span>${I.sun}${I.moon}</button>`;

const state = {
  token: localStorage.getItem(TOKEN_KEY) || null, user: null,
  closet: [], wishlist: [], outfits: [], plans: [],
  tab: 'closet', authView: 'login',
  cFilter: 'All', cSearch: '', cSort: 'new',
  wFilter: 'All', wSearch: '', wSort: 'priority',
  month: new Date(new Date().getFullYear(), new Date().getMonth(), 1), selDate: null,
  draft: null, queue: [], bld: null, planDraft: null, openLookId: null,
  pendingRegistration: null, pendingReset: null, pendingOtp: null
};

/* ---------------- helpers ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayStr = () => ymd(new Date());
const fmtLong = s => new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });
const money = n => (n || n === 0) && n !== '' ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '';
const normCat = c => LEGACY[c] || (CATS.includes(c) ? c : 'Tops');
const normUrl = u => { u = (u || '').trim(); if (!u) return ''; return /^https?:\/\//i.test(u) ? u : 'https://' + u; };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }

async function api(path, opts = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  if (state.token) headers.Authorization = 'Bearer ' + state.token;
  if (opts.body && typeof opts.body !== 'string') opts.body = JSON.stringify(opts.body);
  const res = await fetch(path, Object.assign({}, opts, { headers }));
  let data = null; try { data = await res.json(); } catch (e) {}
  if (!res.ok) throw new Error((data && data.message) || 'Something went wrong');
  return data;
}
const fixItem = i => ({ ...i, category: normCat(i.category) });
async function loadAll() {
  const [c, w, o, p] = await Promise.all([api('/api/clothing'), api('/api/wishlist'), api('/api/outfits'), api('/api/wear')]);
  state.closet = c.map(fixItem); state.wishlist = w.map(fixItem); state.outfits = o; state.plans = p;
}
const findItem = (src, id) => (src === 'wishlist' ? state.wishlist : state.closet).find(i => i.id === id);

/* wear tracking: an entry counts as "worn" if flagged worn, or (legacy entries) dated today/earlier */
const isWorn = p => p.worn === true || (p.worn === undefined && p.date <= todayStr());
function planItemIds(p) {
  if (p.itemIds && p.itemIds.length) return p.itemIds;
  const o = state.outfits.find(x => x.id === p.outfitId); return o ? (o.itemIds || []) : [];
}
function wearCounts() { const m = {}; state.plans.filter(isWorn).forEach(p => planItemIds(p).forEach(id => { m[id] = (m[id] || 0) + 1; })); return m; }

/* ---------------- images: resize, camera, upload, cut-out ---------------- */
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Could not read that image')); i.src = src; }); }
async function resizeImage(src, max = 900, q = .82) {
  const img = await loadImg(src);
  const s = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', q);
}
function fileToImage(file) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => resizeImage(r.result).then(res, rej); r.onerror = () => rej(new Error('Could not read file')); r.readAsDataURL(file); });
}
function pickFiles(multiple, cb, capture) {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = !!multiple;
  if (capture) inp.setAttribute('capture', 'environment');
  inp.onchange = async () => {
    const files = [...inp.files]; if (!files.length) return;
    try { toast('Processing photo…'); cb(await Promise.all(files.map(fileToImage))); } catch (e) { toast(e.message); }
  };
  inp.click();
}
/* Live in-page camera (getUserMedia). Needs HTTPS or localhost — otherwise falls back to the phone's native camera app. */
async function openCamera(onPhoto) {
  const live = window.isSecureContext && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  if (!live) { toast('Opening your camera app…'); return pickFiles(false, a => onPhoto(a[0]), true); }
  const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  let facing = mobile ? 'environment' : 'user', stream = null;
  const wrap = document.createElement('div'); wrap.className = 'cam';
  wrap.innerHTML = `<div class="cam-top"><span>Snap your piece</span><button data-c="close">Close</button></div>
    <video playsinline muted autoplay></video><div class="cam-guide"></div>
    <img class="shot" alt="Captured photo" style="display:none">
    <div class="cam-bar" data-bar="live"><button data-c="flip" aria-label="Switch camera">${I.flip}</button><button class="shutter" data-c="snap" aria-label="Take photo"></button><button data-c="gallery">Upload</button></div>
    <div class="cam-bar" data-bar="review" style="display:none"><button data-c="retake">Retake</button><button data-c="use">Use photo</button></div>`;
  document.body.appendChild(wrap);
  const video = $('video', wrap), shot = $('.shot', wrap), guide = $('.cam-guide', wrap);
  let data = null;
  const stop = () => { if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; };
  const close = () => { stop(); wrap.remove(); };
  async function start() {
    stop();
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: facing }, width: { ideal: 1600 }, height: { ideal: 1600 } }, audio: false });
      video.srcObject = stream; await video.play();
    } catch (e) { close(); toast('Camera blocked or unavailable — choose a photo instead'); pickFiles(false, a => onPhoto(a[0]), true); }
  }
  const show = review => {
    $('[data-bar=live]', wrap).style.display = review ? 'none' : 'flex'; $('[data-bar=review]', wrap).style.display = review ? 'flex' : 'none';
    video.style.display = review ? 'none' : 'block'; guide.style.display = review ? 'none' : 'block'; shot.style.display = review ? 'block' : 'none';
  };
  wrap.onclick = async e => {
    const b = e.target.closest('[data-c]'); if (!b) return; const c = b.dataset.c;
    if (c === 'close') close();
    else if (c === 'flip') { facing = facing === 'user' ? 'environment' : 'user'; start(); }
    else if (c === 'gallery') { close(); pickFiles(true, a => onPhoto(a[0], a.slice(1))); }
    else if (c === 'snap') {
      if (!video.videoWidth) return;
      const cv = document.createElement('canvas'); cv.width = video.videoWidth; cv.height = video.videoHeight;
      cv.getContext('2d').drawImage(video, 0, 0);
      data = await resizeImage(cv.toDataURL('image/jpeg', .92)); shot.src = data; show(true);
    }
    else if (c === 'retake') { data = null; show(false); }
    else if (c === 'use') { close(); onPhoto(data); }
  };
  show(false); start();
}
/* Simple background clean-up for photos shot on a plain/white surface: flood-fills from the edges. */
async function cutout(src) {
  const img = await loadImg(src);
  const s = Math.min(1, 720 / Math.max(img.width, img.height));
  const w = Math.round(img.width * s), h = Math.round(img.height * s);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, w, h);
  const im = x.getImageData(0, 0, w, h), d = im.data;
  let r = 0, g = 0, b = 0, n = 0;
  [[0,0],[w-8,0],[0,h-8],[w-8,h-8]].forEach(([px,py]) => { for (let yy = 0; yy < 8; yy++) for (let xx = 0; xx < 8; xx++) { const k = ((py+yy)*w + px+xx)*4; r += d[k]; g += d[k+1]; b += d[k+2]; n++; } });
  r /= n; g /= n; b /= n;
  const tol = 52, near = k => { const dr = d[k]-r, dg = d[k+1]-g, db = d[k+2]-b; return Math.sqrt(dr*dr + dg*dg + db*db) < tol; };
  const seen = new Uint8Array(w*h), stack = new Int32Array(w*h); let sp = 0;
  const push = (px, py) => { const i = py*w + px; if (!seen[i] && near(i*4)) { seen[i] = 1; stack[sp++] = i; } };
  for (let i = 0; i < w; i++) { push(i, 0); push(i, h-1); } for (let j = 0; j < h; j++) { push(0, j); push(w-1, j); }
  while (sp) { const i = stack[--sp], px = i % w, py = (i / w) | 0; d[i*4+3] = 0; if (px > 0) push(px-1, py); if (px < w-1) push(px+1, py); if (py > 0) push(px, py-1); if (py < h-1) push(px, py+1); }
  x.putImageData(im, 0, 0);
  return c.toDataURL('image/png');
}

/* ---------------- modal ---------------- */
function openModal(html, wide) {
  $('#modal').innerHTML = `<div class="overlay" data-act="overlay"><div class="sheet ${wide ? 'wide' : ''}" role="dialog" aria-modal="true"><button class="icon-btn x" data-act="closeModal" aria-label="Close">${I.x}</button>${html}</div></div>`;
}
function closeModal() { $('#modal').innerHTML = ''; state.draft = null; state.queue = []; state.bld = null; state.planDraft = null; state.openLookId = null; }

/* ---------------- shared pieces ---------------- */
const isPng = img => (img || '').startsWith('data:image/png');
function thumb(i, extra = '') {
  return `<div class="thumb ${isPng(i.image) ? 'contain' : ''}">${i.image ? `<img src="${esc(i.image)}" alt="${esc(i.name)}" loading="lazy">` : `<div class="ph" style="background:${esc(i.color || '#ddd')}"></div>`}${extra}</div>`;
}
function autoPos(n) {
  const L = { 1:[[17,10,66]], 2:[[22,3,56],[22,50,56]], 3:[[4,4,48],[48,22,48],[27,58,46]], 4:[[4,4,44],[52,4,44],[4,50,44],[52,50,44]] };
  if (n <= 4) return L[n] || [];
  const rows = Math.ceil(n / 3); return Array.from({ length: n }, (_, i) => [2 + (i % 3) * 33, 3 + ((i / 3) | 0) * (94 / rows), 30]);
}
const autoFrom = items => { const p = autoPos(items.length); return items.map((item, i) => ({ item, x: p[i][0], y: p[i][1], w: p[i][2] })); };
function outfitEntries(o) {
  let list = [];
  if (o.layout && o.layout.length) list = o.layout.map(l => ({ item: findItem(l.src, l.id), x: l.x, y: l.y, w: l.w, z: l.z, wl: l.src === 'wishlist' })).filter(e => e.item);
  if (!list.length) list = autoFrom((o.itemIds || []).map(id => findItem('closet', id)).filter(Boolean));
  return list;
}
function planEntries(p) {
  const o = state.outfits.find(x => x.id === p.outfitId);
  if (o) return outfitEntries(o);
  return autoFrom(planItemIds(p).map(id => findItem('closet', id)).filter(Boolean));
}
function collage(list, cls = '') {
  if (!list.length) return `<div class="collage ${cls}"><div class="none">No pieces</div></div>`;
  return `<div class="collage ${cls}">${list.map(e => e.item.image
    ? `<img src="${esc(e.item.image)}" alt="" class="${e.wl ? 'dashed' : ''}" style="left:${e.x}%;top:${e.y}%;width:${e.w}%;z-index:${e.z || 1}">`
    : `<div class="cph" style="left:${e.x}%;top:${e.y}%;width:${e.w}%;aspect-ratio:1;background:${esc(e.item.color || '#ccc')};z-index:${e.z || 1}"></div>`).join('')}</div>`;
}
const tabsHtml = (cur, items, act, counts) => ['All', ...items].map(c => `<button class="chip ${cur === c ? 'active' : ''}" data-act="${act}" data-v="${esc(c)}">${esc(c)}${counts ? `<small>${counts[c] || 0}</small>` : ''}</button>`).join('');

/* ---------------- shell / router ---------------- */
const NAV = [['closet','Closet','hanger'],['wishlist','Wishlist','heart'],['outfits','Outfits','looks'],['planner','Planner','cal'],['stats','Stats','chart']];
function render() {
  const root = $('#root');
  if (!state.token || !state.user) { root.innerHTML = renderAuth(); return; }
  const nav = NAV.map(([k, l, ic]) => `<button class="navbtn ${state.tab === k ? 'active' : ''}" data-act="nav" data-v="${k}" aria-label="${l}">${I[ic]}<span>${l}</span></button>`).join('');
  root.innerHTML = `<div class="shell"><aside class="side"><div class="brand">fit<i>check</i></div><nav class="nav">${nav}</nav>
    <div class="side-theme"><span>Theme</span>${themeToggle()}</div>
    <div class="side-foot"><div class="avatar">${esc((state.user.name.trim()[0] || 'U').toUpperCase())}</div><div class="who">${esc(state.user.name)}</div><button class="icon-btn" data-act="logout" title="Log out" aria-label="Log out">${I.out}</button></div></aside>
    <main class="main"><div class="mtop"><div class="brand">fit<i>check</i></div><div class="row">${themeToggle()}<button class="icon-btn" data-act="logout" aria-label="Log out">${I.out}</button></div></div><div id="view"></div></main></div>`;
  renderView();
}
function renderView() {
  document.querySelectorAll('.navbtn').forEach(b => b.classList.toggle('active', b.dataset.v === state.tab));
  const v = $('#view'); if (!v) return;
  v.innerHTML = { closet: viewCloset, wishlist: viewWishlist, outfits: viewOutfits, planner: viewPlanner, stats: viewStats }[state.tab]();
  if (state.tab === 'closet') renderClosetGrid(); if (state.tab === 'wishlist') renderWishGrid();
}

/* ---------------- AUTH ---------------- */
function renderAuth() {
  const v = state.authView;
  const wrap = inner => `<div class="auth-theme">${themeToggle()}</div><div class="auth"><div class="auth-card"><div class="brand">fit<i>check</i></div>${inner}</div></div>`;
  const otp = `<div class="otp">Demo mode — in production this code arrives by SMS/email.<br>Your code: <strong>${esc(state.pendingOtp)}</strong></div>`;
  if (v === 'register') return wrap(`<h1>Create your account</h1><p class="sub" style="margin-bottom:18px">Your closet, wishlist and planner in one place.</p>
    <div class="field"><label>Name</label><input type="text" id="rName" autocomplete="name"></div>
    <div class="field"><label>Email</label><input type="email" id="rEmail" autocomplete="email"></div>
    <div class="two"><div class="field"><label>Password</label><input type="password" id="rPass" autocomplete="new-password" placeholder="6+ characters"></div>
    <div class="field"><label>Confirm</label><input type="password" id="rPass2" autocomplete="new-password"></div></div>
    <button class="btn block" data-act="doRegister">Continue</button><p class="center">Have an account? <button class="link" data-act="goLogin">Log in</button></p>`);
  if (v === 'verify2fa') return wrap(`<h1>Verify it’s you</h1><p class="sub" style="margin-bottom:18px">Enter the 6-digit code for ${esc(state.pendingRegistration?.email)}.</p>${otp}
    <div class="field"><label>6-digit code</label><input type="text" id="otpInput" maxlength="6" inputmode="numeric" placeholder="000000"></div>
    <button class="btn block" data-act="confirmOtp">Verify &amp; create account</button><p class="center"><button class="link" data-act="goRegister">Back</button></p>`);
  if (v === 'forgot') return wrap(`<h1>Reset password</h1><p class="sub" style="margin-bottom:18px">Enter the email on your account.</p>
    <div class="field"><label>Email</label><input type="email" id="fgEmail"></div><button class="btn block" data-act="sendReset">Send reset code</button>
    <p class="center"><button class="link" data-act="goLogin">Back to login</button></p>`);
  if (v === 'resetOtp') return wrap(`<h1>Enter reset code</h1><p class="sub" style="margin-bottom:18px">Sent to ${esc(state.pendingReset?.email)}.</p>${otp}
    <div class="field"><label>6-digit code</label><input type="text" id="rotpInput" maxlength="6" inputmode="numeric" placeholder="000000"></div>
    <button class="btn block" data-act="confirmResetOtp">Verify code</button><p class="center"><button class="link" data-act="goLogin">Back to login</button></p>`);
  if (v === 'resetPassword') return wrap(`<h1>New password</h1><p class="sub" style="margin-bottom:18px">Choose a new password.</p>
    <div class="field"><label>New password</label><input type="password" id="npPass"></div><div class="field"><label>Confirm</label><input type="password" id="npPass2"></div>
    <button class="btn block" data-act="saveNewPassword">Save new password</button>`);
  return wrap(`<h1>Welcome back</h1><p class="sub" style="margin-bottom:18px">Log in to your wardrobe.</p>
    <div class="field"><label>Email</label><input type="email" id="liEmail" autocomplete="email"></div>
    <div class="field"><label>Password</label><input type="password" id="liPass" autocomplete="current-password"></div>
    <p style="text-align:right;margin:-4px 0 14px"><button class="link" data-act="goForgot">Forgot password?</button></p>
    <button class="btn block" data-act="doLogin">Log in</button><p class="center">New here? <button class="link" data-act="goRegister">Create an account</button></p>`);
}
function setSession(token, user) { state.token = token; state.user = user; localStorage.setItem(TOKEN_KEY, token); }

/* ---------------- CLOSET ---------------- */
function closetWorth() { return state.closet.reduce((s, i) => s + (Number(i.price) || 0), 0); }
function viewCloset() {
  return `<div class="page-head"><div><h1 class="page">Closet</h1><p class="sub">${state.closet.length} piece${state.closet.length === 1 ? '' : 's'}${closetWorth() ? ' · worth ' + money(closetWorth()) : ''}</p></div>
    <div class="row"><input type="text" class="search" id="cSearch" placeholder="Search closet" value="${esc(state.cSearch)}">
    <select id="cSort" style="width:auto"><option value="new">Newest</option><option value="worn">Most worn</option><option value="least">Least worn</option><option value="name">Name A–Z</option></select>
    <button class="btn" data-act="addPiece">${I.plus} Add piece</button></div></div>
    <div class="tabs" id="cTabs"></div><div class="grid" id="cGrid"></div>`;
}
function renderClosetGrid() {
  const counts = { All: state.closet.length }; CATS.forEach(c => counts[c] = state.closet.filter(i => i.category === c).length);
  $('#cTabs').innerHTML = tabsHtml(state.cFilter, CATS, 'cFilter', counts); $('#cSort').value = state.cSort;
  const wears = wearCounts(), q = state.cSearch.trim().toLowerCase();
  let items = state.closet.filter(i => (state.cFilter === 'All' || i.category === state.cFilter) && (!q || `${i.name} ${i.brand || ''} ${i.category}`.toLowerCase().includes(q)));
  const by = { new: (a, b) => b.createdAt - a.createdAt, worn: (a, b) => (wears[b.id] || 0) - (wears[a.id] || 0), least: (a, b) => (wears[a.id] || 0) - (wears[b.id] || 0), name: (a, b) => a.name.localeCompare(b.name) };
  items.sort(by[state.cSort]);
  const add = `<button class="addcard" data-act="addPiece"><div>${I.plus}Add piece</div></button>`;
  $('#cGrid').innerHTML = (state.closet.length ? '' : '') + add + items.map(i => `<div class="card item" data-act="openItem" data-id="${i.id}">${thumb(i)}<div class="meta"><div class="nm">${esc(i.name)}</div><div class="sb">${esc([i.brand, (wears[i.id] || 0) + ' wear' + ((wears[i.id] || 0) === 1 ? '' : 's')].filter(Boolean).join(' · '))}</div></div></div>`).join('');
}

/* add / edit form (closet + wishlist share it) */
function newDraft(kind, image) {
  return { kind, id: null, image: image || null, name: '', category: kind === 'closet' && state.cFilter !== 'All' ? state.cFilter : (kind === 'wishlist' && state.wFilter !== 'All' ? state.wFilter : 'Tops'),
    color: '#111111', brand: '', price: '', season: 'All season', occasion: 'Casual', notes: '', link: '', priority: 'want' };
}
function openForm(kind, item, image) {
  if (item) state.draft = { kind, id: item.id, image: item.image || null, name: item.name || '', category: normCat(item.category), color: item.color || '#111111', brand: item.brand || '', price: item.price ?? '', season: item.season || 'All season', occasion: item.occasion || 'Casual', notes: item.notes || '', link: item.link || '', priority: item.priority || 'want' };
  else state.draft = newDraft(kind, image);
  showForm();
}
function photoField(d) {
  return `<div class="photo">${d.image ? `<img src="${esc(d.image)}" alt="Selected photo">` : `<div>${I.camera}<div>Add a photo of your ${d.kind === 'wishlist' ? 'wish' : 'piece'}</div></div>`}</div>
  <div class="photo-btns"><button class="btn ghost" data-act="formCamera">${I.camera} Take photo</button><button class="btn ghost" data-act="formUpload">${I.upload} Upload</button></div>
  ${d.image ? `<div class="row" style="margin:-6px 0 14px"><button class="btn ghost sm" data-act="formCutout">Remove plain background</button><button class="btn ghost sm" data-act="formClearPhoto">Remove photo</button></div>` : ''}
  ${state.queue.length ? `<div class="queue">${state.queue.length} more photo${state.queue.length > 1 ? 's' : ''} queued — they’ll open one by one after you save.</div>` : ''}`;
}
function showForm() {
  const d = state.draft, wl = d.kind === 'wishlist';
  const cat = CATS.map(c => `<option ${d.category === c ? 'selected' : ''}>${c}</option>`).join('');
  const sw = COLORS.map(([h, n]) => `<button class="sw ${d.color === h ? 'sel' : ''}" data-act="swatch" data-v="${h}" style="background:${h}" title="${n}" aria-label="${n}"></button>`).join('');
  const seas = SEASONS.map(s => `<option ${d.season === s ? 'selected' : ''}>${s}</option>`).join('');
  const occ = OCCASIONS.map(s => `<option ${d.occasion === s ? 'selected' : ''}>${s}</option>`).join('');
  const pr = Object.entries(PRIORITY).map(([k, l]) => `<button class="${d.priority === k ? 'on' : ''}" data-act="setPriority" data-v="${k}">${l}</button>`).join('');
  openModal(`<h2>${d.id ? 'Edit' : 'Add'} ${wl ? 'wishlist item' : 'piece'}</h2><p class="sub" style="margin-bottom:16px">${wl ? 'Save things you want to buy — then try them in outfits.' : 'Snap it or upload it, then tag it.'}</p>
    ${photoField(d)}
    <div class="field"><label>Name</label><input type="text" id="fName" placeholder="${wl ? 'e.g. Linen co-ord set' : 'e.g. Oversized denim jacket'}" value="${esc(d.name)}"></div>
    <div class="two"><div class="field"><label>Category</label><select id="fCat">${cat}</select></div><div class="field"><label>Brand</label><input type="text" id="fBrand" value="${esc(d.brand)}"></div></div>
    <div class="two"><div class="field"><label>Price (₹)</label><input type="number" id="fPrice" inputmode="decimal" min="0" value="${esc(d.price)}"></div>
    ${wl ? `<div class="field"><label>Priority</label><div class="seg" style="grid-template-columns:repeat(3,1fr)">${pr}</div></div>` : `<div class="field"><label>Season</label><select id="fSeason">${seas}</select></div>`}</div>
    ${wl ? `<div class="field"><label>Product link</label><input type="url" id="fLink" placeholder="https://…" value="${esc(d.link)}"></div>` : `<div class="field"><label>Occasion</label><select id="fOcc">${occ}</select></div>`}
    <div class="field"><label>Colour</label><div class="swrow">${sw}</div></div>
    <div class="field"><label>Notes</label><textarea id="fNotes" placeholder="Size, where you saw it, styling ideas…">${esc(d.notes)}</textarea></div>
    <div class="row" style="justify-content:flex-end"><button class="btn ghost" data-act="closeModal">Cancel</button>${!d.id ? `<button class="btn ghost" data-act="saveItemAnother">Save &amp; add another</button>` : ''}<button class="btn" data-act="saveItem">${d.id ? 'Save changes' : (wl ? 'Add to wishlist' : 'Save piece')}</button></div>`);
}
function syncDraft() {
  const d = state.draft; if (!d) return;
  const g = id => { const e = document.getElementById(id); return e ? e.value : undefined; };
  ['Name:name','Cat:category','Brand:brand','Price:price','Season:season','Occ:occasion','Notes:notes','Link:link'].forEach(p => { const [k, f] = p.split(':'); const v = g('f' + k); if (v !== undefined) d[f] = v; });
}
let busy = false;
async function saveDraft(another) {
  if (busy) return; syncDraft(); const d = state.draft;
  if (!d.name.trim()) { toast('Give it a name first'); return; }
  const wl = d.kind === 'wishlist';
  const body = { name: d.name.trim(), category: d.category, color: d.color, brand: d.brand.trim(), price: d.price === '' ? null : Number(d.price), season: d.season, occasion: d.occasion, image: d.image || null, notes: d.notes || '' };
  if (wl) { body.link = normUrl(d.link); body.priority = d.priority; }
  const base = wl ? '/api/wishlist' : '/api/clothing', list = wl ? 'wishlist' : 'closet';
  busy = true;
  try {
    if (d.id) { const it = fixItem(await api(`${base}/${d.id}`, { method: 'PUT', body })); state[list] = state[list].map(x => x.id === d.id ? it : x); toast('Saved'); closeModal(); }
    else {
      state[list].push(fixItem(await api(base, { method: 'POST', body })));
      if (state.queue.length) { const next = state.queue.shift(); const left = state.queue.length; state.draft = newDraft(d.kind, next); state.draft.category = d.category; toast(`Saved · ${left + 1} more photo${left ? 's' : ''} to tag`); showForm(); renderView(); busy = false; return; }
      if (another) { state.draft = newDraft(d.kind); state.draft.category = d.category; toast('Saved — add the next one'); showForm(); }
      else { toast(wl ? 'Added to wishlist' : 'Added to closet'); closeModal(); }
    }
    renderView();
  } catch (e) { toast(e.message); }
  busy = false;
}

/* item detail */
function openItem(id) {
  const i = findItem('closet', id); if (!i) return;
  const wears = wearCounts()[id] || 0, cpw = wears && i.price ? money(i.price / wears) : '—';
  openModal(`<div class="detail"><div class="card">${thumb(i)}</div><div><h2>${esc(i.name)}</h2><p class="sub">${esc([i.brand, i.category].filter(Boolean).join(' · '))}</p>
    <dl class="dl"><dt>Season</dt><dd>${esc(i.season || '—')}</dd><dt>Occasion</dt><dd>${esc(i.occasion || '—')}</dd><dt>Price</dt><dd>${money(i.price) || '—'}</dd><dt>Worn</dt><dd>${wears} time${wears === 1 ? '' : 's'}</dd><dt>Cost per wear</dt><dd>${cpw}</dd></dl>
    ${i.notes ? `<p class="sub" style="margin-bottom:14px">${esc(i.notes)}</p>` : ''}
    <div class="row"><button class="btn" data-act="wearToday" data-id="${i.id}">${I.check} Wore it today</button><button class="btn ghost" data-act="planPiece" data-id="${i.id}">${I.cal} Plan it</button></div>
    <div class="row" style="margin-top:10px"><button class="btn ghost sm" data-act="editItem" data-id="${i.id}">Edit</button><button class="btn danger sm" data-act="deleteItem" data-id="${i.id}">Delete</button></div></div></div>`, true);
}

/* ---------------- WISHLIST ---------------- */
function viewWishlist() {
  const total = state.wishlist.reduce((s, i) => s + (Number(i.price) || 0), 0);
  return `<div class="page-head"><div><h1 class="page">Wishlist</h1><p class="sub">${state.wishlist.length} item${state.wishlist.length === 1 ? '' : 's'}${total ? ' · ' + money(total) + ' total' : ''}</p></div>
    <div class="row"><input type="text" class="search" id="wSearch" placeholder="Search wishlist" value="${esc(state.wSearch)}">
    <select id="wSort" style="width:auto"><option value="priority">Priority</option><option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select>
    <button class="btn" data-act="addWish">${I.plus} Add to wishlist</button></div></div>
    <div class="tabs" id="wTabs"></div><div class="grid" id="wGrid"></div>`;
}
function renderWishGrid() {
  const counts = { All: state.wishlist.length }; CATS.forEach(c => counts[c] = state.wishlist.filter(i => i.category === c).length);
  $('#wTabs').innerHTML = tabsHtml(state.wFilter, CATS, 'wFilter', counts); $('#wSort').value = state.wSort;
  const q = state.wSearch.trim().toLowerCase(), rank = { love: 0, want: 1, maybe: 2 };
  let items = state.wishlist.filter(i => (state.wFilter === 'All' || i.category === state.wFilter) && (!q || `${i.name} ${i.brand || ''}`.toLowerCase().includes(q)));
  const by = { priority: (a, b) => (rank[a.priority] ?? 1) - (rank[b.priority] ?? 1) || b.createdAt - a.createdAt, new: (a, b) => b.createdAt - a.createdAt, low: (a, b) => (a.price ?? 1e12) - (b.price ?? 1e12), high: (a, b) => (b.price ?? -1) - (a.price ?? -1) };
  items.sort(by[state.wSort]);
  const add = `<button class="addcard" data-act="addWish"><div>${I.plus}Add to wishlist</div></button>`;
  $('#wGrid').innerHTML = add + items.map(i => {
    const p = i.priority || 'want';
    return `<div class="card item" data-act="openWish" data-id="${i.id}">${thumb(i, `<span class="badge ${p}">${PRIORITY[p]}</span>${p === 'love' ? `<span class="heart">${I.heartFill}</span>` : ''}`)}
    <div class="meta"><div class="nm">${esc(i.name)}</div><div class="sb">${esc([i.brand, money(i.price)].filter(Boolean).join(' · ') || i.category)}</div>
    <div class="row" style="margin-top:9px;gap:6px"><button class="btn sm" data-act="bought" data-id="${i.id}">${I.check} Bought it</button>${i.link ? `<a class="btn ghost sm" href="${esc(i.link)}" target="_blank" rel="noopener noreferrer" data-stop="1">${I.link} Shop</a>` : ''}</div></div></div>`;
  }).join('');
}
function openWish(id) {
  const i = findItem('wishlist', id); if (!i) return; const p = i.priority || 'want';
  openModal(`<div class="detail"><div class="card">${thumb(i, `<span class="badge ${p}">${PRIORITY[p]}</span>`)}</div><div><h2>${esc(i.name)}</h2><p class="sub">${esc([i.brand, i.category].filter(Boolean).join(' · '))}</p>
    <dl class="dl"><dt>Price</dt><dd>${money(i.price) || '—'}</dd><dt>Priority</dt><dd>${PRIORITY[p]}</dd>${i.link ? `<dt>Link</dt><dd><a href="${esc(i.link)}" target="_blank" rel="noopener noreferrer">${esc(i.link.replace(/^https?:\/\/(www\.)?/, '').slice(0, 30))}</a></dd>` : ''}</dl>
    ${i.notes ? `<p class="sub" style="margin-bottom:14px">${esc(i.notes)}</p>` : ''}
    <div class="row"><button class="btn" data-act="bought" data-id="${i.id}">${I.check} I bought it</button><button class="btn ghost" data-act="tryWish" data-id="${i.id}">${I.looks} Style it</button></div>
    <div class="row" style="margin-top:10px"><button class="btn ghost sm" data-act="editWish" data-id="${i.id}">Edit</button><button class="btn danger sm" data-act="deleteWish" data-id="${i.id}">Remove</button></div></div></div>`, true);
}

/* ---------------- OUTFITS (collage builder) ---------------- */
function viewOutfits() {
  const cards = state.outfits.slice().sort((a, b) => b.createdAt - a.createdAt).map(o => `<div class="card item" data-act="openLook" data-id="${o.id}">${collage(outfitEntries(o))}<div class="meta"><div class="nm">${esc(o.name)}</div><div class="sb">${esc(o.occasion || '')}${(o.layout || []).some(l => l.src === 'wishlist') ? ' · with wishlist' : ''}</div></div></div>`).join('');
  return `<div class="page-head"><div><h1 class="page">Outfits</h1><p class="sub">${state.outfits.length} saved look${state.outfits.length === 1 ? '' : 's'} — build collages from your closet and wishlist.</p></div>
    <button class="btn" data-act="newLook">${I.plus} Create outfit</button></div>
    ${state.outfits.length ? `<div class="grid">${cards}</div>` : `<div class="empty"><h3>No outfits yet</h3>Style pieces from your closet — or try wishlist items before you buy.<br><br><button class="btn" data-act="newLook">${I.plus} Create your first outfit</button></div>`}`;
}
function openLook(id) {
  const o = state.outfits.find(x => x.id === id); if (!o) return; state.openLookId = id;
  const names = outfitEntries(o).map(e => esc(e.item.name) + (e.wl ? ' <small>(wishlist)</small>' : '')).join(', ');
  openModal(`<div class="detail"><div class="card">${collage(outfitEntries(o))}</div><div><h2>${esc(o.name)}</h2><p class="sub">${esc(o.occasion || '')}</p><p style="margin:14px 0">${names || 'No pieces'}</p>
    <div class="row"><button class="btn" data-act="planLook" data-id="${o.id}">${I.cal} Plan it</button><button class="btn ghost" data-act="editLook" data-id="${o.id}">Edit</button></div>
    <div class="row" style="margin-top:10px"><button class="btn danger sm" data-act="deleteLook" data-id="${o.id}">Delete outfit</button></div></div></div>`, true);
}
function openBuilder(o, preset) {
  state.bld = { id: o ? o.id : null, name: o ? o.name : '', occasion: o ? (o.occasion || 'Casual') : 'Casual', items: [], sel: null, cat: 'All', wl: false, z: 1 };
  if (o) { outfitEntries(o).forEach(e => state.bld.items.push({ uid: ++state.bld.z, src: e.wl ? 'wishlist' : 'closet', id: e.item.id, x: e.x, y: e.y, w: e.w, z: e.z || state.bld.z })); if (state.bld.items.some(i => i.src === 'wishlist')) state.bld.wl = true; }
  if (preset) { state.bld.wl = preset.src === 'wishlist'; addToCanvas(preset.src, preset.id); }
  const occ = OCCASIONS.map(s => `<option ${state.bld.occasion === s ? 'selected' : ''}>${s}</option>`).join('');
  openModal(`<h2>${o ? 'Edit outfit' : 'Create outfit'}</h2><p class="sub" style="margin-bottom:16px">Tap pieces to add them, drag to arrange. Dashed outline = wishlist item.</p>
    <div class="builder"><div class="canvas-wrap"><div class="canvas" id="bCanvas"></div><div class="tools" id="bTools"></div></div>
    <div><div class="two"><div class="field"><label>Outfit name</label><input type="text" id="bName" placeholder="e.g. Friday college fit" value="${esc(state.bld.name)}"></div><div class="field"><label>Occasion</label><select id="bOcc">${occ}</select></div></div>
    <div class="row" style="justify-content:space-between;margin-bottom:10px"><div class="tabs" id="bTabs" style="margin:0;flex:1"></div></div>
    <label class="toggle" style="margin-bottom:12px"><input type="checkbox" id="bWl" ${state.bld.wl ? 'checked' : ''}> Include wishlist items</label>
    <div class="picker" id="bPicker"></div>
    <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn ghost" data-act="closeModal">Cancel</button><button class="btn" data-act="saveLook">Save outfit</button></div></div></div>`, true);
  refreshBuilder();
}
function addToCanvas(src, id) {
  const b = state.bld, ex = b.items.findIndex(i => i.src === src && i.id === id);
  if (ex >= 0) { if (b.sel === b.items[ex].uid) b.sel = null; b.items.splice(ex, 1); return; }
  const it = findItem(src, id); if (!it) return;
  const [x, y, w] = DEF_POS[it.category] || [30, 30, 36];
  b.items.push({ uid: ++b.z, src, id, x, y, w, z: b.z }); b.sel = b.z;
}
function refreshBuilder() {
  const b = state.bld; if (!b) return;
  $('#bCanvas').innerHTML = b.items.length ? b.items.map(it => {
    const item = findItem(it.src, it.id); if (!item) return '';
    return `<div class="cv ${b.sel === it.uid ? 'sel' : ''} ${it.src === 'wishlist' ? 'wl' : ''}" data-uid="${it.uid}" style="left:${it.x}%;top:${it.y}%;width:${it.w}%;z-index:${it.z}">${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.name)}" draggable="false">` : `<div class="cph" style="background:${esc(item.color || '#ccc')}"></div>`}</div>`;
  }).join('') : `<div class="canvas-hint">Tap pieces on the right to start styling.<br>Drag them around to arrange.</div>`;
  $('#bTabs').innerHTML = tabsHtml(b.cat, CATS, 'bCat');
  const pool = [...state.closet.map(i => ({ ...i, src: 'closet' })), ...(b.wl ? state.wishlist.map(i => ({ ...i, src: 'wishlist' })) : [])].filter(i => b.cat === 'All' || i.category === b.cat);
  $('#bPicker').innerHTML = pool.length ? pool.map(i => `<button class="pick ${b.items.some(x => x.src === i.src && x.id === i.id) ? 'on' : ''}" data-act="bPick" data-src="${i.src}" data-id="${i.id}" title="${esc(i.name)}">${thumb(i)}${i.src === 'wishlist' ? `<span class="wlmark">${I.heartFill}</span>` : ''}</button>`).join('')
    : `<p class="sub" style="grid-column:1/-1">Nothing here yet — add pieces to your closet${b.wl ? '' : ' or turn on wishlist items'}.</p>`;
  refreshTools();
}
function refreshTools() {
  const b = state.bld; if (!b) return; const has = b.sel && b.items.some(i => i.uid === b.sel);
  $('#bTools').innerHTML = has ? `<button class="btn ghost sm" data-act="bSize" data-v="-5">− Smaller</button><button class="btn ghost sm" data-act="bSize" data-v="5">+ Bigger</button><button class="btn ghost sm" data-act="bFront">Bring front</button><button class="btn ghost sm" data-act="bBack">Send back</button><button class="btn danger sm" data-act="bRemove">Remove</button>`
    : (b.items.length ? `<button class="btn ghost sm" data-act="bClear">Clear all</button>` : '');
}
async function saveLook() {
  const b = state.bld, name = $('#bName').value.trim(), occasion = $('#bOcc').value;
  if (!name) { toast('Name your outfit'); return; } if (!b.items.length) { toast('Add at least one piece'); return; }
  const body = { name, occasion, itemIds: [...new Set(b.items.filter(i => i.src === 'closet').map(i => i.id))],
    layout: b.items.map(i => ({ src: i.src, id: i.id, x: +i.x.toFixed(1), y: +i.y.toFixed(1), w: +i.w.toFixed(1), z: i.z })) };
  const o = b.id ? await api('/api/outfits/' + b.id, { method: 'PUT', body }) : await api('/api/outfits', { method: 'POST', body });
  if (b.id) state.outfits = state.outfits.map(x => x.id === b.id ? o : x); else state.outfits.push(o);
  toast('Outfit saved'); closeModal(); renderView();
}
/* drag pieces around the canvas (mouse, touch, pen) */
let drag = null;
document.addEventListener('pointerdown', e => {
  const cv = e.target.closest('.cv'); if (!cv || !state.bld) return;
  const it = state.bld.items.find(i => i.uid == cv.dataset.uid); if (!it) return;
  const r = $('#bCanvas').getBoundingClientRect(); state.bld.sel = it.uid; it.z = ++state.bld.z;
  drag = { it, el: cv, sx: e.clientX, sy: e.clientY, ox: it.x, oy: it.y, r };
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}
  document.querySelectorAll('.cv').forEach(c => c.classList.toggle('sel', c === cv)); cv.style.zIndex = it.z; e.preventDefault();
});
document.addEventListener('pointermove', e => {
  if (!drag) return;
  drag.it.x = clamp(drag.ox + (e.clientX - drag.sx) / drag.r.width * 100, -25, 95); drag.it.y = clamp(drag.oy + (e.clientY - drag.sy) / drag.r.height * 100, -25, 95);
  drag.el.style.left = drag.it.x + '%'; drag.el.style.top = drag.it.y + '%';
});
const endDrag = () => { if (drag) { drag = null; refreshTools(); } };
document.addEventListener('pointerup', endDrag); document.addEventListener('pointercancel', endDrag);

/* ---------------- PLANNER ---------------- */
function viewPlanner() {
  if (!state.selDate) state.selDate = todayStr();
  const y = state.month.getFullYear(), m = state.month.getMonth(), offset = (new Date(y, m, 1).getDay() + 6) % 7, dim = new Date(y, m + 1, 0).getDate();
  const total = Math.ceil((offset + dim) / 7) * 7, today = todayStr();
  const byDate = {}; state.plans.forEach(p => (byDate[p.date] = byDate[p.date] || []).push(p));
  let cells = '';
  for (let k = 0; k < total; k++) {
    const dt = new Date(y, m, 1 - offset + k), s = ymd(dt), list = byDate[s] || [], out = dt.getMonth() !== m;
    cells += `<button class="day ${out ? 'out' : ''} ${s === today ? 'today' : ''} ${s === state.selDate ? 'sel' : ''}" data-act="selDay" data-v="${s}" aria-label="${s}"><span class="dn">${dt.getDate()}</span>${list.length ? collage(planEntries(list[0])) : ''}
      ${list.length ? `<span class="dots">${list.slice(0, 4).map(p => `<i class="${isWorn(p) ? '' : 'plan'}"></i>`).join('')}</span>` : ''}${list.length > 1 ? `<span class="more">+${list.length - 1}</span>` : ''}</button>`;
  }
  return `<div class="page-head"><div><h1 class="page">Planner</h1><p class="sub">Plan outfits ahead and log what you wear.</p></div></div>
    <div class="planner"><div class="cal"><div class="cal-head"><button class="icon-btn" data-act="prevMonth" aria-label="Previous month">${I.left}</button>
    <div class="row"><span class="mname">${state.month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span><button class="btn ghost sm" data-act="thisMonth">Today</button></div>
    <button class="icon-btn" data-act="nextMonth" aria-label="Next month">${I.right}</button></div>
    <div class="dow">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => `<span>${d}</span>`).join('')}</div><div class="days">${cells}</div></div>
    <div class="daypanel" id="dayPanel">${dayPanel()}</div></div>`;
}
function dayPanel() {
  const s = state.selDate, list = state.plans.filter(p => p.date === s);
  const rows = list.map(p => {
    const o = state.outfits.find(x => x.id === p.outfitId), names = planItemIds(p).map(id => findItem('closet', id)?.name).filter(Boolean).join(', ');
    return `<div class="entry">${collage(planEntries(p))}<div class="tx"><b>${esc(o ? o.name : 'Custom look')}</b><span class="status ${isWorn(p) ? 'worn' : ''}">${isWorn(p) ? 'Worn' : 'Planned'}</span>
      <div class="sub" style="margin:4px 0 0;font-size:12.5px">${esc(names.slice(0, 90))}${p.note ? '<br><i>' + esc(p.note) + '</i>' : ''}</div>
      <div class="acts"><button class="btn ghost sm" data-act="toggleWorn" data-id="${p.id}">${isWorn(p) ? 'Undo worn' : 'Mark as worn'}</button><button class="btn danger sm" data-act="delPlan" data-id="${p.id}">Remove</button></div></div></div>`;
  }).join('');
  return `<h3>${esc(fmtLong(s))}</h3><p class="sub" style="margin-bottom:14px">${s === todayStr() ? 'Today' : (s > todayStr() ? 'Upcoming' : 'Past')} · ${list.length} outfit${list.length === 1 ? '' : 's'}</p>
    ${rows || '<p class="sub">Nothing planned for this day yet.</p>'}<button class="btn block" style="margin-top:14px" data-act="planAdd">${I.plus} Plan an outfit</button>`;
}
function openPlan(preset) {
  state.planDraft = { date: state.selDate || todayStr(), mode: state.outfits.length ? 'looks' : 'pieces', outfitId: null, ids: [], cat: 'All', worn: false, note: '', ...(preset || {}) };
  if (state.planDraft.date < todayStr() && !preset) state.planDraft.worn = true;
  showPlan();
}
function showPlan() {
  const d = state.planDraft;
  openModal(`<h2>Plan an outfit</h2><p class="sub" style="margin-bottom:14px">Pick a saved outfit or choose individual pieces.</p>
    <div class="two"><div class="field"><label>Date</label><input type="date" id="pDate" value="${d.date}"></div><div class="field"><label>Note (optional)</label><input type="text" id="pNote" placeholder="Brunch, interview…" value="${esc(d.note)}"></div></div>
    <div class="seg" style="grid-template-columns:1fr 1fr;margin-bottom:14px"><button class="${d.mode === 'looks' ? 'on' : ''}" data-act="planMode" data-v="looks">Saved outfits</button><button class="${d.mode === 'pieces' ? 'on' : ''}" data-act="planMode" data-v="pieces">Pick pieces</button></div>
    <div id="planBody"></div>
    <label class="toggle" style="margin:14px 0"><input type="checkbox" id="pWorn" ${d.worn ? 'checked' : ''}> I already wore this</label>
    <div class="row" style="justify-content:flex-end"><button class="btn ghost" data-act="closeModal">Cancel</button><button class="btn" data-act="savePlan">Add to planner</button></div>`);
  refreshPlanBody();
}
function refreshPlanBody() {
  const d = state.planDraft, el = $('#planBody'); if (!el) return;
  if (d.mode === 'looks') {
    el.innerHTML = state.outfits.length ? `<div class="picker" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">${state.outfits.map(o => `<button class="pick ${d.outfitId === o.id ? 'on' : ''}" data-act="planPickLook" data-id="${o.id}">${collage(outfitEntries(o))}<div class="meta" style="padding:6px 8px"><div class="nm" style="font-size:12.5px">${esc(o.name)}</div></div></button>`).join('')}</div>`
      : `<p class="sub">No saved outfits yet — switch to “Pick pieces”.</p>`;
  } else {
    const pool = state.closet.filter(i => d.cat === 'All' || i.category === d.cat);
    el.innerHTML = `<div class="tabs">${tabsHtml(d.cat, CATS, 'planCat')}</div><div class="picker">${pool.length ? pool.map(i => `<button class="pick ${d.ids.includes(i.id) ? 'on' : ''}" data-act="planPickPiece" data-id="${i.id}" title="${esc(i.name)}">${thumb(i)}</button>`).join('') : '<p class="sub" style="grid-column:1/-1">Your closet is empty here.</p>'}</div><p class="sub" style="margin-top:8px">${d.ids.length} selected</p>`;
  }
}
function syncPlan() { const d = state.planDraft; if (!d) return; const g = id => document.getElementById(id); if (g('pDate')) d.date = g('pDate').value; if (g('pNote')) d.note = g('pNote').value; if (g('pWorn')) d.worn = g('pWorn').checked; }
async function savePlan() {
  syncPlan(); const d = state.planDraft;
  if (!d.date) { toast('Pick a date'); return; }
  let body = { date: d.date, worn: d.worn, note: d.note.trim() };
  if (d.mode === 'looks') { const o = state.outfits.find(x => x.id === d.outfitId); if (!o) { toast('Choose an outfit'); return; } body.outfitId = o.id; body.itemIds = o.itemIds || []; }
  else { if (!d.ids.length) { toast('Pick at least one piece'); return; } body.itemIds = d.ids; }
  const p = await api('/api/wear', { method: 'POST', body }); state.plans.push(p); state.selDate = p.date;
  const dt = new Date(p.date + 'T00:00:00'); state.month = new Date(dt.getFullYear(), dt.getMonth(), 1);
  toast(d.worn ? 'Logged as worn' : 'Added to planner'); closeModal(); if (state.tab !== 'planner') state.tab = 'planner'; render();
}

/* ---------------- STATS ---------------- */
function viewStats() {
  const wears = wearCounts(), c = state.closet, totalWears = Object.values(wears).reduce((a, b) => a + b, 0);
  const wearable = c.filter(i => i.price && wears[i.id]);
  const avgCpw = wearable.length ? wearable.reduce((s, i) => s + i.price / wears[i.id], 0) / wearable.length : 0;
  const wlTotal = state.wishlist.reduce((s, i) => s + (Number(i.price) || 0), 0);
  const most = c.filter(i => wears[i.id]).sort((a, b) => wears[b.id] - wears[a.id]).slice(0, 5), top = most.length ? wears[most[0].id] : 1;
  const never = c.filter(i => !wears[i.id]).slice(0, 6);
  const best = c.filter(i => i.price && wears[i.id]).sort((a, b) => a.price / wears[a.id] - b.price / wears[b.id]).slice(0, 3);
  const row = (i, right, pct) => `<div class="rank"><div class="mini">${i.image ? `<img src="${esc(i.image)}" alt="">` : `<div style="height:100%;background:${esc(i.color || '#ddd')}"></div>`}</div><div class="tx"><b>${esc(i.name)}</b><span>${esc(i.category)}</span>${pct != null ? `<div class="bar"><i style="width:${pct}%"></i></div>` : ''}</div><b>${right}</b></div>`;
  const maxCat = Math.max(1, ...CATS.map(k => c.filter(i => i.category === k).length));
  return `<div class="page-head"><div><h1 class="page">Stats</h1><p class="sub">How you actually use your wardrobe.</p></div></div>
    <div class="stat-grid"><div class="stat"><div class="num">${c.length}</div><div class="lb">Pieces in closet</div></div><div class="stat"><div class="num">${money(closetWorth()) || '₹0'}</div><div class="lb">Closet value</div></div>
    <div class="stat"><div class="num">${state.wishlist.length}</div><div class="lb">Wishlist items · ${money(wlTotal) || '₹0'}</div></div><div class="stat"><div class="num">${state.outfits.length}</div><div class="lb">Saved outfits</div></div>
    <div class="stat"><div class="num">${totalWears}</div><div class="lb">Wears logged</div></div><div class="stat"><div class="num">${avgCpw ? money(avgCpw) : '—'}</div><div class="lb">Avg cost per wear</div></div></div>
    <div class="two-col"><div><h2 class="sec">Most worn</h2>${most.length ? most.map(i => row(i, wears[i.id] + '×', wears[i.id] / top * 100)).join('') : '<p class="sub">Log outfits as worn in the planner to see this.</p>'}
    <h2 class="sec">Best value</h2>${best.length ? best.map(i => row(i, money(i.price / wears[i.id]) + '/wear')).join('') : '<p class="sub">Add prices to your pieces to see cost per wear.</p>'}</div>
    <div><h2 class="sec">Never worn</h2>${never.length ? never.map(i => row(i, '0×')).join('') : '<p class="sub">Everything has been worn. 🎉</p>'}
    <h2 class="sec">By category</h2>${CATS.map(k => { const n = c.filter(i => i.category === k).length; return `<div style="margin-bottom:10px"><div class="row" style="justify-content:space-between"><span>${k}</span><b>${n}</b></div><div class="bar"><i style="width:${n / maxCat * 100}%"></i></div></div>`; }).join('')}</div></div>`;
}

/* ---------------- event handlers ---------------- */
const val = id => ($(id) ? $(id).value.trim() : '');
const A = {
  /* auth */
  goLogin() { state.authView = 'login'; render(); }, goRegister() { state.authView = 'register'; render(); }, goForgot() { state.authView = 'forgot'; render(); },
  async doLogin() {
    const email = val('#liEmail').toLowerCase(), password = $('#liPass').value; if (!email || !password) return toast('Enter email and password');
    const { token, user } = await api('/api/auth/login', { method: 'POST', body: { email, password } }); setSession(token, user); await loadAll(); toast(`Welcome back, ${user.name.split(' ')[0]}`); render();
  },
  async doRegister() {
    const name = val('#rName'), email = val('#rEmail').toLowerCase(), p = $('#rPass').value, p2 = $('#rPass2').value;
    if (!name || !email || !p) return toast('Fill in all fields'); if (!email.includes('@') || !email.includes('.')) return toast('Enter a valid email');
    if (p.length < 6) return toast('Password needs 6+ characters'); if (p !== p2) return toast("Passwords don't match");
    const { demoOtp } = await api('/api/auth/register/start', { method: 'POST', body: { name, email, password: p } });
    state.pendingRegistration = { name, email }; state.pendingOtp = demoOtp; state.authView = 'verify2fa'; render();
  },
  async confirmOtp() {
    const { token, user } = await api('/api/auth/register/verify', { method: 'POST', body: { email: state.pendingRegistration.email, code: val('#otpInput') } });
    setSession(token, user); state.pendingRegistration = state.pendingOtp = null; await loadAll(); toast('Account created'); render();
  },
  async sendReset() { const email = val('#fgEmail').toLowerCase(); const { demoOtp } = await api('/api/auth/forgot/start', { method: 'POST', body: { email } }); state.pendingReset = { email }; state.pendingOtp = demoOtp; state.authView = 'resetOtp'; render(); },
  async confirmResetOtp() { const code = val('#rotpInput'); await api('/api/auth/forgot/verify', { method: 'POST', body: { email: state.pendingReset.email, code } }); state.pendingReset.code = code; state.authView = 'resetPassword'; render(); },
  async saveNewPassword() {
    const p1 = $('#npPass').value, p2 = $('#npPass2').value; if (p1.length < 6) return toast('Password needs 6+ characters'); if (p1 !== p2) return toast("Passwords don't match");
    await api('/api/auth/forgot/reset', { method: 'POST', body: { email: state.pendingReset.email, code: state.pendingReset.code, password: p1 } });
    state.pendingReset = state.pendingOtp = null; state.authView = 'login'; toast('Password reset — please log in'); render();
  },
  logout() { state.token = state.user = null; localStorage.removeItem(TOKEN_KEY); Object.assign(state, { closet: [], wishlist: [], outfits: [], plans: [], authView: 'login', tab: 'closet' }); closeModal(); render(); },

  toggleTheme() { applyTheme(getTheme() === 'dark' ? 'light' : 'dark', true); },

  /* nav + modal */
  nav(el) { state.tab = el.dataset.v; renderView(); window.scrollTo(0, 0); }, closeModal, overlay: closeModal,

  /* closet */
  cFilter(el) { state.cFilter = el.dataset.v; renderClosetGrid(); },
  addPiece() { openForm('closet'); }, openItem(el) { openItem(el.dataset.id); },
  editItem(el) { openForm('closet', findItem('closet', el.dataset.id)); },
  async deleteItem(el) { if (!confirm('Remove this piece from your closet?')) return; await api('/api/clothing/' + el.dataset.id, { method: 'DELETE' }); state.closet = state.closet.filter(i => i.id !== el.dataset.id); closeModal(); renderView(); toast('Removed'); },
  async wearToday(el) { const p = await api('/api/wear', { method: 'POST', body: { date: todayStr(), itemIds: [el.dataset.id], worn: true } }); state.plans.push(p); toast('Logged — enjoy the fit'); openItem(el.dataset.id); renderView(); },
  planPiece(el) { closeModal(); openPlan({ mode: 'pieces', ids: [el.dataset.id] }); },

  /* shared add/edit form */
  formCamera() { syncDraft(); openCamera((img, rest) => { state.draft.image = img; if (rest && rest.length && !state.draft.id) state.queue = rest; showForm(); }); },
  formUpload() { syncDraft(); pickFiles(true, imgs => { state.draft.image = imgs[0]; if (!state.draft.id) state.queue = imgs.slice(1); showForm(); }); },
  formClearPhoto() { syncDraft(); state.draft.image = null; showForm(); },
  async formCutout() { syncDraft(); toast('Removing background…'); try { state.draft.image = await cutout(state.draft.image); toast('Done — works best on plain backgrounds'); } catch (e) { toast('Could not process that photo'); } showForm(); },
  swatch(el) { state.draft.color = el.dataset.v; document.querySelectorAll('.sw').forEach(s => s.classList.toggle('sel', s === el)); },
  setPriority(el) { state.draft.priority = el.dataset.v; document.querySelectorAll('[data-act=setPriority]').forEach(s => s.classList.toggle('on', s === el)); },
  saveItem() { return saveDraft(false); }, saveItemAnother() { return saveDraft(true); },

  /* wishlist */
  wFilter(el) { state.wFilter = el.dataset.v; renderWishGrid(); },
  addWish() { openForm('wishlist'); }, openWish(el) { openWish(el.dataset.id); },
  editWish(el) { openForm('wishlist', findItem('wishlist', el.dataset.id)); },
  async deleteWish(el) { if (!confirm('Remove from wishlist?')) return; await api('/api/wishlist/' + el.dataset.id, { method: 'DELETE' }); state.wishlist = state.wishlist.filter(i => i.id !== el.dataset.id); closeModal(); renderView(); toast('Removed'); },
  async bought(el) {
    const id = el.dataset.id, w = findItem('wishlist', id); if (!w || !confirm(`Move “${w.name}” to your closet?`)) return;
    const item = fixItem(await api(`/api/wishlist/${id}/purchase`, { method: 'POST' })); state.closet.push(item); state.wishlist = state.wishlist.filter(i => i.id !== id);
    state.outfits = await api('/api/outfits'); closeModal(); renderView(); toast('Moved to your closet');
  },
  tryWish(el) { closeModal(); openBuilder(null, { src: 'wishlist', id: el.dataset.id }); },

  /* outfits */
  newLook() { openBuilder(); }, openLook(el) { openLook(el.dataset.id); },
  editLook(el) { const o = state.outfits.find(x => x.id === el.dataset.id); closeModal(); openBuilder(o); },
  async deleteLook(el) { if (!confirm('Delete this outfit?')) return; await api('/api/outfits/' + el.dataset.id, { method: 'DELETE' }); state.outfits = state.outfits.filter(o => o.id !== el.dataset.id); state.plans = state.plans.map(p => p.outfitId === el.dataset.id ? { ...p, outfitId: null } : p); closeModal(); renderView(); toast('Deleted'); },
  planLook(el) { closeModal(); openPlan({ mode: 'looks', outfitId: el.dataset.id }); },
  bCat(el) { state.bld.cat = el.dataset.v; refreshBuilder(); },
  bPick(el) { addToCanvas(el.dataset.src, el.dataset.id); refreshBuilder(); },
  bSize(el) { const it = state.bld.items.find(i => i.uid === state.bld.sel); if (it) { it.w = clamp(it.w + Number(el.dataset.v), 10, 95); refreshBuilder(); } },
  bFront() { const it = state.bld.items.find(i => i.uid === state.bld.sel); if (it) { it.z = ++state.bld.z; refreshBuilder(); } },
  bBack() { const it = state.bld.items.find(i => i.uid === state.bld.sel); if (it) { it.z = Math.min(0, ...state.bld.items.map(i => i.z)) - 1; refreshBuilder(); } },
  bRemove() { state.bld.items = state.bld.items.filter(i => i.uid !== state.bld.sel); state.bld.sel = null; refreshBuilder(); },
  bClear() { state.bld.items = []; state.bld.sel = null; refreshBuilder(); },
  saveLook,

  /* planner */
  prevMonth() { state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1); renderView(); },
  nextMonth() { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1); renderView(); },
  thisMonth() { const n = new Date(); state.month = new Date(n.getFullYear(), n.getMonth(), 1); state.selDate = todayStr(); renderView(); },
  selDay(el) { state.selDate = el.dataset.v; document.querySelectorAll('.day').forEach(d => d.classList.toggle('sel', d === el)); $('#dayPanel').innerHTML = dayPanel(); },
  planAdd() { openPlan(); },
  planMode(el) { syncPlan(); state.planDraft.mode = el.dataset.v; showPlan(); },
  planPickLook(el) { state.planDraft.outfitId = el.dataset.id; refreshPlanBody(); },
  planPickPiece(el) { const d = state.planDraft, id = el.dataset.id; d.ids = d.ids.includes(id) ? d.ids.filter(x => x !== id) : [...d.ids, id]; refreshPlanBody(); },
  planCat(el) { state.planDraft.cat = el.dataset.v; refreshPlanBody(); },
  savePlan,
  async toggleWorn(el) { const p = state.plans.find(x => x.id === el.dataset.id); const upd = await api('/api/wear/' + p.id, { method: 'PUT', body: { worn: !isWorn(p), itemIds: planItemIds(p) } }); state.plans = state.plans.map(x => x.id === p.id ? upd : x); renderView(); },
  async delPlan(el) { if (!confirm('Remove from planner?')) return; await api('/api/wear/' + el.dataset.id, { method: 'DELETE' }); state.plans = state.plans.filter(p => p.id !== el.dataset.id); renderView(); }
};
document.addEventListener('click', async e => {
  if (e.target.closest('[data-stop]')) return;
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act; if (act === 'overlay' && e.target !== el) return;
  if (!A[act]) return;
  try { await A[act](el, e); } catch (err) { toast(err.message || 'Something went wrong'); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'cSearch') { state.cSearch = e.target.value; renderClosetGrid(); }
  if (e.target.id === 'wSearch') { state.wSearch = e.target.value; renderWishGrid(); }
});
document.addEventListener('change', e => {
  const id = e.target.id;
  if (id === 'cSort') { state.cSort = e.target.value; renderClosetGrid(); }
  if (id === 'wSort') { state.wSort = e.target.value; renderWishGrid(); }
  if (id === 'bWl') { state.bld.wl = e.target.checked; refreshBuilder(); }
  if (id === 'pDate' && state.planDraft) state.planDraft.date = e.target.value;
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('#modal').innerHTML && !$('.cam')) closeModal();
  if (e.key === 'Enter' && e.target.closest('.auth-card') && e.target.tagName === 'INPUT') { const b = $('.auth-card .btn'); if (b) b.click(); }
});

/* ---------------- boot ---------------- */
(async function boot() {
  if (state.token) { try { state.user = await api('/api/auth/me'); await loadAll(); } catch (e) { state.token = null; state.user = null; localStorage.removeItem(TOKEN_KEY); } }
  render();
})();
