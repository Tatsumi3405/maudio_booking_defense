/* ══════════════════════════════════════════════════════════════
   M-AUDIO PRO — SUPABASE_CONFIG.js
   Supabase client plus a small Firestore-style helper layer
   (db.collection().doc().get()/set()/onSnapshot(), auth.*).
   The API shape was kept from the site's original prototype so the
   page scripts stayed unchanged; everything underneath is Supabase.
   Exposes db, auth, mediaStorage, serverTimestamp() to ADMIN.js,
   BOOKING.js and MAUDIO.js.
   ══════════════════════════════════════════════════════════════ */

const SUPABASE_URL      = 'window._env_.https://ponrkrqsmktdgclpuvyd.supabase.co';
const SUPABASE_ANON_KEY = 'window._env_.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvbnJrcnFzbWt0ZGdjbHB1dnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxODI2MjgsImV4cCI6MjA4OTc1ODYyOH0.uSKHTHx84yIac1QJAcpwOtZMq1FImaDjAhyppakvWvQ';

// ── Init real Supabase client ────────────────────────────────
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken:    true,
    persistSession:      true,
    detectSessionInUrl:  false,   // prevent magic-link confusion
  }
});

/* ════════════════════════════════════════════════════════════
   UTILITY
   ════════════════════════════════════════════════════════════ */
let _chCounter = 0;
function _uid() { return ++_chCounter; }

function _toSnap(rows) {
  const docs = (rows || []).map(row => ({
    id:   row.id,
    data: () => { const { id, ...rest } = row; return rest; }
  }));
  return { docs, empty: docs.length === 0, forEach: fn => docs.forEach(fn) };
}

// Supabase lowercases all column names — normalise keys before writing
function _clean(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v && v._serverTs) { out[k.toLowerCase()] = new Date().toISOString(); }
    else if (v !== undefined) { out[k.toLowerCase()] = v; }
  }
  return out;
}

/* ════════════════════════════════════════════════════════════
   DOCUMENT REFERENCE
   ════════════════════════════════════════════════════════════ */
function _docRef(table, id) {
  return {
    get: async () => {
      const { data, error } = await _sb.from(table).select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error;
      return {
        exists: !!data,
        id:     data?.id,
        data:   () => {
          if (!data) return null;
          const { id: _, ...rest } = data;
          return rest;
        }
      };
    },

    update: async updates => {
      const cleaned = _clean(updates);
      const { error } = await _sb.from(table).update(cleaned).eq('id', id);
      if (error) throw error;
    },

    delete: async () => {
      const { error } = await _sb.from(table).delete().eq('id', id);
      if (error) throw error;
    },

    set: async (docData, _opts) => {
      const row = _clean({ ...docData, id });
      const { error } = await _sb.from(table).upsert(row, { onConflict: 'id' });
      if (error) throw error;
    }
  };
}

/* ════════════════════════════════════════════════════════════
   QUERY REFERENCE
   ════════════════════════════════════════════════════════════ */
function _queryRef(table, field, op, value) {
  const sbOp = { '==':'eq','!=':'neq','>':'gt','>=':'gte','<':'lt','<=':'lte' }[op] || 'eq';

  async function _fetch() {
    const { data, error } = await _sb.from(table).select('*')[sbOp](field, value);
    if (error) throw error;
    return _toSnap(data);
  }

  return {
    get: _fetch,
    onSnapshot: (cb, errCb) => {
      _fetch().then(cb).catch(e => errCb?.(e));

      const chName = `${table}:${field}:${String(value).substring(0,20)}:${_uid()}`;
      const ch = _sb.channel(chName);
      ch.on('postgres_changes', { event: '*', schema: 'public', table }, () =>
        _fetch().then(cb).catch(() => {})
      );
      ch.subscribe();
      return () => _sb.removeChannel(ch);
    }
  };
}

/* ════════════════════════════════════════════════════════════
   COLLECTION REFERENCE
   ════════════════════════════════════════════════════════════ */
function _collRef(table) {
  return {
    get: async () => {
      const { data, error } = await _sb.from(table).select('*');
      if (error) throw error;
      return _toSnap(data);
    },

    onSnapshot: (cb, errCb) => {
      // Immediate first load
      _sb.from(table).select('*').then(({ data, error }) => {
        if (error) { errCb?.(error); return; }
        cb(_toSnap(data));
      });

      const chName = `${table}-all-${_uid()}`;
      const ch = _sb.channel(chName);
      ch.on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        _sb.from(table).select('*').then(({ data }) => {
          if (data) cb(_toSnap(data));
        });
      });
      ch.subscribe();
      return () => _sb.removeChannel(ch);
    },

    add: async docData => {
      const row = _clean(docData);
      const { data, error } = await _sb.from(table).insert(row).select().single();
      if (error) throw error;
      return { id: data.id };
    },

    // Insert for anonymous visitors (public booking form). Row Level
    // Security gives the public INSERT but not SELECT on `bookings`, so
    // the normal add() — which reads the new row back — would be
    // refused. Here the id is generated in the browser and nothing is
    // read back.
    addPublic: async docData => {
      const id  = crypto.randomUUID();
      const row = _clean({ ...docData, id });
      const { error } = await _sb.from(table).insert(row);
      if (error) throw error;
      return { id };
    },

    doc: id => {
      if (!id) id = crypto.randomUUID();
      return _docRef(table, id);
    },

    where: (field, op, value) => _queryRef(table, field, op, value)
  };
}

/* ════════════════════════════════════════════════════════════
   PUBLIC db OBJECT
   ════════════════════════════════════════════════════════════ */
const db = { collection: table => _collRef(table) };

/* ════════════════════════════════════════════════════════════
   AUTH COMPAT SHIM
   ────────────────────────────────────────────────────────────
   KEY FIX: The old "security" version broke onAuthStateChanged
   by using a mock that fired null, causing an infinite redirect
   loop between LOGIN.html and ADMIN.html.

   This version:
   1. Calls back exactly ONCE with the current session on init.
   2. Then calls back on every real auth change.
   3. Uses a guard (_initFired) to prevent double-fire from
      INITIAL_SESSION + getSession both running.
   ════════════════════════════════════════════════════════════ */
const auth = {

  signInWithEmailAndPassword: async (email, password) => {
    let data, error;
    try {
      ({ data, error } = await _sb.auth.signInWithPassword({ email, password }));
    } catch (fetchErr) {
      throw { code: 'auth/network-request-failed', message: fetchErr.message };
    }
    if (error) {
      const msg = (error.message || '').toLowerCase();
      const code =
          msg.includes('invalid login')   ? 'auth/invalid-credential'
        : msg.includes('invalid email')   ? 'auth/invalid-email'
        : msg.includes('invalid')         ? 'auth/invalid-credential'
        : msg.includes('wrong password')  ? 'auth/wrong-password'
        : msg.includes('user not found')  ? 'auth/user-not-found'
        : msg.includes('too many')        ? 'auth/too-many-requests'
        : msg.includes('not confirmed')   ? 'auth/email-not-confirmed'
        : msg.includes('disabled')        ? 'auth/operation-not-allowed'
        :                                   'auth/network-request-failed';
      throw { code, message: error.message };
    }
    if (!data?.user) throw { code: 'auth/user-not-found', message: 'No user returned' };
    return { user: data.user };
  },

  signOut: () => _sb.auth.signOut(),

  getCurrentUser: async () => {
    const { data } = await _sb.auth.getUser();
    return data?.user ?? null;
  },

  updatePassword: async newPassword => {
    const { data, error } = await _sb.auth.updateUser({ password: newPassword });
    if (error) throw { code: 'auth/update-failed', message: error.message };
    return data?.user;
  },

  updateEmail: async newEmail => {
    const { data, error } = await _sb.auth.updateUser({ email: newEmail });
    if (error) throw { code: 'auth/update-failed', message: error.message };
    // Supabase requires clicking a confirmation link (sent to the new address,
    // and often the old one too) before the email actually swaps over — the
    // session's email won't reflect the change until that's done.
    return data?.user;
  },

  onAuthStateChanged: callback => {
    let _initFired = false;

    // Listener for all subsequent changes (LOGIN, LOGOUT, TOKEN_REFRESH…)
    const { data: { subscription } } = _sb.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (_initFired) return;   // already handled by getSession below
        _initFired = true;
      }
      callback(session?.user ?? null);
    });

    // Immediate check in case onAuthStateChange hasn't fired yet
    _sb.auth.getSession().then(({ data }) => {
      if (_initFired) return;     // onAuthStateChange already fired first
      _initFired = true;
      callback(data?.session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }
};

/* ════════════════════════════════════════════════════════════
   STORAGE — bulk file uploads (gallery videos, etc.)
   Wraps Supabase Storage so callers never touch _sb directly.
   Bucket must exist and be public — see
   ABOUT_US_GALLERY_STORAGE.sql for the one-time setup.
   ════════════════════════════════════════════════════════════ */
const mediaStorage = {
  // Uploads a single File and resolves with its public URL + path.
  upload: async (bucket, path, file, onProgress) => {
    const { data, error } = await _sb.storage
      .from(bucket)
      .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
    if (error) throw error;
    // Supabase JS v2 doesn't expose granular upload progress on this call;
    // onProgress (if given) just gets a single 100% tick on completion.
    if (onProgress) onProgress(100);
    const { data: pub } = _sb.storage.from(bucket).getPublicUrl(data.path);
    return { path: data.path, publicUrl: pub.publicUrl };
  },

  // Short-lived read link for a PRIVATE bucket (booking-proofs). The
  // anon role has INSERT only there, so a customer's proof of payment
  // can't be fetched by anyone guessing a URL; the authenticated admin
  // mints a signed link that expires. Used by ADMIN.js's booking modal.
  signedUrl: async (bucket, path, expiresIn = 3600) => {
    const { data, error } = await _sb.storage.from(bucket).createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data.signedUrl;
  },

  remove: async (bucket, paths) => {
    const { error } = await _sb.storage.from(bucket).remove(Array.isArray(paths) ? paths : [paths]);
    if (error) throw error;
  }
};

/* ════════════════════════════════════════════════════════════
   serverTimestamp() — marker that _clean() swaps for an ISO
   timestamp when the row is written.
   ════════════════════════════════════════════════════════════ */
const serverTimestamp = () => ({ _serverTs: true });