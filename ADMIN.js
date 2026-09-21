/* ══════════════════════════════════════════
   M-AUDIO PRO — ADMIN.js
   Full admin panel logic: Supabase, bookings,
   calendar.
   ══════════════════════════════════════════ */

// ── PACKAGE DATA (shared with BOOKING.js) ─
// This is the canonical package database that matches the customer dashboard
const PACKAGE_DATA = {
  basic: {
    label: 'BASIC PA SETUPS', subtitle: 'For programs, recognitions & small gatherings', icon: '🔊', crew: 3,
    packages: [
      { id: 'basic-1', name: 'BASIC PA', num: 1, price: 5000, inclusions: ['4 pcs — Aerolights RGBW Parleds', '4 pcs — KOSMO White Amber Parleds', '2 pcs — Parled Crank Stands', '2 pcs — TS415 Alto Professional Speakers', '2 pcs — Phynex Pro Wireless Mic', '2 pcs — Mic Stands', '1 pc — Soundcraft SIG12 Analog Mixer', '1 pc — Laptop for Playback'] },
      { id: 'basic-2', name: 'BASIC PA+', num: 2, price: 6000, inclusions: ['8 pcs — Aerolights RGBW Parleds', '4 pcs — KOSMO White Amber Parleds', '2 pcs — Parled Crank Stands', '2 pcs — Turbosound iQ12 Speakers', '1 pc — Allen & Heath QU16 Digital Mixer', '4 pcs — Phynex Pro Wireless Mic', '4 pcs — Mic Stands', '1 pc — Smoke Machine', '1 pc — Power Box', '1 pc — Laptop for Playback'] },
      { id: 'basic-3', name: 'BASIC PRO', num: 3, price: 7500, inclusions: ['12 pcs — Aerolights RGBW Parleds', '4 pcs — KOSMO White Amber Parleds', '2 pcs — MATRIX BEAM 230', '2 pcs — Parled Crank Stands', '4 pcs — TS415 Alto Professional Speakers', '1 pc — Allen & Heath QU16 Digital Mixer', '4 pcs — Phynex Pro Wireless Mic', '4 pcs — Mic Stands', '1 pc — Smoke Machine', '1 pc — Power Box', '1 pc — Laptop for Playback'] },
    ]
  },
  wedding: {
    label: 'WEDDING SETUPS', subtitle: 'For weddings, debuts, pageants & after parties', icon: '💍', crew: 5,
    packages: [
      { id: 'wed-1', name: 'WED STARTER', num: 1, price: 5000, inclusions: ['4 pcs — Aerolights RGBW Parleds', '4 pcs — KOSMO White Amber Parleds', '2 pcs — Parled Crank Stands', '2 pcs — TS415 Alto Professional Speakers', '2 pcs — Phynex Pro Wireless Mic', '2 pcs — Mic Stands', '1 pc — Soundcraft SIG12 Analog Mixer', '1 pc — Laptop for Playback'] },
      { id: 'wed-2', name: 'WED BASIC', num: 2, price: 6000, inclusions: ['8 pcs — Aerolights RGBW Parleds', '4 pcs — KOSMO White Amber Parleds', '2 pcs — Parled Crank Stands', '2 pcs — Turbosound iQ12 Speakers', '1 pc — Allen & Heath QU16 Digital Mixer', '4 pcs — Phynex Pro Wireless Mic', '4 pcs — Mic Stands', '1 pc — Smoke Machine', '1 pc — Power Box', '1 pc — Laptop for Playback'] },
      { id: 'wed-3', name: 'WED PLUS', num: 3, price: 7500, inclusions: ['12 pcs — Aerolights RGBW Parleds', '4 pcs — KOSMO White Amber Parleds', '2 pcs — MATRIX BEAM 230', '2 pcs — Parled Crank Stands', '4 pcs — TS415 Alto Professional Speakers', '1 pc — Allen & Heath QU16 Digital Mixer', '4 pcs — Phynex Pro Wireless Mic', '4 pcs — Mic Stands', '1 pc — Smoke Machine', '1 pc — Power Box', '1 pc — Laptop for Playback'] },
      { id: 'wed-4', name: 'WED DELUXE', num: 4, price: 9500, inclusions: ['20 pcs — Aerolights RGBW Parleds', '6 pcs — KOSMO White Amber Parleds', '2 pcs — MATRIX Crowd Lights', '4 pcs — KOSMO BEAM 400', '2 pcs — Parled Crank Stands', '4 pcs — TS415 Alto Professional Speakers', '2 pcs — 18" Subwoofer Speaker', '1 pc — Allen & Heath QU16 Digital Mixer', '4 pcs — Phynex Pro Wireless Mic', '4 pcs — Mic Stands', '1 pc — Smoke Machine', '1 pc — MATRIX Haze Machine', '1 pc — Power Box', '1 pc — Laptop for Playback'] },
      { id: 'wed-5', name: 'WED PREMIUM', num: 5, price: 11000, inclusions: ['20 pcs — Aerolights RGBW Parleds', '8 pcs — KOSMO White Amber Parleds', '2 pcs — MATRIX Crowd Lights', '6 pcs — KOSMO BEAM 400', '2 pcs — Parled Crank Stands', '4 pcs — Moving Head Stands', '4 pcs — TS415 Alto Professional Speakers', '2 pcs — Beringer Eurolive Monitors', '2 pcs — 18" Subwoofer Speaker', '1 pc — Allen & Heath QU16 Digital Mixer', '4 pcs — Phynex Pro Wireless Mic', '4 pcs — Mic Stands', '1 pc — Smoke Machine', '1 pc — MATRIX Haze Machine', '1 pc — Power Box', '1 pc — Laptop for Playback'] },
      { id: 'wed-6', name: 'WED ELITE', num: 6, price: 12000, inclusions: ['26 pcs — Aerolights RGBW Parleds', '8 pcs — KOSMO White Amber Parleds', '2 pcs — MATRIX Crowd Lights', '6 pcs — KOSMO BEAM 400', '2 pcs — Parled Crank Stands', '4 pcs — Moving Head Stands', '4 pcs — TS415 Alto Professional Speakers', '2 pcs — Beringer Eurolive Monitors', '2 pcs — 18" Subwoofer Speaker', '1 pc — Allen & Heath QU16 Digital Mixer', '6 pcs — Phynex Pro Wireless Mic', '6 pcs — Mic Stands', '1 pc — Smoke Machine', '1 pc — Haze Machine', '1 pc — Power Box', '1 pc — Laptop for Playback'] },
      { id: 'wed-7', name: 'WED GRAND', num: 7, price: 14000, inclusions: ['30 pcs — Aerolights RGBW Parleds', '8 pcs — KOSMO White Amber Parleds', '2 pcs — MATRIX Crowd Lights', '8 pcs — KOSMO BEAM 400', '4 pcs — Parled Crank Stands', '4 pcs — Moving Head Stands', '2 pcs — Turbo Sound iQ12 Speakers', '4 pcs — TS415 Alto Professional Speakers', '2 pcs — Beringer Eurolive Monitors', '2 pcs — 18" Subwoofer Speaker', '1 pc — Allen & Heath QU16 Digital Mixer', '6 pcs — Phynex Pro Wireless Mic', '6 pcs — Mic Stands', '2 pcs — Smoke Machine', '1 pc — Haze Machine', '1 pc — Power Box', '1 pc — Laptop for Playback'] },
      { id: 'wed-8', name: 'WED ULTRA', num: 8, price: 18000, inclusions: ['44 pcs — Aerolights RGBW Parleds', '8 pcs — KOSMO White Amber Parleds (FRONTAL)', '4 pcs — MATRIX Crowd Lights', '8 pcs — KOSMO BEAM 400', '8 pcs — MATRIX BEAM 280', '4 pcs — Parled Crank Stands', '4 pcs — Moving Head Stands', '4 pcs — TS415 Alto Professional Speakers', '2 pcs — Beringer Eurolive Monitors', '2 pcs — 18" Subwoofer Speaker', '1 pc — Allen & Heath QU16 Digital Mixer', '6 pcs — Phynex Pro Wireless Mic', '6 pcs — Mic Stands', '2 pcs — Smoke Machine', '1 pc — Haze Machine', '1 pc — Power Box', '1 pc — Laptop for Playback'] },
    ]
  },
  bigcrowd: {
    label: 'BIG CROWD SETUPS', subtitle: 'For concerts, festivals & large outdoor events', icon: '🎪', crew: 7,
    packages: [
      { id: 'big-8', name: 'CROWD PRO', num: 8, price: 18000, tag: 'BIG CROWD', inclusions: ['30 pcs — Aerolights RGBW Parleds', '8 pcs — KOSMO White Amber Parleds (FRONTAL)', '2 pcs — MATRIX Crowd Lights', '8 pcs — KOSMO BEAM 400', '4 pcs — Parled Crank Stands', '4 pcs — Moving Head Stands', '2 pcs — Passive P-AUDIO Tower Speakers', '2 pcs — TS415 ALTO Speakers', '2 pcs — 18" Passive Subwoofer Speaker', '1 pc — Allen & Heath QU16 Digital Mixer', '6 pcs — Phynex Pro Wireless Mic', '6 pcs — Mic Stands', '2 pcs — Smoke Machine', '1 pc — Haze Machine', '1 pc — Power Box', '1 pc — Laptop for Playback'] },
      { id: 'big-9', name: 'CROWD MAX', num: 9, price: 22000, tag: 'BIG CROWD', inclusions: ['44 pcs — Aerolights RGBW Parleds', '8 pcs — KOSMO White Amber Parleds (FRONTAL)', '4 pcs — MATRIX Crowd Lights', '8 pcs — KOSMO BEAM 400', '8 pcs — MATRIX BEAM 280', '4 pcs — Parled Crank Stands', '4 pcs — Moving Head Stands', '4 pcs — TS415 Alto Professional Speakers', '2 pcs — Beringer Eurolive Monitors', '2 pcs — Passive P-AUDIO Tower Speakers', '2 pcs — 18" Subwoofer Speaker', '1 pc — Allen & Heath QU16 Digital Mixer', '6 pcs — Phynex Pro Wireless Mic', '6 pcs — Mic Stands', '2 pcs — Smoke Machine', '1 pc — Haze Machine', '1 pc — Power Box', '1 pc — Laptop for Playback'] },
    ]
  },
  ledwall: {
    label: 'LED WALL ONLY', subtitle: 'LED screen rental — indoor & outdoor rates', icon: '📺', crew: 2,
    packages: [
      { id: 'lw-35', num: null, price: 14000, priceOutdoor: 15000, panels: 35, name: '35 PANELS', inclusions: ['35 LED Wall Panels', 'Full setup & teardown by crew', 'Controller & signal processor', 'Power distribution box', '2 dedicated LED wall technicians'], note: 'Indoors ₱14,000 · Outdoors ₱15,000' },
      { id: 'lw-40', num: null, price: 18000, priceOutdoor: 19000, panels: 40, name: '40 PANELS', inclusions: ['40 LED Wall Panels', 'Full setup & teardown by crew', 'Controller & signal processor', 'Power distribution box', '2 dedicated LED wall technicians'], note: 'Indoors ₱18,000 · Outdoors ₱19,000' },
    ]
  }
};
// ══════════════════════════════════════════════════════════════
//  INTERACTIVE FINANCE CARDS
// ══════════════════════════════════════════════════════════════
function selectFinCard(cardType) {
    const allCards = document.querySelectorAll('.fin-stat-card');
    const clickedCard = document.querySelector(`.fin-stat-card[data-fin-card="${cardType}"]`);

    // Toggle logic: If you click the same card again, clear the filter
    if (_finActiveCard === cardType) {
        _finActiveCard = null;
        clickedCard.classList.remove('is-selected', 'just-clicked');
    } else {
        // 1. Clear previous selections from all cards
        allCards.forEach(c => c.classList.remove('is-selected', 'just-clicked'));
        
        // 2. Highlight the clicked card
        _finActiveCard = cardType;
        clickedCard.classList.add('is-selected', 'just-clicked');
        
        // 3. Remove the pulse animation class after it finishes playing
        setTimeout(() => clickedCard.classList.remove('just-clicked'), 600);
    }

    // 4. Reload the finance data to apply the filter to the table
    loadFinance();
}

// ══════════════════════════════════════════════════════════════
//  INTERACTIVE STAT CARDS — Dashboard & Finance
// ══════════════════════════════════════════════════════════════

let _finActiveCard = null; // Tracks which finance card is selected ('revenue', 'collected', etc.)

/**
 * Handles clicks on Dashboard stat cards.
 * Highlights the clicked card and redirects to the relevant page with filters.
 */
function goToDashCard(el, targetPage, filterValue) {
    // 1. Clear previous selections on all dashboard cards
    document.querySelectorAll('.stat-card-click').forEach(c => {
        c.classList.remove('is-selected', 'just-clicked');
    });

    // 2. Highlight the clicked card
    el.classList.add('is-selected', 'just-clicked');
    
    // 3. Remove the pulse animation class after it finishes
    setTimeout(() => el.classList.remove('just-clicked'), 600);

    // 4. Navigate to the target page
    navigate(targetPage);

    // 5. Apply specific filters if navigating to Bookings
    if (targetPage === 'bookings' && filterValue) {
        // Small delay to ensure the Bookings page HTML is ready
        setTimeout(() => {
            const filterBtn = document.querySelector(`.bk-ftab[data-status="${filterValue}"]`);
            if (filterBtn) {
                filterBtn.click(); // Triggers setBkFilter()
            } else {
                // Fallback if the specific button isn't found
                setBkFilter(filterValue, document.querySelector(`.bk-ftab[data-status="all"]`));
            }
        }, 150);
    }
}
/**
 * Handles clicks on Financial Reports stat cards.
 * Highlights the clicked card and filters the finance tables/charts.
 */
function selectFinCard(cardType) {
    // 1. Clear previous selections on all finance cards
    document.querySelectorAll('.fin-stat-card').forEach(c => {
        c.classList.remove('is-selected', 'just-clicked');
    });

    // 2. Highlight the clicked card
    const el = document.querySelector(`.fin-stat-card[data-fin-card="${cardType}"]`);
    if (el) {
        el.classList.add('is-selected', 'just-clicked');
        setTimeout(() => el.classList.remove('just-clicked'), 600);
    }

    // 3. Update global state and reload finance data
    _finActiveCard = (_finActiveCard === cardType) ? null : cardType; // Toggle off if clicked again
    
    // If toggled off, remove highlight
    if (!_finActiveCard && el) {
        el.classList.remove('is-selected');
    }

    loadFinance(); // Re-render tables with new filter

    // If 'expenses' is selected, scroll to the Expense Ledger
    if (_finActiveCard === 'expenses') {
        const ledger = document.getElementById('finExpenseLedgerCard');
        if (ledger) ledger.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function findPackageById(id) {
  for (const [catKey, cat] of Object.entries(PACKAGE_DATA)) {
    const pkg = cat.packages.find(p => p.id === id);
    if (pkg) return { pkg, cat, catKey };
  }
  return null;
}

// ── NAVIGATION ────────────────────────────
const pages = document.querySelectorAll('.page');
const items = document.querySelectorAll('.sb-item[data-page]');
const titles = {
  dashboard: 'DASHBOARD', bookings: 'BOOKINGS', clients: 'CLIENTS',
  packages: 'PACKAGES', crew: 'CREW MANAGEMENT', calendar: 'BOOKING CALENDAR',
  finance: 'FINANCIAL REPORTS', aboutus: 'ABOUT US', settings: 'SETTINGS'
};

function navigate(id) {
  pages.forEach(p => p.classList.remove('active'));
  items.forEach(i => i.classList.remove('active'));
  const pg = document.getElementById('page-' + id);
  const it = document.querySelector('[data-page="' + id + '"]');
  if (pg) pg.classList.add('active');
  if (it) it.classList.add('active');
  const titleEl = document.getElementById('topbarTitle');
  if (titleEl) titleEl.textContent = titles[id] || id.toUpperCase();
  document.querySelector('.content').scrollTop = 0;
  if (window.lucide) setTimeout(() => lucide.createIcons(), 50);
  if (id === 'calendar')  initAdmCal();
  if (id === 'bookings')  loadBookings();
  if (id === 'dashboard') loadDashboard();
  if (id === 'clients')   loadClients();
  if (id === 'crew')      loadCrew();
  if (id === 'finance')   { loadFinance(); loadExpenses(); }
  if (id === 'packages')  loadPackages();
  if (id === 'settings')  loadSettings();
  if (id === 'aboutus')   loadAboutUs();
}
items.forEach(item => item.addEventListener('click', () => navigate(item.dataset.page)));

// ── CLOCK ─────────────────────────────────
function updateClock() {
  const now  = new Date();
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const h    = now.getHours(), m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh   = (h % 12 || 12).toString().padStart(2, '0');
  const mm   = m.toString().padStart(2, '0');
  const el   = document.getElementById('topbarClock');
  if (el) el.textContent = days[now.getDay()] + ' ' + hh + ':' + mm + ' ' + ampm;
}
updateClock();
setInterval(updateClock, 10000);

// ── MODALS ────────────────────────────────
function _whoIsLoggedIn() {
  return _currentAdminDisplayName || (_currentUserEmail ? _currentUserEmail.split('@')[0] : 'Admin');
}
function openModal(id)  {
  document.getElementById(id)?.classList.add('open');
  if (id === 'modalAddExpense') {
    const byEl = document.getElementById('exp-by');
    if (byEl) byEl.value = _whoIsLoggedIn();
  }
}
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function confirmDelete(docId) { openModal('modalDelete'); window._pendingDeleteId = docId || null; }
document.querySelectorAll('.modal-overlay').forEach(ov => {
  ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('open'); });
});

// ── TOAST ─────────────────────────────────
function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = (type === 'err' ? '✕  ' : type === 'ok' ? '✓  ' : '  ') + msg;
  t.style.background = type === 'err' ? '#7f1d1d' : type === 'ok' ? '#14532d' : '';
  t.classList.add('show');
  setTimeout(() => { t.classList.remove('show'); t.style.background = ''; }, 3500);
}
function saveAndClose(id, msg) { closeModal(id); if (msg) showToast(msg, 'ok'); }

// ══════════════════════════════════════════
//  DOUBLE VERIFICATION — destructive actions
// ══════════════════════════════════════════
function _openConfirmModal(opts) {
  const overlay = document.getElementById('modalConfirm');
  if (!overlay) { if (confirm(opts.message)) opts.onConfirm(); return; }

  const titleEl  = document.getElementById('confirmTitle');
  const msgEl    = document.getElementById('confirmMessage');
  const inputEl  = document.getElementById('confirmWordInput');
  const hintEl   = document.getElementById('confirmWordHint');
  const btnEl    = document.getElementById('confirmActionBtn');

  if (titleEl) titleEl.textContent = opts.title || '⚠ CONFIRM ACTION';
  if (msgEl)   msgEl.innerHTML     = opts.message || '';
  if (hintEl)  hintEl.textContent  = opts.confirmWord || 'CONFIRM';
  if (inputEl) { inputEl.value = ''; inputEl.placeholder = opts.confirmWord || 'CONFIRM'; }
  if (btnEl)   {
    btnEl.textContent = opts.confirmBtnLabel || 'Confirm';
    btnEl.style.background = opts.confirmBtnColor || '#e8180c';
    btnEl.disabled = true;
    btnEl.style.opacity = '.45';
    btnEl.style.cursor  = 'not-allowed';
  }

  const expected = (opts.confirmWord || 'CONFIRM').toUpperCase();

  if (inputEl) {
    const fresh = inputEl.cloneNode(true);
    inputEl.replaceWith(fresh);
    fresh.addEventListener('input', () => {
      const liveBtn = document.getElementById('confirmActionBtn');
      if (!liveBtn) return;
      const ok = fresh.value.trim().toUpperCase() === expected;
      liveBtn.disabled = !ok;
      liveBtn.style.opacity = ok ? '1' : '.45';
      liveBtn.style.cursor  = ok ? 'pointer' : 'not-allowed';
    });
    setTimeout(() => fresh.focus(), 60);
  }

  if (btnEl) {
    const freshBtn = btnEl.cloneNode(true);
    btnEl.replaceWith(freshBtn);
    freshBtn.addEventListener('click', async () => {
      freshBtn.disabled = true;
      freshBtn.textContent = 'Working…';
      try { await opts.onConfirm(); }
      finally { closeModal('modalConfirm'); }
    });
  }

  openModal('modalConfirm');
}

function confirmStatusChange(bookingId, newStatus, booking, onDone) {
  const statusWords = {
    'confirmed':    'CONFIRM',
    'cancelled':    'CANCEL',
    'deposit paid': 'DEPOSIT',
    'completed':    'DONE',
  };
  const messages = {
    'confirmed':    `Confirm this booking?<br><br><strong style="color:#22c55e">${esc(booking.name || '—')}</strong> — ${esc(booking.pkg || '')}<br>Event: ${esc(booking.eventName || '—')}<br>Date: ${esc(booking.date || '—')}<br><br>This registers the booking as confirmed and marks the date as taken.`,
    'cancelled':    `Cancel this booking?<br><br><strong style="color:#f87171">${esc(booking.name || '—')}</strong> — ${esc(booking.pkg || '')}<br>Event: ${esc(booking.eventName || '—')}<br>Date: ${esc(booking.date || '—')}<br><br>The date will be freed up for new bookings. The record is kept with status "cancelled".`,
    'deposit paid': `Mark the down payment as collected?<br><br><strong>${esc(booking.name || '—')}</strong><br>Amount: ₱${(booking.downPay || 0).toLocaleString('en-PH')}<br><br>Only mark this after you have verified the payment in GCash / BPI.`,
    'completed':    `Mark this event as DONE?<br><br><strong>${esc(booking.name || '—')}</strong><br>Event: ${esc(booking.eventName || '—')}<br>Date: ${esc(booking.date || '—')}<br><br>This will:<br>• Collect the full balance as settled<br>• Auto-log crew payroll to Expenses (if crew is assigned)<br>• Increment each crew member's event count`,
  };

  _openConfirmModal({
    title: `⚠ ${newStatus.toUpperCase()} BOOKING`,
    message: messages[newStatus] || `Change status to ${newStatus}?`,
    confirmWord: statusWords[newStatus] || 'CONFIRM',
    confirmBtnLabel: newStatus === 'cancelled' ? 'Yes, Cancel Booking' : 'Confirm',
    confirmBtnColor: newStatus === 'cancelled' ? '#c0150b' : (newStatus === 'confirmed' ? '#22c55e' : '#e8180c'),
    onConfirm: async () => {
      await updateBookingStatus(bookingId, newStatus, booking);
      if (onDone) await onDone();
    }
  });
}

function deleteBooking(bookingId) {
  const booking = _bStore[bookingId];
  if (!booking) { showToast('Booking not found.', 'err'); return; }

  _openConfirmModal({
    title: '🗑 DELETE BOOKING PERMANENTLY',
    message:
      `This will <strong style="color:#f87171">permanently delete</strong> this booking.<br><br>` +
      `Client: <strong>${esc(booking.name || '—')}</strong><br>` +
      `Package: ${esc(booking.pkg || '—')}<br>` +
      `Event: ${esc(booking.eventName || '—')}<br>` +
      `Date: ${esc(booking.date || '—')}<br>` +
      `Amount: ₱${(booking.totalPrice || 0).toLocaleString('en-PH')}<br><br>` +
      `<span style="color:#f87171">⚠ This action CANNOT be undone. The booking's history, crew assignment, and payroll records will be lost. Use "Cancel" instead if you only want to free up the date.</span>`,
    confirmWord: 'DELETE',
    confirmBtnLabel: 'Permanently Delete',
    confirmBtnColor: '#7f1d1d',
    onConfirm: async () => {
      try {
        try { await db.collection('booking_availability').doc(bookingId).delete(); }
        catch (_) { /* paired row may not exist — non-fatal */ }

        await db.collection('bookings').doc(bookingId).delete();

        delete _bStore[bookingId];
        closeModal('modalBookingDetail');
        showToast('Booking deleted permanently.', 'err');

        loadBookings();
        loadDashboard();
        if (document.getElementById('page-calendar')?.classList.contains('active')) {
          renderAdmCal();
          renderAdmUpcoming();
        }
        if (document.getElementById('page-finance')?.classList.contains('active')) loadFinance();
      } catch (e) {
        showToast('Delete failed: ' + e.message, 'err');
        throw e;
      }
    }
  });
}

// ── TABLE FILTER ──────────────────────────
function filterTable(tableId, query) {
  const tbl = document.getElementById(tableId);
  if (!tbl) return;
  const q = query.toLowerCase();
  tbl.querySelectorAll('tbody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}
function filterCrewCards(q) {
  document.querySelectorAll('.crew-card').forEach(c => {
    c.style.display = c.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}
function setCrewView(mode) {
  const grid = document.getElementById('crewGrid');
  const tbl  = document.getElementById('crewTableWrap');
  const bc   = document.getElementById('btnCardView');
  const bt   = document.getElementById('btnTableView');
  if (mode === 'card') {
    grid.style.display = 'grid'; tbl.style.display = 'none';
    bc.classList.add('active'); bt.classList.remove('active');
  } else {
    grid.style.display = 'none'; tbl.style.display = 'block';
    bt.classList.add('active'); bc.classList.remove('active');
  }
}

// ── AUTH GUARD ───────────────────────────
document.body.style.visibility = 'hidden';

let _currentUserEmail = null;
let _currentAdminDisplayName = null;

auth.onAuthStateChanged(async user => {
  if (!user) {
    document.body.style.visibility = '';
    if (!window._adminRedirecting) {
      window._adminRedirecting = true;
      window.location.replace('LOGIN.html');
    }
    return;
  }

  let isAdmin = false;
  try {
    const row = await db.collection('admins').doc(user.id).get();
    isAdmin = row.exists;
    if (!isAdmin) {
      console.warn(
        '[Admin check] No admins row found for user id "' + user.id + '" (' + (user.email || 'no email') + '). ' +
        'Insert this UUID into the `admins` table (and make sure RLS lets the user SELECT their own row) to grant access.'
      );
    }
  } catch (e) {
    console.error('[Admin check] Query failed — table missing, RLS misconfigured, or network error:', e);
  }

  if (!isAdmin) {
    await auth.signOut();
    document.body.style.visibility = '';
    if (!window._adminRedirecting) {
      window._adminRedirecting = true;
      window.location.replace('LOGIN.html?err=not_admin');
    }
    return;
  }

  document.body.style.visibility = '';
  window._adminRedirecting = false;
  _currentUserEmail = user.email || null;
  const nameEl = document.querySelector('.sb-user-name');
  if (nameEl && user.email) nameEl.textContent = user.email.split('@')[0];
  loadDashboard();
});

function adminLogout() {
  auth.signOut().then(() => window.location.replace('LOGIN.html'));
}

// ══════════════════════════════════════════
//  BOOKING STATUS UPDATE
// ══════════════════════════════════════════
async function updateBookingStatus(docId, newStatus, booking) {
  const activeEl = document.activeElement;
  if (activeEl && activeEl.tagName === 'BUTTON') {
    activeEl.disabled = true;
    activeEl.textContent = '…';
  }

  try {
    const updateData = { status: newStatus };

    if (newStatus === 'confirmed' && booking.downPay == null) {
      updateData.downpay = 0;
    }
    if (newStatus === 'deposit paid' && booking.downPay != null) {
      updateData.downpay = booking.downPay;
    }

    await db.collection('bookings').doc(docId).update(updateData);

    const toastMap = {
      confirmed:      '✅ Booking confirmed! Down payment registered.',
      'deposit paid': '💰 Down payment marked as collected.',
      cancelled:      '❌ Booking cancelled.',
      completed:      '🏁 Marked as done — full payment settled.',
    };
    const toastType = ['confirmed','completed','deposit paid'].includes(newStatus) ? 'ok'
                    : newStatus === 'cancelled' ? 'err' : null;
    showToast(toastMap[newStatus] || 'Status → ' + newStatus.toUpperCase(), toastType);

    loadBookings();
    loadDashboard();
    if (document.getElementById('page-calendar')?.classList.contains('active')) {
      renderAdmCal();
      renderAdmUpcoming();
    }
    if (document.getElementById('page-finance')?.classList.contains('active')) loadFinance();

  } catch (err) {
    console.error('Status update failed:', err);
    showToast('Failed: ' + err.message, 'err');
    if (activeEl && activeEl.tagName === 'BUTTON') {
      activeEl.disabled = false;
      activeEl.textContent = activeEl.title || '✅';
    }
  }
}

// ══════════════════════════════════════════
//  BOOKING DETAIL MODAL
// ══════════════════════════════════════════
function viewBooking(docId, booking) {
  _bStore[docId] = booking;
  window._currentBdDocId = docId;
  const _attireEl = document.getElementById('slipAttireInput');
  if (_attireEl) _attireEl.value = booking.attire || '';
  document.getElementById('bdModalTitle').textContent = 'BOOKING — ' + (booking.name || '').toUpperCase();

  const total   = booking.totalprice || booking.totalPrice || 0;
  const down    = booking.downpay    || booking.downPay    || 0;
  const balance = Math.max(0, total - down);
  const ref     = 'MA-' + new Date().getFullYear() + '-' + docId.substring(0,6).toUpperCase();

  const statusColors = { pending:'yellow', confirmed:'green', cancelled:'red', inquiry:'', 'deposit paid':'blue', completed:'green' };
  const sc = statusColors[(booking.status||'').toLowerCase()] || '';
  const isOnline = booking.onlinePayment;

  let html = '';

  html += '<div class="bd-section">'
        + '<div class="bd-row"><span class="bd-label">Reference No.</span><span class="bd-val" style="font-family:var(--font-m);font-size:.8rem">' + ref + '</span></div>'
        + '<div class="bd-row"><span class="bd-label">Status</span><span class="bd-val ' + sc + '">' + 
  ((booking.status||'pending').toLowerCase() === 'confirmed' ? 'WAITING DOWN PAYMENT' : (booking.status||'pending').toUpperCase()) + 
  '</span></div>'
        + (booking.submitted ? '<div class="bd-row"><span class="bd-label">Submitted</span><span class="bd-val" style="font-size:.78rem;color:var(--gray)">'
            + new Date(booking.submitted.toDate?.() || booking.submitted).toLocaleString('en-PH') + '</span></div>' : '')
        + '</div>';

  html += '<div class="bd-section"><div class="bd-section-title">EVENT DETAILS</div>'
        + '<div class="bd-row"><span class="bd-label">Event</span><span class="bd-val">' + esc(booking.eventName) + '</span></div>'
        + '<div class="bd-row"><span class="bd-label">Package</span><span class="bd-val">' + esc(booking.pkg) + '</span></div>'
        + '<div class="bd-row"><span class="bd-label">Date</span><span class="bd-val">' + esc(booking.date) + ' @ ' + esc(booking.time) + '</span></div>'
        + '<div class="bd-row"><span class="bd-label">Venue</span><span class="bd-val">' + esc(booking.venue) + '</span></div>'
        + '<div class="bd-row"><span class="bd-label">Crowd</span><span class="bd-val">' + esc(booking.crowd) + '</span></div>'
        + (booking.duration ? '<div class="bd-row"><span class="bd-label">Duration</span><span class="bd-val">' + esc(booking.duration) + '</span></div>' : '')
        + '</div>';

  html += '<div class="bd-section"><div class="bd-section-title">CLIENT</div>'
        + '<div class="bd-row"><span class="bd-label">Name</span><span class="bd-val">' + esc(booking.name) + '</span></div>'
        + '<div class="bd-row"><span class="bd-label">Phone</span><span class="bd-val">' + esc(booking.phone) + '</span></div>'
        + '<div class="bd-row"><span class="bd-label">Email</span><span class="bd-val ' + (booking.email ? 'blue' : '') + '">' + (booking.email ? esc(booking.email) : 'Not provided') + '</span></div>'
        + (booking.fb ? '<div class="bd-row"><span class="bd-label">Facebook</span><span class="bd-val">' + esc(booking.fb) + '</span></div>' : '')
        + ((booking.socialproof || booking.socialProof)
            ? '<div class="bd-proof-shot"><div class="bd-proof-shot-label">PROFILE SCREENSHOT</div>'
              + '<img class="bd-proof-img" alt="Client profile screenshot" data-proof-path="'
              + esc(booking.socialproof || booking.socialProof) + '"/>'
              + '<div class="bd-proof-loading">Loading screenshot…</div></div>'
            : '')
        + '</div>';

  html += '<div class="bd-section"><div class="bd-section-title">PAYMENT</div>'
        + '<div class="bd-row"><span class="bd-label">Total Price</span><span class="bd-val red">₱' + total.toLocaleString('en-PH') + '</span></div>'
        + '<div class="bd-row"><span class="bd-label">Down Payment</span><span class="bd-val green">₱' + down.toLocaleString('en-PH') + ' (' + (total > 0 ? Math.round((down/total)*100) : 0) + '%)</span></div>'
        + '<div class="bd-row"><span class="bd-label">Balance Due</span><span class="bd-val ' + (balance > 0 ? 'yellow' : 'green') + '">₱' + balance.toLocaleString('en-PH') + '</span></div>'
        + '<div class="bd-row"><span class="bd-label">Method</span><span class="bd-val">' + esc(booking.payMethod) + '</span></div>';

  const paymentProofPath = booking.paymentproof || booking.paymentProof || '';
  const socialProofPath  = booking.socialproof  || booking.socialProof  || '';

  if (paymentProofPath) {
    html += '<div class="bd-proof-shot" data-proof-path="' + esc(paymentProofPath) + '">'
          + '<div class="bd-proof-shot-label">PROOF OF PAYMENT</div>'
          + '<img class="bd-proof-img" alt="Proof of payment screenshot" data-proof-path="' + esc(paymentProofPath) + '"/>'
          + '<div class="bd-proof-loading">Loading screenshot…</div></div>';
  } else if (isOnline) {
    html += '<div class="bd-proof-note">'
          + '⚠ <div>Client paid via <strong>' + esc(booking.payMethod) + '</strong> but did not attach a screenshot. '
          + 'Ask them for it, or check <a href="https://facebook.com/maudioprosoundo" target="_blank">fb.com/maudioprosoundo</a> '
          + 'before confirming.</div></div>';
  }

  if (booking.payNotes) {
    html += '<div class="bd-row"><span class="bd-label">Notes</span><span class="bd-val" style="font-size:.78rem;color:var(--gray)">' + esc(booking.payNotes) + '</span></div>';
  }
  html += '</div>';

  if (booking.notes) {
    html += '<div class="bd-section"><div class="bd-section-title">ADDITIONAL NOTES</div>'
          + '<div style="font-size:.84rem;color:var(--gray);line-height:1.7">' + esc(booking.notes) + '</div></div>';
  }

    const bdBody = document.getElementById('bdModalBody');
  bdBody.innerHTML = html;

  // Make sure the slip container is visible when viewing a booking
  const slipContainer = document.getElementById('bdSlipContainer');
  if (slipContainer) slipContainer.style.display = 'block';

  bdBody.querySelectorAll('img.bd-proof-img[data-proof-path]').forEach(async imgEl => {
    const wrap = imgEl.closest('.bd-proof-shot');
    const note = wrap && wrap.querySelector('.bd-proof-loading');
    try {
      const url = await mediaStorage.signedUrl('booking-proofs', imgEl.dataset.proofPath, 3600);
      imgEl.src = url;
      imgEl.style.cursor = 'zoom-in';
      imgEl.addEventListener('click', () => window.open(url, '_blank', 'noopener'));
      if (note) note.remove();
    } catch (e) {
      console.warn('[ADMIN] could not sign proof URL:', e);
      imgEl.remove();
      if (note) { note.textContent = 'Screenshot unavailable — it may have been removed.'; note.style.color = '#f87171'; }
    }
  });

  const rawCrew = booking.assignedcrew || booking.assignedCrew || [];
  const assignedCrew = _parseAssignedCrew(rawCrew);
  let crewHtml = '';
  const editBtn = `<button onclick="openAssignCrewModal('${docId}')" style="font-family:var(--font-m);font-size:.55rem;font-weight:600;background:${assignedCrew.length > 0 ? 'rgba(234,179,8,.15)' : 'rgba(34,197,94,.15)'};border:1px solid ${assignedCrew.length > 0 ? 'rgba(234,179,8,.4)' : 'rgba(34,197,94,.4)'};color:${assignedCrew.length > 0 ? '#eab308' : '#22c55e'};padding:.4rem .75rem;border-radius:5px;cursor:pointer;transition:all .2s" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 2px 8px rgba(0,0,0,.3)'" onmouseout="this.style.transform='';this.style.boxShadow=''">${assignedCrew.length > 0 ? '✏ EDIT CREW' : '+ ASSIGN CREW'}</button>`;

  crewHtml = `<div class="bd-section" style="background:linear-gradient(135deg, rgba(234,179,8,.05) 0%, rgba(30,32,40,.3) 100%);border:1px solid rgba(234,179,8,.15);border-radius:8px;padding:1rem;margin-top:1.5rem"><div class="bd-section-title" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem"><span style="color:#eab308;font-size:.65rem">👥 ASSIGNED CREW</span>${editBtn}</div>`;

  if (assignedCrew.length > 0) {
    crewHtml += '<div style="display:flex;flex-direction:column;gap:.5rem">';
    let totalPay = 0;
    assignedCrew.forEach(c => {
      const icon = ROLE_ICONS[c.role] || '👤';
      const rate = parseFloat(c.rate) || 0;
      totalPay += rate;
      crewHtml += `<div style="display:flex;align-items:center;gap:.75rem;padding:.65rem .75rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:6px;transition:all .2s" onmouseover="this.style.background='rgba(255,255,255,.05)';this.style.borderColor='rgba(234,179,8,.3)'" onmouseout="this.style.background='rgba(255,255,255,.03)';this.style.borderColor='rgba(255,255,255,.08)'">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg, rgba(234,179,8,.2), rgba(234,179,8,.05));border:1px solid rgba(234,179,8,.3);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">${icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;color:var(--white);font-size:.9rem">${esc(c.name || '—')}</div>
          <div style="font-size:.7rem;color:#eab308;font-family:var(--font-m);letter-spacing:.05em;text-transform:uppercase">${esc(c.role || '—')}</div>
        </div>
        <div style="font-family:var(--font-m);font-size:.75rem;color:#22c55e;flex-shrink:0;font-weight:700;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);padding:.25rem .5rem;border-radius:4px">₱${rate.toLocaleString('en-PH')}/day</div>
      </div>`;
    });
    crewHtml += `</div>
    <div style="margin-top:.85rem;padding:.75rem 1rem;background:linear-gradient(135deg, rgba(234,179,8,.12), rgba(234,179,8,.05));border:1px solid rgba(234,179,8,.3);border-radius:7px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 8px rgba(0,0,0,.2)">
      <span style="font-family:var(--font-m);font-size:.62rem;letter-spacing:.15em;color:#eab308;font-weight:600;text-transform:uppercase">👥 Total Crew Payroll</span>
      <span style="font-family:var(--font-m);font-size:.9rem;font-weight:700;color:#eab308;text-shadow:0 0 10px rgba(234,179,8,.3)">₱${totalPay.toLocaleString('en-PH')}</span>
    </div>`;
  } else {
    crewHtml += '<div style="padding:1.25rem;background:rgba(34,197,94,.05);border:1px dashed rgba(34,197,94,.3);border-radius:7px;font-size:.82rem;color:#4ade80;text-align:center;display:flex;align-items:center;justify-content:center;gap:.5rem"><span style="font-size:1.2rem">👥</span><div><strong>No crew assigned yet</strong><br><span style="color:var(--gray2);font-size:.75rem">Click the button above to assign crew members to this event</span></div></div>';
  }
  crewHtml += '</div>';
  bdBody.insertAdjacentHTML('beforeend', crewHtml);

  const footer  = document.getElementById('bdModalFooter');
  const status  = (booking.status || 'pending').toLowerCase();

  let buttons = '<button class="btn btn-ghost" onclick="closeModal(\'modalBookingDetail\')">Close</button>';

  if (status === 'pending') {
    buttons += '<button class="bd-action-confirm" onclick="quickConfirm(\'' + docId + '\')">✅ CONFIRM</button>';
  }
  if (status === 'confirmed') {
    buttons += '<button class="bd-action-deposit" onclick="quickDepositPaid(\'' + docId + '\')">💰 DOWN PAYMENT PAID</button>';
  }
  if (status === 'confirmed' || status === 'deposit paid') {
    buttons += '<button class="bd-action-done" onclick="markDone(\'' + docId + '\')">🏁 MARK AS DONE</button>';
  }
  if (status !== 'cancelled' && status !== 'completed') {
    buttons += '<button class="bd-action-cancel" onclick="quickCancel(\'' + docId + '\')">❌ CANCEL</button>';
  }
  buttons += '<button class="bd-action-delete" onclick="deleteBooking(\'' + docId + '\')">🗑 DELETE</button>';
  footer.innerHTML = buttons;
  openModal('modalBookingDetail');
}

// ══════════════════════════════════════════
//  LOAD BOOKINGS (Supabase live)
// ══════════════════════════════════════════
let bookingsUnsubscribe = null;

const _bStore = {};
let _bkFilter = 'all';

function setBkFilter(status, btn) {
  _bkFilter = status;
  document.querySelectorAll('.bk-ftab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyBookingFilters();
}

function filterBookings(query) {
  applyBookingFilters(query);
}

function applyBookingFilters(query) {
  const q = (query !== undefined ? query : document.getElementById('bookingSearchInput')?.value || '').toLowerCase();
  const rows = document.querySelectorAll('#tblBookings tbody tr');
  rows.forEach(row => {
    const text   = row.textContent.toLowerCase();
    const status = row.dataset.status || '';
    const matchQ = !q || text.includes(q);
    const matchS = _bkFilter === 'all' || status === _bkFilter;
    row.style.display = (matchQ && matchS) ? '' : 'none';
  });
  const visible = [...rows].filter(r => r.style.display !== 'none').length;
  const countEl = document.getElementById('bkVisibleCount');
  if (countEl) countEl.textContent = visible;
}

function _normalizeBooking(b) {
  if (b.totalprice    != null && b.totalPrice    == null) b.totalPrice    = b.totalprice;
  if (b.downpay       != null && b.downPay       == null) b.downPay       = b.downpay;
  if (b.eventtype     != null && b.eventType     == null) b.eventType     = b.eventtype;
  if (b.eventname     != null && b.eventName     == null) b.eventName     = b.eventname;
  if (b.paynotes      != null && b.payNotes      == null) b.payNotes      = b.paynotes;
  if (b.paymethod     != null && b.payMethod     == null) b.payMethod     = b.paymethod;
  if (b.onlinepayment != null && b.onlinePayment == null) b.onlinePayment = b.onlinepayment;
  return b;
}

function _expensesByBooking(expenses) {
  const map = {};
  expenses.forEach(e => {
    const bid = e.bookingId || e.bookingid;
    if (!bid) return;
    map[bid] = (map[bid] || 0) + (parseFloat(e.amount) || 0);
  });
  return map;
}

function updateBkStatPills(docs) {
  const pending   = docs.filter(d => (d.status||'pending') === 'pending').length;
  const confirmed = docs.filter(d => ['confirmed','deposit paid'].includes(d.status||'')).length;
  const setEl = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  setEl('bkStatPending',   pending);
  setEl('bkStatConfirmed', confirmed);
  setEl('bkStatTotal',     docs.length);
}

function loadBookings() {
  const tbody = document.querySelector('#tblBookings tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray2);padding:2.5rem;font-family:var(--font-m);font-size:.72rem;letter-spacing:.12em">LOADING…</td></tr>';

  if (bookingsUnsubscribe) bookingsUnsubscribe();
  bookingsUnsubscribe = db.collection('bookings')
    .onSnapshot(snap => {
      if (snap.empty) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray2);padding:2.5rem;font-family:var(--font-m);font-size:.72rem;letter-spacing:.12em">NO BOOKINGS YET</td></tr>';
        updateBkStatPills([]);
        return;
      }
      tbody.innerHTML = '';

      const docs = snap.docs.sort((a, b) => {
        const da = a.data().date || '';
        const db2 = b.data().date || '';
        return db2.localeCompare(da);
      });

      const allData = [];
      docs.forEach(doc => {
        const b  = doc.data();
        const id = doc.id;
        _bStore[id] = b;

        _normalizeBooking(b);

        allData.push(b);

        const ref     = 'MA-' + new Date().getFullYear() + '-' + id.substring(0,6).toUpperCase();
        const status  = (b.status || 'pending').toLowerCase();
        const balance = Math.max(0, (b.totalPrice||0) - (b.downPay||0));

        const badgeMap = {
          pending:        '<span class="badge badge-yellow">PENDING</span>',
          confirmed:      '<span class="badge badge-green">WAITING DOWN PAYMENT</span>',
          cancelled:      '<span class="badge badge-red">CANCELLED</span>',
          inquiry:        '<span class="badge badge-gray">INQUIRY</span>',
          'deposit paid': '<span class="badge badge-blue">DEP. PAID</span>',
          completed:      '<span class="badge" style="background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.25);color:#c4b5fd">DONE</span>',
        };
        const badge = (badgeMap[status] || '<span class="badge badge-gray">' + status.toUpperCase() + '</span>')
          + (b.onlinePayment && status === 'pending' ? ' <span title="Awaiting proof of payment" style="font-size:.75rem;cursor:help">📲</span>' : '');

        let actions = '<button class="bk-act view" title="View details" onclick="viewBookingById(\'' + id + '\')">👁</button>';
        if (status === 'pending')
          actions += '<button class="bk-act confirm" title="Confirm booking" onclick="quickConfirm(\'' + id + '\')">✓</button>';
        if (status === 'confirmed')
  actions += '<button class="bk-act deposit" title="Mark down payment received" onclick="quickDepositPaid(\'' + id + '\')">↓</button>';
        if (status !== 'cancelled' && status !== 'completed')
          actions += '<button class="bk-act cancel" title="Cancel booking" onclick="quickCancel(\'' + id + '\')">✕</button>';
        actions += '<button class="bk-act delete" title="Delete permanently" onclick="event.stopPropagation();deleteBooking(\'' + id + '\')" style="color:#f87171">🗑</button>';

        const tr  = document.createElement('tr');
        tr.dataset.status = status;
        tr.addEventListener('click', () => viewBookingById(id));
        tr.innerHTML =
          '<td><div class="bk-ref">' + ref + '</div></td>'
          + '<td><div class="bk-name">' + esc(b.name) + '</div><div class="bk-sub">' + esc(b.phone) + '</div></td>'
          + '<td><div class="bk-pkg">' + esc(b.pkg) + '</div><div class="bk-sub">' + esc(b.eventName || b.eventType) + ' · ' + esc(b.eventType) + '</div></td>'
          + '<td><div class="bk-date">' + esc(b.date) + '</div><div class="bk-sub">' + esc(b.time || '') + '</div></td>'
          + '<td style="max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.78rem;color:var(--gray)">' + esc(b.venue) + '</td>'
          + '<td><div class="bk-price">' + ((b.totalPrice||0) > 0 ? '₱' + (b.totalPrice).toLocaleString('en-PH') : '<span style="color:var(--gray2)">—</span>') + '</div>'
          + (b.downPay > 0 ? '<div class="bk-down">↓ ₱' + (b.downPay).toLocaleString('en-PH') + ' dp</div>' : (balance > 0 ? '<div class="bk-down" style="color:var(--gray2)">No deposit yet</div>' : '')) + '</td>'
          + '<td>' + badge + '</td>'
          + '<td onclick="event.stopPropagation()"><div class="bk-act-group">' + actions + '</div></td>';
        tbody.appendChild(tr);
      });

      updateBkStatPills(allData);
      applyBookingFilters();
    }, err => {
      tbody.innerHTML = '<tr><td colspan="8" style="color:#f87171;padding:2rem;text-align:center;font-family:var(--font-m);font-size:.75rem">Error: ' + err.message + '</td></tr>';
    });
}

// Safe HTML escape
function esc(v) { return (v || '—').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ── ID-only helpers — all route through double-confirm ──────
function viewBookingById(id)  { const b = _bStore[id]; if (b) viewBooking(id, b); }

function quickConfirm(id) {
  const b = _bStore[id];
  if (b) confirmStatusChange(id, 'confirmed', b);
}
function quickCancel(id) {
  const b = _bStore[id];
  if (b) confirmStatusChange(id, 'cancelled', b);
}
function quickDepositPaid(id) {
  const b = _bStore[id];
  if (b) confirmStatusChange(id, 'deposit paid', b);
}

// ══════════════════════════════════════════
//  CREW ASSIGNMENT TO BOOKINGS
// ══════════════════════════════════════════
let _currentBookingId = null;
let _selectedCrew = [];

const ROLE_ICONS = {
  'Owner':              '👑',
  'Manager':            '🏢',
  'Team Leader':        '⭐',
  'DJ':                 '🎧',
  'Sound Technician':   '🎚',
  'Lights Specialist':  '💡',
  'Led Wall Technician':'🖥',
  'Driver':             '🚐',
  'Crew':               '👤',
};

const ROLE_COLORS = {
  'Owner':              { color: '#f59e0b', bg: 'rgba(245,158,11,.18)', border: 'rgba(245,158,11,.4)'  },
  'Manager':            { color: '#a78bfa', bg: 'rgba(167,139,250,.18)', border: 'rgba(167,139,250,.4)'  },
  'Team Leader':        { color: '#e8180c', bg: 'rgba(232,24,12,.18)',  border: 'rgba(232,24,12,.4)'   },
  'DJ':                 { color: '#22d3ee', bg: 'rgba(34,211,238,.18)', border: 'rgba(34,211,238,.4)'  },
  'Sound Technician':   { color: '#22c55e', bg: 'rgba(34,197,94,.18)',  border: 'rgba(34,197,94,.4)'   },
  'Lights Specialist':  { color: '#facc15', bg: 'rgba(250,204,21,.18)', border: 'rgba(250,204,21,.4)'  },
  'Led Wall Technician':{ color: '#3b82f6', bg: 'rgba(59,130,246,.18)', border: 'rgba(59,130,246,.4)'  },
  'Driver':             { color: '#f97316', bg: 'rgba(249,115,22,.18)', border: 'rgba(249,115,22,.4)'  },
  'Crew':               { color: '#8b92a5', bg: 'rgba(139,146,165,.12)',border: 'rgba(139,146,165,.3)' },
};

const SALARY_ROLES = new Set(['Owner', 'Manager']);
const ROLE_ORDER = ['Owner','Manager','Team Leader','DJ','Sound Technician','Lights Specialist','Led Wall Technician','Driver','Crew'];

function _parseAssignedCrew(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string') {
    return raw.map(id => ({ crewId: id, name: '', role: '', rate: 0 }));
  }
  return raw;
}

function openAssignCrewModal(bookingId) {
  _currentBookingId = bookingId;
  const existing = _bStore[bookingId]?.assignedcrew || _bStore[bookingId]?.assignedCrew || [];
  _selectedCrew = _parseAssignedCrew(existing);

  const listEl = document.getElementById('assignCrewList');
  if (!listEl) {
    console.error('[AssignCrew] assignCrewList element not found!');
    return;
  }

  listEl.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--gray2);font-family:var(--font-m);font-size:.7rem">Loading crew...</div>';

  openModal('modalAssignCrew');

  db.collection('crew').get().then(snap => {

    if (snap.empty) {
      listEl.innerHTML = '<div style="padding:1rem;text-align:center;color:var(--gray2)">No crew members. Add crew in Crew Management first.</div>';
      return;
    }

    const members = snap.docs.map(d => {
      const raw = { id: d.id, ...d.data() };
      const normalized = _normCrew(raw);
      return normalized;
    }).sort((a, b) => {
      const ri = r => ROLE_ORDER.indexOf(r) === -1 ? 99 : ROLE_ORDER.indexOf(r);
      return ri(a.role) - ri(b.role) || a.name.localeCompare(b.name);
    });

    const grouped = {};
    members.forEach(m => {
      const r = m.role || 'Crew';
      if (!grouped[r]) grouped[r] = [];
      grouped[r].push(m);
    });
    let html = '';
    Object.keys(grouped).forEach(role => {
      if (ROLE_ORDER.includes(role)) return;
      const icon = ROLE_ICONS[role] || '👤';
      html += `<div style="font-family:var(--font-m);font-size:.55rem;letter-spacing:.18em;color:var(--gray2);padding:.5rem .5rem .25rem;text-transform:uppercase">${icon} ${role || 'OTHER'}</div>`;
      grouped[role].forEach(m => {
        const existing = _selectedCrew.find(c => c.crewId === m.id);
        const isSelected = !!existing;
        const rateVal = existing?.rate ?? (parseFloat(m.dailyRate) || 0);
        html += `<div style="display:flex;align-items:center;gap:.65rem;padding:.55rem .5rem;border-bottom:1px solid var(--border);transition:background .15s" onmouseover="this.style.background='var(--bg3)'" onmouseout="this.style.background=''">
          <input type="checkbox" id="chk_${m.id}" ${isSelected ? 'checked' : ''} onchange="toggleCrewSelection('${m.id}','${esc(m.name)}','${esc(m.role)}',parseFloat(document.getElementById('rate_${m.id}').value)||0)" style="width:16px;height:16px;cursor:pointer;flex-shrink:0">
          <div style="width:36px;height:36px;border-radius:50%;flex-shrink:0;overflow:hidden;background:var(--bg3);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:.85rem;${m.photoURL ? 'background-image:url(' + m.photoURL + ');background-size:cover;background-position:center' : ''}">
            ${!m.photoURL ? `<span style="color:var(--gray);font-weight:600">${(m.name||'?')[0].toUpperCase()}</span>` : ''}
          </div>
          <div style="flex:1;min-width:0"><div style="font-weight:500;color:var(--white);font-size:.85rem">${esc(m.name)}</div><div style="font-size:.68rem;color:var(--gray)">${esc(m.role || 'No role')}</div></div>
          <div style="display:flex;align-items:center;gap:.35rem;flex-shrink:0">
            <span style="font-family:var(--font-m);font-size:.6rem;color:var(--gray2)">₱</span>
            <input type="number" id="rate_${m.id}" value="${rateVal}" min="0" step="100" style="width:72px;background:var(--bg3);border:1px solid var(--border2);border-radius:4px;padding:.25rem .4rem;color:var(--white);font-family:var(--font-m);font-size:.72rem;text-align:right" onchange="updateCrewRate('${m.id}',this.value)">
            <span style="font-family:var(--font-m);font-size:.55rem;color:var(--gray2)">/day</span>
          </div>
        </div>`;
      });
    });

    ROLE_ORDER.forEach(role => {
      if (!grouped[role]) return;
      const icon = ROLE_ICONS[role] || '👤';
      html += `<div style="font-family:var(--font-m);font-size:.55rem;letter-spacing:.18em;color:var(--gray2);padding:.5rem .5rem .25rem;text-transform:uppercase">${icon} ${role}</div>`;
      grouped[role].forEach(m => {
        const existing = _selectedCrew.find(c => c.crewId === m.id);
        const isSelected = !!existing;
        const statusLower = (m.status || 'available').toLowerCase();
        const isAvailable = ['available','standby'].includes(statusLower);
        const rateVal = existing?.rate ?? (parseFloat(m.dailyRate) || 0);

        html += `<div style="display:flex;align-items:center;gap:.65rem;padding:.55rem .5rem;border-bottom:1px solid var(--border);transition:background .15s"
          onmouseover="this.style.background='var(--bg3)'" onmouseout="this.style.background=''">
          <input type="checkbox" id="chk_${m.id}" ${isSelected ? 'checked' : ''} onchange="toggleCrewSelection('${m.id}','${esc(m.name)}','${esc(m.role)}',parseFloat(document.getElementById('rate_${m.id}').value)||0)"
            ${!isAvailable && !isSelected ? 'disabled title="Not available"' : ''}
            style="width:16px;height:16px;cursor:pointer;flex-shrink:0">
          <div style="width:36px;height:36px;border-radius:50%;flex-shrink:0;overflow:hidden;background:var(--bg3);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:.85rem;${m.photoURL ? 'background-image:url(' + m.photoURL + ');background-size:cover;background-position:center' : ''}">
            ${!m.photoURL ? `<span style="color:var(--gray);font-weight:600">${(m.name||'?')[0].toUpperCase()}</span>` : ''}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:500;color:var(--white);font-size:.85rem">${esc(m.name)}</div>
            <div style="font-size:.68rem;color:var(--gray)">${!isAvailable && !isSelected ? '<span style="color:#eab308">Not available</span>' : 'Available'}</div>
          </div>
          <div style="display:flex;align-items:center;gap:.35rem;flex-shrink:0">
            <span style="font-family:var(--font-m);font-size:.6rem;color:var(--gray2)">₱</span>
            <input type="number" id="rate_${m.id}" value="${rateVal}" min="0" step="100"
              style="width:72px;background:var(--bg3);border:1px solid var(--border2);border-radius:4px;padding:.25rem .4rem;color:var(--white);font-family:var(--font-m);font-size:.72rem;text-align:right"
              placeholder="Rate" title="Daily rate for this event"
              onchange="updateCrewRate('${m.id}',this.value)">
            <span style="font-family:var(--font-m);font-size:.55rem;color:var(--gray2)">/day</span>
          </div>
        </div>`;
      });
    });

    listEl.innerHTML = html || '<div style="padding:1rem;text-align:center;color:var(--gray2)">No crew found.</div>';

    _updateAssignSummary();
  }).catch(e => {
    console.error('[AssignCrew] Error:', e);
    listEl.innerHTML = '<div style="padding:1rem;color:#f87171;text-align:center">Error loading crew: ' + e.message + '</div>';
  });
}

function _updateAssignSummary() {
  let sumEl = document.getElementById('assignCrewSummary');
  if (!sumEl) {
    sumEl = document.createElement('div');
    sumEl.id = 'assignCrewSummary';
    document.getElementById('assignCrewList')?.after(sumEl);
  }
  const total = _selectedCrew.reduce((s, c) => s + (parseFloat(c.rate) || 0), 0);
  const count = _selectedCrew.length;
  sumEl.style.cssText = 'margin-top:.75rem;padding:.6rem .85rem;background:rgba(234,179,8,.07);border:1px solid rgba(234,179,8,.18);border-radius:6px;display:flex;justify-content:space-between;align-items:center';
  sumEl.innerHTML = `<span style="font-family:var(--font-m);font-size:.6rem;letter-spacing:.1em;color:var(--gray)">${count} CREW SELECTED</span>
    <span style="font-family:var(--font-m);font-size:.75rem;font-weight:600;color:#eab308">TOTAL PAYROLL: ₱${total.toLocaleString('en-PH')}</span>`;
}

function toggleCrewSelection(crewId, name, role, rate) {
  const idx = _selectedCrew.findIndex(c => c.crewId === crewId);
  if (idx >= 0) {
    _selectedCrew.splice(idx, 1);
  } else {
    _selectedCrew.push({ crewId, name, role, rate: parseFloat(rate) || 0 });
  }
  _updateAssignSummary();
}

function updateCrewRate(crewId, val) {
  const entry = _selectedCrew.find(c => c.crewId === crewId);
  if (entry) {
    entry.rate = parseFloat(val) || 0;
    _updateAssignSummary();
  }
}

async function saveCrewAssignment() {
  if (!_currentBookingId) return;

  try {
    await db.collection('bookings').doc(_currentBookingId).update({
      assignedCrew: _selectedCrew
    });

    if (_bStore[_currentBookingId]) {
      _bStore[_currentBookingId].assignedCrew  = _selectedCrew;
      _bStore[_currentBookingId].assignedcrew  = _selectedCrew;
    }

    closeModal('modalAssignCrew');
    showToast(_selectedCrew.length + ' crew member' + (_selectedCrew.length !== 1 ? 's' : '') + ' assigned!', 'ok');
    viewBooking(_currentBookingId, _bStore[_currentBookingId]);
  } catch (e) {
    showToast('Failed to assign crew: ' + e.message, 'err');
  }
}

// ══════════════════════════════════════════
//  DASHBOARD (live stats from Supabase)
// ══════════════════════════════════════════
function loadDashboard() {
  db.collection('bookings').onSnapshot(snap => {
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const now = new Date(); now.setHours(0,0,0,0);

    const pending   = all.filter(b => (b.status||'pending') === 'pending').length;

    const confirmedStatuses = ['confirmed', 'completed', 'deposit paid'];
    const confirmedThisMonth = all.filter(b => {
      if (!confirmedStatuses.includes(b.status || '')) return false;
      if (!b.date) return false;
      const d = new Date(b.date + 'T00:00:00');
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const collected  = confirmedThisMonth.reduce((s,b) =>
      s + (b.status === 'completed' ? (b.totalprice || b.totalPrice || 0) : (b.downpay || b.downPay || 0)), 0);
    const expected   = confirmedThisMonth.reduce((s,b) => s + (b.totalprice || b.totalPrice || 0), 0);
    const outstanding= Math.max(0, expected - collected);

    const activeClients = new Set(all.map(b => b.phone).filter(Boolean)).size;

    const fmt = v => '₱' + (v >= 1000 ? Math.round(v/1000)+'K' : v.toLocaleString('en-PH'));
    const setEl = (id, v) => { const e=document.getElementById(id); if(e) e.textContent=v; };

    setEl('dashStatPending',     pending);
    setEl('dashStatRevenue',     fmt(collected));
    setEl('dashStatClients',     activeClients || '—');
    setEl('dashStatPendingSub',  pending === 1 ? '1 gig needs confirmation' : pending + ' gigs need confirmation');
    setEl('dashStatRevenueSub',  confirmedThisMonth.length + ' confirmed gig' + (confirmedThisMonth.length!==1?'s':'') + ' · ₱' + outstanding.toLocaleString('en-PH') + ' outstanding');

    db.collection('crew').get().then(cs => {
      setEl('dashStatCrew', cs.docs.length || '—');
    }).catch(() => {});

    const statVals = document.querySelectorAll('.stat-val');
    if (statVals[0]) statVals[0].textContent = pending;
    if (statVals[1]) statVals[1].textContent = fmt(collected);
    if (statVals[2]) statVals[2].textContent = activeClients || '—';

    const badge = document.querySelector('.sb-badge');
    if (badge) {
      badge.textContent = pending;
      badge.style.display = pending > 0 ? '' : 'none';
    }

    updateNotifBell(pending, all);

    const upcoming = all
      .filter(b => b.date && new Date(b.date + 'T00:00:00') >= now
              && b.status !== 'cancelled' && b.status !== 'completed')
      .sort((a,b) => a.date.localeCompare(b.date))
      .slice(0, 5);

    const upEl = document.getElementById('dashUpcoming');
    if (upEl) {
      if (upcoming.length === 0) {
        upEl.innerHTML = '<p style="padding:1rem;color:var(--gray2);font-size:.82rem">No upcoming bookings.</p>';
      } else {
        upEl.innerHTML = upcoming.map(b => {
          const dt  = new Date(b.date + 'T00:00:00');
          const day = dt.getDate().toString().padStart(2,'0');
          const mon = dt.toLocaleDateString('en-PH',{month:'short'}).toUpperCase();
          const status = (b.status||'pending').toLowerCase();
const sc  = {pending:'badge-yellow',confirmed:'badge-yellow','deposit paid':'badge-blue',cancelled:'badge-red'};
const cls = sc[status] || 'badge-gray';
const label = status === 'confirmed' ? 'WAITING DOWN PAYMENT' : (b.status||'pending').toUpperCase();
return '<div class="event-row">'
  + '<div class="event-date"><div class="day">' + day + '</div><div class="mon">' + mon + '</div></div>'
  + '<div class="event-info"><div class="event-name">' + esc(b.eventName || b.pkg) + '</div>'
  + '<div class="event-meta">' + esc(b.pkg) + ' · ' + esc(b.venue) + '</div></div>'
  + '<span class="badge ' + cls + '">' + label + '</span>'
            + (b.onlinePayment && b.status==='pending' ? '<span title="Awaiting proof of payment" style="margin-left:.5rem;font-size:.85rem;cursor:help">📲</span>' : '')
            + '</div>';
        }).join('');
      }
    }
  });
}

// ══════════════════════════════════════════
//  ADMIN CALENDAR
// ══════════════════════════════════════════
const CAL_MONTHS = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
let admYear, admMonth, admSelected = null;
let calBound = false;

function fmtD(y, m, d) {
  return new Date(y, m, d).getFullYear() + '-' +
    String(new Date(y,m,d).getMonth()+1).padStart(2,'0') + '-' +
    String(new Date(y,m,d).getDate()).padStart(2,'0');
}

function initAdmCal() {
  if (!document.getElementById('admCalDays')) return;
  const now = new Date();
  admYear  = now.getFullYear();
  admMonth = now.getMonth();
  if (!calBound) {
    calBound = true;
    document.getElementById('admCalPrev')?.addEventListener('click', () => {
      admMonth--; if (admMonth < 0) { admMonth = 11; admYear--; }
      renderAdmCal();
    });
    document.getElementById('admCalNext')?.addEventListener('click', () => {
      admMonth++; if (admMonth > 11) { admMonth = 0; admYear++; }
      renderAdmCal();
    });
  }
  renderAdmCal();
  renderAdmUpcoming();
}

function renderAdmCal() {
  const titleEl = document.getElementById('admCalTitle');
  const gridEl  = document.getElementById('admCalDays');
  if (!titleEl || !gridEl) return;
  titleEl.textContent = CAL_MONTHS[admMonth] + ' ' + admYear;
  const currentH = gridEl.offsetHeight;
  if (currentH > 0) gridEl.style.minHeight = currentH + 'px';
  gridEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;font-family:var(--font-m);font-size:.7rem;color:var(--gray2);letter-spacing:.1em">LOADING…</div>';

  Promise.all([
    db.collection('bookings').get(),
    db.collection('blocked_dates').get().catch(() => ({ docs: [] }))
  ]).then(([snap, blockedSnap]) => {
      const blockedSet = new Set(blockedSnap.docs.map(d => d.id));
      const prefix = fmtD(admYear, admMonth, 1).substring(0, 7);
      const bookings = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(b => (b.date || '').startsWith(prefix));

      const todayStr  = fmtD(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
      const firstDay  = new Date(admYear, admMonth, 1).getDay();
      const daysInM   = new Date(admYear, admMonth + 1, 0).getDate();
      const daysInPrev= new Date(admYear, admMonth, 0).getDate();
      let html = '';

      for (let i = firstDay - 1; i >= 0; i--) {
        html += '<div class="ac-cell dim"><span class="ac-num">' + (daysInPrev - i) + '</span></div>';
      }
      for (let d = 1; d <= daysInM; d++) {
        const ds        = fmtD(admYear, admMonth, d);
        const dayBks    = bookings.filter(b => b.date === ds && b.status !== 'cancelled');
        const isToday   = ds === todayStr;
        const isSel     = ds === admSelected;
        const isBlocked = blockedSet.has(ds);
        let cls = 'ac-cell';
        if (isToday)       cls += ' is-today';
        if (dayBks.length) cls += ' has-event';
        if (isSel)         cls += ' sel';
        if (isBlocked)     cls += ' ac-blocked';

        html += '<div class="' + cls + '" onclick="selectAdmDay(\'' + ds + '\')">';
        html += '<span class="ac-num">' + d + '</span>';
        if (isBlocked) html += '<span class="ac-blocked-tag" title="Blocked — not open for booking">🚫 Blocked</span>';
        dayBks.slice(0, 2).forEach(b => {
          html += '<span class="ac-pill ' + (b.status||'pending') + '" title="' + esc(b.name||'') + '">' + esc(b.eventName || b.name || '—') + '</span>';
        });
        if (dayBks.length > 2) html += '<span class="ac-more">+' + (dayBks.length - 2) + ' more</span>';
        html += '</div>';
      }
      const rem = (firstDay + daysInM) % 7;
      for (let i = 1; i <= (rem === 0 ? 0 : 7 - rem); i++) {
        html += '<div class="ac-cell dim"><span class="ac-num">' + i + '</span></div>';
      }
      gridEl.style.minHeight = '';
      gridEl.innerHTML = html;
    }).catch(err => {
      gridEl.style.minHeight = '';
      gridEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:#f87171;font-family:var(--font-m);font-size:.7rem">Calendar error: ' + err.message + '</div>';
      console.error('[Calendar]', err);
    });
}

function selectAdmDay(ds) {
  admSelected = ds;
  renderAdmCal();
  const titleEl = document.getElementById('admDayTitle');
  const bodyEl  = document.getElementById('admDayBody');
  if (!titleEl || !bodyEl) return;
  const dt = new Date(ds + 'T00:00:00');
  titleEl.textContent = dt.toLocaleDateString('en-PH', { weekday:'short', month:'long', day:'numeric', year:'numeric' });

  Promise.all([
    db.collection('bookings').where('date', '==', ds).get(),
    db.collection('blocked_dates').doc(ds).get().catch(() => ({ exists: false }))
  ]).then(([snap, blockedDoc]) => {
    const dayBks    = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(b => b.status !== 'cancelled');
    const isBlocked = !!blockedDoc.exists;
    const reason    = isBlocked ? (blockedDoc.data()?.reason || '') : '';

    const blockBtn = isBlocked
      ? '<button class="btn btn-ghost" style="margin-top:.6rem;font-size:.75rem;padding:.45rem 1rem;width:100%;border-color:rgba(34,197,94,.4);color:#22c55e" onclick="toggleBlockDay(\'' + ds + '\', false)">✓ Unblock this day</button>'
      : '<button class="btn btn-ghost" style="margin-top:.6rem;font-size:.75rem;padding:.45rem 1rem;width:100%;border-color:rgba(248,113,113,.4);color:#f87171" onclick="toggleBlockDay(\'' + ds + '\', true)">🚫 Block this day</button>';
    const blockBanner = isBlocked
      ? '<div style="margin-bottom:.75rem;padding:.6rem .75rem;border-radius:6px;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.3);color:#f87171;font-family:var(--font-m);font-size:.68rem;letter-spacing:.03em">🚫 Blocked — hidden from the booking calendar' + (reason ? ' · ' + esc(reason) : '') + '</div>'
      : '';

    if (dayBks.length === 0) {
      bodyEl.innerHTML = blockBanner + '<p class="ac-empty-msg">No active bookings on this date.</p>'
        + '<button class="btn btn-red" style="margin-top:.75rem;font-size:.78rem;padding:.45rem 1rem;width:100%" onclick="openModal(\'modalAddBooking\')">+ Add Booking</button>'
        + blockBtn;
    } else {
      bodyEl.innerHTML = blockBanner + dayBks.map(b => {
        _bStore[b.id] = b;
        const s = b.status || 'pending';
        return '<div class="ac-day-row">'
          + '<span class="ac-day-dot ' + s + '"></span>'
          + '<div class="ac-day-info"><div class="ac-day-name">' + esc(b.eventName || b.name) + '</div>'
          + '<div class="ac-day-pkg">' + esc(b.pkg) + ' · ' + esc(b.name || '') + '</div></div>'
          + '<span class="ac-up-badge ' + s + '">' + (s.toLowerCase() === 'confirmed' ? 'WAITING DP' : s.toUpperCase()) + '</span>'
          + '<button class="ac-day-del" title="View" onclick="viewBookingById(\'' + b.id + '\')">👁</button>'
          + '</div>';
      }).join('')
        + '<button class="btn btn-ghost" style="margin-top:.75rem;font-size:.78rem;padding:.45rem 1rem;width:100%" onclick="openModal(\'modalAddBooking\')">+ Add Another</button>'
        + blockBtn;
    }
  });
}

function toggleBlockDay(ds, block) {
  if (block) {
    const reason = prompt('Optional reason (crew unavailable, holiday, etc.) — shown to admins only:', '') || '';
    db.collection('blocked_dates').doc(ds).set({ reason, blockedAt: serverTimestamp() })
      .then(() => { showToast('Day blocked — hidden from the booking calendar.', 'ok'); renderAdmCal(); selectAdmDay(ds); })
      .catch(e => showToast('Failed to block day: ' + e.message, 'err'));
  } else {
    db.collection('blocked_dates').doc(ds).delete()
      .then(() => { showToast('Day unblocked.', 'ok'); renderAdmCal(); selectAdmDay(ds); })
      .catch(e => showToast('Failed to unblock day: ' + e.message, 'err'));
  }
}

function renderAdmUpcoming() {
  const el = document.getElementById('admUpcoming');
  if (!el) return;
  const now = new Date(); now.setHours(0,0,0,0);
  db.collection('bookings')
    .get().then(snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(b => ['pending','confirmed','deposit paid'].includes(b.status||'pending')
                  && b.date && new Date(b.date + 'T00:00:00') >= now)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 10);
      if (!list.length) {
        el.innerHTML = '<p class="ac-empty-msg" style="padding:1rem">No upcoming bookings.</p>';
        return;
      }
      el.innerHTML = list.map(b => {
        const dt  = new Date(b.date + 'T00:00:00');
        const s   = b.status || 'pending';
        return '<div class="ac-up-row" onclick=\'admMonth=' + dt.getMonth() + ';admYear=' + dt.getFullYear() + ';renderAdmCal();selectAdmDay("' + b.date + '")\'>'
          + '<div class="ac-up-date"><div class="ac-up-date-day">' + dt.getDate() + '</div>'
          + '<div class="ac-up-date-mon">' + dt.toLocaleDateString('en-PH',{month:'short'}) + '</div></div>'
          + '<div class="ac-up-info"><div class="ac-up-name">' + esc(b.eventName || b.name) + '</div>'
          + '<div class="ac-up-pkg">' + esc(b.pkg) + '</div></div>'
          + '<span class="ac-up-badge ' + s + '">' + (s.toLowerCase() === 'confirmed' ? 'WAITING DP' : s.toUpperCase()) + '</span>'
          + (b.onlinePayment ? '<span title="Online payment — check FB for proof" style="font-size:.8rem;margin-left:.25rem;cursor:help">📲</span>' : '')
          + '</div>';
      }).join('');
    });
}

// ══════════════════════════════════════════
//  MARK AS DONE
// ══════════════════════════════════════════
async function markDone(id) {
  const b = _bStore[id];
  if (!b) return;
  confirmStatusChange(id, 'completed', b, async () => {
    const rawCrew = b.assignedcrew || b.assignedCrew || [];
    const assignedCrew = _parseAssignedCrew(rawCrew);
    if (assignedCrew.length === 0) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const bookingRef = 'MA-' + now.getFullYear() + '-' + id.substring(0, 6).toUpperCase();
    const eventName = b.eventName || b.eventname || b.name || 'Event';

    const promises = assignedCrew.map(c => {
      const rate = parseFloat(c.rate) || 0;
      if (rate <= 0) return Promise.resolve();
      return db.collection('expenses').add({
        category:    'Crew Pay',
        amount:      rate,
        description: `${c.name} (${c.role}) — ${eventName} [${bookingRef}]`,
        date:        dateStr,
        loggedby:    'Auto (Event Completed)',
        bookingId:   id,
        crewId:      c.crewId,
        crewName:    c.name,
        crewRole:    c.role,
      });
    });

    const incrementPromises = assignedCrew.map(c =>
      db.collection('crew').doc(c.crewId).get().then(doc => {
        if (!doc.exists) return;
        const current = doc.data().eventsdone ?? doc.data().eventsDone ?? 0;
        return db.collection('crew').doc(c.crewId).update({ eventsDone: current + 1 });
      }).catch(() => {})
    );

    try {
      await Promise.all([...promises, ...incrementPromises]);
      const totalPay = assignedCrew.reduce((s, c) => s + (parseFloat(c.rate) || 0), 0);
      if (totalPay > 0) {
        showToast(`✓ Crew payroll logged: ₱${totalPay.toLocaleString('en-PH')} for ${assignedCrew.length} member${assignedCrew.length !== 1 ? 's' : ''}`, 'ok');
      }
    } catch (e) {
      console.error('Crew payroll logging failed:', e);
      showToast('Booking done — some payroll entries failed: ' + e.message, 'err');
    }
  });
}

// ══════════════════════════════════════════
//  LOAD CLIENTS (from bookings — derive unique clients)
// ══════════════════════════════════════════
let clientsUnsubscribe = null;
function loadClients() {
  const tbody = document.querySelector('#tblClients tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem;letter-spacing:.1em">LOADING CLIENTS...</td></tr>';

  if (clientsUnsubscribe) clientsUnsubscribe();
  clientsUnsubscribe = db.collection('bookings')
    .onSnapshot(snap => {
      if (snap.empty) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem">NO CLIENTS YET</td></tr>';
        return;
      }

      const clientMap = {};
      snap.forEach(doc => {
        const b = doc.data();
        const key = (b.phone || b.name || doc.id).trim();
        if (!clientMap[key]) {
          clientMap[key] = {
            name:    b.name  || '—',
            phone:   b.phone || '—',
            email:   b.email || '—',
            fb:      b.fb    || '—',
            venue:   b.venue || '—',
            bookings: 0,
            totalSpent: 0,
            lastDate: '',
            lastPkg:  ''
          };
        }
        clientMap[key].bookings++;
        clientMap[key].totalSpent += (b.totalPrice || 0);
        if (!clientMap[key].lastDate || (b.date && b.date > clientMap[key].lastDate)) {
          clientMap[key].lastDate = b.date || '';
          clientMap[key].lastPkg  = b.pkg  || '—';
        }
      });

      const clients = Object.values(clientMap).sort((a,b) => b.totalSpent - a.totalSpent);
      tbody.innerHTML = '';
      clients.forEach((c, i) => {
        const tr  = document.createElement('tr');
        const id = '#CL-' + String(i+1).padStart(3,'0');
        tr.innerHTML = '<td style="font-family:var(--font-m);font-size:.65rem;color:var(--gray)">' + id + '</td>'
          + '<td><strong>' + esc(c.name) + '</strong></td>'
          + '<td>' + esc(c.phone) + '</td>'
          + (c.email !== '—' ? '<td><a href="mailto:' + esc(c.email) + '" style="color:#60a5fa">' + esc(c.email) + '</a></td>' : '<td style="color:var(--gray2)">—</td>')
          + '<td style="color:var(--gray)">' + esc(c.venue) + '</td>'
          + '<td style="text-align:center">' + c.bookings + '</td>'
          + '<td style="font-family:var(--font-m);color:#e8180c">' + (c.totalSpent > 0 ? '₱' + c.totalSpent.toLocaleString('en-PH') : '—') + '</td>'
          + '<td style="font-family:var(--font-m);font-size:.78rem">' + (c.lastDate || '—') + '</td>'
          + '<td><div class="act-group"><button class="act-btn act-view" title="View bookings" onclick="filterAndNavigateBookings(\'' + esc(c.name) + '\')">👁</button></div></td>';
        tbody.appendChild(tr);
      });
    }, err => {
      tbody.innerHTML = '<tr><td colspan="9" style="color:#f87171;padding:1.5rem;text-align:center">Error: ' + err.message + '</td></tr>';
    });
}

function filterAndNavigateBookings(name) {
  navigate('bookings');
  setTimeout(() => {
    const inp = document.querySelector('#tblBookings')?.closest('.card')?.querySelector('input');
    if (inp) { inp.value = name; filterTable('tblBookings', name); }
  }, 400);
}

// ══════════════════════════════════════════
//  LOAD CREW (crew table)
// ══════════════════════════════════════════
function _normCrew(raw) {
  return {
    id:             raw.id,
    name:           raw.name           || '',
    phone:          raw.phone          || '',
    role:           raw.role           || '',
    specialization: raw.specialization || '',
    status:         raw.status         || 'available',
    notes:          raw.notes          || '',
    email:          raw.email          || '',
    photoURL:       raw.photoURL  || raw.photourl  || '',
    dailyRate:      raw.dailyRate || raw.dailyrate  || 0,
    monthlySalary:  raw.monthlySalary || raw.monthlysalary || 0,
    eventsDone:     raw.eventsDone != null ? raw.eventsDone
                  : raw.eventsdone != null ? raw.eventsdone : 0,
    joinDate:       raw.joinDate  || raw.joindate  || '',
  };
}

let crewUnsubscribe = null;

function _crewRateLine(m) {
  if (SALARY_ROLES.has(m.role)) {
    const sal = m.monthlySalary || m.dailyRate;
    return sal ? '₱' + Number(sal).toLocaleString('en-PH') + '/mo' : '';
  }
  return m.dailyRate ? '₱' + parseInt(m.dailyRate).toLocaleString('en-PH') + '/day' : '';
}

const _crewStore = {};

function enlargeCrewPhoto(crewId) {
  const m = _crewStore[crewId];
  if (!m) return;

  const existing = document.getElementById('crewPhotoLightbox');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'crewPhotoLightbox';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:5000;background:rgba(6,7,10,.92);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:2rem;cursor:zoom-out;animation:fadeIn .15s ease';
  overlay.addEventListener('click', () => overlay.remove());

  const initials = (m.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  overlay.innerHTML = m.photoURL
    ? `<img src="${m.photoURL}" alt="${esc(m.name)}" style="max-width:min(90vw,480px);max-height:80vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.6);object-fit:contain">`
    : `<div style="width:220px;height:220px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--bg3);border:1px solid var(--border2);font-family:var(--font-d);font-size:3rem;color:var(--gray)">${initials}</div>`;

  const caption = document.createElement('div');
  caption.style.cssText = 'position:absolute;bottom:2.5rem;left:0;right:0;text-align:center;font-family:var(--font-d);font-size:1.1rem;letter-spacing:.05em;color:var(--white)';
  caption.textContent = m.name || '';
  overlay.appendChild(caption);

  document.body.appendChild(overlay);
}

function _triggerPhotoUpload(crewId) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  inp.style.cssText = 'position:fixed;top:-9999px;opacity:0';
  document.body.appendChild(inp);
  inp.addEventListener('change', () => {
    const file = inp.files[0];
    document.body.removeChild(inp);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 600;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const b64 = canvas.toDataURL('image/jpeg', 0.82);
        db.collection('crew').doc(crewId).update({ photoURL: b64 })
          .then(() => showToast('Photo updated!', 'ok'))
          .catch(e => showToast('Upload failed: ' + e.message, 'err'));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  inp.click();
}

function loadCrew() {
  const grid  = document.getElementById('crewGrid');
  const tbody = document.querySelector('#tblCrew tbody');

  if (grid)  grid.innerHTML  = '<div style="grid-column:1/-1;text-align:center;color:var(--gray2);padding:3rem;font-family:var(--font-m);font-size:.75rem;letter-spacing:.1em">LOADING CREW…</div>';
  if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem">LOADING CREW…</td></tr>';

  if (crewUnsubscribe) crewUnsubscribe();
  crewUnsubscribe = db.collection('crew')
    .onSnapshot(snap => {
      if (snap.empty) {
        if (grid)  grid.innerHTML  = '<div style="grid-column:1/-1;text-align:center;color:var(--gray2);padding:3rem;font-family:var(--font-m);font-size:.75rem">No crew members yet. Click + Add Member.</div>';
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem">No crew members yet.</td></tr>';
        return;
      }

      const members = snap.docs.map(d => _normCrew({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const ro = r => { const i = ROLE_ORDER.indexOf(r); return i === -1 ? 99 : i; };
          return ro(a.role) - ro(b.role) || a.name.localeCompare(b.name);
        });

      members.forEach(m => { _crewStore[m.id] = m; });

      const statusColors = { available:'badge-green', 'on duty':'badge-red', 'day off':'badge-gray', standby:'badge-yellow' };
      const statusDotLabel = { available:'AVAILABLE', 'on duty':'ON DUTY', 'day off':'DAY OFF', standby:'STANDBY' };

      if (grid) {
        grid.innerHTML = members.map(m => {
          const s        = (m.status || 'available').toLowerCase();
          const sc       = statusColors[s] || 'badge-gray';
          const rc       = ROLE_COLORS[m.role] || ROLE_COLORS['Crew'];
          const rIcon    = ROLE_ICONS[m.role]  || '👤';
          const hasPhoto = !!m.photoURL;
          const initials = (m.name || '?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
          const evDone   = m.eventsDone || 0;
          const rateLine = _crewRateLine(m);
          const isVIP    = SALARY_ROLES.has(m.role);

          return `<div class="crew-card-v3${isVIP?' vip-card':''}" style="--rc:${rc.color};--rc-bg:${rc.bg};--rc-border:${rc.border}" onclick="viewCrewMember('${m.id}')">
            <div class="ccv3-hero" data-clickable data-id="${m.id}" title="Click to view photo">
              ${hasPhoto
                ? `<img src="${m.photoURL}" class="ccv3-hero-img" alt="${esc(m.name)}">`
                : `<div class="ccv3-initials-bg"><span class="ccv3-initials">${initials}</span></div>`}
              <div class="ccv3-hero-overlay"></div>
              <div class="ccv3-role-pill"><span>${rIcon}</span><span>${esc(m.role||'—')}</span></div>
              <div class="ccv3-cam-btn" data-camera data-id="${m.id}" title="Change photo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
              <span class="ccv3-avail-dot ${s}" title="${statusDotLabel[s]||s}"></span>
            </div>
            <div class="ccv3-body">
              <div class="ccv3-name">${esc(m.name||'—')}</div>
              <div class="ccv3-spec">${m.specialization ? esc(m.specialization) : '&nbsp;'}</div>
              <div class="ccv3-meta">
                <div class="ccv3-mi">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 15l2 2 4-4"/></svg>
                  <span>${evDone} event${evDone !== 1 ? 's' : ''}</span>
                </div>
                ${rateLine ? `<div class="ccv3-mi ccv3-rate">
                  <span style="font-size:10px;font-weight:700;line-height:1;color:currentColor">₱</span>
                  <span>${rateLine}</span>
                </div>` : ''}
                ${m.phone ? `<div class="ccv3-mi">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.99 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/></svg>
                  <span>${esc(m.phone)}</span>
                </div>` : ''}
              </div>
              <div class="ccv3-footer" onclick="event.stopPropagation()">
                <span class="badge ${sc}" style="font-size:.52rem;padding:.2rem .55rem">${(statusDotLabel[s]||s)}</span>
                <div class="ccv3-actions">
                  <button class="ccv3-btn" onclick="editCrewMember('${m.id}')" title="Edit">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button class="ccv3-btn ccv3-btn-del" onclick="deleteCrewMember('${m.id}')" title="Remove">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
        }).join('');

        grid.querySelectorAll('[data-clickable]').forEach(ph => {
          ph.addEventListener('click', e => { e.stopPropagation(); enlargeCrewPhoto(ph.dataset.id); });
        });
        grid.querySelectorAll('[data-camera]').forEach(cam => {
          cam.addEventListener('click', e => { e.stopPropagation(); _triggerPhotoUpload(cam.dataset.id); });
        });
      }

      if (tbody) {
        tbody.innerHTML = '';
        members.forEach(m => {
          const s  = m.status.toLowerCase();
          const sc = statusColors[s] || 'badge-gray';
          const tr  = document.createElement('tr');
          tr.innerHTML = '<td>' + esc(m.name) + '</td>'
            + '<td>' + esc(m.role) + '</td>'
            + '<td>' + esc(m.specialization) + '</td>'
            + '<td>' + esc(m.phone) + '</td>'
            + '<td>' + m.eventsDone + '</td>'
            + '<td><span class="badge ' + sc + '">' + s.toUpperCase() + '</span></td>'
            + '<td><div class="act-group">'
            + '<button class="act-btn act-view" onclick="viewCrewMember(\'' + m.id + '\')">👁</button>'
            + '<button class="act-btn act-edit" onclick="editCrewMember(\'' + m.id + '\')">✏️</button>'
            + '<button class="act-btn act-delete" onclick="deleteCrewMember(\'' + m.id + '\')">🗑</button>'
            + '</div></td>';
          tbody.appendChild(tr);
        });
      }
    }, err => {
      if (grid) grid.innerHTML = '<div style="color:#f87171;padding:2rem;text-align:center">Error: ' + err.message + '</div>';
    });
}
function viewCrewMember(id) {
  db.collection('crew').doc(id).get().then(doc => {
    if (!doc.exists) { showToast('Member not found.', 'err'); return; }
    const m  = _normCrew({ id: doc.id, ...doc.data() });
    const s  = m.status.toLowerCase();
    const rc = ROLE_COLORS[m.role] || ROLE_COLORS['Crew'];
    const rIcon  = ROLE_ICONS[m.role] || '👤';
    const evDone = m.eventsDone || 0;
    const isSalary = SALARY_ROLES.has(m.role);
    const rateLine = _crewRateLine(m);
    const statusColors = { available:'badge-green', 'on duty':'badge-red', 'day off':'badge-gray', standby:'badge-yellow' };
    const sc = statusColors[s] || 'badge-gray';
    const initials = (m.name || '?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);

    const html = `
    <div class="cp-hero" style="--rc:${rc.color};--rc-bg:${rc.bg};--rc-border:${rc.border}">
      <div class="cp-hero-photo">
        ${m.photoURL
          ? `<img src="${m.photoURL}" class="cp-hero-img" alt="${esc(m.name)}">`
          : `<div class="cp-hero-initials">${initials}</div>`}
        <div class="cp-hero-glow"></div>
      </div>
      <div class="cp-hero-info">
        <div class="cp-hero-role-pill">${rIcon} ${esc(m.role||'—')}</div>
        <div class="cp-hero-name">${esc(m.name||'—')}</div>
        ${m.specialization ? `<div class="cp-hero-spec">${esc(m.specialization)}</div>` : ''}
        <div style="margin-top:.5rem"><span class="badge ${sc}" style="font-size:.6rem">${s.toUpperCase()}</span></div>
      </div>
    </div>

    <div class="cp-stats-row">
      <div class="cp-stat-box">
        <div class="cp-stat-val">${evDone}</div>
        <div class="cp-stat-lbl">EVENTS DONE</div>
      </div>
      <div class="cp-stat-box cp-stat-rate">
        <div class="cp-stat-val" style="color:var(--rc)">${rateLine || '—'}</div>
        <div class="cp-stat-lbl">${isSalary ? 'MONTHLY SALARY' : 'DAILY RATE'}</div>
      </div>
      <div class="cp-stat-box">
        <div class="cp-stat-val" style="font-size:.9rem;color:${s==='available'?'#22c55e':s==='on duty'?'#f87171':'#eab308'}">${s.toUpperCase()}</div>
        <div class="cp-stat-lbl">STATUS</div>
      </div>
    </div>

    <div class="cp-details">
      <div class="cp-detail-section">
        <div class="cp-detail-label">CONTACT</div>
        <div class="cp-detail-grid">
          <div class="cp-detail-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.99 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/></svg>
            <span>${esc(m.phone || '—')}</span>
          </div>
          ${m.email ? `<div class="cp-detail-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>${esc(m.email)}</span>
          </div>` : ''}
          ${m.joinDate ? `<div class="cp-detail-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <span>Joined ${esc(m.joinDate)}</span>
          </div>` : ''}
        </div>
      </div>

      ${m.notes ? `<div class="cp-detail-section">
        <div class="cp-detail-label">SKILLS & NOTES</div>
        <div class="cp-notes-box">${esc(m.notes)}</div>
      </div>` : ''}
    </div>

    <div class="cp-action-row">
      <button class="cp-btn-edit" onclick="editCrewMember('${id}');closeModal('modalBookingDetail')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        EDIT PROFILE
      </button>
      <button class="cp-btn-photo" onclick="closeModal('modalBookingDetail');_triggerPhotoUpload('${id}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
        UPDATE PHOTO
      </button>
      <button class="cp-btn-del" onclick="if(confirm('Remove this crew member?')){db.collection('crew').doc('${id}').delete().then(()=>{showToast('Removed.','ok');closeModal('modalBookingDetail')}).catch(e=>showToast(e.message,'err'))}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        REMOVE
      </button>
    </div>`;

    const overlay = document.getElementById('modalBookingDetail');
    const body    = document.getElementById('bdModalBody');
    const title   = document.getElementById('bdModalTitle');
    const footer  = document.getElementById('bdModalFooter');
      if (overlay && body) {
      if (title)  title.textContent    = 'CREW PROFILE';
      body.innerHTML = html;
      if (footer) footer.style.display = 'none';
      
      // Hide the booking slips since this is a crew profile, not a booking
      const slipContainer = document.getElementById('bdSlipContainer');
      if (slipContainer) slipContainer.style.display = 'none';
      
      openModal('modalBookingDetail');
    }
  }).catch(e => showToast('Load failed: ' + e.message, 'err'));
}

function editCrewMember(id) {
  db.collection('crew').doc(id).get().then(doc => {
    if (!doc.exists) return;
    const m = _normCrew({ id: doc.id, ...doc.data() });
    window._editCrewId = id;

    const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };
    set('cm-name',  m.name);
    set('cm-phone', m.phone);
    set('cm-email', m.email);
    set('cm-spec',  m.specialization);
    set('cm-rate',  m.dailyRate || '');
    set('cm-salary',m.monthlySalary || '');
    set('cm-events',m.eventsDone);
    set('cm-notes', m.notes);
    onCrewRoleChange(m.role);

    const preview = document.getElementById('cmPhotoPreview');
    if (preview) {
      if (m.photoURL) {
        preview.style.backgroundImage    = 'url(' + m.photoURL + ')';
        preview.style.backgroundSize     = 'cover';
        preview.style.backgroundPosition = 'center top';
        const inner = preview.querySelector('.cm-photo-inner');
        if (inner) inner.style.display = 'none';
      } else {
        preview.style.backgroundImage = '';
        const inner = preview.querySelector('.cm-photo-inner');
        if (inner) inner.style.display = '';
      }
    }

    const roleEl = document.getElementById('cm-role');
    if (roleEl) {
      const opt = [...roleEl.options].find(o => o.value === m.role);
      if (opt) roleEl.value = m.role;
    }
    const statusEl = document.getElementById('cm-status');
    if (statusEl) {
      const cap = (m.status||'available').charAt(0).toUpperCase() + (m.status||'available').slice(1);
      const opt = [...statusEl.options].find(o => o.value === cap || o.value.toLowerCase() === (m.status||'').toLowerCase());
      if (opt) statusEl.value = opt.value;
    }

    const title = document.getElementById('crewModalTitle');
    if (title) title.textContent = 'EDIT — ' + (m.name || 'CREW MEMBER').toUpperCase();

    openModal('modalAddCrew');
  }).catch(e => showToast('Load failed: ' + e.message, 'err'));
}

function deleteCrewMember(id) {
  if (!confirm('Remove this crew member?')) return;
  db.collection('crew').doc(id).delete()
    .then(() => showToast('Crew member removed.', 'ok'))
    .catch(e => showToast('Error: ' + e.message, 'err'));
}

function onCrewRoleChange(role) {
  const rateWrap   = document.getElementById('cm-rate-wrap');
  const salWrap    = document.getElementById('cm-salary-wrap');
  const isSal      = SALARY_ROLES.has(role);
  if (!rateWrap || !salWrap) return;
  if (isSal) {
    rateWrap.style.display  = 'none';
    salWrap.style.display   = '';
  } else {
    rateWrap.style.display  = '';
    salWrap.style.display   = 'none';
  }
  const roleEl = document.getElementById('cm-role');
  if (roleEl && roleEl.value !== role) {
    const opt = [...roleEl.options].find(o => o.value === role);
    if (opt) roleEl.value = role;
  }
}


function openAddCrewModal() {
  window._editCrewId = null;
  window._pendingPhotoB64 = null;
  ['cm-name','cm-phone','cm-email','cm-spec'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const rate = document.getElementById('cm-rate');
  if (rate) rate.value = '';
  const salary = document.getElementById('cm-salary');
  if (salary) salary.value = '';
  const events = document.getElementById('cm-events');
  if (events) events.value = '0';
  const notes = document.getElementById('cm-notes');
  if (notes) notes.value = '';
  const role = document.getElementById('cm-role');
  if (role) { role.selectedIndex = 0; onCrewRoleChange(role.options[0]?.value || ''); }
  const status = document.getElementById('cm-status');
  if (status) status.selectedIndex = 0;
  const preview = document.getElementById('cmPhotoPreview');
  if (preview) {
    preview.style.backgroundImage = '';
    const inner = preview.querySelector('.cm-photo-inner');
    if (inner) inner.style.display = '';
  }
  const title = document.getElementById('crewModalTitle');
  if (title) title.textContent = '+ ADD CREW MEMBER';
  openModal('modalAddCrew');
}

function saveCrewMemberFromModal() {
  const name   = document.getElementById('cm-name')?.value.trim()    || '';
  const phone  = document.getElementById('cm-phone')?.value.trim()   || '';
  const email  = document.getElementById('cm-email')?.value.trim()   || '';
  const role   = document.getElementById('cm-role')?.value           || '';
  const spec   = document.getElementById('cm-spec')?.value.trim()    || '';
  const rate   = parseFloat(document.getElementById('cm-rate')?.value)   || 0;
  const salary = parseFloat(document.getElementById('cm-salary')?.value) || 0;
  const events = parseInt(document.getElementById('cm-events')?.value)   || 0;
  const status = document.getElementById('cm-status')?.value.toLowerCase() || 'available';
  const notes  = document.getElementById('cm-notes')?.value.trim()   || '';

  if (!name) { showToast('Name is required.', 'err'); return; }

  const data = {
    name, phone, email, role, specialization: spec,
    dailyRate: rate,
    eventsDone: events,
    status, notes
  };
  if (salary > 0) data.monthlySalary = salary;
  if (window._pendingPhotoB64) {
    data.photoURL = window._pendingPhotoB64;
    window._pendingPhotoB64 = null;
  }

  const docId = window._editCrewId;
  const ref   = docId ? db.collection('crew').doc(docId) : db.collection('crew').doc();
  ref.set(data, { merge: true })
    .then(() => {
      window._editCrewId = null;
      closeModal('modalAddCrew');
      showToast((docId ? 'Crew member updated!' : 'Crew member added!'), 'ok');
      ['cm-name','cm-phone','cm-email','cm-spec','cm-notes','cm-rate','cm-salary'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      loadCrew();
    })
    .catch(e => showToast('Save failed: ' + e.message, 'err'));
}

function saveCrewMember() { saveCrewMemberFromModal(); }

// ══════════════════════════════════════════
//  LOAD EXPENSES (expenses table)
// ══════════════════════════════════════════
let expensesUnsubscribe = null;
let _finYear   = new Date().getFullYear();
let _finPreset = 'year';
let _finFrom   = null;
let _finTo     = null;

function _isoDate(d) { return d.toISOString().split('T')[0]; }

function _finRecomputeRange() {
  const now = new Date();
  if (_finPreset === 'year') {
    _finFrom = _finYear + '-01-01';
    _finTo   = _finYear + '-12-31';
  } else if (_finPreset === 'month') {
    const y = now.getFullYear(), m = now.getMonth();
    const lastDay = new Date(y, m + 1, 0).getDate();
    _finFrom = y + '-' + String(m + 1).padStart(2, '0') + '-01';
    _finTo   = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(lastDay).padStart(2, '0');
  } else if (_finPreset === 'last30') {
    const from = new Date(now); from.setDate(from.getDate() - 29);
    _finFrom = _isoDate(from);
    _finTo   = _isoDate(now);
  } else if (_finPreset === 'custom') {
    _finFrom = _finFrom || _isoDate(now);
    _finTo   = _finTo   || _isoDate(now);
  }
}

function _finSyncControls() {
  const yearNav  = document.getElementById('finYearNav');
  const yearLbl  = document.getElementById('finYearLabel');
  if (yearNav) yearNav.style.display = _finPreset === 'year' ? 'flex' : 'none';
  if (yearLbl) yearLbl.textContent   = _finYear;
}

let finCalendar = null;

function _finInitCalendar() {
  if (finCalendar || !window.MACalendar) return;
  const trigger = document.getElementById('finRangeTrigger');
  const textEl  = document.getElementById('finRangeText');
  if (!trigger) return;

  const presets = [
    { key: 'year',   label: 'This Year',    range: () => [new Date(_finYear, 0, 1), new Date(_finYear, 11, 31)] },
    { key: 'month',  label: 'This Month',   range: () => { const n = new Date(); return [new Date(n.getFullYear(), n.getMonth(), 1), new Date(n.getFullYear(), n.getMonth() + 1, 0)]; } },
    { key: 'last30', label: 'Last 30 Days', range: () => { const n = new Date(); const s = new Date(n); s.setDate(s.getDate() - 29); return [s, n]; } },
    { key: 'custom', label: 'Custom Range', custom: true },
  ];

  finCalendar = new MACalendar({
    trigger, textEl,
    mode: 'range',
    presets,
    rangeValue: { start: _finFrom, end: _finTo, presetKey: _finPreset },
    onChange: (v) => {
      _finPreset = v.presetKey || 'custom';
      _finFrom   = v.start;
      _finTo     = v.end;
      if (_finPreset === 'year') _finYear = new Date(_finFrom + 'T00:00:00').getFullYear();
      _finSyncControls();
      loadFinance();
    },
  });
}
// ── Expense Ledger range picker (separate from Finance) ────
let expCalendar = null;
let _expFrom    = null;
let _expTo      = null;
let _expPreset  = 'all';

function _expInitCalendar() {
  if (expCalendar || !window.MACalendar) return;
  const trigger = document.getElementById('expRangeTrigger');
  const textEl  = document.getElementById('expRangeText');
  if (!trigger) return;

  const presets = [
    { key: 'all',    label: 'All Time',     range: () => [new Date(2020, 0, 1), new Date()] },
    { key: 'month',  label: 'This Month',   range: () => { const n = new Date(); return [new Date(n.getFullYear(), n.getMonth(), 1), new Date(n.getFullYear(), n.getMonth() + 1, 0)]; } },
    { key: 'last30', label: 'Last 30 Days', range: () => { const n = new Date(); const s = new Date(n); s.setDate(s.getDate() - 29); return [s, n]; } },
    { key: 'year',   label: 'This Year',    range: () => { const n = new Date(); return [new Date(n.getFullYear(), 0, 1), new Date(n.getFullYear(), 11, 31)]; } },
    { key: 'custom', label: 'Custom Range', custom: true },
  ];

  expCalendar = new MACalendar({
    trigger, textEl,
    mode: 'range',
    presets,
    rangeValue: _expFrom && _expTo ? { start: _expFrom, end: _expTo, presetKey: _expPreset } : null,
    onChange: (v) => {
      _expPreset = v.presetKey || 'custom';
      _expFrom   = v.start;
      _expTo     = v.end;

      // Mirror into the hidden native inputs so expApplyFilters() picks them up
      const fromEl = document.getElementById('expFilterFrom');
      const toEl   = document.getElementById('expFilterTo');
      if (fromEl) fromEl.value = _expFrom || '';
      if (toEl)   toEl.value   = _expTo   || '';

      expApplyFilters();
    },
  });
}

function finChangeYear(delta) {
  _finYear  += delta;
  _finPreset = 'year';
  _finRecomputeRange();
  _finSyncControls();
  loadFinance();
}

// ══════════════════════════════════════════
//  EXPENSE LEDGER — filters (category / range / search)
// ══════════════════════════════════════════
function expApplyFilters() {
  const cat    = document.getElementById('expFilterCategory')?.value || '';
  const from   = document.getElementById('expFilterFrom')?.value || '';
  const to     = document.getElementById('expFilterTo')?.value || '';
  const search = (document.getElementById('expFilterSearch')?.value || '').toLowerCase().trim();

  const tbody = document.querySelector('#tblExpenses tbody');
  if (!tbody) return;
  const rows = tbody.querySelectorAll('tr[data-exp-row]');

  let visible = 0, total = 0;
  rows.forEach(row => {
    total++;
    const rowCat  = row.dataset.category || '';
    const rowDate = row.dataset.date || '';
    const rowText = row.textContent.toLowerCase();

    const matchCat  = !cat    || rowCat === cat;
    const matchFrom = !from   || rowDate >= from;
    const matchTo   = !to     || rowDate <= to;
    const matchText = !search || rowText.includes(search);

    const show = matchCat && matchFrom && matchTo && matchText;
    row.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  // Update the clear button visibility + summary label
  const active = !!(cat || from || to || search);
  const clearBtn = document.getElementById('expFilterClearBtn');
  if (clearBtn) clearBtn.style.display = active ? '' : 'none';

  const summary = document.getElementById('expFilterSummary');
  if (summary) {
    summary.textContent = (active && visible !== total)
      ? `Showing ${visible} of ${total} expenses`
      : '';
  }
}

function expClearFilters() {
  const catEl = document.getElementById('expFilterCategory'); if (catEl) catEl.value = '';
  const fromEl = document.getElementById('expFilterFrom');     if (fromEl) fromEl.value = '';
  const toEl   = document.getElementById('expFilterTo');       if (toEl) toEl.value = '';
  const srchEl = document.getElementById('expFilterSearch');   if (srchEl) srchEl.value = '';

  _expFrom = null;
  _expTo   = null;
  _expPreset = 'all';

  // Reset the calendar trigger's visible label
  const textEl = document.getElementById('expRangeText');
  if (textEl) {
    textEl.textContent = 'All Time';
    textEl.classList.add('placeholder');
  }

  expApplyFilters();
}

function loadExpenses() {
  const tbody = document.querySelector('#tblExpenses tbody');
  if (!tbody) return;

  _expInitCalendar();

  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem;letter-spacing:.1em">LOADING EXPENSES...</td></tr>';

  if (expensesUnsubscribe) expensesUnsubscribe();

  expensesUnsubscribe = db.collection('expenses').onSnapshot(snap => {
    const now     = new Date();
    const monPfx  = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0');
    const all     = snap.docs.map(d => ({id:d.id,...d.data()}));
    all.sort((a,b) => (b.date||'').localeCompare(a.date||''));

    const allTime   = all.reduce((s,e) => s + (e.amount||0), 0);
    const thisMonEx = all.filter(e => (e.date||'').startsWith(monPfx)).reduce((s,e) => s + (e.amount||0), 0);

    db.collection('bookings').get().then(bSnap => {
      const monRev = bSnap.docs.map(d=>d.data())
        .filter(b => b.status !== 'cancelled' && b.submitted)
        .filter(b => {
          const d = b.submitted?.toDate?.() || new Date(b.submitted);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        })
        .reduce((s,b) => s+(b.totalPrice||0), 0);

      const net = monRev - thisMonEx;
      const fmt = v => '₱' + (v >= 1000 ? Math.round(v/1000)+'K' : v.toLocaleString('en-PH'));

      ['expThisMonth','expAllTime','expNetProfit'].forEach((id,i) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = fmt([thisMonEx, allTime, net][i]);
        if (id==='expNetProfit') el.style.color = net >= 0 ? '#22c55e' : '#f87171';
      });
    }).catch(()=>{});

    if (all.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem">No expenses yet — click "+ Log Expense" to add one.</td></tr>';
      return;
    }

    const catColor = {Fuel:'#60a5fa',Repair:'#f87171',Consumables:'#eab308','Crew Pay':'#4ade80',Food:'#fb923c',Miscellaneous:'#a78bfa'};
    tbody.innerHTML = '';
    all.forEach(e => {
      const ref = '#EX-' + e.id.substring(0,6).toUpperCase();
      const cc  = catColor[e.category] || 'var(--gray)';
      const isCrewPay = e.category === 'Crew Pay';
      const tr  = document.createElement('tr');
      tr.dataset.expRow   = '1';
      tr.dataset.category = e.category || '';
      tr.dataset.date     = e.date || '';
      const descHtml = isCrewPay && e.crewrole
        ? `<div style="font-size:.78rem">${esc(e.description)}</div><div style="font-size:.65rem;color:var(--gray);margin-top:1px">${ROLE_ICONS[e.crewrole]||'👤'} ${esc(e.crewrole)}</div>`
        : esc(e.description);
      tr.innerHTML =
        '<td style="font-family:var(--font-m);font-size:.65rem;color:var(--gray)">' + ref + '</td>'
        + '<td><span style="font-family:var(--font-m);font-size:.6rem;letter-spacing:.1em;color:' + cc + ';background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);padding:2px 8px;border-radius:3px">' + esc(e.category) + '</span></td>'
        + '<td>' + descHtml + '</td>'
        + '<td style="font-family:var(--font-m);color:#f87171;font-weight:600">₱' + (e.amount||0).toLocaleString('en-PH') + '</td>'
        + '<td style="font-family:var(--font-m);font-size:.78rem">' + (e.date||'—') + '</td>'
        + '<td style="color:var(--gray);font-size:.82rem">' + esc(e.loggedby || e.loggedBy || 'Admin') + '</td>'
        + '<td><div class="act-group"><button class="act-btn act-delete" onclick="deleteExpense(\'' + e.id + '\')" title="Delete">🗑</button></div></td>';
      tbody.appendChild(tr);
    });
  }, err => {
    tbody.innerHTML = '<tr><td colspan="7" style="color:#f87171;padding:1.5rem;text-align:center">Error: ' + err.message + '</td></tr>';
  });
}

function saveExpense() {
  const cat  = document.getElementById('exp-category')?.value || '';
  const amt  = parseFloat(document.querySelector('#exp-amount')?.value) || 0;
  const desc = document.querySelector('#exp-desc')?.value.trim() || '';
  const date = document.querySelector('#exp-date')?.value || new Date().toISOString().split('T')[0];
  const by   = document.querySelector('#exp-by')?.value.trim() || _whoIsLoggedIn();

  if (!cat)    { showToast('Please select a category.', 'err'); return; }
  if (amt <= 0){ showToast('Amount must be > ₱0.', 'err'); return; }

  db.collection('expenses').add({
    category: cat, amount: amt, description: desc, date, loggedby: by
  }).then(() => {
    closeModal('modalAddExpense');
    showToast('₱' + amt.toLocaleString('en-PH') + ' expense logged — net profit updated.', 'ok');
    ['exp-amount','exp-desc','exp-by'].forEach(id => { const el=document.getElementById(id); if(el) el.value = id==='exp-by'?_whoIsLoggedIn():''; });
    if (document.getElementById('page-finance')?.classList.contains('active')) loadFinance();
  }).catch(e => showToast('Save failed: ' + e.message, 'err'));
}

function deleteExpense(id) {
  if (!confirm('Delete this expense? This affects your net profit.')) return;
  db.collection('expenses').doc(id).delete()
    .then(() => {
      showToast('Expense deleted.', 'ok');
      if (document.getElementById('page-finance')?.classList.contains('active')) loadFinance();
    })
    .catch(e => showToast('Error: ' + e.message, 'err'));
}
function editExpense(id) { showToast('Edit expense — coming soon', null); }

// ══════════════════════════════════════════
//  LOAD FINANCE — live from Supabase
// ══════════════════════════════════════════
let _finActiveEventType = '';
let _finActiveStatus    = '';
let _finActivePkg       = '';

function finApplyFilters() {
  _finActiveEventType = document.getElementById('finFilterEventType')?.value || '';
  _finActiveStatus    = document.getElementById('finFilterStatus')?.value || '';
  _finActivePkg       = document.getElementById('finFilterPkg')?.value || '';
  _finSyncFilterUI();
  loadFinance();
}

function finClearFilters() {
  _finActiveEventType = ''; _finActiveStatus = ''; _finActivePkg = '';
  const et = document.getElementById('finFilterEventType'); if (et) et.value = '';
  const st = document.getElementById('finFilterStatus');    if (st) st.value = '';
  const pk = document.getElementById('finFilterPkg');       if (pk) pk.value = '';
  _finSyncFilterUI();
  loadFinance();
}

function _finSyncFilterUI() {
  const active = !!(_finActiveEventType || _finActiveStatus || _finActivePkg);
  const clearBtn = document.getElementById('finFilterClearBtn');
  if (clearBtn) clearBtn.style.display = active ? '' : 'none';
  const summary = document.getElementById('finFilterSummary');
  if (summary) {
    const parts = [];
    if (_finActiveEventType) parts.push(_finActiveEventType);
    if (_finActiveStatus)    parts.push(_finActiveStatus);
    if (_finActivePkg)       parts.push(_finActivePkg);
    summary.textContent = parts.length ? `Filtered: ${parts.join(' · ')}` : '';
  }
}

function _finPopulatePkgOptions(allBookings) {
  const sel = document.getElementById('finFilterPkg');
  if (!sel) return;
  const current = sel.value;
  const pkgs = [...new Set(allBookings.map(b => b.pkg).filter(Boolean))].sort();
  sel.innerHTML = '<option value="">All Packages</option>' +
    pkgs.map(p => `<option value="${esc(p)}"${p === current ? ' selected' : ''}>${esc(p)}</option>`).join('');
}

function loadFinance() {
  if (!document.getElementById('finChartLabel')) return;
  if (!_finFrom || !_finTo) { _finRecomputeRange(); _finSyncControls(); }
  _finInitCalendar();

  const from = _finFrom, to = _finTo;
  const now  = new Date();

  Promise.all([
    db.collection('bookings').get(),
    db.collection('expenses').get()
  ]).then(([bSnap, eSnap]) => {

    const allBookings = bSnap.docs.map(d => _normalizeBooking({id:d.id,...d.data()})).filter(b => b.status !== 'cancelled');
    const allExpenses = eSnap.docs.map(d => ({id:d.id,...d.data()}));
    const expByBooking = _expensesByBooking(allExpenses);

    _finPopulatePkgOptions(allBookings);
    _finSyncFilterUI();

    let rBookings = allBookings.filter(b => (b.date||'') >= from && (b.date||'') <= to);
    if (_finActiveEventType) rBookings = rBookings.filter(b => (b.eventType||'') === _finActiveEventType);
    if (_finActiveStatus)    rBookings = rBookings.filter(b => (b.status||'pending') === _finActiveStatus);
    if (_finActivePkg)       rBookings = rBookings.filter(b => (b.pkg||'') === _finActivePkg);
    const rExpenses = allExpenses.filter(e => (e.date||'') >= from && (e.date||'') <= to);

    const confirmedBks = rBookings.filter(b => ['confirmed','completed','deposit paid'].includes(b.status||''));
    const pendingBks   = rBookings.filter(b => (b.status||'pending') === 'pending');

    const totalRev = confirmedBks.reduce((s,b) => s+(b.totalPrice||b.totalprice||0), 0);
        const collected = confirmedBks.reduce((s,b) => {
      // If the event is completed, the full balance is collected
      if (b.status === 'completed') return s + (b.totalprice || b.totalPrice || 0);
      
      // Only count the down payment if you have explicitly marked it as paid
      if (b.status === 'deposit paid') return s + (b.downpay || b.downPay || 0);
      
      // If it's just 'confirmed', no money has been collected yet
      return s;
    }, 0);
    const outstanding = Math.max(0, totalRev - collected);
    const totalExp    = rExpenses.reduce((s,e) => s+(e.amount||0), 0);
    const netProfit   = collected - totalExp;
    const expRatio    = collected > 0 ? Math.round(totalExp/collected*100) : 0;

    const fmt = v => '₱' + (v>=1000 ? Math.round(v/1000)+'K' : v.toLocaleString('en-PH'));
    const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };

    set('finRevenue',    fmt(totalRev));
    set('finCollected',  fmt(collected));
    set('finOutstanding',fmt(outstanding));
    set('finExpenses',   fmt(totalExp));
    set('finRevSub',     confirmedBks.length + ' confirmed gig' + (confirmedBks.length!==1?'s':'') + ' · ' + pendingBks.length + ' pending');
    set('finCollSub',    totalRev > 0 ? Math.round(collected/totalRev*100)+'% of expected collected' : '—');
    set('finOutSub',     confirmedBks.filter(b=>(b.totalPrice||0)>(b.downPay||0)).length + ' with balance due on event day');
    set('finExpSub',     rExpenses.length + ' expense entries');
    set('finNetProfit',  fmt(netProfit));
    set('finExpRatio',   expRatio + '%');

    const netEl = document.getElementById('finNetProfit');
    if (netEl) netEl.style.color = netProfit >= 0 ? '#22c55e' : '#f87171';

    const labelEl = document.getElementById('finChartLabel');
    const chartEl = document.getElementById('finChart');
    const fmtShort = iso => new Date(iso+'T00:00:00').toLocaleDateString('en-PH',{month:'short',day:'numeric'});

    if (_finPreset === 'year') {
      if (labelEl) labelEl.textContent = _finYear;
      const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      const mRev = new Array(12).fill(0), mExp = new Array(12).fill(0);
      confirmedBks.forEach(b => {
        if (!b.date) return;
        const mi = parseInt(b.date.split('-')[1]) - 1;
        if (mi<0||mi>11) return;
        mRev[mi] += b.status==='completed' ? (b.totalprice||b.totalPrice||0) : (b.downpay||b.downPay||0);
      });
      rExpenses.forEach(e => { if(e.date){ const m=parseInt(e.date.split('-')[1])-1; if(m>=0&&m<12) mExp[m]+=(e.amount||0); } });
      const mNet = mRev.map((r,i)=>r-mExp[i]);
      const maxVal = Math.max(...mRev, ...mExp, 1);
      const curMon = _finYear === now.getFullYear() ? now.getMonth() : 11;

      if (chartEl) chartEl.innerHTML = MONTHS.map((mon,i) => {
        const future = _finYear > now.getFullYear() || (_finYear === now.getFullYear() && i > now.getMonth());
        const rH = Math.max(2,(mRev[i]/maxVal)*100).toFixed(1);
        const eH = Math.max(future?0:1,(mExp[i]/maxVal)*100).toFixed(1);
        const nH = Math.max(0,(Math.max(0,mNet[i])/maxVal)*100).toFixed(1);
        const isCur = i===curMon && _finYear===now.getFullYear();
        const tip = future ? '' : 'Rev: ₱'+mRev[i].toLocaleString('en-PH')+' · Exp: ₱'+mExp[i].toLocaleString('en-PH')+' · Net: ₱'+mNet[i].toLocaleString('en-PH');
        return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0" title="${tip}">
          <div style="width:100%;height:140px;display:flex;align-items:flex-end;gap:1px;position:relative">
            ${future
              ? `<div style="width:100%;height:8px;border-top:1px dashed var(--border2);opacity:.3;margin-top:auto"></div>`
              : `<div style="flex:1;height:${rH}%;background:rgba(232,24,12,.45);border-radius:3px 3px 0 0;border-top:1px solid rgba(232,24,12,.7);transition:height .5s" title="Revenue ₱${mRev[i].toLocaleString('en-PH')}"></div>
                 <div style="flex:1;height:${eH}%;background:rgba(234,179,8,.45);border-radius:3px 3px 0 0;border-top:1px solid rgba(234,179,8,.7);transition:height .5s" title="Expenses ₱${mExp[i].toLocaleString('en-PH')}"></div>
                 <div style="flex:1;height:${nH}%;background:rgba(34,197,94,.45);border-radius:3px 3px 0 0;border-top:1px solid rgba(34,197,94,.7);transition:height .5s" title="Net ₱${mNet[i].toLocaleString('en-PH')}"></div>`
            }
          </div>
          <span style="font-family:var(--font-m);font-size:.5rem;letter-spacing:.08em;color:${isCur?'#e8180c':future?'var(--gray2)':'var(--gray)'};font-weight:${isCur?700:400}">${mon}</span>
        </div>`;
      }).join('');

    } else {
      if (labelEl) labelEl.textContent = fmtShort(from) + ' – ' + fmtShort(to) + ', ' + to.substring(0,4);
      const fromD = new Date(from+'T00:00:00'), toD = new Date(to+'T00:00:00');
      const spanDays = Math.round((toD-fromD)/86400000) + 1;

      if (spanDays <= 31) {
        const days = [];
        for (let d = new Date(fromD); d <= toD; d.setDate(d.getDate()+1)) days.push(_isoDate(d));
        const dRev = days.map(iso => confirmedBks.filter(b=>b.date===iso).reduce((s,b)=>s+(b.status==='completed'?(b.totalprice||b.totalPrice||0):(b.downpay||b.downPay||0)),0));
        const dExp = days.map(iso => rExpenses.filter(e=>e.date===iso).reduce((s,e)=>s+(e.amount||0),0));
        const dNet = dRev.map((r,i)=>r-dExp[i]);
        const maxVal = Math.max(...dRev, ...dExp, 1);
        if (chartEl) chartEl.innerHTML = days.map((iso,i) => {
          const rH=Math.max(2,(dRev[i]/maxVal)*100).toFixed(1), eH=Math.max(1,(dExp[i]/maxVal)*100).toFixed(1), nH=Math.max(0,(Math.max(0,dNet[i])/maxVal)*100).toFixed(1);
          const tip='Rev: ₱'+dRev[i].toLocaleString('en-PH')+' · Exp: ₱'+dExp[i].toLocaleString('en-PH')+' · Net: ₱'+dNet[i].toLocaleString('en-PH');
          const dayNum = iso.split('-')[2];
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0" title="${tip}">
            <div style="width:100%;height:140px;display:flex;align-items:flex-end;gap:1px">
              <div style="flex:1;height:${rH}%;background:rgba(232,24,12,.45);border-radius:2px 2px 0 0" title="Revenue ₱${dRev[i].toLocaleString('en-PH')}"></div>
              <div style="flex:1;height:${eH}%;background:rgba(234,179,8,.45);border-radius:2px 2px 0 0" title="Expenses ₱${dExp[i].toLocaleString('en-PH')}"></div>
              <div style="flex:1;height:${nH}%;background:rgba(34,197,94,.45);border-radius:2px 2px 0 0" title="Net ₱${dNet[i].toLocaleString('en-PH')}"></div>
            </div>
            <span style="font-family:var(--font-m);font-size:.48rem;color:var(--gray)">${dayNum}</span>
          </div>`;
        }).join('');
      } else {
        const monthKeys = [];
        const cur = new Date(fromD.getFullYear(), fromD.getMonth(), 1);
        const end = new Date(toD.getFullYear(), toD.getMonth(), 1);
        while (cur <= end) { monthKeys.push(cur.getFullYear()+'-'+String(cur.getMonth()+1).padStart(2,'0')); cur.setMonth(cur.getMonth()+1); }
        const mRev = monthKeys.map(k => confirmedBks.filter(b=>(b.date||'').startsWith(k)).reduce((s,b)=>s+(b.status==='completed'?(b.totalprice||b.totalPrice||0):(b.downpay||b.downPay||0)),0));
        const mExp = monthKeys.map(k => rExpenses.filter(e=>(e.date||'').startsWith(k)).reduce((s,e)=>s+(e.amount||0),0));
        const mNet = mRev.map((r,i)=>r-mExp[i]);
        const maxVal = Math.max(...mRev, ...mExp, 1);
        if (chartEl) chartEl.innerHTML = monthKeys.map((k,i) => {
          const [y,m] = k.split('-');
          const lbl = new Date(y, parseInt(m)-1, 1).toLocaleDateString('en-PH',{month:'short'}).toUpperCase() + " '" + y.substring(2);
          const rH=Math.max(2,(mRev[i]/maxVal)*100).toFixed(1), eH=Math.max(1,(mExp[i]/maxVal)*100).toFixed(1), nH=Math.max(0,(Math.max(0,mNet[i])/maxVal)*100).toFixed(1);
          const tip='Rev: ₱'+mRev[i].toLocaleString('en-PH')+' · Exp: ₱'+mExp[i].toLocaleString('en-PH')+' · Net: ₱'+mNet[i].toLocaleString('en-PH');
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0" title="${tip}">
            <div style="width:100%;height:140px;display:flex;align-items:flex-end;gap:1px">
              <div style="flex:1;height:${rH}%;background:rgba(232,24,12,.45);border-radius:3px 3px 0 0" title="Revenue ₱${mRev[i].toLocaleString('en-PH')}"></div>
              <div style="flex:1;height:${eH}%;background:rgba(234,179,8,.45);border-radius:3px 3px 0 0" title="Expenses ₱${mExp[i].toLocaleString('en-PH')}"></div>
              <div style="flex:1;height:${nH}%;background:rgba(34,197,94,.45);border-radius:3px 3px 0 0" title="Net ₱${mNet[i].toLocaleString('en-PH')}"></div>
            </div>
            <span style="font-family:var(--font-m);font-size:.5rem;letter-spacing:.06em;color:var(--gray)">${lbl}</span>
          </div>`;
        }).join('');
      }
    }

                const recTbody = document.querySelector('#tblPayments tbody');
    if (recTbody) {
      // Start with all confirmed bookings
      let displayBks = [...confirmedBks];

      // Apply the filter based on the clicked card
      if (_finActiveCard === 'revenue') {
        displayBks = displayBks.filter(b => ['confirmed', 'completed', 'deposit paid'].includes(b.status));
      } else if (_finActiveCard === 'collected') {
        displayBks = displayBks.filter(b => b.status === 'completed' || (b.downpay || b.downPay || 0) > 0);
      } else if (_finActiveCard === 'outstanding') {
        displayBks = displayBks.filter(b => (b.totalPrice || 0) > (b.downPay || 0));
      } else if (_finActiveCard === 'expenses') {
        displayBks = [];
      }

      // Sort and slice
      const rows = displayBks.sort((a,b) => (b.date||'').localeCompare(a.date||'')).slice(0, 50);

      // Update the empty state message based on the filter
      if (!rows.length) {
        const emptyMsg = _finActiveCard === 'expenses' 
          ? "See the Expense Ledger below for detailed expenses." 
          : "No bookings match the current filter.";
        recTbody.innerHTML = `<tr><td colspan="12" style="text-align:center;color:var(--gray2);padding:1.5rem;font-family:var(--font-m);font-size:.72rem">${emptyMsg}</td></tr>`;
      } else {
        recTbody.innerHTML = rows.map(b => {
          const tot  = b.totalPrice || 0;
          const dp   = b.downPay || 0;
          const paid = b.status === 'completed' ? tot : dp;
          const bal  = Math.max(0, tot - paid);
          const bookingExp = expByBooking[b.id] || 0;
          const bookingNet = paid - bookingExp;
          const refYear = (b.date||'').substring(0,4) || _finYear;
          const ref  = 'MA-' + refYear + '-' + b.id.substring(0,6).toUpperCase();
          
          const stBadge = b.status === 'completed'
  ? '<span class="badge badge-green">SETTLED</span>'
  : b.status === 'deposit paid'
    ? '<span class="badge badge-blue">DEPOSIT PAID</span>'
    : b.status === 'confirmed'
      ? '<span class="badge badge-yellow">WAITING DOWN PAYMENT</span>'
      : bal === 0
        ? '<span class="badge badge-green">PAID</span>'
        : '<span class="badge badge-yellow">DOWN PAID</span>';
                
          const actionBtn = b.status !== 'completed'
            ? `<button onclick="markDone('${b.id}')"
                style="background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.25);color:#60a5fa;padding:.25rem .6rem;border-radius:4px;font-family:var(--font-m);font-size:.58rem;letter-spacing:.08em;cursor:pointer;white-space:nowrap;transition:background .2s"
                onmouseover="this.style.background='rgba(59,130,246,.25)'"
                onmouseout="this.style.background='rgba(59,130,246,.12)'"
                title="Mark event as done — collect full balance">
                🏁 MARK DONE
              </button>`
            : '<span style="font-family:var(--font-m);font-size:.58rem;color:var(--gray2);letter-spacing:.08em">SETTLED</span>';
            
          return '<tr>'
            + '<td style="font-family:var(--font-m);font-size:.65rem;color:var(--gray)">' + ref + '</td>'
            + '<td><strong>' + esc(b.name) + '</strong><br><span style="font-size:.72rem;color:var(--gray)">' + esc(b.pkg) + '</span></td>'
            + '<td style="font-family:var(--font-m);font-size:.72rem;color:var(--gray)">' + esc(b.eventType || '—') + '</td>'
            + '<td style="font-family:var(--font-m);font-size:.78rem;color:var(--gray)">' + (b.date||'—') + '</td>'
            + '<td style="font-family:var(--font-m)">₱' + tot.toLocaleString('en-PH') + '</td>'
            + '<td style="font-family:var(--font-m);color:#22c55e;font-weight:600">₱' + paid.toLocaleString('en-PH') + '</td>'
            + '<td style="font-family:var(--font-m);color:' + (bal>0?'#eab308':'#22c55e') + '">₱' + bal.toLocaleString('en-PH') + '</td>'
            + '<td style="font-family:var(--font-m);color:#eab308">' + (bookingExp>0 ? '₱'+bookingExp.toLocaleString('en-PH') : '—') + '</td>'
            + '<td style="font-family:var(--font-m);font-weight:600;color:' + (bookingNet>=0?'#22c55e':'#f87171') + '">₱' + bookingNet.toLocaleString('en-PH') + '</td>'
            + '<td>' + esc(b.payMethod) + '</td>'
            + '<td>' + stBadge + '</td>'
            + '<td>' + actionBtn + '</td>'
            + '</tr>';
        }).join('');
      }
    }

  }).catch(err => {
    console.error('[Finance]', err);
    showToast('Finance error: ' + err.message, 'err');
  });
}

// ── Export PDF Financial Report ─────────────────────────────
async function exportFinancePDF() {
  showToast('Building PDF report…','ok');
  if (!_finFrom || !_finTo) _finRecomputeRange();
  const from = _finFrom, to = _finTo;
  const rangeLabel = _finPreset === 'year'
    ? 'FY ' + _finYear
    : from + ' to ' + to;
  let books=[], exps=[], expByBooking={};
  try {
    const [bs,es] = await Promise.all([db.collection('bookings').get(), db.collection('expenses').get()]);
    const allBookings = bs.docs.map(d=>_normalizeBooking({id:d.id,...d.data()}));
    const allExpenses = es.docs.map(d=>({id:d.id,...d.data()}));
    expByBooking = _expensesByBooking(allExpenses);

    books = allBookings.filter(b=>(b.date||'') >= from && (b.date||'') <= to);
    if (_finActiveEventType) books = books.filter(b => (b.eventType||'') === _finActiveEventType);
    if (_finActiveStatus)    books = books.filter(b => (b.status||'pending') === _finActiveStatus);
    if (_finActivePkg)       books = books.filter(b => (b.pkg||'') === _finActivePkg);

    exps  = allExpenses.filter(e => (e.date||'') >= from && (e.date||'') <= to);
  } catch(err){ showToast('Load failed: '+err.message,'err'); return; }

  const filterParts = [];
  if (_finActiveEventType) filterParts.push('Event Type: ' + _finActiveEventType);
  if (_finActiveStatus)    filterParts.push('Status: ' + _finActiveStatus);
  if (_finActivePkg)       filterParts.push('Package: ' + _finActivePkg);
  const filterLabel = filterParts.length ? filterParts.join(' · ') : 'All bookings';

  const totRev  = books.reduce((s,b)=>s+(parseFloat(b.totalPrice)||0),0);
  const totPaid = books.reduce((s,b)=>s+(b.status==='completed' ? (parseFloat(b.totalPrice)||0) : (parseFloat(b.downPay)||0)),0);
  const totExp  = exps .reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const net     = totPaid - totExp;

  const bRows = books.map(b=>{
    const tot  = parseFloat(b.totalPrice)||0;
    const dp   = parseFloat(b.downPay)||0;
    const paid = b.status === 'completed' ? tot : dp;
    const bookingExp = expByBooking[b.id] || 0;
    const bookingNet = paid - bookingExp;
    const st=(b.status||'pending').toLowerCase();
    const bc=st==='confirmed'||st==='completed'?'#dcfce7;color:#15803d':st==='cancelled'?'#fee2e2;color:#b91c1c':'#fef9c3;color:#854d0e';
    const refYr = (b.date||'').substring(0,4) || _finYear;
    return `<tr><td style="font-family:monospace;font-size:.62rem">MA-${refYr}-${b.id.substring(0,6).toUpperCase()}</td>
    <td>${esc(b.name||'—')}</td><td>${esc(b.eventType||'—')}</td><td>${esc(b.pkg||'—')}</td><td>${b.date||'—'}</td>
    <td style="font-weight:600">₱${tot.toLocaleString('en-PH')}</td>
    <td>₱${paid.toLocaleString('en-PH')}</td>
    <td>₱${(tot-paid).toLocaleString('en-PH')}</td>
    <td style="color:#d97706">${bookingExp>0?'₱'+bookingExp.toLocaleString('en-PH'):'—'}</td>
    <td style="font-weight:600;color:${bookingNet>=0?'#16a34a':'#dc2626'}">₱${bookingNet.toLocaleString('en-PH')}</td>
    <td><span style="background:${bc};padding:2px 7px;border-radius:3px;font-size:.58rem;font-weight:600">${st.toUpperCase()}</span></td></tr>`;
  }).join('');

  const eRows = exps.map(e=>`<tr>
    <td style="font-family:monospace;font-size:.62rem">${e.date||'—'}</td>
    <td>${esc(e.category||'—')}</td>
    <td>${esc(e.description||e.crewname||'—')}</td>
    <td style="font-weight:600;color:#dc2626">₱${(parseFloat(e.amount)||0).toLocaleString('en-PH')}</td>
    <td style="font-size:.68rem;color:#6b7280">${esc(e.loggedby||e.loggedBy||'—')}</td>
  </tr>`).join('');

  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <title>M-Audio PRO — Financial Report (${rangeLabel})</title>
  <style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;color:#111;background:#fff;padding:28px;font-size:13px}
  .hd{display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;margin-bottom:8px;border-bottom:3px solid #e8180c}
  .logo{width:38px;height:38px;background:#e8180c;color:#fff;font-weight:700;font-size:1.3rem;display:flex;align-items:center;justify-content:center;border-radius:3px;margin-right:10px}
  .brand-row{display:flex;align-items:center}
  .brand-name{font-size:.9rem;font-weight:700;letter-spacing:.06em}
  .brand-sub{font-size:.58rem;color:#888;letter-spacing:.1em}
  .meta{text-align:right;font-size:.7rem;color:#555}
  .meta strong{font-size:1.1rem;color:#e8180c;font-weight:700;display:block}
  .filter-line{text-align:right;font-size:.62rem;color:#9ca3af;margin-bottom:20px}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px}
  .kpi{border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px}
  .kpi-lbl{font-size:.52rem;letter-spacing:.14em;color:#9ca3af;text-transform:uppercase;margin-bottom:4px}
  .kpi-val{font-size:1.15rem;font-weight:700}
  .sec{font-size:.58rem;letter-spacing:.2em;font-weight:700;text-transform:uppercase;color:#e8180c;margin:18px 0 8px;border-left:3px solid #e8180c;padding-left:8px}
  table{width:100%;border-collapse:collapse;font-size:.72rem;margin-bottom:18px}
  th{background:#111317;color:#fff;padding:7px 9px;text-align:left;font-size:.52rem;letter-spacing:.12em}
  td{padding:6px 9px;border-bottom:1px solid #f3f4f6}
  tr:nth-child(even) td{background:#fafafa}
  .sig-row{display:flex;justify-content:space-between;margin-top:56px;gap:60px}
  .sig-box{flex:1;text-align:center}
  .sig-line{border-top:1.5px solid #111;margin-top:46px;padding-top:6px}
  .sig-role{font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
  .sig-sub{font-size:.55rem;color:#9ca3af;margin-top:2px}
  .ft{margin-top:24px;padding-top:10px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:.58rem;color:#9ca3af}
  @media print{@page{margin:1.5cm}button{display:none}}
  </style></head><body>
  <div class="hd">
    <div class="brand-row">
      <div class="logo">M</div>
      <div><div class="brand-name">M-AUDIO PRO SOUND</div><div class="brand-sub">POBLACION, CORELLA, BOHOL · 0930 261 7168</div></div>
    </div>
    <div class="meta"><strong>FINANCIAL REPORT</strong>${rangeLabel} · ${new Date().toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'})}</div>
  </div>
  <div class="filter-line">Filter: ${esc(filterLabel)}</div>
  <div class="kpis">
    <div class="kpi"><div class="kpi-lbl">Gross Revenue</div><div class="kpi-val" style="color:#e8180c">₱${totRev.toLocaleString('en-PH')}</div></div>
    <div class="kpi"><div class="kpi-lbl">Total Collected</div><div class="kpi-val">₱${totPaid.toLocaleString('en-PH')}</div></div>
    <div class="kpi"><div class="kpi-lbl">Total Expenses</div><div class="kpi-val" style="color:#d97706">₱${totExp.toLocaleString('en-PH')}</div></div>
    <div class="kpi"><div class="kpi-lbl">Net Profit</div><div class="kpi-val" style="color:${net>=0?'#16a34a':'#dc2626'}">₱${net.toLocaleString('en-PH')}</div></div>
  </div>
  <div class="sec">BOOKINGS — ${rangeLabel} (${books.length})</div>
  <table><thead><tr><th>REF</th><th>CLIENT</th><th>EVENT TYPE</th><th>PACKAGE</th><th>DATE</th><th>TOTAL</th><th>PAID</th><th>BALANCE</th><th>EXPENSES</th><th>NET</th><th>STATUS</th></tr></thead>
  <tbody>${bRows||'<tr><td colspan="11" style="text-align:center;color:#9ca3af;padding:1rem">No bookings match the current filters.</td></tr>'}</tbody></table>
  <div class="sec">EXPENSES — ${rangeLabel} (${exps.length})</div>
  <table><thead><tr><th>DATE</th><th>CATEGORY</th><th>DESCRIPTION</th><th>AMOUNT</th><th>LOGGED BY</th></tr></thead>
  <tbody>${eRows||'<tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:1rem">No expenses recorded.</td></tr>'}</tbody></table>
  <div class="sig-row">
    <div class="sig-box"><div class="sig-line"><div class="sig-role">Prepared By</div><div class="sig-sub">Signature over printed name</div></div></div>
    <div class="sig-box"><div class="sig-line"><div class="sig-role">Approved By</div><div class="sig-sub">Signature over printed name</div></div></div>
  </div>
  <div class="ft"><span>M-Audio Pro Sound — Confidential Financial Document</span><span>Generated: ${new Date().toLocaleString('en-PH')}</span></div>
  </body></html>`;

  const w=window.open('','_blank','width=960,height=720');
  w.document.write(html); w.document.close();
  w.onload=()=>{ setTimeout(()=>{ w.print(); showToast('PDF dialog opened — choose "Save as PDF".','ok'); },400); };
}
function exportFinanceCSV(){ exportFinancePDF(); }

// ── Price History & Live Price Editing ───────────────────────
async function openPriceHistory() {
  const modal = document.getElementById('modalPriceHistory');
  const body  = document.getElementById('priceHistoryBody');
  if (!modal||!body){ showToast('Price history modal missing','err'); return; }
  body.innerHTML='<div style="text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.72rem">Loading…</div>';
  openModal('modalPriceHistory');
  try {
    const snap = await db.collection('package_price_history').get();
    if (snap.empty){
      body.innerHTML='<div style="text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.72rem">No price changes recorded yet.<br>Use "Edit Price" on any package to start the history.</div>';
      return;
    }
    const recs = snap.docs.map(d=>({id:d.id,...d.data()}))
      .sort((a,b)=>(b.changedat||'').localeCompare(a.changedat||''));
    body.innerHTML = recs.map(r=>{
      const dt = r.changedat ? new Date(r.changedat).toLocaleString('en-PH') : '—';
      const op = parseFloat(r.oldprice)||0;
      const np = parseFloat(r.newprice)||0;
      const delta = np-op;
      const arrow = delta>0?'↑':'↓';
      const dc    = delta>0?'#22c55e':'#f87171';
      return `<div style="display:grid;grid-template-columns:1fr auto auto 1fr;gap:.5rem 1rem;padding:.65rem 0;border-bottom:1px solid var(--border);align-items:center">
        <div>
          <div style="font-weight:600;font-size:.84rem;color:var(--white)">${esc(r.packagename||r.packageid||'—')}</div>
          <div style="font-family:var(--font-m);font-size:.58rem;color:var(--gray2)">${esc(r.packageid||'')}</div>
        </div>
        <div style="font-family:var(--font-m);font-size:.78rem;color:var(--gray2);text-decoration:line-through">₱${op.toLocaleString('en-PH')}</div>
        <div style="font-family:var(--font-m);font-size:.82rem;font-weight:700;color:#22c55e">₱${np.toLocaleString('en-PH')} <span style="color:${dc};font-size:.68rem">${arrow}₱${Math.abs(delta).toLocaleString('en-PH')}</span></div>
        <div style="text-align:right">
          <div style="font-family:var(--font-m);font-size:.6rem;color:var(--gray2)">${dt}</div>
          ${r.notes?`<div style="font-size:.7rem;color:var(--gray);margin-top:.15rem">${esc(r.notes)}</div>`:''}
        </div>
      </div>`;
    }).join('');
  } catch(e){ body.innerHTML=`<div style="color:#f87171;padding:1rem;text-align:center">Error: ${e.message}</div>`; }
}

function openEditPriceModal(pkgId, pkgName, currentPrice) {
  const modal=document.getElementById('modalEditPrice');
  if (!modal){ showToast('Edit price modal missing','err'); return; }
  document.getElementById('epPkgId').value    = pkgId;
  document.getElementById('epPkgName').value  = pkgName;
  document.getElementById('epOldPrice').value = currentPrice;
  document.getElementById('epNewPrice').value = currentPrice;
  document.getElementById('epNotes').value    = '';
  document.getElementById('epPkgLabel').textContent   = pkgName;
  document.getElementById('epCurrentLabel').textContent = '₱'+parseInt(currentPrice).toLocaleString('en-PH');
  openModal('modalEditPrice');
}

async function submitEditPrice() {
  const pkgId    = document.getElementById('epPkgId').value;
  const pkgName  = document.getElementById('epPkgName').value;
  const oldPrice = parseFloat(document.getElementById('epOldPrice').value)||0;
  const newPrice = parseFloat(document.getElementById('epNewPrice').value)||0;
  const notes    = document.getElementById('epNotes').value.trim();
  if (!newPrice||newPrice<=0){ showToast('Enter a valid price (> 0)','err'); return; }
  if (newPrice===oldPrice){ showToast('Price unchanged.','ok'); closeModal('modalEditPrice'); return; }
  const btn=document.querySelector('#modalEditPrice .btn-red');
  if(btn){ btn.disabled=true; btn.textContent='Saving…'; }

  function _isRlsError(e) {
    const m = (e?.message||'').toLowerCase();
    return m.includes('row-level security') || m.includes('violates') || m.includes('policy') || m.includes('permission');
  }

  try {
    await db.collection('package_price_overrides').doc(pkgId).set({
      packageid:    pkgId,
      packagename:  pkgName,
      currentprice: newPrice,
      updatedat:    serverTimestamp()
    });

    try {
      await db.collection('package_price_history').add({
        packageid:  pkgId, packagename: pkgName,
        oldprice:   oldPrice, newprice: newPrice,
        changedat:  serverTimestamp(),
        changedby:  'Admin', notes
      });
    } catch (histErr) {
      if (_isRlsError(histErr)) {
        showToast('Price saved! History blocked by RLS — run PRICE_RLS_FIX.sql in Supabase.', 'ok');
      }
    }

    for (const cat of Object.values(PACKAGE_DATA)) {
      const pkg = cat.packages.find(p => p.id === pkgId);
      if (pkg) { pkg.price = newPrice; break; }
    }

    closeModal('modalEditPrice');
    renderPackagesFromData();
    showToast('Price updated → ₱' + newPrice.toLocaleString('en-PH'), 'ok');

  } catch(err) {
    if (_isRlsError(err)) {
      const errBox = document.getElementById('epErrorBox');
      if (errBox) {
        errBox.style.display = 'block';
        errBox.innerHTML = '🔒 <strong>Permission denied.</strong> Supabase RLS is blocking writes.<br>'
          + 'Run <strong>PRICE_RLS_FIX.sql</strong> in Supabase SQL Editor to fix this once.';
      } else {
        showToast('Permission denied — run PRICE_RLS_FIX.sql in Supabase SQL Editor.', 'err');
      }
    } else {
      showToast('Failed: ' + err.message, 'err');
    }
  } finally {
    if(btn){ btn.disabled=false; btn.textContent='Save Price'; }
  }
}


// ══════════════════════════════════════════
//  NOTIFICATION BELL
// ══════════════════════════════════════════
let _notifDropOpen = false;

function updateNotifBell(pendingCount, allBookings) {
  const bell    = document.querySelector('.topbar-notif');
  const redDot  = document.getElementById('notifDot');
  if (!bell) return;

  if (!redDot) {
    const dot = document.createElement('span');
    dot.id = 'notifDot';
    dot.style.cssText = 'position:absolute;top:2px;right:2px;width:8px;height:8px;border-radius:50%;background:#e8180c;display:none';
    bell.style.position = 'relative';
    bell.appendChild(dot);
  }

  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = pendingCount > 0 ? 'block' : 'none';

  const now = new Date(); now.setHours(0,0,0,0);
  const recent = allBookings
    .filter(b => {
      if (!b.submitted) return false;
      const d = b.submitted.toDate ? b.submitted.toDate() : new Date(b.submitted);
      const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 3;
    })
    .sort((a,b) => {
      const da = a.submitted?.toDate?.() || new Date(a.submitted);
      const db2 = b.submitted?.toDate?.() || new Date(b.submitted);
      return db2 - da;
    })
    .slice(0, 8);

  bell.onclick = (e) => {
    e.stopPropagation();
    _notifDropOpen = !_notifDropOpen;
    let drop = document.getElementById('notifDropdown');
    if (!drop) {
      drop = document.createElement('div');
      drop.id = 'notifDropdown';
      drop.style.cssText = [
        'position:fixed',
        'top:62px',
        'right:12px',
        'width:320px',
        'background:var(--bg2)',
        'border:1px solid var(--border)',
        'border-radius:8px',
        'box-shadow:0 12px 40px rgba(0,0,0,.5)',
        'z-index:9999',
        'overflow:hidden',
        'animation:slideDown .2s ease'
      ].join(';');
      document.body.appendChild(drop);
    }
    if (!_notifDropOpen) { drop.remove(); _notifDropOpen = false; return; }

    const items = recent.length === 0
      ? '<div style="padding:1.25rem;text-align:center;color:var(--gray2);font-family:var(--font-m);font-size:.65rem;letter-spacing:.1em">No recent notifications</div>'
      : recent.map(b => {
          const d   = b.submitted?.toDate?.() || new Date(b.submitted);
          const ago = timeAgo(d);
          const sc  = {pending:'#eab308',confirmed:'#22c55e',cancelled:'#f87171'}[b.status||'pending'] || '#8b92a5';
          return `<div onclick="navigate('bookings')" style="padding:.75rem 1rem;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s;display:flex;gap:.65rem;align-items:flex-start" onmouseover="this.style.background='var(--bg3)'" onmouseout="this.style.background=''">
            <span style="font-size:1rem;flex-shrink:0;margin-top:2px">${b.status==='pending'?'🆕':b.status==='confirmed'?'✅':'❌'}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:.84rem;font-weight:600;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(b.name || '—')}</div>
              <div style="font-size:.72rem;color:var(--gray);margin-top:1px">${esc(b.pkg || '—')} · ${b.date || '—'}</div>
              <div style="display:flex;align-items:center;gap:.4rem;margin-top:3px">
                <span style="font-family:var(--font-m);font-size:.55rem;letter-spacing:.12em;color:${sc}">${(b.status||'pending').toUpperCase()}</span>
                <span style="font-family:var(--font-m);font-size:.55rem;color:var(--gray2)">${ago}</span>
              </div>
            </div>
          </div>`;
        }).join('');

    drop.innerHTML = `<div style="padding:.65rem 1rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <span style="font-family:var(--font-m);font-size:.62rem;letter-spacing:.18em;color:var(--white)">NOTIFICATIONS</span>
        ${pendingCount > 0 ? `<span style="font-family:var(--font-m);font-size:.58rem;background:rgba(232,24,12,.1);border:1px solid rgba(232,24,12,.25);color:#f87171;padding:1px 7px;border-radius:3px">${pendingCount} PENDING</span>` : ''}
      </div>
      <div style="max-height:340px;overflow-y:auto">${items}</div>
      <div style="padding:.6rem 1rem;border-top:1px solid var(--border);text-align:center">
        <button onclick="navigate('bookings');document.getElementById('notifDropdown')?.remove();_notifDropOpen=false" style="font-family:var(--font-m);font-size:.6rem;letter-spacing:.12em;background:transparent;border:1px solid var(--border);color:var(--gray);padding:.3rem .9rem;border-radius:4px;cursor:pointer">VIEW ALL BOOKINGS</button>
      </div>`;
  };

  document.addEventListener('click', () => {
    const drop = document.getElementById('notifDropdown');
    if (drop) { drop.remove(); _notifDropOpen = false; }
  }, { once: true });
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)     return 'just now';
  if (diff < 3600)   return Math.floor(diff/60) + 'm ago';
  if (diff < 86400)  return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}
document.addEventListener('click', e => {
  const ph = e.target.closest('.crew-card-photo[data-clickable], .ccv2-photo[data-clickable]');
  if (!ph) return;
  e.stopPropagation();
  const docId = ph.dataset.id;
  if (!docId) { console.warn('[Photo] No data-id on element'); return; }

  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'image/*';
  inp.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
  document.body.appendChild(inp);

  inp.addEventListener('change', () => {
    const file = inp.files[0];
    document.body.removeChild(inp);
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    const bgLayer = ph.querySelector('.ccv2-photo-bg');
    if (bgLayer) {
      bgLayer.style.backgroundImage    = 'url(' + localUrl + ')';
      bgLayer.style.backgroundSize     = 'cover';
      bgLayer.style.backgroundPosition = 'center top';
    } else {
      ph.style.backgroundImage    = 'url(' + localUrl + ')';
      ph.style.backgroundSize     = 'cover';
      ph.style.backgroundPosition = 'center top';
    }
    const icon = ph.querySelector('.photo-icon');
    const hint = ph.querySelector('.photo-hint');
    if (icon) icon.style.display = 'none';
    if (hint) hint.style.display = 'none';
    showToast('Uploading…', null);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 400;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const b64 = canvas.toDataURL('image/jpeg', 0.75);
        db.collection('crew').doc(docId).update({ photoURL: b64 })
          .then(() => showToast('Photo saved! ✓', 'ok'))
          .catch(err => showToast('Save failed: ' + err.message, 'err'));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  inp.click();
});

// ══════════════════════════════════════════
//  PACKAGES PAGE — Dynamic from PACKAGE_DATA
// ══════════════════════════════════════════
function loadPackages() {
  renderPackagesFromData();
  db.collection('package_price_overrides').get().then(snap => {
    if (snap.empty) return;
    let changed = false;
    snap.docs.forEach(d => {
      const row = { id: d.id, ...d.data() };
      const pkgId = row.id || row.packageid;
      const newPrice = parseFloat(row.currentprice || row.currentPrice);
      if (!pkgId || !newPrice) return;
      for (const cat of Object.values(PACKAGE_DATA)) {
        const pkg = cat.packages.find(p => p.id === pkgId);
        if (pkg && pkg.price !== newPrice) {
          pkg._liveOverride = true;
          pkg.price = newPrice;
          changed = true;
        }
      }
    });
    if (changed) renderPackagesFromData();
  }).catch(() => {});
}


function renderPackagesFromData() {
  const tbody = document.getElementById('pkgTbody') || document.querySelector('#tblPackages tbody');
  if (!tbody) return;

  const catIcons  = { basic:'🔊', wedding:'💍', bigcrowd:'🎪', ledwall:'📺' };
  const catOrder  = ['basic','wedding','bigcrowd','ledwall'];

  let rows = '';
  catOrder.forEach(catKey => {
    const cat = PACKAGE_DATA[catKey];
    if (!cat) return;
    const icon = catIcons[catKey] || '🎵';

    rows += '<tr style="background:rgba(232,24,12,.05)">' +
      '<td colspan="7" style="font-family:var(--font-m);font-size:.58rem;letter-spacing:.18em;color:#e8180c;padding:.55rem 1rem;border-bottom:1px solid rgba(232,24,12,.12)">' +
      icon + ' ' + cat.label +
      ' <span style="color:var(--gray2);font-size:.55rem;font-weight:400;letter-spacing:.1em">— ' + cat.subtitle + ' · 👥 ' + cat.crew + ' crew</span>' +
      '</td></tr>';

    cat.packages.forEach(pkg => {
      const pkgDisplayName = pkg.num
        ? ('PKG ' + pkg.num + (pkg.name ? ' — ' + pkg.name : ''))
        : (pkg.name || '—');
      const isOverride = !!pkg._liveOverride;
      const liveBadge  = isOverride ? '<span style="font-family:var(--font-m);font-size:.48rem;background:rgba(34,197,94,.15);border:1px solid rgba(34,197,94,.3);color:#22c55e;padding:1px 5px;border-radius:3px;vertical-align:middle;margin-left:4px">⚡LIVE</span>' : '';
      const price      = pkg.price ? '₱' + pkg.price.toLocaleString('en-PH') : '—';
      const priceExtra = pkg.priceOutdoor ? ' <span style="font-size:.62rem;color:var(--gray2)">/ ₱' + pkg.priceOutdoor.toLocaleString('en-PH') + ' outdoor</span>' : '';
      const inclSnip   = pkg.inclusions ? pkg.inclusions.slice(0, 3).join(' · ') + (pkg.inclusions.length > 3 ? '…' : '') : '—';
      const tagBadge   = pkg.tag ? ' <span style="font-family:var(--font-m);font-size:.5rem;background:rgba(234,179,8,.1);border:1px solid rgba(234,179,8,.2);color:#eab308;padding:1px 5px;border-radius:3px;vertical-align:middle">' + pkg.tag + '</span>' : '';
      const safeId     = pkg.id.replace(/'/g, "\\'");
      const safeName   = pkgDisplayName.replace(/'/g, "\\'");

      rows += '<tr>' +
        '<td style="font-family:var(--font-m);font-size:.6rem;color:var(--gray)">' + pkg.id + '</td>' +
        '<td><strong>' + esc(pkgDisplayName) + '</strong>' + tagBadge + '<br><span style="font-size:.7rem;color:var(--gray)">' + esc(cat.label) + '</span></td>' +
        '<td style="font-size:.8rem;color:var(--gray);max-width:140px">' + esc(cat.subtitle) + '</td>' +
        '<td style="font-family:var(--font-m);color:#e8180c;font-weight:700;white-space:nowrap">' + price + liveBadge + priceExtra + '</td>' +
        '<td style="max-width:240px;font-size:.72rem;color:var(--gray);overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + esc(pkg.inclusions ? pkg.inclusions.join('; ') : '') + '">' + esc(inclSnip) + '</td>' +
        '<td><span class="badge badge-green">ACTIVE</span></td>' +
        '<td><div class="act-group">' +
          '<button class="act-btn act-view" title="View inclusions" onclick="viewPackageDetail(\'' + safeId + '\')">👁</button>' +
          '<button class="act-btn act-edit" title="Edit price" style="font-size:.65rem;font-weight:700;color:#e8180c;min-width:52px" onclick="openEditPriceModal(\'' + safeId + '\',\'' + safeName + '\',' + (pkg.price||0) + ')">₱ EDIT</button>' +
        '</div></td>' +
        '</tr>';
    });
  });

  tbody.innerHTML = rows || '<tr><td colspan="7" style="text-align:center;color:var(--gray2);padding:2rem">No packages found.</td></tr>';
}

function viewPackageDetail(pkgId) {
  const found = findPackageById(pkgId);
  if (!found) {
    showToast('Package not found.', 'err');
    return;
  }

  const pkg = found.pkg;
  const cat = found.cat;

  const html = `
    <div style="margin-bottom:1.25rem">
      <div style="font-family:var(--font-m);font-size:.55rem;letter-spacing:.2em;color:var(--gray2);margin-bottom:.5rem">PACKAGE</div>
      <div style="font-size:1.2rem;font-weight:700;color:var(--white)">${cat.label} — ${pkg.num ? 'PKG ' + pkg.num + (pkg.name ? ' (' + pkg.name + ')' : '') : pkg.name}</div>
      ${pkg.tag ? '<span style="font-family:var(--font-m);font-size:.55rem;background:rgba(234,179,8,.15);border:1px solid rgba(234,179,8,.3);color:#eab308;padding:.2rem .5rem;border-radius:3px;margin-top:.5rem;display:inline-block">' + pkg.tag + '</span>' : ''}
    </div>

    <div style="margin-bottom:1.25rem">
      <div style="font-family:var(--font-m);font-size:.55rem;letter-spacing:.2em;color:var(--gray2);margin-bottom:.5rem">PRICE</div>
      <div style="font-size:1.5rem;font-weight:700;color:#e8180c">₱${pkg.price.toLocaleString('en-PH')}</div>
      ${pkg.priceOutdoor ? '<div style="font-size:.75rem;color:var(--gray2);margin-top:.25rem">Outdoor: ₱' + pkg.priceOutdoor.toLocaleString('en-PH') + '</div>' : ''}
    </div>

    <div style="margin-bottom:1.25rem">
      <div style="font-family:var(--font-m);font-size:.55rem;letter-spacing:.2em;color:var(--gray2);margin-bottom:.5rem">CREW INCLUDED</div>
      <div style="font-size:.9rem;color:var(--white)">👥 ${cat.crew} crew members</div>
    </div>

    <div style="margin-bottom:1.25rem">
      <div style="font-family:var(--font-m);font-size:.55rem;letter-spacing:.2em;color:var(--gray2);margin-bottom:.75rem">INCLUSIONS</div>
      <ul style="list-style:none;padding:0;margin:0;display:grid;gap:.4rem">
        ${pkg.inclusions.map(i => '<li style="font-size:.82rem;color:var(--gray);padding:.4rem .6rem;background:var(--bg3);border-radius:5px;border-left:3px solid var(--red)">• ' + i + '</li>').join('')}
      </ul>
    </div>

    ${pkg.note ? '<div style="padding:.75rem;background:rgba(234,179,8,.08);border:1px solid rgba(234,179,8,.2);border-radius:6px;font-size:.78rem;color:#eab308">' + pkg.note + '</div>' : ''}
  `;

  document.getElementById('bdModalTitle').textContent = 'PACKAGE DETAILS';
  document.getElementById('bdModalBody').innerHTML = html;
  document.getElementById('bdModalFooter').innerHTML = '<button class="btn btn-ghost" onclick="closeModal(\'modalBookingDetail\')">Close</button>';
  openModal('modalBookingDetail');
}

function viewPackage(id) { viewPackageDetail(id); }
function editPackage(id) { showToast('Edit package — coming soon', null); }
function deletePackage(id) { if (confirm('Delete this package?')) { db.collection('packages').doc(id).delete().then(() => showToast('Package deleted', 'ok')).catch(e => showToast('Error: ' + e.message, 'err')); } }

// ── Init on load ──────────────────────────
window.addEventListener('load', loadDashboard);

// ── Modal photo preview upload (Add Crew modal) ──────────────
document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('cmPhotoPreview');
  if (!preview) return;
  preview.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*';
    inp.style.cssText = 'position:fixed;top:-9999px;opacity:0';
    document.body.appendChild(inp);
    inp.addEventListener('change', () => {
      const file = inp.files[0];
      document.body.removeChild(inp);
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const MAX = 400;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width  = Math.round(img.width  * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          const b64 = canvas.toDataURL('image/jpeg', 0.75);
          window._pendingPhotoB64 = b64;
          preview.style.backgroundImage = 'url(' + b64 + ')';
          preview.style.backgroundSize = 'cover';
          preview.style.backgroundPosition = 'center';
          const inner = preview.querySelector('.cm-photo-inner');
          if (inner) inner.style.display = 'none';
          showToast('Photo ready — save the member to confirm.', null);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
    inp.click();
  });
});

// ══════════════════════════════════════════════════════════════
//  SETTINGS — HOMEPAGE STATS
// ══════════════════════════════════════════════════════════════
async function loadSettings() {
  const acctUserEl = document.getElementById('acctUsername');
  if (acctUserEl && _currentUserEmail) acctUserEl.value = _currentUserEmail;

  try {
    const snap = await db.collection('site_stats').get();
    if (snap.empty) return;
    snap.docs.forEach(d => {
      const row = { id: d.id, ...d.data() };

      if (row.id === 'homepage') {
        if (row.years     && document.getElementById('statYears'))     document.getElementById('statYears').value     = row.years;
        if (row.events    && document.getElementById('statEvents'))    document.getElementById('statEvents').value    = row.events;
        if (row.followers && document.getElementById('statFollowers')) document.getElementById('statFollowers').value = row.followers;
      }

      if (row.id === 'business_info') {
        const map = { bizName:'name', bizPhone:'phone', bizAddress:'address', bizFb:'facebook', bizEmail:'email' };
        Object.entries(map).forEach(([elId,key]) => {
          const el = document.getElementById(elId);
          if (el && row[key] !== undefined) el.value = row[key];
        });
      }

      if (row.id === 'booking_prefs') {
        if (row.downpaypct !== undefined && document.getElementById('prefDownpay')) document.getElementById('prefDownpay').value = row.downpaypct;
        if (row.note       !== undefined && document.getElementById('prefNote'))    document.getElementById('prefNote').value    = row.note;
      }

      if (row.id === 'admin_profile') {
        if (row.displayname) _currentAdminDisplayName = row.displayname;
        if (row.displayname && document.getElementById('acctName')) document.getElementById('acctName').value = row.displayname;
      }
    });
  } catch (e) {
    console.warn('[Settings] Could not load stats:', e);
  }
}

async function saveBusinessInfo() {
  const statusEl = document.getElementById('bizInfoStatus');
  const data = {
    name:     (document.getElementById('bizName')?.value    || '').trim(),
    phone:    (document.getElementById('bizPhone')?.value   || '').trim(),
    address:  (document.getElementById('bizAddress')?.value || '').trim(),
    facebook: (document.getElementById('bizFb')?.value      || '').trim(),
    email:    (document.getElementById('bizEmail')?.value   || '').trim(),
  };
  if (statusEl) statusEl.textContent = 'Saving…';
  try {
    await db.collection('site_stats').doc('business_info').set({
      ...data,
      updatedat: serverTimestamp()
    });
    showToast('Business information saved.', 'ok');
    if (statusEl) statusEl.textContent = 'Saved ' + new Date().toLocaleTimeString('en-PH');
  } catch (e) {
    showToast('Save failed: ' + e.message, 'err');
    if (statusEl) statusEl.textContent = '';
  }
}

async function saveBookingPrefs() {
  const statusEl = document.getElementById('bookPrefsStatus');
  const downpay = parseFloat(document.getElementById('prefDownpay')?.value) || 0;
  const note    = (document.getElementById('prefNote')?.value || '').trim();

  if (downpay <= 0 || downpay > 100) {
    showToast('Downpayment must be between 1 and 100.', 'err');
    return;
  }
  if (statusEl) statusEl.textContent = 'Saving…';
  try {
    await db.collection('site_stats').doc('booking_prefs').set({
      downpaypct: downpay,
      note,
      updatedat: serverTimestamp()
    });
    showToast('Booking preferences updated.', 'ok');
    if (statusEl) statusEl.textContent = 'Saved ' + new Date().toLocaleTimeString('en-PH');
  } catch (e) {
    showToast('Save failed: ' + e.message, 'err');
    if (statusEl) statusEl.textContent = '';
  }
}

async function updateAdminAccount() {
  const statusEl   = document.getElementById('adminAcctStatus');
  const name       = (document.getElementById('acctName')?.value || '').trim();
  const newUser    = (document.getElementById('acctUsername')?.value || '').trim();
  const newPass    = document.getElementById('acctNewPass')?.value || '';
  const confirmPass= document.getElementById('acctConfirmPass')?.value || '';

  if (newPass || confirmPass) {
    if (newPass.length < 6) { showToast('Password must be at least 6 characters.', 'err'); return; }
    if (newPass !== confirmPass) { showToast('Passwords do not match.', 'err'); return; }
  }

  const emailChanged = newUser && newUser !== _currentUserEmail;
  if (emailChanged) {
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser);
    if (!looksLikeEmail) { showToast('Enter a valid email for the username.', 'err'); return; }
    const confirmed = window.confirm(
      'Changing this requires clicking a confirmation link Supabase emails to ' + newUser +
      ' (and possibly your current address) before it takes effect. Your current login keeps working until then. Continue?'
    );
    if (!confirmed) return;
  }

  if (statusEl) statusEl.textContent = 'Saving…';
  try {
    await db.collection('site_stats').doc('admin_profile').set({
      displayname: name,
      updatedat: serverTimestamp()
    });
    _currentAdminDisplayName = name || null;

    let msg = 'Account updated.';

    if (emailChanged) {
      await auth.updateEmail(newUser);
      msg = 'Account updated — check ' + newUser + ' to confirm the new sign-in email.';
    }

    if (newPass) {
      await auth.updatePassword(newPass);
      document.getElementById('acctNewPass').value = '';
      document.getElementById('acctConfirmPass').value = '';
      msg = emailChanged ? msg + ' Password changed too.' : 'Account updated — password changed.';
    }

    showToast(msg, 'ok');
    if (statusEl) statusEl.textContent = 'Saved ' + new Date().toLocaleTimeString('en-PH');
  } catch (e) {
    showToast('Update failed: ' + (e.message || e), 'err');
    if (statusEl) statusEl.textContent = '';
  }
}

async function saveHomepageStats() {
  const years     = (document.getElementById('statYears')?.value     || '').trim();
  const events    = (document.getElementById('statEvents')?.value    || '').trim();
  const followers = (document.getElementById('statFollowers')?.value || '').trim();

  if (!years && !events && !followers) {
    showToast('Fill in at least one stat before saving.', 'err');
    return;
  }

  const statusEl = document.getElementById('statsStatus');
  if (statusEl) statusEl.textContent = 'Saving…';

  try {
    await db.collection('site_stats').doc('homepage').set({
      years,
      events,
      followers,
      updatedat: serverTimestamp()
    });
    showToast('Stats published → homepage updated live.', 'ok');
    if (statusEl) statusEl.textContent = 'Last saved: ' + new Date().toLocaleTimeString('en-PH');
  } catch (e) {
    showToast('Save failed: ' + e.message, 'err');
    if (statusEl) statusEl.textContent = '';
  }
}


// ══════════════════════════════════════════════════════════════
//  ABOUT US CMS
// ══════════════════════════════════════════════════════════════
let teamMembersUnsubscribe  = null;
let galleryItemsUnsubscribe = null;

function loadAboutUs() {
  loadAboutStorySettings();
  loadTeamMembersAdmin();
  loadGalleryItemsAdmin();
}

async function loadAboutStorySettings() {
  try {
    const doc = await db.collection('site_stats').doc('about_story').get();
    if (!doc.exists) return;
    const row = doc.data();
    if (document.getElementById('aboutStoryP1')) document.getElementById('aboutStoryP1').value = row.storyp1 || '';
    if (document.getElementById('aboutStoryP2')) document.getElementById('aboutStoryP2').value = row.storyp2 || '';
  } catch (e) { console.warn('[About Us] Could not load story:', e); }
}

async function saveAboutStory() {
  const p1 = (document.getElementById('aboutStoryP1')?.value || '').trim();
  const p2 = (document.getElementById('aboutStoryP2')?.value || '').trim();
  const statusEl = document.getElementById('aboutStoryStatus');
  if (!p1 && !p2) { showToast('Write at least one paragraph before saving.', 'err'); return; }
  if (statusEl) statusEl.textContent = 'Saving…';
  try {
    await db.collection('site_stats').doc('about_story').set({
      storyp1: p1, storyp2: p2,
      updatedat: serverTimestamp()
    });
    showToast('Story published → homepage updated live.', 'ok');
    if (statusEl) statusEl.textContent = 'Saved ' + new Date().toLocaleTimeString('en-PH');
  } catch (e) {
    showToast('Save failed: ' + e.message, 'err');
    if (statusEl) statusEl.textContent = '';
  }
}

function loadTeamMembersAdmin() {
  const grid = document.getElementById('teamMembersGrid');
  if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem">LOADING…</div>';
  if (teamMembersUnsubscribe) teamMembersUnsubscribe();
  teamMembersUnsubscribe = db.collection('team_members').onSnapshot(snap => {
    if (!grid) return;
    if (snap.empty) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem">No team members yet. Click + Add Team Member.</div>';
      return;
    }
    const members = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a,b) => (a.sortorder||0) - (b.sortorder||0));
    grid.innerHTML = members.map(m => {
      const hasPhoto = !!m.photourl;
      const initials = (m.name || '?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
      return `<div class="crew-card-v3">
        <div class="ccv3-hero">
          ${hasPhoto
            ? `<img src="${m.photourl}" class="ccv3-hero-img" alt="${esc(m.name)}">`
            : `<div class="ccv3-initials-bg"><span class="ccv3-initials">${initials}</span></div>`}
          <div class="ccv3-hero-overlay"></div>
          <div class="ccv3-role-pill"><span>👤</span><span>${esc(m.role||'—')}</span></div>
        </div>
        <div class="ccv3-body">
          <div class="ccv3-name">${esc(m.name||'—')}</div>
          <div class="ccv3-spec">${m.badge ? esc(m.badge) : '&nbsp;'}</div>
          <div class="ccv3-footer" onclick="event.stopPropagation()">
            <div class="ccv3-actions">
              <button class="ccv3-btn" onclick="editTeamMember('${m.id}')" title="Edit">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="ccv3-btn ccv3-btn-del" onclick="deleteTeamMember('${m.id}')" title="Remove">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');
  }, err => {
    console.warn('[About Us] Team sync error:', err);
    if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem">Could not load team members. Run ABOUT_US_CMS_MIGRATION.sql if you haven\'t yet.</div>';
  });
}

function openAddTeamMemberModal() {
  window._editTeamMemberId = null;
  window._pendingTeamPhotoB64 = null;
  ['tm-name','tm-role','tm-desc','tm-badge'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const preview = document.getElementById('tmPhotoPreview');
  if (preview) {
    preview.style.backgroundImage = '';
    const inner = preview.querySelector('.tm-photo-inner');
    if (inner) inner.style.display = '';
  }
  document.getElementById('tmModalTitle').textContent = '+ ADD TEAM MEMBER';
  openModal('modalTeamMember');
}

function editTeamMember(id) {
  db.collection('team_members').doc(id).get().then(doc => {
    if (!doc.exists) return;
    const m = { id: doc.id, ...doc.data() };
    window._editTeamMemberId = id;
    window._pendingTeamPhotoB64 = null;
    const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };
    set('tm-name',  m.name);
    set('tm-role',  m.role);
    set('tm-desc',  m.description);
    set('tm-badge', m.badge);
    const preview = document.getElementById('tmPhotoPreview');
    if (preview) {
      if (m.photourl) {
        preview.style.backgroundImage    = 'url(' + m.photourl + ')';
        preview.style.backgroundSize     = 'cover';
        preview.style.backgroundPosition = 'center top';
        const inner = preview.querySelector('.tm-photo-inner');
        if (inner) inner.style.display = 'none';
      } else {
        preview.style.backgroundImage = '';
        const inner = preview.querySelector('.tm-photo-inner');
        if (inner) inner.style.display = '';
      }
    }
    document.getElementById('tmModalTitle').textContent = 'EDIT — ' + (m.name || 'TEAM MEMBER').toUpperCase();
    openModal('modalTeamMember');
  }).catch(e => showToast('Load failed: ' + e.message, 'err'));
}

function deleteTeamMember(id) {
  if (!confirm('Remove this team member from the homepage?')) return;
  db.collection('team_members').doc(id).delete()
    .then(() => showToast('Team member removed.', 'ok'))
    .catch(e => showToast('Error: ' + e.message, 'err'));
}

function saveTeamMemberFromModal() {
  const name  = document.getElementById('tm-name')?.value.trim()  || '';
  const role  = document.getElementById('tm-role')?.value.trim()  || '';
  const desc  = document.getElementById('tm-desc')?.value.trim()  || '';
  const badge = document.getElementById('tm-badge')?.value.trim() || '';

  if (!name) { showToast('Name is required.', 'err'); return; }
  if (!role) { showToast('Role / title is required.', 'err'); return; }

  const data = { name, role, description: desc, badge };
  if (window._pendingTeamPhotoB64) {
    data.photourl = window._pendingTeamPhotoB64;
    window._pendingTeamPhotoB64 = null;
  }

  const docId = window._editTeamMemberId;
  const ref = docId ? db.collection('team_members').doc(docId) : db.collection('team_members').doc();
  ref.set(data, { merge: true })
    .then(() => {
      window._editTeamMemberId = null;
      closeModal('modalTeamMember');
      showToast((docId ? 'Team member updated!' : 'Team member added!'), 'ok');
      loadTeamMembersAdmin();
    })
    .catch(e => showToast('Save failed: ' + e.message, 'err'));
}

function loadGalleryItemsAdmin() {
  const grid = document.getElementById('aboutGalleryGrid');
  if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem">LOADING…</div>';
  if (galleryItemsUnsubscribe) galleryItemsUnsubscribe();
  galleryItemsUnsubscribe = db.collection('gallery_items').onSnapshot(snap => {
    if (!grid) return;
    if (snap.empty) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem">No photos or videos yet. Click + Add Photo or + Add Video.</div>';
      return;
    }
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a,b) => (a.sortorder||0) - (b.sortorder||0));
    grid.innerHTML = items.map(item => {
      const thumb = item.type === 'video'
        ? `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg3);font-size:1.6rem">🎬</div>`
        : `<img src="${item.src}" alt="${esc(item.label)}" style="width:100%;height:100%;object-fit:cover">`;
      return `<div class="crew-card-v3">
        <div class="ccv3-hero" style="height:120px">
          ${thumb}
          <div class="ccv3-hero-overlay"></div>
          <div class="ccv3-role-pill"><span>${item.type === 'video' ? '🎬' : '🖼'}</span><span>${item.type.toUpperCase()}</span></div>
        </div>
        <div class="ccv3-body">
          <div class="ccv3-name" style="font-size:.85rem">${esc(item.label)}</div>
          <div class="ccv3-footer" onclick="event.stopPropagation()">
            <div class="ccv3-actions">
              <button class="ccv3-btn ccv3-btn-del" onclick="deleteGalleryItem('${item.id}', ${item.storagepath ? `'${item.storagepath}'` : 'null'})" title="Remove">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');
  }, err => {
    console.warn('[About Us] Gallery sync error:', err);
    if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--gray2);padding:2rem;font-family:var(--font-m);font-size:.75rem">Could not load gallery. Run ABOUT_US_CMS_MIGRATION.sql if you haven\'t yet.</div>';
  });
}

window._galleryStaging = [];
const GALLERY_VIDEO_BUCKET = 'gallery-media';

function openAddGalleryModal(type) {
  window._galleryStaging = [];
  document.getElementById('gi-type').value = type;
  document.getElementById('gi-videourl').value = '';
  document.getElementById('giModalTitle').textContent = type === 'video' ? '+ ADD VIDEOS' : '+ ADD PHOTOS';
  document.getElementById('giPhotoField').style.display = type === 'video' ? 'none' : '';
  document.getElementById('giVideoField').style.display = type === 'video' ? '' : 'none';
  renderGalleryStaging();
  openModal('modalGalleryItem');
}

function renderGalleryStaging() {
  const wrap  = document.getElementById('giStagingWrap');
  const list  = document.getElementById('giStagingList');
  const count = document.getElementById('giStagingCount');
  const items = window._galleryStaging;
  if (!wrap || !list || !count) return;
  count.textContent = items.length;
  wrap.style.display = items.length ? '' : 'none';
  list.innerHTML = items.map((it, i) => {
    const thumb = it.type === 'video'
      ? '<span style="font-size:1.2rem">🎬</span>'
      : `<img src="${it.src}" style="width:100%;height:100%;object-fit:cover">`;
    const statusLine = it.uploading
      ? `<div style="font-family:var(--font-m);font-size:.6rem;color:var(--gray2);margin-top:.25rem">⏳ Uploading…</div>`
      : it.error
        ? `<div style="font-family:var(--font-m);font-size:.6rem;color:#f87171;margin-top:.25rem">⚠ Upload failed — remove and retry</div>`
        : '';
    return `
    <div style="display:flex;gap:.6rem;align-items:center;background:var(--bg3);border:1px solid var(--border2);border-radius:8px;padding:.5rem">
      <div style="width:44px;height:44px;flex-shrink:0;border-radius:6px;overflow:hidden;background:var(--bg2);display:flex;align-items:center;justify-content:center">
        ${thumb}
      </div>
      <div style="flex:1;min-width:0">
        <input value="${esc(it.label || '')}" placeholder="Label for this ${it.type}" oninput="window._galleryStaging[${i}].label = this.value" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:6px;color:var(--white);font-family:var(--font-b);font-size:.8rem;padding:.4rem .6rem"/>
        ${statusLine}
      </div>
      <button type="button" onclick="removeGalleryStagingItem(${i})" title="Remove" style="background:transparent;border:none;color:var(--gray2);cursor:pointer;font-size:1rem;padding:.2rem .4rem;flex-shrink:0">✕</button>
    </div>
  `; }).join('');
}

function removeGalleryStagingItem(i) {
  const it = window._galleryStaging[i];
  if (it && it.storagepath && !it.uploading) {
    mediaStorage.remove(GALLERY_VIDEO_BUCKET, it.storagepath).catch(() => {});
  }
  window._galleryStaging.splice(i, 1);
  renderGalleryStaging();
}

function addVideoUrlToStaging() {
  const input = document.getElementById('gi-videourl');
  const url = (input?.value || '').trim();
  if (!url) { showToast('Enter a video URL first.', 'err'); return; }
  window._galleryStaging.push({ type: 'video', src: url, label: '' });
  input.value = '';
  renderGalleryStaging();
  input.focus();
}

function deleteGalleryItem(id, storagepath) {
  if (!confirm('Remove this item from the gallery?')) return;
  db.collection('gallery_items').doc(id).delete()
    .then(() => {
      showToast('Item removed.', 'ok');
      if (storagepath) mediaStorage.remove(GALLERY_VIDEO_BUCKET, storagepath).catch(() => {});
    })
    .catch(e => showToast('Error: ' + e.message, 'err'));
}

function saveGalleryItemFromModal() {
  const items = window._galleryStaging;
  if (!items.length) { showToast('Add at least one photo or video first.', 'err'); return; }
  if (items.some(it => it.uploading)) { showToast('Still uploading — wait for it to finish.', 'err'); return; }
  if (items.some(it => it.error)) { showToast('Remove failed uploads before saving.', 'err'); return; }
  if (items.some(it => !it.label || !it.label.trim())) { showToast('Give every item a label before saving.', 'err'); return; }

  const btn = document.getElementById('giSaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  const base = Math.floor(Date.now() / 1000);
  Promise.all(items.map((it, i) => {
    const doc = { type: it.type, src: it.src, label: it.label.trim(), sortorder: base + i };
    if (it.storagepath) doc.storagepath = it.storagepath;
    return db.collection('gallery_items').add(doc);
  }))
    .then(() => {
      window._galleryStaging = [];
      closeModal('modalGalleryItem');
      showToast(items.length > 1 ? `${items.length} items added!` : 'Item added!', 'ok');
    })
    .catch(e => showToast('Save failed: ' + e.message, 'err'))
    .finally(() => { if (btn) { btn.disabled = false; btn.textContent = 'Add to Gallery'; } });
}

document.addEventListener('DOMContentLoaded', () => {
  function wirePhotoUpload(previewId, innerClass, onReady, maxDim) {
    const preview = document.getElementById(previewId);
    if (!preview) return;
    preview.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'image/*';
      inp.style.cssText = 'position:fixed;top:-9999px;opacity:0';
      document.body.appendChild(inp);
      inp.addEventListener('change', () => {
        const file = inp.files[0];
        document.body.removeChild(inp);
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const MAX = maxDim || 500;
            const scale = Math.min(1, MAX / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width  = Math.round(img.width  * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            const b64 = canvas.toDataURL('image/jpeg', 0.8);
            onReady(b64);
            preview.style.backgroundImage    = 'url(' + b64 + ')';
            preview.style.backgroundSize     = 'cover';
            preview.style.backgroundPosition = 'center';
            const inner = preview.querySelector(innerClass);
            if (inner) inner.style.display = 'none';
            showToast('Photo ready — save to confirm.', null);
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
      inp.click();
    });
  }
  wirePhotoUpload('tmPhotoPreview', '.tm-photo-inner', b64 => { window._pendingTeamPhotoB64 = b64; }, 500);

  const giPicker = document.getElementById('giPhotoPicker');
  if (giPicker) {
    giPicker.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
      inp.style.cssText = 'position:fixed;top:-9999px;opacity:0';
      document.body.appendChild(inp);
      inp.addEventListener('change', () => {
        const files = Array.from(inp.files || []);
        document.body.removeChild(inp);
        if (!files.length) return;
        let pending = files.length;
        files.forEach(file => {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const MAX = 900;
              const scale = Math.min(1, MAX / Math.max(img.width, img.height));
              const canvas = document.createElement('canvas');
              canvas.width  = Math.round(img.width  * scale);
              canvas.height = Math.round(img.height * scale);
              canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
              const b64 = canvas.toDataURL('image/jpeg', 0.8);
              const guessedLabel = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
              window._galleryStaging.push({ type: 'photo', src: b64, label: guessedLabel });
              renderGalleryStaging();
              pending--;
              if (pending === 0) showToast(`${files.length} photo${files.length > 1 ? 's' : ''} ready — label ${files.length > 1 ? 'them' : 'it'} below, then save.`, null);
            };
            img.src = reader.result;
          };
          reader.readAsDataURL(file);
        });
      });
      inp.click();
    });
  }

  const giVideoPicker = document.getElementById('giVideoPicker');
  if (giVideoPicker) {
    giVideoPicker.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'video/*'; inp.multiple = true;
      inp.style.cssText = 'position:fixed;top:-9999px;opacity:0';
      document.body.appendChild(inp);
      inp.addEventListener('change', () => {
        const files = Array.from(inp.files || []);
        document.body.removeChild(inp);
        if (!files.length) return;
        showToast(`Uploading ${files.length} video${files.length > 1 ? 's' : ''}…`, null);
        files.forEach(file => {
          const guessedLabel = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
          const stagingItem = { type: 'video', src: '', label: guessedLabel, uploading: true, error: false, storagepath: null };
          window._galleryStaging.push(stagingItem);
          renderGalleryStaging();

          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const path = `videos/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName}`;

          mediaStorage.upload(GALLERY_VIDEO_BUCKET, path, file)
            .then(({ path: storedPath, publicUrl }) => {
              stagingItem.src = publicUrl;
              stagingItem.storagepath = storedPath;
              stagingItem.uploading = false;
              renderGalleryStaging();
            })
            .catch(e => {
              stagingItem.uploading = false;
              stagingItem.error = true;
              renderGalleryStaging();
              showToast(`Upload failed for "${file.name}": ${e.message || e}`, 'err');
            });
        });
      });
      inp.click();
    });
  }

  const giVideoUrlInput = document.getElementById('gi-videourl');
  if (giVideoUrlInput) {
    giVideoUrlInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); addVideoUrlToStaging(); }
    });
  }
});


// ══════════════════════════════════════════════════════════════
//  BOOKING CONFIRMATION IMAGE GENERATOR
// ══════════════════════════════════════════════════════════════

function downloadConfirmationImage() {
  const docId   = window._currentBdDocId;
  const booking = docId && _bStore[docId] ? _bStore[docId] : null;
  if (!booking) { showToast('No booking loaded. Open a booking detail first.', 'err'); return; }

  const RED   = '#e8180c';
  const DARK  = '#0d0f13';
  const WHITE = '#ffffff';
  const GRAY  = '#9ca3af';
  const GRAY2 = '#6b7280';
  const GREEN = '#22c55e';
  const GOLD  = '#eab308';

  const PAD    = 32;
  const W      = 900;
  const MID    = W / 2;
  const LGAP   = 16;
  const LW     = MID - PAD - LGAP;
  const RW     = W - MID - PAD;
  const LBAW   = 130;
  const ROW_H  = 24;
  const SEC_H  = 20;
  const VSEP   = 12;

  const total   = booking.totalprice || booking.totalPrice || 0;
  const down    = booking.downpay    || booking.downPay    || 0;
  const balance = Math.max(0, total - down);
  const pct     = total > 0 ? Math.round((down / total) * 100) : 0;
  const notes   = booking.notes || '';

  const leftRows  = 1 + 6;
  const rightRows = 1 + 4 + 1 + 1 + 4;
  const NOTES_LINES  = notes ? Math.ceil(notes.length / 75) + 1 : 0;
  const CONTENT_TOP  = 120;
  const leftH  = leftRows  * ROW_H + SEC_H;
  const rightH = rightRows * ROW_H + SEC_H + VSEP;
  const bodyH  = Math.max(leftH, rightH) + (NOTES_LINES ? VSEP + NOTES_LINES * 18 + 24 : 0);
  const FOOT_H = 64;
  const H      = CONTENT_TOP + bodyH + FOOT_H + 16;

  const canvas    = document.createElement('canvas');
  canvas.width    = W * 2;
  canvas.height   = H * 2;
  const ctx       = canvas.getContext('2d');
  ctx.scale(2, 2);

  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,0.022)';
  for (let gx = 24; gx < W; gx += 28)
    for (let gy = 24; gy < H; gy += 28) {
      ctx.beginPath(); ctx.arc(gx, gy, 1, 0, Math.PI * 2); ctx.fill();
    }

  ctx.fillStyle = RED;
  ctx.fillRect(0, 0, 5, H);

  const hg = ctx.createLinearGradient(0, 0, W * 0.6, 0);
  hg.addColorStop(0, 'rgba(232,24,12,0.22)');
  hg.addColorStop(1, 'rgba(13,15,19,0)');
  ctx.fillStyle = hg;
  ctx.fillRect(0, 0, W, 105);

  ctx.fillStyle = WHITE;
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText('M-AUDIO PRO SOUND', PAD, 40);

  ctx.fillStyle = GRAY2;
  ctx.font = '11px Arial, sans-serif';
  ctx.fillText('PROFESSIONAL SOUND & LIGHTS  ·  CORELLA, BOHOL', PAD, 60);

  const status     = (booking.status || 'confirmed').toLowerCase();
  const badgeColor = status === 'confirmed' ? GREEN : status === 'pending' ? GOLD : GRAY;
  const badgeBg    = status === 'confirmed' ? 'rgba(34,197,94,0.14)' : status === 'pending' ? 'rgba(234,179,8,0.14)' : 'rgba(156,163,175,0.14)';
  const badgeLabel = status.toUpperCase();

  ctx.font = 'bold 12px Arial, sans-serif';
  const bTW = ctx.measureText('● ' + badgeLabel).width;
  const bW  = bTW + 32;
  const bX  = W - bW - PAD;
  const bY  = 18;

  ctx.fillStyle = badgeBg;
  roundRect(ctx, bX, bY, bW, 38, 6); ctx.fill();
  ctx.strokeStyle = badgeColor + '90'; ctx.lineWidth = 1.5;
  roundRect(ctx, bX, bY, bW, 38, 6); ctx.stroke();
  ctx.fillStyle = badgeColor;
  ctx.textAlign = 'center';
  ctx.fillText('● ' + badgeLabel, bX + bW / 2, bY + 24);
  ctx.textAlign = 'left';

  ctx.strokeStyle = 'rgba(232,24,12,0.28)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD, 78); ctx.lineTo(W - PAD, 78); ctx.stroke();

  const ref = 'MA-' + new Date().getFullYear() + '-' + (docId || 'XXXXXX').substring(0, 6).toUpperCase();
  ctx.fillStyle = GRAY2;
  ctx.font = '10px monospace';
  ctx.fillText('REFERENCE NO.', PAD, 100);
  ctx.fillStyle = RED;
  ctx.font = 'bold 12px monospace';
  ctx.fillText(ref, PAD + 115, 100);

  function secTitle(x, y, label, colW) {
    ctx.fillStyle = GRAY2;
    ctx.font = 'bold 9px Arial, sans-serif';
    ctx.fillText(label, x, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x + colW, y + 5); ctx.stroke();
    return y + SEC_H;
  }

  function dataRow(x, y, label, value, valueColor, colRightEdge) {
    ctx.fillStyle = GRAY2;
    ctx.font = '10px Arial, sans-serif';
    ctx.fillText(label, x, y);

    ctx.fillStyle = valueColor || WHITE;
    ctx.font = '11px Arial, sans-serif';
    const valX   = x + LBAW;
    const maxW   = colRightEdge - valX - 8;
    let   val    = String(value || '—');
    while (val.length > 4 && ctx.measureText(val).width > maxW)
      val = val.slice(0, -1);
    if (val !== String(value || '—')) val = val.trimEnd() + '…';
    ctx.fillText(val, valX, y);
    return y + ROW_H;
  }

  const colLX    = PAD;
  const colLEdge = MID - LGAP;
  const colRX    = MID + LGAP;
  const colREdge = W - PAD;

  let yL = CONTENT_TOP;
  let yR = CONTENT_TOP;

  yL = secTitle(colLX, yL, 'EVENT DETAILS', LW);
  yL = dataRow(colLX, yL, 'Event:',   booking.eventName || '—',  null,  colLEdge);
  yL = dataRow(colLX, yL, 'Package:', booking.pkg        || '—',  null,  colLEdge);
  yL = dataRow(colLX, yL, 'Date:',    booking.date       || '—',  null,  colLEdge);
  yL = dataRow(colLX, yL, 'Time:',    booking.time       || '—',  null,  colLEdge);
  yL = dataRow(colLX, yL, 'Venue:',   booking.venue      || '—',  null,  colLEdge);
  yL = dataRow(colLX, yL, 'Crowd:',   booking.crowd      || '—',  null,  colLEdge);
  if (booking.duration)
    yL = dataRow(colLX, yL, 'Duration:', booking.duration, null, colLEdge);

  yR = secTitle(colRX, yR, 'CLIENT INFORMATION', RW);
  yR = dataRow(colRX, yR, 'Name:',     booking.name  || '—',            null,  colREdge);
  yR = dataRow(colRX, yR, 'Phone:',    booking.phone || '—',            null,  colREdge);
  yR = dataRow(colRX, yR, 'Email:',    booking.email || 'Not provided', null,  colREdge);
  yR = dataRow(colRX, yR, 'Facebook:', booking.fb    || '—',            null,  colREdge);

  yR += VSEP;

  yR = secTitle(colRX, yR, 'PAYMENT SUMMARY', RW);
  yR = dataRow(colRX, yR, 'Total Price:',   '₱' + total.toLocaleString('en-PH'),                             RED,                        colREdge);
  yR = dataRow(colRX, yR, 'Down Payment:',  '₱' + down.toLocaleString('en-PH') + ' (' + pct + '%)',         GREEN,                      colREdge);
  yR = dataRow(colRX, yR, 'Balance Due:',   '₱' + balance.toLocaleString('en-PH'),                           balance > 0 ? GOLD : GREEN, colREdge);
  yR = dataRow(colRX, yR, 'Pay Method:',    booking.payMethod || '—',                                        null,                       colREdge);

  const bodyBottom = Math.max(yL, yR) + 14;
  if (notes) {
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD, bodyBottom); ctx.lineTo(W - PAD, bodyBottom); ctx.stroke();

    ctx.fillStyle = GRAY2;
    ctx.font = 'bold 9px Arial, sans-serif';
    ctx.fillText('ADDITIONAL NOTES', PAD, bodyBottom + 16);

    ctx.fillStyle = GRAY;
    ctx.font = '10px Arial, sans-serif';
    const words = notes.split(' ');
    let line = '', ny = bodyBottom + 32;
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > W - PAD * 2) {
        ctx.fillText(line, PAD, ny); ny += 16; line = w;
      } else { line = test; }
    }
    if (line) ctx.fillText(line, PAD, ny);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(MID, CONTENT_TOP - 10);
  ctx.lineTo(MID, Math.max(yL, yR) + 4);
  ctx.stroke();
  ctx.setLineDash([]);

  const footY = H - FOOT_H;
  const fg = ctx.createLinearGradient(0, footY, W * 0.6, footY);
  fg.addColorStop(0, 'rgba(232,24,12,0.1)');
  fg.addColorStop(1, 'rgba(13,15,19,0)');
  ctx.fillStyle = fg;
  ctx.fillRect(0, footY, W, FOOT_H);

  ctx.strokeStyle = 'rgba(232,24,12,0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD, footY + 1); ctx.lineTo(W - PAD, footY + 1); ctx.stroke();

  ctx.fillStyle = GRAY2;
  ctx.font = '10px Arial, sans-serif';
  ctx.fillText('M-Audio Pro Sound  ·  Poblacion, Corella, Bohol  ·  0930 261 7168  ·  fb.com/maudioprosoundo', PAD, footY + 22);

  ctx.fillStyle = GRAY2;
  ctx.font = '9px monospace';
  ctx.fillText('Generated: ' + new Date().toLocaleString('en-PH'), PAD, footY + 44);

  ctx.fillStyle = RED;
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('Official booking confirmation — M-Audio Pro Sound', W - PAD, footY + 44);
  ctx.textAlign = 'left';

  const clientName = (booking.name || 'client').replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
  const dateStr    = (booking.date || new Date().toISOString().slice(0, 10)).replace(/[^0-9\-]/g, '');
  const filename   = 'MAUDIO_Confirmation_' + clientName + '_' + dateStr + '.png';

  const link = document.createElement('a');
  link.href     = canvas.toDataURL('image/png', 1.0);
  link.download = filename;
  link.click();
  showToast('Downloaded: ' + filename, 'ok');
}


// ══════════════════════════════════════════════════════════════
//  EVENT & CREW SLIP GENERATOR
// ══════════════════════════════════════════════════════════════

function downloadEventCrewSlip() {
  const docId   = window._currentBdDocId;
  const booking = docId && _bStore[docId] ? _bStore[docId] : null;
  if (!booking) { showToast('No booking loaded. Open a booking detail first.', 'err'); return; }

  const attireInput = document.getElementById('slipAttireInput');
  const typedAttire = attireInput ? attireInput.value.trim() : '';
  const attire      = typedAttire || booking.attire || '';

  if (docId && typedAttire && typedAttire !== (booking.attire || '')) {
    booking.attire = typedAttire;
    _bStore[docId] = booking;
    db.collection('bookings').doc(docId).update({ attire: typedAttire }).catch(() => {});
  }

  const rawCrew      = booking.assignedcrew || booking.assignedCrew || [];
  const assignedCrew = _parseAssignedCrew(rawCrew).slice().sort((a, b) => {
    const ri = r => ROLE_ORDER.indexOf(r) === -1 ? 99 : ROLE_ORDER.indexOf(r);
    return ri(a.role) - ri(b.role) || String(a.name || '').localeCompare(String(b.name || ''));
  });

  const RED    = '#e8180c';
  const RED_LT = '#ff3b2e';
  const DARK   = '#0a0c10';
  const CARD   = '#12151b';
  const WHITE  = '#ffffff';
  const GRAY   = '#9ca3af';
  const GRAY2  = '#6b7280';
  const GOLD   = '#eab308';
  const GREEN  = '#22c55e';

  const status     = (booking.status || 'confirmed').toLowerCase();
  const badgeColor = status === 'confirmed' ? GREEN : status === 'pending' ? GOLD : status === 'cancelled' ? '#f87171' : GRAY;
  const badgeBg    = status === 'confirmed' ? 'rgba(34,197,94,.14)' : status === 'pending' ? 'rgba(234,179,8,.14)' : status === 'cancelled' ? 'rgba(248,113,113,.14)' : 'rgba(156,163,175,.14)';

  const W        = 1000;
  const PAD      = 44;
  const CW       = W - PAD * 2;
  const GAP      = 14;

  const meas = document.createElement('canvas').getContext('2d');
  function wrapLines(text, maxW, font) {
    meas.font = font;
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (line && meas.measureText(test).width > maxW) { lines.push(line); line = w; }
      else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }

  const eventName = booking.eventName || 'Untitled Event';
  const pkgName   = booking.pkg || 'Custom Setup';
  const titleLines = wrapLines(eventName, CW - 40, 'bold 30px Arial, sans-serif');

  const attireText  = attire || 'No specific dress code specified — crew uniform / smart casual default applies.';
  const attireLines = wrapLines(attireText, CW - 90, '500 15px Arial, sans-serif');

  const HEADER_H  = 108;
  const HERO_H    = 54 + titleLines.length * 36 + 40;
  const CHIP_ROWS = 2;
  const CHIP_H    = 66;
  const CHIPS_H   = 26 + CHIP_ROWS * CHIP_H + (CHIP_ROWS - 1) * GAP;

  const crewRowH   = 58;
  const CREW_H     = 30 + (assignedCrew.length > 0 ? assignedCrew.length * (crewRowH + 8) : 70);

  const ATTIRE_PAD_TOP = 26;
  const ATTIRE_H   = ATTIRE_PAD_TOP + 30 + attireLines.length * 22 + 26;

  const SEC_GAP  = 30;
  const FOOT_H   = 78;

  const bodyTop  = HEADER_H + 30;
  const H = bodyTop + HERO_H + SEC_GAP + CHIPS_H + SEC_GAP + CREW_H + SEC_GAP + ATTIRE_H + SEC_GAP + FOOT_H + 20;

  const canvas = document.createElement('canvas');
  canvas.width  = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(W * 0.78, H * 0.62);
  ctx.rotate(-Math.PI / 9);
  ctx.font = 'bold 118px Arial, sans-serif';
  ctx.fillStyle = 'rgba(232,24,12,0.035)';
  ctx.textAlign = 'center';
  ctx.fillText('M-AUDIO', 0, 0);
  ctx.restore();
  ctx.textAlign = 'left';

  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let gx = 20; gx < W; gx += 26)
    for (let gy = 20; gy < H; gy += 26) {
      ctx.beginPath(); ctx.arc(gx, gy, 0.9, 0, Math.PI * 2); ctx.fill();
    }

  const stripeG = ctx.createLinearGradient(0, 0, 0, H);
  stripeG.addColorStop(0, RED_LT);
  stripeG.addColorStop(1, RED);
  ctx.fillStyle = stripeG;
  ctx.fillRect(0, 0, 6, H);

  ctx.strokeStyle = 'rgba(232,24,12,0.22)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

  const hg = ctx.createLinearGradient(0, 0, W * 0.65, 0);
  hg.addColorStop(0, 'rgba(232,24,12,0.20)');
  hg.addColorStop(1, 'rgba(10,12,16,0)');
  ctx.fillStyle = hg;
  ctx.fillRect(0, 0, W, HEADER_H + 4);

  function drawEmblem(x, y, s) {
    const lg = ctx.createLinearGradient(x, y, x + s, y + s);
    lg.addColorStop(0, RED_LT);
    lg.addColorStop(1, '#a8110a');
    ctx.save();
    ctx.shadowColor = 'rgba(232,24,12,0.55)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = lg;
    roundRect(ctx, x, y, s, s, s * 0.24);
    ctx.fill();
    ctx.restore();

    const bars = [0.42, 0.72, 1, 0.55, 0.3];
    const bw = s * 0.09;
    const gap = s * 0.055;
    const totalW = bars.length * bw + (bars.length - 1) * gap;
    let bx = x + (s - totalW) / 2;
    const baseY = y + s * 0.78;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    bars.forEach(f => {
      const bh = s * 0.52 * f;
      roundRect(ctx, bx, baseY - bh, bw, bh, bw * 0.4);
      ctx.fill();
      bx += bw + gap;
    });
  }

  const EMB = 56;
  drawEmblem(PAD, 26, EMB);

  ctx.fillStyle = WHITE;
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText('M-AUDIO PRO', PAD + EMB + 16, 50);
  ctx.fillStyle = RED_LT;
  ctx.font = 'bold 24px Arial, sans-serif';
  const mw = ctx.measureText('M-AUDIO PRO ').width;
  ctx.fillText('SOUND', PAD + EMB + 16 + mw, 50);

  ctx.fillStyle = GRAY2;
  ctx.font = '11px Arial, sans-serif';
  ctx.fillText('EVENT & CREW NOTICE  ·  CORELLA, BOHOL', PAD + EMB + 16, 68);

  ctx.font = 'bold 12px Arial, sans-serif';
  const badgeLabel = status.toUpperCase();
  const bTW = ctx.measureText('● ' + badgeLabel).width;
  const bW  = bTW + 32, bX = W - bW - PAD, bY = 26;
  ctx.fillStyle = badgeBg;
  roundRect(ctx, bX, bY, bW, 34, 7); ctx.fill();
  ctx.strokeStyle = badgeColor + 'a0'; ctx.lineWidth = 1.4;
  roundRect(ctx, bX, bY, bW, 34, 7); ctx.stroke();
  ctx.fillStyle = badgeColor;
  ctx.textAlign = 'center';
  ctx.fillText('● ' + badgeLabel, bX + bW / 2, bY + 22);
  ctx.textAlign = 'left';

  ctx.strokeStyle = 'rgba(232,24,12,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD, HEADER_H - 12); ctx.lineTo(W - PAD, HEADER_H - 12); ctx.stroke();

  const ref = 'EV-' + new Date().getFullYear() + '-' + (docId || 'XXXXXX').substring(0, 6).toUpperCase();
  ctx.fillStyle = GRAY2;
  ctx.font = '10px monospace';
  ctx.fillText('REFERENCE NO.', PAD, HEADER_H + 4);
  ctx.fillStyle = RED_LT;
  ctx.font = 'bold 12px monospace';
  ctx.fillText(ref, PAD + 100, HEADER_H + 4);

  ctx.fillStyle = GRAY2;
  ctx.font = '10px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }), W - PAD, HEADER_H + 4);
  ctx.textAlign = 'left';

  function sectionHeader(x, y, icon, label, w) {
    ctx.fillStyle = WHITE;
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText(icon, x, y);
    ctx.fillStyle = GRAY;
    ctx.font = 'bold 10.5px Arial, sans-serif';
    ctx.fillText(label, x + 20, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x + w, y + 8); ctx.stroke();
    return y + 26;
  }

  let y = bodyTop;

  ctx.font = 'bold 10.5px Arial, sans-serif';
  const pkgLabel = pkgName.toUpperCase();
  const pkgTW = ctx.measureText(pkgLabel).width;
  const pkgBW = pkgTW + 22;
  ctx.fillStyle = 'rgba(232,24,12,0.15)';
  roundRect(ctx, PAD, y, pkgBW, 24, 5); ctx.fill();
  ctx.strokeStyle = 'rgba(232,24,12,0.4)'; ctx.lineWidth = 1;
  roundRect(ctx, PAD, y, pkgBW, 24, 5); ctx.stroke();
  ctx.fillStyle = RED_LT;
  ctx.fillText(pkgLabel, PAD + 11, y + 16);

  y += 24 + 16;
  ctx.fillStyle = WHITE;
  ctx.font = 'bold 30px Arial, sans-serif';
  titleLines.forEach(line => { ctx.fillText(line, PAD, y); y += 36; });

  y += 6;
  ctx.fillStyle = GRAY;
  ctx.font = '13px Arial, sans-serif';
  const venueStr = (booking.venue || '—') + '   ·   ' + (booking.date || '—') + '   ·   ' + (booking.time || '—');
  ctx.fillText('📍 ' + venueStr, PAD, y);

  y = bodyTop + HERO_H + SEC_GAP;

  y = sectionHeader(PAD, y, '🗂', 'EVENT DETAILS', CW);
  const chips = [
    { icon: '📅', label: 'DATE',     value: booking.date     || '—' },
    { icon: '⏰', label: 'TIME',     value: booking.time     || '—' },
    { icon: '⏱',  label: 'DURATION', value: booking.duration || '—' },
    { icon: '📍', label: 'VENUE',    value: booking.venue    || '—' },
    { icon: '👥', label: 'CROWD',    value: booking.crowd    || '—' },
    { icon: '🎚', label: 'PACKAGE',  value: pkgName },
  ];
  const chipW = (CW - GAP * 2) / 3;
  chips.forEach((c, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const cx = PAD + col * (chipW + GAP);
    const cy = y + row * (CHIP_H + GAP);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    roundRect(ctx, cx, cy, chipW, CHIP_H, 8); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1;
    roundRect(ctx, cx, cy, chipW, CHIP_H, 8); ctx.stroke();

    ctx.fillStyle = WHITE;
    ctx.font = '15px Arial, sans-serif';
    ctx.fillText(c.icon, cx + 12, cy + 26);

    ctx.fillStyle = GRAY2;
    ctx.font = 'bold 9px Arial, sans-serif';
    ctx.fillText(c.label, cx + 36, cy + 20);

    ctx.fillStyle = WHITE;
    ctx.font = '600 12.5px Arial, sans-serif';
    let val = String(c.value);
    const maxW = chipW - 46;
    while (val.length > 3 && ctx.measureText(val).width > maxW) val = val.slice(0, -1);
    if (val !== String(c.value)) val = val.trimEnd() + '…';
    ctx.fillText(val, cx + 36, cy + 40);
  });

  y = bodyTop + HERO_H + SEC_GAP + CHIPS_H + SEC_GAP;

  y = sectionHeader(PAD, y, '👥', 'ASSIGNED CREW  ·  WHO\u2019S ON THIS EVENT', CW);

  if (assignedCrew.length > 0) {
    assignedCrew.forEach((c, i) => {
      const rc = ROLE_COLORS[c.role] || ROLE_COLORS['Crew'];
      const icon = ROLE_ICONS[c.role] || '👤';
      const cy = y + i * (crewRowH + 8);

      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      roundRect(ctx, PAD, cy, CW, crewRowH, 8); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
      roundRect(ctx, PAD, cy, CW, crewRowH, 8); ctx.stroke();

      const acx = PAD + 28, acy = cy + crewRowH / 2, ar = 19;
      ctx.fillStyle = rc.bg;
      ctx.beginPath(); ctx.arc(acx, acy, ar, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = rc.border; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(acx, acy, ar, 0, Math.PI * 2); ctx.stroke();
      ctx.font = '15px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(icon, acx, acy + 5);
      ctx.textAlign = 'left';

      ctx.fillStyle = WHITE;
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.fillText(c.name || 'Unnamed crew member', PAD + 58, cy + 24);
      ctx.fillStyle = rc.color;
      ctx.font = 'bold 10px Arial, sans-serif';
      ctx.fillText((c.role || 'Crew').toUpperCase(), PAD + 58, cy + 40);

      ctx.fillStyle = GRAY2;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('#' + String(i + 1).padStart(2, '0'), PAD + CW - 14, cy + crewRowH / 2 + 4);
      ctx.textAlign = 'left';
    });
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.025)';
    roundRect(ctx, PAD, y, CW, 56, 8); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
    roundRect(ctx, PAD, y, CW, 56, 8); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = GRAY;
    ctx.font = '12.5px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No crew assigned to this event yet', PAD + CW / 2, y + 32);
    ctx.textAlign = 'left';
  }

  y = bodyTop + HERO_H + SEC_GAP + CHIPS_H + SEC_GAP + CREW_H + SEC_GAP;

  const attireBoxH = ATTIRE_H - ATTIRE_PAD_TOP;
  const ag = ctx.createLinearGradient(PAD, y, PAD + CW, y);
  ag.addColorStop(0, 'rgba(234,179,8,0.10)');
  ag.addColorStop(1, 'rgba(234,179,8,0.02)');
  ctx.fillStyle = ag;
  roundRect(ctx, PAD, y, CW, attireBoxH, 10); ctx.fill();
  ctx.strokeStyle = 'rgba(234,179,8,0.4)'; ctx.lineWidth = 1.3;
  roundRect(ctx, PAD, y, CW, attireBoxH, 10); ctx.stroke();

  ctx.fillStyle = GOLD;
  ctx.font = '17px Arial, sans-serif';
  ctx.fillText('👔', PAD + 18, y + 30);
  ctx.font = 'bold 11px Arial, sans-serif';
  ctx.fillText('WHAT TO WEAR  ·  DRESS CODE FOR THIS EVENT', PAD + 42, y + 27);

  ctx.fillStyle = attire ? WHITE : GRAY;
  ctx.font = (attire ? '500 15px' : 'italic 13px') + ' Arial, sans-serif';
  let ly = y + 52;
  attireLines.forEach(line => { ctx.fillText(line, PAD + 18, ly); ly += 22; });

  y = bodyTop + HERO_H + SEC_GAP + CHIPS_H + SEC_GAP + CREW_H + SEC_GAP + ATTIRE_H + SEC_GAP;

  const footY = y;
  const fg = ctx.createLinearGradient(0, footY, W * 0.65, footY);
  fg.addColorStop(0, 'rgba(232,24,12,0.10)');
  fg.addColorStop(1, 'rgba(10,12,16,0)');
  ctx.fillStyle = fg;
  ctx.fillRect(0, footY, W, FOOT_H);

  ctx.strokeStyle = 'rgba(232,24,12,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD, footY + 1); ctx.lineTo(W - PAD, footY + 1); ctx.stroke();

  ctx.fillStyle = GRAY2;
  ctx.font = '10px Arial, sans-serif';
  ctx.fillText('M-Audio Pro Sound  ·  Poblacion, Corella, Bohol  ·  0930 261 7168  ·  fb.com/maudioprosoundo', PAD, footY + 24);

  ctx.fillStyle = GRAY2;
  ctx.font = '9px monospace';
  ctx.fillText('Generated: ' + new Date().toLocaleString('en-PH'), PAD, footY + 46);

  ctx.fillStyle = RED_LT;
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('Official Event & Crew Notice — M-Audio Pro Sound', W - PAD, footY + 46);
  ctx.textAlign = 'left';

  const evtSlug = eventName.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Event';
  const dateStr = (booking.date || new Date().toISOString().slice(0, 10)).replace(/[^0-9\-]/g, '');
  const filename = 'MAUDIO_EventCrewSlip_' + evtSlug + '_' + dateStr + '.png';

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png', 1.0);
  link.download = filename;
  link.click();
  showToast('Downloaded: ' + filename, 'ok');
}


function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}