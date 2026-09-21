// ── LED Wall radio selector (only one at a time) ─────────────
let _selectedLwKey = null;
function selectLwRadio(btn) {
  const key   = btn.dataset.key;
  const price = parseInt(btn.dataset.price) || 0;
  const name  = btn.dataset.name || '';

  document.querySelectorAll('.lw-radio-btn').forEach(b => b.classList.remove('active'));

  if (_selectedLwKey === key) {
    _selectedLwKey = null;
    if (typeof csState !== 'undefined' && csState.items) {
      ['ledwall35','ledwall35o','ledwall40','ledwall40o'].forEach(k => delete csState.items[k]);
    }
  } else {
    _selectedLwKey = key;
    btn.classList.add('active');
    if (typeof csState !== 'undefined' && csState.items) {
      ['ledwall35','ledwall35o','ledwall40','ledwall40o'].forEach(k => delete csState.items[k]);
      csState.items[key] = { qty: 1, price, name, free: false };
    }
  }

  if (typeof _recalcCustomTotal === 'function') {
    _recalcCustomTotal();
  } else {
    _custTotal = 0;
    document.querySelectorAll('.cil-item').forEach(item => {
      const qty = parseInt(item.querySelector('.cqv')?.textContent) || 0;
      const p   = parseInt(item.dataset.price) || 0;
      if (!item.classList.contains('cil-free')) _custTotal += qty * p;
    });
    if (_selectedLwKey) _custTotal += price;
    const el = document.getElementById('custRunning');
    const ft = document.getElementById('custFooterTotal');
    if (el) el.textContent = _custTotal.toLocaleString('en-PH');
    if (ft) ft.style.display = _custTotal > 0 ? '' : 'none';
  }
}

/* ══════════════════════════════════════════
   M-AUDIO PRO — MAUDIO.js  (Public Site)
   ══════════════════════════════════════════ */

// ── PACKAGE CATEGORY TABS ─────────────────
const PKG_META = {
  basic:    { sub: 'For programs, recognitions & small gatherings',      crew: '👥 3 crew members included' },
  wedding:  { sub: 'Elegant setups for your special day',                crew: '👥 4–6 crew members included' },
  bigcrowd: { sub: 'High-power rigs for concerts & large events',        crew: '👥 6–8 crew members included' },
  ledwall:  { sub: 'Large-format LED video wall packages',               crew: '👥 2 LED technicians included' },
  disco:    { sub: 'Full mobile disco rig with professional DJs',        crew: '👥 3 DJs + crew included' },
  custom:   { sub: 'Build your own package from scratch',                crew: '✨ Fully customizable' }
};

// ══════════════════════════════════════════════════════════════
// PUBLIC CALENDAR — SLOT MODEL
// ──────────────────────────────────────────────────────────────
// Mirrors the three-slot model enforced by BOOKING.js. A day has
// three slots, each bookable once:
//
//   pa      — shared by Basic PA, Wedding, Big Crowd, and Custom
//   ledwall — LED Wall packages only
//   disco   — Disco package only
//
// PUB_SLOT_ALIAS folds the two legacy values from before this update
// ('wedding', 'bigcrowd') into 'pa', so a booking stored under the old
// scheme renders with the correct colour instead of disappearing into
// the fallback. PUB_SLOT_META is the single source of truth for the
// colour, icon, full label, and short label of each slot — used by the
// day cells, the dots' tooltips, and the sidebar events list.
// ══════════════════════════════════════════════════════════════
const PUB_SLOT_ALIAS = {
  pa: 'pa', wedding: 'pa', bigcrowd: 'pa',
  ledwall: 'ledwall', disco: 'disco',
};
const PUB_SLOT_META = {
  pa:      { color: 'slot-pa',      icon: '🔊', label: 'PA · Wedding · Big Crowd', short: 'PA' },
  ledwall: { color: 'slot-ledwall', icon: '📺', label: 'LED Wall',                 short: 'LED Wall' },
  disco:   { color: 'slot-disco',   icon: '🎧', label: 'Disco',                    short: 'Disco' },
};
const PUB_SLOT_KEYS = ['pa', 'ledwall', 'disco'];

// Determine the slot category of a booking. The stored `slottype` field
// is preferred, but it is NOT trusted blindly — bookings made before the
// Disco slot category existed were saved with `slottype: 'pa'` (the old
// getSlotTypeForNew() had no 'disco' branch, so a Disco booking fell
// through to the PA default). The package label and package ID are the
// ground truth: they're written by the booking form from PACKAGE_DATA,
// cannot be edited by the customer, and unambiguously identify Disco
// and LED Wall bookings.
//
// Accepts either a booking object or a raw slottype string, so older
// call sites that only had the string still work.
function pubSlotOf(booking) {
  const b = (booking && typeof booking === 'object') ? booking : { slottype: booking };

  const rawSlot = String(b.slottype || b.slotType || '').toLowerCase();
  const pkgId   = String(b.pkgId   || b.pkgid    || '').toLowerCase();
  const pkgLbl  = String(b.pkg || '').toUpperCase();

  // 1. Package ID — set by the booking form, strongest signal.
  if (pkgId === 'disco')      return 'disco';
  if (pkgId.startsWith('lw')) return 'ledwall';

  // 2. Package label — catches legacy bookings whose slottype was saved
  //    before the Disco category existed. The Disco URL handler sets
  //    pkg = "DISCO PACKAGE" and the LED Wall labels all contain
  //    "LED WALL ONLY — N PANELS", so a plain substring match is safe:
  //    no PA / Wedding / Big Crowd / Custom label contains either word.
  if (pkgLbl.includes('DISCO'))    return 'disco';
  if (pkgLbl.includes('LED WALL')) return 'ledwall';

  // 3. Fall back to the stored slottype, folding legacy values.
  return PUB_SLOT_ALIAS[rawSlot] || 'pa';
}

function switchPkgCat(cat) {
  document.querySelectorAll('.pkg-cat-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.pkg-tab').forEach(t => t.classList.remove('active'));
  const pane = document.getElementById('pcat-' + cat);
  const tab  = document.querySelector('[data-cat="' + cat + '"]');
  if (pane) pane.classList.add('active');
  if (tab)  tab.classList.add('active');
  const meta = PKG_META[cat] || {};
  const sub  = document.getElementById('pkgCatSubtitle');
  const crew = document.getElementById('pkgCrewBadge');
  if (sub)  sub.textContent  = meta.sub  || '';
  if (crew) crew.textContent = meta.crew || '';
}

// ── CUSTOMIZER MODAL ──────────────────────
let _custEventType = '', _custCrowd = '', _custRec = '', _custTotal = 0;
const _custQtys = {};

function openCustomizer() {
  document.getElementById('custOverlay').classList.add('open');
  document.body.classList.add('cust-open');
  document.querySelectorAll('.cust-step').forEach(s => s.classList.remove('active'));
  const s1 = document.getElementById('cs1');
  if (s1) s1.classList.add('active');
  const csCount = document.getElementById('csCount');
  if (csCount) csCount.textContent = '1';
  const bar = document.getElementById('custProgressBar');
  if (bar) bar.style.width = '25%';
  const footerTotal = document.getElementById('custFooterTotal');
  if (footerTotal) footerTotal.style.display = 'none';
  _custEventType = ''; _custCrowd = ''; _custRec = '';
  document.querySelectorAll('.cet-btn,.ccr-btn').forEach(b => b.classList.remove('sel'));
  const next1 = document.getElementById('csNext1');
  if (next1) next1.disabled = true;
  const next2 = document.getElementById('csNext2');
  if (next2) next2.disabled = true;
}
function closeCustomizer() {
  document.getElementById('custOverlay').classList.remove('open');
  document.body.classList.remove('cust-open');
}
function closeCustomizerOutside(e) {
  if (e.target === document.getElementById('custOverlay')) closeCustomizer();
}
function selectEventType(btn) {
  document.querySelectorAll('.cet-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  _custEventType = btn.dataset.val;
  document.getElementById('csNext1').disabled = false;
}
function selectCrowd(btn) {
  document.querySelectorAll('.ccr-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  _custCrowd = btn.dataset.val;
  _custRec   = btn.dataset.rec;
  document.getElementById('csNext2').disabled = false;
}
function cilChange(btn, delta) {
  const item  = btn.closest('.cil-item');
  const qEl   = item.querySelector('.cqv');
  const key   = item.dataset.key;
  const price = parseFloat(item.dataset.price) || 0;
  let qty = parseInt(qEl.textContent) || 0;
  qty = Math.max(0, qty + delta);
  qEl.textContent = qty;
  qEl.classList.toggle('active', qty > 0);
  item.classList.toggle('active', qty > 0);
  _custQtys[key] = qty;
  _custTotal = 0;
  document.querySelectorAll('.cil-item').forEach(it => {
    const k = it.dataset.key, p = parseFloat(it.dataset.price) || 0;
    const q = parseInt(it.querySelector('.cqv').textContent) || 0;
    _custTotal += p * q;
  });
  document.getElementById('custRunning').textContent   = _custTotal.toLocaleString('en-PH');
  document.getElementById('custFooterTotal').style.display = _custTotal > 0 ? '' : 'none';
}
function csNext(step) {
  const steps = document.querySelectorAll('.cust-step');
  steps.forEach(s => s.classList.remove('active'));
  const next = document.getElementById('cs' + (step + 1));
  if (next) next.classList.add('active');
  document.getElementById('csCount').textContent = step + 1;
  document.getElementById('custProgressBar').style.width = ((step+1)/4*100) + '%';
  if (step + 1 === 4) buildCustSummary();
}
function csBack(step) {
  const steps = document.querySelectorAll('.cust-step');
  steps.forEach(s => s.classList.remove('active'));
  document.getElementById('cs' + (step - 1)).classList.add('active');
  document.getElementById('csCount').textContent = step - 1;
  document.getElementById('custProgressBar').style.width = ((step-1)/4*100) + '%';
}
function buildCustSummary() {
  _custTotal = 0;
  document.querySelectorAll('.cil-item').forEach(item => {
    const qty = parseInt(item.querySelector('.cqv')?.textContent) || 0;
    const p   = parseFloat(item.dataset.price) || 0;
    if (!item.classList.contains('cil-free')) _custTotal += qty * p;
  });
  if (_selectedLwKey) {
    const lwBtn = document.querySelector(`.lw-radio-btn[data-key="${_selectedLwKey}"]`);
    if (lwBtn) _custTotal += parseInt(lwBtn.dataset.price) || 0;
  }

  const down = Math.ceil(_custTotal * 0.1);
  document.getElementById('custTotalDisplay').textContent = _custTotal.toLocaleString('en-PH');
  document.getElementById('custDownDisplay').textContent  = down.toLocaleString('en-PH');

  let rows = '';
  document.querySelectorAll('.cil-item').forEach(item => {
    const qty = parseInt(item.querySelector('.cqv').textContent) || 0;
    if (!qty) return;
    const name  = item.dataset.name  || item.querySelector('.cil-name').textContent;
    const price = parseFloat(item.dataset.price) || 0;
    rows += '<div class="cust-sum-row"><span>' + name + ' × ' + qty + '</span><span>₱' + (price*qty).toLocaleString('en-PH') + '</span></div>';
  });
  if (_selectedLwKey) {
    const lwBtn = document.querySelector(`.lw-radio-btn[data-key="${_selectedLwKey}"]`);
    if (lwBtn) {
      rows += '<div class="cust-sum-row" style="color:#60a5fa"><span>📺 ' + (lwBtn.dataset.name||_selectedLwKey) + '</span><span>₱' + (parseInt(lwBtn.dataset.price)||0).toLocaleString('en-PH') + '</span></div>';
    }
  }

  const sumEl = document.getElementById('custSummary');
  if (sumEl) sumEl.innerHTML = '<div class="cust-sum-section"><div class="cust-sum-head">LIGHTING SELECTION</div><div class="cust-sum-rows">' + (rows || '<div class="cust-sum-row"><span>No items selected</span><span>₱0</span></div>') + '</div></div>'
    + '<div class="cust-sum-section"><div class="cust-sum-head">EVENT INFO</div><div class="cust-sum-rows">'
    + '<div class="cust-sum-row"><span>Event type</span><span>' + (_custEventType||'—') + '</span></div>'
    + '<div class="cust-sum-row"><span>Crowd size</span><span>' + (_custCrowd||'—') + '</span></div>'
    + '</div></div>';
}

function goCustomBookingFromModal() {
  const items = [];
  document.querySelectorAll('.cil-item').forEach(item => {
    const qty = parseInt(item.querySelector('.cqv').textContent) || 0;
    if (qty) items.push(item.dataset.name + ' ×' + qty);
  });
  if (_selectedLwKey) {
    const lwBtn = document.querySelector(`.lw-radio-btn[data-key="${_selectedLwKey}"]`);
    if (lwBtn) items.push(lwBtn.dataset.name || _selectedLwKey);
  }
  _custTotal = 0;
  document.querySelectorAll('.cil-item').forEach(item => {
    const qty = parseInt(item.querySelector('.cqv')?.textContent) || 0;
    const p   = parseFloat(item.dataset.price) || 0;
    if (!item.classList.contains('cil-free')) _custTotal += qty * p;
  });
  if (_selectedLwKey) {
    const lwBtn = document.querySelector(`.lw-radio-btn[data-key="${_selectedLwKey}"]`);
    if (lwBtn) _custTotal += parseInt(lwBtn.dataset.price) || 0;
  }

  const label = 'CUSTOM: ' + (_custEventType||'Custom') + ' — ' + (items.join(', ') || 'Lights Only');
  closeCustomizer();
  window.location.href = 'BOOKING.html?pkg=custom&price=' + _custTotal + '&label=' + encodeURIComponent(label);
}

// ── PUBLIC BOOKING CALENDAR ───────────────
const PUB_MONTHS = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
let pubYear, pubMonth;

function initPubCal() {
  const now = new Date();
  pubYear  = now.getFullYear();
  pubMonth = now.getMonth();
  document.getElementById('pubCalPrev')?.addEventListener('click', () => {
    pubMonth--; if (pubMonth < 0) { pubMonth = 11; pubYear--; }
    renderPubCal();
  });
  document.getElementById('pubCalNext')?.addEventListener('click', () => {
    pubMonth++; if (pubMonth > 11) { pubMonth = 0; pubYear++; }
    renderPubCal();
  });
  renderPubCal();
}

function renderPubCal() {
  const titleEl = document.getElementById('pubCalTitle');
  const daysEl  = document.getElementById('pubCalDays');
  if (!titleEl || !daysEl) return;
  titleEl.textContent = PUB_MONTHS[pubMonth] + ' ' + pubYear;

  const prefix    = pubYear + '-' + String(pubMonth+1).padStart(2,'0');
  const firstDay  = new Date(pubYear, pubMonth, 1).getDay();
  const daysInM   = new Date(pubYear, pubMonth+1, 0).getDate();
  const daysInPrev= new Date(pubYear, pubMonth, 0).getDate();
  const todayStr  = new Date().toISOString().split('T')[0];

  const currentH = daysEl.offsetHeight;
  daysEl.style.minHeight = currentH + 'px';
  daysEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:1rem;font-family:var(--font-mono);font-size:.7rem;color:var(--gray2)">LOADING…</div>';

  db.collection('booking_availability').get().then(snap => {
    const bookings = snap.docs.map(d => ({ ...d.data() }))
      .filter(b => b.status !== 'cancelled' && (b.date||'').startsWith(prefix));

    let html = '';
    for (let i = firstDay - 1; i >= 0; i--) {
      html += '<div class="cal-day other-month"><span class="cal-day-num">' + (daysInPrev-i) + '</span></div>';
    }
    for (let d = 1; d <= daysInM; d++) {
      const ds     = prefix + '-' + String(d).padStart(2,'0');
      const dayBks = bookings.filter(b => b.date === ds);
      const isToday = ds === todayStr;

      // Which distinct slots are taken — a booking under the legacy
      // 'wedding' or 'bigcrowd' value counts as the shared PA slot, so
      // the day's real occupancy is reflected instead of silently
      // under-counting.
      const slotsTaken = new Set();
      dayBks.forEach(b => slotsTaken.add(pubSlotOf(b)));

      const hasBk = slotsTaken.size > 0;
      const isFull = slotsTaken.size >= PUB_SLOT_KEYS.length;

      let cls = 'cal-day';
      if (isToday) cls += ' is-today';
      if (hasBk)   cls += isFull ? ' is-full is-booked' : ' is-partial is-booked';

      // One dot per TAKEN slot — never two of the same colour, even if
      // the day somehow holds two legacy bookings that both fold into
      // 'pa'. Tooltip on each dot names the slot it represents.
      let dots = '';
      PUB_SLOT_KEYS.forEach(slot => {
        if (!slotsTaken.has(slot)) return;
        const meta = PUB_SLOT_META[slot];
        dots += '<div class="cal-slot-dot ' + meta.color + '" title="' + meta.label + ' — slot taken"></div>';
      });

      // Remaining-slot counter for partially-booked days.
      const remaining = PUB_SLOT_KEYS.length - slotsTaken.size;
      const remainTag = (!isFull && hasBk && remaining > 0)
        ? '<span class="cal-remain-tag">' + remaining + ' open</span>'
        : '';

      html += '<div class="' + cls + '">'
        + '<span class="cal-day-num">' + d + '</span>'
        + (dots ? '<div class="cal-slot-dots">' + dots + '</div>' : '')
        + remainTag
        + (isFull ? '<span class="cal-full-tag">FULLY BOOKED</span>' : '')
        + '</div>';
    }
    const rem = (firstDay + daysInM) % 7;
    for (let i = 1; i <= (rem === 0 ? 0 : 7 - rem); i++) {
      html += '<div class="cal-day other-month"><span class="cal-day-num">' + i + '</span></div>';
    }
    daysEl.style.minHeight = '';
    daysEl.innerHTML = html;

    renderPubCalEvents(snap);
  }).catch(() => {
    daysEl.style.minHeight = '';
    daysEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:1rem;color:#f87171;font-family:var(--font-mono);font-size:.7rem">Could not load calendar.</div>';
  });
}

function renderPubCalEvents(snap) {
  const el = document.getElementById('pubCalEvents');
  if (!el) return;
  const now = new Date(); now.setHours(0,0,0,0);

  // Sort key: earliest date first, then slot order (PA → LED Wall →
  // Disco) so multiple bookings on the same day appear in a stable,
  // predictable order rather than whatever order Supabase returned.
  const list = snap.docs.map(d => d.data())
    .filter(b => ['confirmed','deposit paid'].includes((b.status||'').toLowerCase())
              && b.date && new Date(b.date+'T00:00:00') >= now)
    .sort((a,b) => {
      const d = a.date.localeCompare(b.date);
      if (d !== 0) return d;
      return PUB_SLOT_KEYS.indexOf(pubSlotOf(a))
           - PUB_SLOT_KEYS.indexOf(pubSlotOf(b));
    })
    .slice(0, 8);

  if (!list.length) {
    el.innerHTML = '<div class="pce-empty">No upcoming bookings shown.</div>';
    return;
  }

  el.innerHTML = list.map(b => {
    const dt    = new Date(b.date+'T00:00:00');
    const mo    = dt.toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' }).toUpperCase();
    const slot  = pubSlotOf(b);
    const meta  = PUB_SLOT_META[slot];

    // Privacy: event type + package only — no client names or contact.
    // The slot label makes it clear which of the three slots this
    // booking occupies, so a customer checking the sidebar can tell at
    // a glance whether the PA slot is still open for their own event.
    const eventName = b.eventName || b.eventname || b.eventType || b.eventtype || 'Event';
    const pkgLabel  = b.pkg || 'Package';

    return '<div class="pce-item">'
      + '<div class="pce-date">' + mo + '</div>'
      + '<div class="pce-slot-tag ' + meta.color + '">' + meta.icon + ' ' + meta.label.toUpperCase() + '</div>'
      + '<div class="pce-name">' + eventName + '</div>'
      + '<div class="pce-pkg">' + pkgLabel + '</div>'
      + '</div>';
  }).join('');
}

// ── GALLERY MEDIA ITEMS ───────────────────
var DEFAULT_GALLERY_ITEMS = [
  { type:'photo', src:'PHOTOS/1.jpg',         label:'Event Setup' },
  { type:'photo', src:'PHOTOS/3.jpg',         label:'Professional DJs' },
  { type:'photo', src:'PHOTOS/4.jpg',         label:'Concert Setup' },
  { type:'photo', src:'PHOTOS/5.jpg',         label:'Wedding Reception' },
  { type:'photo', src:'PHOTOS/6.jpg',         label:'Battle of Sounds' },
  { type:'photo', src:'PHOTOS/7.jpg',         label:'Lights Show' },
  { type:'photo', src:'PHOTOS/9.jpg',         label:'DJ Setup' },
  { type:'photo', src:'PHOTOS/10.jpg',        label:'Mixer' },
  { type:'photo', src:'PHOTOS/11.jpg',        label:'Stage Setup' },
  { type:'photo', src:'PHOTOS/1000.jpg',      label:'DJ Equipment' },
  { type:'photo', src:'PHOTOS/ALLEN.jpg',     label:'Allen Mixer' },
  { type:'photo', src:'PHOTOS/AMPLIFIERS.jpg',label:'Amplifiers' },
  { type:'photo', src:'PHOTOS/DAUIS.jpg',     label:'Dauis Event' },
  { type:'photo', src:'PHOTOS/DJ.jpg',        label:'DJ Performance' },
  { type:'photo', src:'PHOTOS/LED WALL.jpg',  label:'LED Wall' },
  { type:'photo', src:'PHOTOS/LEMORE.jpg',    label:'Lemore Event' },
  { type:'photo', src:'PHOTOS/LIGHTS.jpg',    label:'Lights' },
  { type:'photo', src:'PHOTOS/LIGHTS1.jpg',   label:'Disco Night' },
  { type:'photo', src:'PHOTOS/491036076_1238012901665170_2149674050827853153_n.jpg', label:'M-Audio Pro Sound' },
  { type:'video', src:'PHOTOS/BEAM.mp4',      label:'Beam Lights' },
  { type:'video', src:'PHOTOS/LIGHTS CHECKS.mp4', label:'Lights Showcase' },
  { type:'video', src:'PHOTOS/CAD VS MAUDIO BATTLE OF SOUNDS DAUIS BOHOL.mp4', label:'Battle of Sounds' },
  { type:'video', src:'PHOTOS/PARTY.mp4',     label:'Disco Party' },
];
var GALLERY_ITEMS = DEFAULT_GALLERY_ITEMS.slice();

var DEFAULT_TEAM_MEMBERS = [
  { id:'default-1', name:'Steve T. Manubag', role:'FOUNDER &amp; OWNER', photourl:'PHOTOS/UNKEL SUIT.png',
    description:'The visionary behind M-Audio Pro Sound. Built the business from the ground up since 2005, growing from a single PA rig to a full professional AV company serving all of Bohol.',
    badge:'🎙 20 Years Experience' },
  { id:'default-2', name:'Robert M. Baro', role:'OPERATIONS MANAGER', photourl:'PHOTOS/KUYA.jpg',
    description:'Oversees all event logistics and equipment deployment from setup to teardown. The backbone of every event — ensuring everything runs on time and on point.',
    badge:'🚐 Field Operations Lead' },
  { id:'default-3', name:'Alberto C. Baro', role:'PRODUCTION MANAGER', photourl:'PHOTOS/SIR BERT SUIT.png',
    description:'Builds and fabricates sound system hardware including speaker boxes, equipment racks, and protective cases. The craftsman who keeps our gear in peak condition.',
    badge:'🔧 Hardware &amp; Fabrication' },
];
var TEAM_MEMBERS = DEFAULT_TEAM_MEMBERS.slice();

var DEFAULT_STORY_TEXT = {
  p1: 'Founded in <strong>2005</strong>, M-Audio Pro Sound started from a single PA rig and grew into Bohol\'s most trusted full-service events audio-visual company. From small school programs to full-scale concerts and wedding receptions, we\'ve powered every kind of celebration this island has to offer.',
  p2: 'Today we operate multiple complete PA rigs, an LED video wall system, disco battle units, and a dedicated crew of professional technicians, DJs, and lighting specialists — all based right here in Corella.'
};

function escHtml(s) { return (s == null ? '' : String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function renderTeamGrid(list) {
  const grid = document.getElementById('amTeamGrid');
  if (!grid) return;
  const members = (list && list.length) ? list : DEFAULT_TEAM_MEMBERS;
  grid.innerHTML = members.map(m => {
    const photo = m.photourl || m.photoURL || '';
    return `<div class="am-team-card">
      <div class="am-tc-photo-wrap" onclick="openTeamPhotoLb('${photo.replace(/'/g,"\\'")}','${escHtml(m.name).replace(/'/g,"\\'")}','${(m.role||'').replace(/'/g,"\\'")}')" title="Click to enlarge">
        <img src="${photo}" alt="${escHtml(m.name)}" class="am-tc-photo"/>
        <div class="am-tc-photo-overlay">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
      </div>
      <div class="am-tc-body">
        <div class="am-tc-role">${m.role || ''}</div>
        <div class="am-tc-name">${escHtml(m.name)}</div>
        <div class="am-tc-desc">${escHtml(m.description)}</div>
        ${m.badge ? `<div class="am-tc-badge">${escHtml(m.badge)}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function renderHighlightsGrid() {
  const grid = document.getElementById('spVideosGrid');
  if (!grid) return;
  const videos = GALLERY_ITEMS.map((item, idx) => ({ item, idx })).filter(x => x.item.type === 'video');
  if (!videos.length) { grid.innerHTML = '<p style="color:var(--gray2);padding:1rem">No videos yet.</p>'; return; }
  grid.innerHTML = videos.map(({ item, idx }) => `
    <div class="sp-vid-card" onclick="openLbViewer(${idx}, GALLERY_ITEMS)">
      <div class="sp-vid-thumb" style="display:flex;align-items:center;justify-content:center;background:var(--bg3);width:100%;height:100%"><span style="font-size:1.5rem">🎬</span></div>
      <div class="sp-vid-overlay">
        <div class="sp-vid-play"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
      </div>
      <div class="sp-vid-info"><span class="sp-vid-tag">VIDEO</span><span class="sp-vid-label">${escHtml(item.label)}</span></div>
    </div>`).join('');
}

async function loadAboutStory() {
  try {
    const doc = await db.collection('site_stats').doc('about_story').get();
    const el  = document.getElementById('amStoryText');
    if (!doc.exists || !el) return;
    const row = doc.data();
    const p1 = row.storyp1 || DEFAULT_STORY_TEXT.p1;
    const p2 = row.storyp2 || DEFAULT_STORY_TEXT.p2;
    el.innerHTML = `<p>${p1}</p><p>${p2}</p>`;
  } catch (e) { console.warn('[M-Audio] loadAboutStory failed:', e); }
}

function loadAboutTeam() {
  try {
    db.collection('team_members').onSnapshot(
      snap => {
        if (!snap.empty) {
          TEAM_MEMBERS = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            .sort((a,b) => (a.sortorder||0) - (b.sortorder||0));
        }
        renderTeamGrid(TEAM_MEMBERS);
      },
      err => { console.warn('[M-Audio] Team sync error:', err); renderTeamGrid(DEFAULT_TEAM_MEMBERS); }
    );
  } catch (e) { console.warn('[M-Audio] loadAboutTeam failed:', e); renderTeamGrid(DEFAULT_TEAM_MEMBERS); }
}

function loadAboutGallery() {
  try {
    db.collection('gallery_items').onSnapshot(
      snap => {
        if (!snap.empty) {
          GALLERY_ITEMS = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            .sort((a,b) => (a.sortorder||0) - (b.sortorder||0));
        }
        renderHighlightsGrid();
        if (_activeSidePanel === 'gallery') renderSpGallery('all');
      },
      err => { console.warn('[M-Audio] Gallery sync error:', err); renderHighlightsGrid(); }
    );
  } catch (e) { console.warn('[M-Audio] loadAboutGallery failed:', e); renderHighlightsGrid(); }
}

renderTeamGrid(TEAM_MEMBERS);
renderHighlightsGrid();

var _gbFiltered = GALLERY_ITEMS.slice();
var _lbIndex    = 0;

function openGalleryBrowser() {
  _gbFiltered = GALLERY_ITEMS.slice();
  renderGbGrid(_gbFiltered);
  document.getElementById('gbOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeGalleryBrowser() {
  document.getElementById('gbOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function gbCloseOutside(e) {
  if (e.target === document.getElementById('gbOverlay')) closeGalleryBrowser();
}
function gbFilter(btn, filter) {
  document.querySelectorAll('.gb-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _gbFiltered = filter === 'all' ? GALLERY_ITEMS.slice()
    : GALLERY_ITEMS.filter(i => i.type === filter);
  renderGbGrid(_gbFiltered);
}
function gbShuffle() {
  for (let i = _gbFiltered.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [_gbFiltered[i], _gbFiltered[j]] = [_gbFiltered[j], _gbFiltered[i]];
  }
  renderGbGrid(_gbFiltered);
}
function renderGbGrid(items) {
  const grid  = document.getElementById('gbGrid');
  const count = document.getElementById('gbCount');
  if (!grid) return;
  if (count) count.textContent = items.length + ' items';
  grid.innerHTML = items.map((item, idx) => {
    if (item.type === 'video') {
      return '<div class="gb-item" onclick="openLbViewer('+idx+',_gbFiltered)">'
        + '<span class="gb-item-badge gb-badge-video">VIDEO</span>'
        + '<div class="gb-item-play"><div class="gb-item-play-ring">&#9654;</div></div>'
        + '<div class="gb-item-ph"><span class="gb-item-ph-icon">&#127909;</span><span class="gb-item-ph-label">'+item.label+'</span></div>'
        + '<div class="gb-item-label">'+item.label+'</div></div>';
    }
    return '<div class="gb-item" onclick="openLbViewer('+idx+',_gbFiltered)">'
      + '<span class="gb-item-badge gb-badge-photo">PHOTO</span>'
      + '<img src="'+item.src+'" alt="'+item.label+'" loading="lazy" style="width:100%;height:100%;object-fit:cover"/>'
      + '<div class="gb-item-label">'+item.label+'</div></div>';
  }).join('');
}

var _lbItems = [];
function openLbViewer(idx, items) {
  _lbItems = items || GALLERY_ITEMS; _lbIndex = idx;
  renderLb();
  document.getElementById('lbViewer').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLbViewer() {
  document.getElementById('lbViewer').classList.remove('open');
  document.body.style.overflow = '';
  const vid = document.querySelector('#lbMediaWrap video');
  if (vid) vid.pause();
}
function lbNav(dir) {
  _lbIndex = (_lbIndex + dir + _lbItems.length) % _lbItems.length;
  renderLb();
}
function renderLb() {
  const item = _lbItems[_lbIndex];
  const wrap = document.getElementById('lbMediaWrap');
  if (!item || !wrap) return;
  const old = wrap.querySelector('video'); if (old) old.pause();
  wrap.innerHTML = item.type === 'video'
    ? '<video src="'+item.src+'" controls autoplay muted playsinline style="max-width:100%;max-height:calc(100vh - 140px)"></video>'
    : '<img src="'+item.src+'" alt="'+item.label+'" style="max-width:100%;max-height:calc(100vh - 140px);object-fit:contain"/>';
  const cap = document.getElementById('lbCaption'); if (cap) cap.textContent = item.label;
  const ctr = document.getElementById('lbCounter'); if (ctr) ctr.textContent = (_lbIndex+1)+' / '+_lbItems.length;
}
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lbViewer');
  if (!lb?.classList.contains('open')) return;
  if (e.key==='ArrowRight') lbNav(1);
  if (e.key==='ArrowLeft')  lbNav(-1);
  if (e.key==='Escape')     closeLbViewer();
});

// ── VIDEO HOVER PLAY ──────────────────────
document.querySelectorAll('.vid-wrap').forEach(wrap => {
  const vid = wrap.querySelector('.av-video');
  if (!vid) return;
  wrap.addEventListener('mouseenter', () => { vid.play().catch(()=>{}); wrap.classList.add('playing'); });
  wrap.addEventListener('mouseleave', () => { vid.pause(); wrap.classList.remove('playing'); });
  wrap.addEventListener('click', () => {
    if (wrap.classList.contains('playing')) { vid.pause(); wrap.classList.remove('playing'); }
    else { vid.play().catch(()=>{}); wrap.classList.add('playing'); }
  });
});

// ── FAQ ACCORDION ─────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    item.classList.toggle('open');
    item.querySelector('.faq-a').classList.toggle('open');
  });
});

// ── MOBILE BURGER ─────────────────────────
const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');
if (burger && mobMenu) {
  burger.addEventListener('click', () => mobMenu.classList.toggle('open'));
  mobMenu.querySelectorAll('.mm-link').forEach(a => a.addEventListener('click', () => mobMenu.classList.remove('open')));
}

// ── ACTIVE NAV ON SCROLL ──────────────────
(function() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nl');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        links.forEach(l => l.classList.remove('active'));
        document.querySelector('.nl[href="#'+sec.id+'"]')?.classList.add('active');
      }
    });
  }, { passive: true });
})();

// ── NAVBAR SCROLL ─────────────────────────
(function() {
  const nav = document.getElementById('navbar');
  const s = () => nav?.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', s, { passive: true }); s();
})();

// ── REVEAL ON SCROLL ──────────────────────
(function() {
  const els = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-skew');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
  document.querySelectorAll('.hero .reveal-up,.hero .reveal-left,.hero .reveal-right,.hero .reveal-skew')
    .forEach(el => setTimeout(() => el.classList.add('visible'), 100));
})();

// ── Load live price overrides from Supabase ─────────────────
async function loadLivePrices() {
  try {
    const snap = await db.collection('package_price_overrides').get();
    if (snap.empty) return;

    snap.docs.forEach(d => {
      const row      = { id: d.id, ...d.data() };
      const pkgId    = row.id || row.packageid;
      const newPrice = parseFloat(row.currentprice || row.currentPrice);
      if (!pkgId || !newPrice || newPrice <= 0) return;

      const bookBtns = document.querySelectorAll(`a.btn-pkg[data-pkg="${pkgId}"]`);
      bookBtns.forEach(btn => {
        const venue = btn.dataset.venue;
        const finalPrice = venue === 'outdoor' ? newPrice + 1000 : newPrice;

        try {
          const u = new URL(btn.getAttribute('href'), location.href);
          u.searchParams.set('price', finalPrice);
          btn.setAttribute('href', u.pathname + u.search);
        } catch (_) {}

        const card = btn.closest('.pkg-card');
        if (!card) return;

        if (!venue) {
          const priceEl = card.querySelector('.pkg-price');
          if (priceEl) priceEl.textContent = newPrice.toLocaleString('en-PH');
          return;
        }

        const locNotes = card.querySelectorAll('.pkg-lw-loc');
        if (venue === 'indoor') {
          if (locNotes[0]) locNotes[0].textContent = `🏛 Indoors — ₱${newPrice.toLocaleString('en-PH')}`;
          const priceEl = card.querySelector('.pkg-price');
          if (priceEl) priceEl.textContent = newPrice.toLocaleString('en-PH');
        } else {
          if (locNotes[1]) locNotes[1].textContent = `🌤 Outdoors — ₱${(newPrice + 1000).toLocaleString('en-PH')}`;
        }
      });
    });

    let minPrice = Infinity;
    document.querySelectorAll('#pcat-basic .pkg-price, #pcat-wedding .pkg-price').forEach(el => {
      const n = parseFloat((el.textContent || '').replace(/,/g, ''));
      if (n > 0 && n < minPrice) minPrice = n;
    });
    if (minPrice < Infinity) {
      document.querySelectorAll('.qa-card-desc').forEach(el => {
        if (el.textContent.includes('from ₱')) {
          el.innerHTML = el.innerHTML.replace(/from ₱[\d,]+/, `from ₱${minPrice.toLocaleString('en-PH')}`);
        }
      });
    }

  } catch (_) { /* silent — hardcoded HTML prices remain as fallback */ }
}

// ── Quick Access Modal ───────────────────────────────────────
function openQAModal() {
  const overlay = document.getElementById('qaOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeQAModal() {
  const overlay = document.getElementById('qaOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
function qaCloseOutside(e) {
  if (e.target === document.getElementById('qaOverlay')) closeQAModal();
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeQAModal();
});

window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.pkg-custom-invite');
    if (btn && btn.classList.contains('pkg-custom-invite')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openCustomizer();
      return false;
    }
  }, true);

  initPubCal();
  loadLivePrices();
  loadLiveStats();
  loadAboutStory();
  loadAboutTeam();
  loadAboutGallery();
});

// ── SIDE PANEL SYSTEM ────────────────────────────────────────
let _activeSidePanel = null;

function openSidePanel(which) {
  closeSidePanel(false);
  if (which === 'about')      { openAboutModal();      return; }
  if (which === 'gallery')    { openGalleryModal();    return; }
  if (which === 'highlights') { openHighlightsModal(); return; }
}

function openGalleryModal() {
  const overlay = document.getElementById('galleryModalOverlay');
  if (!overlay) return;
  document.querySelectorAll('.side-tab').forEach((t, i) => {
    const labels = ['about', 'gallery', 'highlights'];
    t.classList.toggle('active', labels[i] === 'gallery');
  });
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  _activeSidePanel = 'gallery';
  renderSpGallery('all');
}
function closeGalleryModal(e) {
  const overlay = document.getElementById('galleryModalOverlay');
  if (!overlay) return;
  if (e && e.target !== overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  document.querySelectorAll('.side-tab').forEach(t => t.classList.remove('active'));
  _activeSidePanel = null;
}
function openHighlightsModal() {
  const overlay = document.getElementById('highlightsModalOverlay');
  if (!overlay) return;
  document.querySelectorAll('.side-tab').forEach((t, i) => {
    const labels = ['about', 'gallery', 'highlights'];
    t.classList.toggle('active', labels[i] === 'highlights');
  });
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  _activeSidePanel = 'highlights';
}
function closeHighlightsModal(e) {
  const overlay = document.getElementById('highlightsModalOverlay');
  if (!overlay) return;
  if (e && e.target !== overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  document.querySelectorAll('.side-tab').forEach(t => t.classList.remove('active'));
  _activeSidePanel = null;
}
function closeSidePanel(restoreScroll = true) {
  closeAboutModal();
  document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('open'));
  document.querySelector('.side-panel-overlay')?.classList.remove('open');
  document.getElementById('galleryModalOverlay')?.classList.remove('open');
  document.getElementById('highlightsModalOverlay')?.classList.remove('open');
  document.querySelectorAll('.side-tab').forEach(t => t.classList.remove('active'));
  if (restoreScroll) document.body.style.overflow = '';
  _activeSidePanel = null;
}
function openAboutModal() {
  const overlay = document.getElementById('aboutModalOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAboutModal(e) {
  const overlay = document.getElementById('aboutModalOverlay');
  if (!overlay) return;
  if (e && e.target !== overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
function openTeamPhotoLb(src, name, role) {
  const lb = document.getElementById('teamPhotoLb');
  const img = document.getElementById('teamLbImg');
  const nameEl = document.getElementById('teamLbName');
  const roleEl = document.getElementById('teamLbRole');
  if (!lb || !img) return;
  img.src = src;
  img.alt = name;
  if (nameEl) nameEl.textContent = name;
  if (roleEl) roleEl.innerHTML = role;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeTeamPhotoLb() {
  const lb = document.getElementById('teamPhotoLb');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}
function renderSpGallery(filter) {
  const grid = document.getElementById('spGalleryGrid');
  if (!grid) return;
  const items = filter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.type === filter);
  grid.innerHTML = items.map((item, idx) => {
    const realIdx = GALLERY_ITEMS.indexOf(item);
    if (item.type === 'video') {
      return `<div class="sp-gi" onclick="openLbViewer(${realIdx},GALLERY_ITEMS)">
        <div class="sp-gi-play"><div class="sp-gi-play-ring">&#9654;</div></div>
        <div class="sp-gi-overlay"><span class="sp-gi-label">${item.label}</span></div>
        <span class="sp-gi-badge">VIDEO</span>
      </div>`;
    }
    return `<div class="sp-gi" onclick="openLbViewer(${realIdx},GALLERY_ITEMS)">
      <img src="${item.src}" alt="${item.label}" loading="lazy"/>
      <div class="sp-gi-overlay"><span class="sp-gi-label">${item.label}</span></div>
      <span class="sp-gi-badge">PHOTO</span>
    </div>`;
  }).join('');
}
function spGalleryFilter(btn, filter) {
  document.querySelectorAll('.sp-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderSpGallery(filter);
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const teamLb = document.getElementById('teamPhotoLb');
  if (teamLb?.classList.contains('open')) { closeTeamPhotoLb(); return; }
  const aboutOv = document.getElementById('aboutModalOverlay');
  if (aboutOv?.classList.contains('open')) { aboutOv.classList.remove('open'); document.body.style.overflow = ''; return; }
  if (_activeSidePanel) closeSidePanel();
});

// ── Live stats sync from Supabase (site_stats table) ─────────
function loadLiveStats() {
  function applyStats(snap) {
    if (!snap || snap.empty) return;
    snap.docs.forEach(d => {
      const row = { id: d.id, ...d.data() };
      if (row.id !== 'homepage') return;

      if (row.years) {
        document.querySelectorAll('.hstat-n').forEach(el => {
          if ((el.nextElementSibling || el.closest('.hstat')?.querySelector('.hstat-l'))?.textContent?.toLowerCase().includes('year')) {
            el.textContent = row.years;
          }
        });
        document.querySelectorAll('.am-stat-n').forEach(el => {
          const lbl = el.nextElementSibling?.textContent?.toLowerCase() || '';
          if (lbl.includes('year')) el.textContent = row.years;
        });
        const badge = document.querySelector('.side-tab-badge');
        if (badge && badge.textContent.includes('YRS')) badge.textContent = row.years + ' YRS';
      }

      if (row.events) {
        document.querySelectorAll('.hstat-n').forEach(el => {
          const lbl = (el.nextElementSibling || el.closest('.hstat')?.querySelector('.hstat-l'))?.textContent?.toLowerCase() || '';
          if (lbl.includes('event')) el.textContent = row.events;
        });
        document.querySelectorAll('.am-stat-n').forEach(el => {
          if ((el.nextElementSibling?.textContent || '').toLowerCase().includes('event')) el.textContent = row.events;
        });
      }

      if (row.followers) {
        document.querySelectorAll('.hstat-n').forEach(el => {
          const lbl = (el.nextElementSibling || el.closest('.hstat')?.querySelector('.hstat-l'))?.textContent?.toLowerCase() || '';
          if (lbl.includes('follow')) el.textContent = row.followers;
        });
        document.querySelectorAll('.am-stat-n').forEach(el => {
          if ((el.nextElementSibling?.textContent || '').toLowerCase().includes('follow')) el.textContent = row.followers;
        });
        document.querySelectorAll('.c-card-hint').forEach(el => {
          if (el.textContent.includes('followers')) {
            el.textContent = el.textContent.replace(/[\d.,]+K?\s*followers/, row.followers + ' followers');
          }
        });
      }
    });
  }

  try {
    db.collection('site_stats').onSnapshot(
      function(snap) { applyStats(snap); },
      function(err)  { console.warn('[M-Audio] Stats sync error:', err); }
    );
  } catch (e) {
    console.warn('[M-Audio] loadLiveStats failed:', e);
  }
}