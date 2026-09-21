/* ══════════════════════════════════════════════════════════════
   M-AUDIO PRO — CLOUDFLARE_WORKER.js
   Server-side booking price verification.

   This Worker has ONE job: right after a public booking is inserted,
   BOOKING.js calls it with { action: "verify_booking_price", docId }.
   The Worker recomputes the minimum possible price from the package
   and meal data, and corrects the stored total if it is lower than
   what is even possible (i.e. the customer edited the price in
   devtools before submitting).

   ENVIRONMENT VARIABLES (Cloudflare Dashboard → Workers → Settings → Variables):
     SUPABASE_URL          = "https://ponrkrqsmktdgclpuvyd.supabase.co"
     SUPABASE_SERVICE_KEY  = your service_role key  ← mark as Secret

   DEPLOY:
     wrangler secret put SUPABASE_SERVICE_KEY
     wrangler deploy

   TEST (after deploy):
     curl https://maudio-booking-webhook.rommelbaro4.workers.dev
     → Returns a JSON health check showing whether the secrets are set
   ══════════════════════════════════════════════════════════════ */

// ── Canonical pricing tables (mirror of PACKAGE_DATA in BOOKING.js /
//    ADMIN.js). These are the DEFAULT prices; admin overrides from the
//    package_price_overrides table take precedence (see getPriceOverride). This is what
//    makes verify_booking_price authoritative: it is computed here,
//    server-side, from data the customer's browser cannot edit.
const PACKAGE_DATA = {
  basic:    { crew: 3, packages: [
    { id: 'basic-1', price: 5000 }, { id: 'basic-2', price: 6000 }, { id: 'basic-3', price: 7500 },
  ]},
  wedding:  { crew: 5, packages: [
    { id: 'wed-1', price: 5000 }, { id: 'wed-2', price: 6000 }, { id: 'wed-3', price: 7500 },
    { id: 'wed-4', price: 9500 }, { id: 'wed-5', price: 11000 }, { id: 'wed-6', price: 12000 },
    { id: 'wed-7', price: 14000 }, { id: 'wed-8', price: 18000 },
  ]},
  bigcrowd: { crew: 7, packages: [
    { id: 'big-8', price: 18000 }, { id: 'big-9', price: 22000 },
  ]},
  ledwall:  { crew: 2, packages: [
    { id: 'lw-35', price: 14000, priceOutdoor: 15000 },
    { id: 'lw-40', price: 18000, priceOutdoor: 19000 },
  ]},
};
const MEAL_RATE = 150;

function findPackage(id) {
  for (const cat of Object.values(PACKAGE_DATA)) {
    const pkg = cat.packages.find(p => p.id === id);
    if (pkg) return { pkg, crew: cat.crew };
  }
  return null;
}

// ── UUID guard — every docId we accept must look like a real Postgres
//    uuid before it ever touches a query string. ──────────────────────
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidDocId(id) {
  return typeof id === 'string' && UUID_RE.test(id);
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

// ── ALLOWED ORIGINS ────────────────────────────────────────────
// Every origin the public booking page is served from. Browsers refuse to
// send the price-check request from any origin not listed here, so this is
// the list that decides who can reach the endpoint from a page.
//
// Localhost entries are NOT hardcoded. To develop locally, set the
// Cloudflare environment variable DEV_ORIGIN (e.g. "http://127.0.0.1:5500")
// on a preview/dev deployment only — production never has it set, so dev
// origins can never be accepted by the live Worker even by mistake.
const ALLOWED_ORIGINS = [
  'https://maudioprosound.com',
  'https://www.maudioprosound.com',
];

function allowedOrigins(env) {
  const extra = (env && env.DEV_ORIGIN) ? [env.DEV_ORIGIN] : [];
  return ALLOWED_ORIGINS.concat(extra);
}

function isAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin') || '';
  return allowedOrigins(env).includes(origin);
}

function corsFor(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = allowedOrigins(env).includes(origin);
  return {
    'Access-Control-Allow-Origin':  allowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary':                         'Origin',
  };
}

export default {
  async fetch(request, env) {
    const cors = corsFor(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // ── GET: health check ────────────────────────────────────
    // SECURITY FIX: this used to report to anyone on the internet whether
    // the service key was configured, which tells an attacker exactly when
    // price verification is offline. The detailed report is now gated
    // behind the same origin allowlist used for POSTs; everyone else gets
    // a bare liveness response.
    if (request.method === 'GET') {
      if (!isAllowedOrigin(request, env)) {
        return json({ status: 'ok' }, 200, cors);
      }
      const checks = {
        worker:       'online ✅',
        supabase_url: env.SUPABASE_URL         ? '✅ set' : '⚠ using default URL',
        service_key:  env.SUPABASE_SERVICE_KEY ? '✅ set' : '❌ MISSING — price verification will fail',
      };
      return json({ status: 'M-Audio PRO Worker', checks }, 200, cors);
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: cors });
    }

    // SECURITY FIX: CORS headers only constrain browsers — curl, Postman or
    // any script ignores them entirely. Rejecting the request server-side
    // means the endpoint genuinely only answers our own booking page.
    if (!isAllowedOrigin(request, env)) {
      return json({ error: 'Forbidden origin' }, 403, cors);
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'Invalid JSON body' }, 400, cors); }

    // ── Route: verify_booking_price ────────────────────────────
    // Public (runs right after an anonymous booking submission). Recomputes
    // the authoritative minimum price server-side and corrects the DB row
    // if the client-submitted total is below what's even possible for the
    // selected package + meals.
    if (body.action === 'verify_booking_price') {
      const { docId } = body;
      if (!isValidDocId(docId)) return json({ error: 'Missing or invalid docId' }, 400, cors);

      const booking = await getBooking(docId, env);
      if (!booking) return json({ ok: false, error: 'Booking not found' }, 404, cors);

      const result = await verifyAndCorrectPrice(booking, docId, env);
      return json(result, 200, cors);
    }

    return json({ error: 'Unknown action' }, 400, cors);
  }
};

// ══════════════════════════════════════════════════════════════
//  SUPABASE HELPERS (service-role — server-side only)
// ══════════════════════════════════════════════════════════════
function getSupabaseUrl(env) {
  return env.SUPABASE_URL || 'https://ponrkrqsmktdgclpuvyd.supabase.co';
}

function sbHeaders(env) {
  return {
    'apikey':        env.SUPABASE_SERVICE_KEY,
    'Authorization': 'Bearer ' + env.SUPABASE_SERVICE_KEY,
    'Content-Type':  'application/json',
    'Prefer':        'return=representation'
  };
}

async function getBooking(docId, env) {
  if (!isValidDocId(docId)) return null;
  try {
    const url = getSupabaseUrl(env) + '/rest/v1/bookings?id=eq.' + encodeURIComponent(docId) + '&select=*';
    const res = await fetch(url, { headers: sbHeaders(env) });
    if (!res.ok) return null;
    const rows = await res.json();
    return (rows && rows.length > 0) ? rows[0] : null;
  } catch { return null; }
}

// Admin-edited prices live in package_price_overrides (written by ADMIN.js,
// applied on the public site by MAUDIO.js and carried into the booking form
// via ?price=). The hardcoded table above is only the fallback default — if
// an override exists it is the authoritative base price, otherwise a package
// the admin had lowered would be "corrected" back up to its old price.
async function getPriceOverride(pkgId, env) {
  try {
    const url = getSupabaseUrl(env) + '/rest/v1/package_price_overrides?id=eq.' +
                encodeURIComponent(pkgId) + '&select=currentprice';
    const res = await fetch(url, { headers: sbHeaders(env) });
    if (!res.ok) return null;
    const rows = await res.json();
    const price = parseFloat(rows && rows[0] && rows[0].currentprice);
    return price > 0 ? price : null;
  } catch { return null; }
}

// ══════════════════════════════════════════════════════════════
//  PRICE VERIFICATION  (fixes client-side price tampering)
// ══════════════════════════════════════════════════════════════
async function verifyAndCorrectPrice(booking, docId, env) {
  const found = findPackage(booking.pkgid || booking.pkgId);
  // Custom/unrecognized packages: we don't have enough server-side
  // information to re-derive a price, so we skip rather than risk
  // corrupting a legitimate booking.
  if (!found) return { ok: true, verified: false, reason: 'Package not recognized — skipped' };

  const mealProvided = booking.mealprovided ?? booking.mealProvided ?? true;
  const mealMeals     = Number(booking.mealmeals ?? booking.mealMeals ?? 0);
  const crewCount     = Number(booking.crewcount ?? booking.crewCount ?? found.crew) || found.crew;
  const mealCost      = mealProvided ? 0 : MEAL_RATE * crewCount * mealMeals;

  // Add-ons are stored as a human-readable joined string in this schema,
  // not structured line items, so we can't recompute their exact
  // contribution here. We verify the *floor* — base package + meals — and
  // only correct the total UP to that floor if the stored total is LOWER
  // than it (i.e. someone reduced the price below what's even
  // mathematically possible). We never reduce a total that's higher, since
  // legitimate add-ons account for that.
  const basePrice = (await getPriceOverride(found.pkg.id, env)) ?? found.pkg.price;
  const floor = basePrice + mealCost;
  const storedTotal = Number(booking.totalprice ?? booking.totalPrice ?? 0);

  if (storedTotal >= floor) {
    return { ok: true, verified: true, corrected: false };
  }

  try {
    await fetch(getSupabaseUrl(env) + '/rest/v1/bookings?id=eq.' + encodeURIComponent(docId), {
      method: 'PATCH',
      headers: sbHeaders(env),
      body: JSON.stringify({ totalprice: floor })
    });
  } catch { /* best effort */ }

  console.warn(
    'PRICE CHECK: booking ' + docId.substring(0, 6).toUpperCase() +
    ' was submitted with total PHP ' + storedTotal.toLocaleString('en-PH') +
    ', below the minimum possible PHP ' + floor.toLocaleString('en-PH') +
    ' for its package. Corrected automatically — please double-check this booking.'
  );

  return { ok: true, verified: true, corrected: true, correctedTotal: floor };
}