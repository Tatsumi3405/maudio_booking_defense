/* ══════════════════════════════════════════════════════════════
   M-AUDIO PRO — LOGIN.js  v3 PREMIUM
   ══════════════════════════════════════════════════════════════

   Features added over v2:
   ─────────────────────────────────────────────────────────────
   ① Oscilloscope canvas background (multi-layer sine harmonics)
   ② Custom cursor w/ lerped ring (matches MAUDIO site)
   ③ Session precheck veil  → no flash of login page
   ④ Typewriter animation   → ADMIN LOGIN types out char by char
   ⑤ Password show/hide toggle with animated eye SVGs
   ⑥ Caps Lock detector     → live warning below password field
   ⑦ Email format validator → debounced ✓/✗ badge
   ⑧ Magnetic login button  → follows cursor within bounds
   ⑨ VU-meter loading state → 7 animated bars replace button text
   ⑩ Failed-attempt meter   → visual indicator only (not a real lockout)
   ⑪ Card shake on error    → physical feedback
   ⑫ Input fields clear state on retry
   ══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   ① OSCILLOSCOPE CANVAS
   ───────────────────────────────────────────────────────────── */
const canvas = document.getElementById('oscCanvas');
const ctx    = canvas.getContext('2d');
let   _frame = 0;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Four overlapping harmonic waves — different freq, phase, amplitude, speed
const WAVES = [
  { freq: 0.016, amp: 38, speed: 0.009,  phase: 0,             alpha: 0.11, lw: 1.5 },
  { freq: 0.028, amp: 20, speed: 0.016,  phase: Math.PI / 2.5, alpha: 0.07, lw: 1.0 },
  { freq: 0.011, amp: 55, speed: 0.006,  phase: Math.PI / 1.3, alpha: 0.05, lw: 1.8 },
  { freq: 0.040, amp: 12, speed: 0.023,  phase: Math.PI * 0.8, alpha: 0.04, lw: 0.8 },
];

function drawWave(wave, t) {
  const { freq, amp, speed, phase, alpha, lw } = wave;
  const cy = canvas.height * 0.5;
  ctx.beginPath();
  ctx.strokeStyle = `rgba(232,24,12,${alpha})`;
  ctx.lineWidth   = lw;
  ctx.lineJoin    = 'round';
  for (let x = 0; x <= canvas.width; x += 2) {
    // Primary harmonic + subtle secondary overtone
    const y = cy
      + Math.sin(x * freq + t * speed + phase) * amp
      + Math.sin(x * freq * 1.73 + t * speed * 0.6 + phase * 0.85) * amp * 0.28;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
}

(function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  WAVES.forEach(w => drawWave(w, _frame));
  _frame++;
  requestAnimationFrame(animateCanvas);
})();


/* ─────────────────────────────────────────────────────────────
   ② CUSTOM CURSOR — removed. Was a dot+ring follower replacing
   the system cursor (matches MAUDIO site); now using the plain
   default cursor everywhere instead. See LOGIN.css/.html for the
   matching removal.
   ───────────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────────────
   ③ SESSION PRECHECK VEIL
   Blocks the login UI until Supabase auth state resolves.
   Prevents the flash of the login page to a logged-in user.
   ───────────────────────────────────────────────────────────── */
const sessionVeil = document.getElementById('sessionVeil');
const loginWrap   = document.getElementById('loginWrap');
let   _revealed   = false;

// Safety fallback — show the form after 3 s regardless
const _veilTimeout = setTimeout(() => reveal(), 3000);

function reveal() {
  if (_revealed) return;
  _revealed = true;
  clearTimeout(_veilTimeout);

  sessionVeil.classList.add('out');          // fade out veil
  loginWrap.classList.add('visible');        // fade in form

  // Start the typewriter after the card-rise animation finishes
  setTimeout(() => startTypewriter('ADMIN LOGIN'), 580);
}

auth.onAuthStateChanged(user => {
  if (user) {
    // Already logged in — skip straight to admin
    window.location.replace('ADMIN.html');
  } else {
    reveal();
    // Surfaced by ADMIN.js's admin-allowlist check when a real Supabase
    // account exists but isn't in the `admins` table.
    if (new URLSearchParams(location.search).get('err') === 'not_admin') {
      setTimeout(() => showErr('This account isn\u2019t authorized for admin access.'), 700);
    }
  }
});


/* ─────────────────────────────────────────────────────────────
   ④ TYPEWRITER  —  types out heading char-by-char
   ───────────────────────────────────────────────────────────── */
function startTypewriter(text) {
  const out = document.getElementById('twText');
  let i = 0;
  out.textContent = '';

  function tick() {
    if (i < text.length) {
      out.textContent += text[i++];
      // Slightly randomised typing speed for realism
      setTimeout(tick, 72 + Math.random() * 55);
    }
  }
  tick();
}


/* ─────────────────────────────────────────────────────────────
   ⑤ PASSWORD SHOW / HIDE TOGGLE
   ───────────────────────────────────────────────────────────── */
const inputPass = document.getElementById('inputPass');
const pwToggle  = document.getElementById('pwToggle');
let   _pwVis    = false;

const EYE_OPEN = /* html */`
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>`;

const EYE_SHUT = /* html */`
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
           a18.45 18.45 0 0 1 5.06-5.94
           M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8
           a18.5 18.5 0 0 1-2.16 3.19
           m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
  <line x1="1" y1="1" x2="23" y2="23"/>
</svg>`;

// Initialise with the eye-open icon
pwToggle.innerHTML = EYE_OPEN;

pwToggle.addEventListener('click', () => {
  _pwVis          = !_pwVis;
  inputPass.type  = _pwVis ? 'text' : 'password';
  pwToggle.innerHTML    = _pwVis ? EYE_SHUT : EYE_OPEN;
  pwToggle.setAttribute('aria-label', _pwVis ? 'Hide password' : 'Show password');
  inputPass.focus();
});


/* ─────────────────────────────────────────────────────────────
   ⑥ CAPS LOCK DETECTOR
   ───────────────────────────────────────────────────────────── */
const capsWarn = document.getElementById('capsWarn');

function updateCapsLock(e) {
  const on = e.getModifierState && e.getModifierState('CapsLock');
  capsWarn.classList.toggle('on', on);
}
inputPass.addEventListener('keydown', updateCapsLock);
inputPass.addEventListener('keyup',   updateCapsLock);


/* ─────────────────────────────────────────────────────────────
   ⑦ EMAIL VALIDATION BADGE  (debounced, 600 ms)
   ───────────────────────────────────────────────────────────── */
const inputUser  = document.getElementById('inputUser');
const emailBadge = document.getElementById('emailBadge');
let   _emailTmr;
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

inputUser.addEventListener('input', () => {
  clearTimeout(_emailTmr);
  // Reset immediately
  emailBadge.className   = 'field-badge';
  emailBadge.textContent = '';
  inputUser.classList.remove('v-ok', 'v-bad');

  _emailTmr = setTimeout(() => {
    const v = inputUser.value.trim();
    if (!v) return;
    const valid = RE_EMAIL.test(v);
    inputUser.classList.add(valid ? 'v-ok' : 'v-bad');
    emailBadge.textContent = valid ? '✓' : '✗';
    emailBadge.className   = `field-badge show ${valid ? 'ok' : 'bad'}`;
  }, 600);
});


/* ─────────────────────────────────────────────────────────────
   ⑧ MAGNETIC BUTTON  —  follows cursor within bounds
   ───────────────────────────────────────────────────────────── */
const loginBtn = document.getElementById('loginBtn');
let   _btnMagnetic = true;

loginBtn.addEventListener('mousemove', e => {
  if (!_btnMagnetic || loginBtn.disabled) return;
  const r  = loginBtn.getBoundingClientRect();
  const cx = r.left + r.width  / 2;
  const cy = r.top  + r.height / 2;
  const dx = (e.clientX - cx) * 0.26;
  const dy = (e.clientY - cy) * 0.26;
  loginBtn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
});

loginBtn.addEventListener('mouseleave', () => {
  loginBtn.style.transition = 'background .2s, box-shadow .22s, transform .55s cubic-bezier(.2,.8,.3,1)';
  loginBtn.style.transform  = '';
  // Restore fast transition after spring settles
  setTimeout(() => { loginBtn.style.transition = ''; }, 600);
});

loginBtn.addEventListener('mouseenter', () => {
  loginBtn.style.transition = 'background .2s, box-shadow .22s, transform .07s linear';
});


/* ─────────────────────────────────────────────────────────────
   ⑨ LOADING STATE  (VU meter in button)
   ───────────────────────────────────────────────────────────── */
const btnLabel = document.getElementById('btnLabel');
const btnVU    = document.getElementById('btnVU');

function setLoading(loading) {
  if (loading) {
    btnLabel.style.display = 'none';
    btnVU.classList.add('on');
    loginBtn.disabled  = true;
    _btnMagnetic       = false;
    inputUser.disabled = true;
    inputPass.disabled = true;
    loginBtn.style.transform = '';
  } else {
    btnLabel.style.display = '';
    btnVU.classList.remove('on');
    loginBtn.disabled  = false;
    _btnMagnetic       = true;
    inputUser.disabled = false;
    inputPass.disabled = false;
  }
}

function setSuccess() {
  btnLabel.style.display = '';
  btnVU.classList.remove('on');
  btnLabel.textContent = '✓ AUTHENTICATED';
  loginBtn.classList.add('success');
  loginBtn.disabled = true;
  _btnMagnetic      = false;
}


/* ─────────────────────────────────────────────────────────────
   ⑩ FAILED-ATTEMPT METER
   ───────────────────────────────────────────────────────────── */
const attemptMeter = document.getElementById('attemptMeter');
const amFill       = document.getElementById('amFill');
const amCount      = document.getElementById('amCount');
const MAX_ATTEMPTS = 3;
let   _attempts    = 0;

function incrementAttempt() {
  _attempts = Math.min(_attempts + 1, MAX_ATTEMPTS);
  attemptMeter.classList.add('on');

  const pct  = (_attempts / MAX_ATTEMPTS) * 100;

  amFill.style.width = pct + '%';

  if (_attempts >= MAX_ATTEMPTS) {
    amFill.classList.add('hot');
    attemptMeter.classList.add('critical');
    amCount.textContent = 'COOLING DOWN 15s';
    amCount.classList.add('red');
    // NOTE: this is a visual indicator plus a 15-second UI pause, nothing
    // more. It lives in page memory, resets on refresh and cannot stop a
    // scripted attacker. The actual brute-force protection is Supabase
    // Auth's server-side rate limiting.
    loginBtn.disabled = true;
    setTimeout(() => { loginBtn.disabled = false; }, 15000);
  } else if (_attempts === 2) {
    amFill.style.background = 'var(--red)';
    amFill.classList.add('hot');
    amCount.textContent = '2 OF 3 FAILED';
    amCount.classList.add('red');
    attemptMeter.classList.add('critical');
  } else {
    amCount.textContent = `${_attempts} OF ${MAX_ATTEMPTS} FAILED`;
  }
}


/* ─────────────────────────────────────────────────────────────
   ⑪ CARD SHAKE  (physical error feedback)
   ───────────────────────────────────────────────────────────── */
const loginCard = document.getElementById('loginCard');
const loginErr  = document.getElementById('loginError');
let   _errTmr;

function shakeCard() {
  loginCard.classList.remove('shaking');
  void loginCard.offsetWidth; // force reflow to restart animation
  loginCard.classList.add('shaking');
  loginCard.addEventListener('animationend', () => {
    loginCard.classList.remove('shaking');
  }, { once: true });
}

function showErr(msg) {
  clearTimeout(_errTmr);
  loginErr.innerHTML     = msg;
  loginErr.style.display = 'block';
  shakeCard();
  _errTmr = setTimeout(() => { loginErr.style.display = 'none'; }, 6000);
}


/* ─────────────────────────────────────────────────────────────
   ⑫ CORE LOGIN FLOW
   ───────────────────────────────────────────────────────────── */
const RE_EMAIL_QUICK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function doLogin() {
  if (loginBtn.disabled) return;

  const email = inputUser.value.trim();
  const pass  = inputPass.value;

  loginErr.style.display = 'none';

  if (!email || !pass) {
    showErr('Please enter your email and password.');
    return;
  }
  if (!RE_EMAIL_QUICK.test(email)) {
    showErr('Please enter a valid email address.');
    return;
  }

  setLoading(true);

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      setSuccess();
      // Small delay — lets the session cookie persist before redirect
      setTimeout(() => window.location.replace('ADMIN.html'), 300);
    })
    .catch(err => {
      setLoading(false);

      // Clear password; reset visibility toggle
      inputPass.value      = '';
      _pwVis               = false;
      inputPass.type       = 'password';
      pwToggle.innerHTML   = EYE_OPEN;

      incrementAttempt();
      showErr(getFriendlyError(err.code, err.message));
    });
}

// Enter key from anywhere on the page
document.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
loginBtn.addEventListener('click', doLogin);


/* ─────────────────────────────────────────────────────────────
   ERROR CODE → FRIENDLY MESSAGE MAP
   ───────────────────────────────────────────────────────────── */
function getFriendlyError(code, rawMsg) {
  const map = {
    'auth/user-not-found':         '❌ No account found with that email.',
    'auth/wrong-password':         '❌ Incorrect password. Please try again.',
    'auth/invalid-email':          '❌ Please enter a valid email address.',
    'auth/invalid-credential':     '❌ Incorrect email or password. Check your Supabase credentials.',
    'auth/email-not-confirmed':    '⚠️ Email not verified — confirm the account in your Supabase Auth dashboard.',
    'auth/too-many-requests':      '⏳ Too many attempts. Wait a few minutes before retrying.',
    'auth/network-request-failed': '🌐 Network error — check your internet connection and try again.',
    'auth/operation-not-allowed':  '⚠️ Email login is disabled. Enable it in Supabase → Auth → Providers.',
    'auth/unknown':                '⚠️ Auth issue — ' + (rawMsg || 'check Supabase Auth settings.'),
  };
  return map[code] || ('❌ Login failed (' + (code||'unknown') + '): ' + (rawMsg||''));
}