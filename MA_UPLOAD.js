/* ══════════════════════════════════════════════════════════════
   M-AUDIO PRO — MA_UPLOAD.js
   Screenshot / proof-of-payment uploader for BOOKING.html.

   WHY THIS FILE EXISTS
   ────────────────────
   BOOKING.html already contained the full markup for two uploaders
   (#socialDrop / #socialFileInput and #proofDrop / #proofFileInput)
   and BOOKING.css already styled every state they use (.drag,
   .proof-preview, .proof-preview-status.uploading/.done/.error).
   What was missing was the JavaScript: nothing in BOOKING.js,
   MAUDIO.js or anywhere else referenced those IDs, so the drop zones
   were inert — clicking them did nothing, dragging a file onto them
   made the browser navigate away to the image, and the booking
   payload had no field to carry a screenshot in. This file supplies
   that missing layer.

   HOW IT WORKS
   ────────────
   1. Click / Enter / Space / drag-drop  → opens or receives a file
   2. Validates type + size entirely client-side (instant feedback)
   3. Shows a local preview with URL.createObjectURL — no read access
      to the storage bucket is needed for the customer to see it
   4. Uploads to the Supabase Storage bucket BOOKING_PROOF_BUCKET
      under a random UUID path
   5. Records { path, publicUrl } on window._uploads[kind] so
      submitBooking() can attach it to the booking row

   SECURITY NOTE (worth saying out loud at defence)
   ────────────────────────────────────────────────
   The bucket is PRIVATE. Anonymous visitors get INSERT only — they
   can drop a file in but cannot list or read the bucket, so one
   customer can never fetch another customer's proof of payment. The
   admin panel is authenticated, so it reads each image through a
   short-lived signed URL. See BOOKING_PROOF_STORAGE.sql.

   Load order in BOOKING.html:
     SUPABASE_CONFIG.js  →  MA_UPLOAD.js  →  BOOKING.js
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const BOOKING_PROOF_BUCKET = 'booking-proofs';
  const MAX_BYTES  = 8 * 1024 * 1024;               // 8MB — matches the UI copy
  const OK_TYPES   = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/heic', 'image/heif'];

  // Shared state read by submitBooking() in BOOKING.js.
  //   window._uploads.social  = { path, publicUrl, name } | null
  //   window._uploads.payment = { path, publicUrl, name } | null
  window._uploads = { social: null, payment: null };
  // Number of uploads still in flight — submitBooking() waits on this.
  window._uploadsPending = 0;

  function bytesLabel(n) {
    return n < 1024 * 1024
      ? Math.round(n / 1024) + ' KB'
      : (n / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function randomName(file) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 5) || 'jpg';
    const id  = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
    return id + '.' + ext;
  }

  function initUploader(cfg) {
    const input   = document.getElementById(cfg.inputId);
    const drop    = document.getElementById(cfg.dropId);
    const preview = document.getElementById(cfg.previewId);
    const img     = document.getElementById(cfg.imgId);
    const nameEl  = document.getElementById(cfg.nameId);
    const statusEl= document.getElementById(cfg.statusId);
    const removeEl= document.getElementById(cfg.removeId);
    const errEl   = document.getElementById(cfg.errId);

    // The uploader is optional on some pages — bail quietly rather than
    // throwing and taking the rest of BOOKING.js down with it.
    if (!input || !drop || !preview || !img) return null;

    let objectUrl = null;   // revoked on replace/remove so we don't leak blobs
    let lastFile  = null;   // kept so the "Retry" affordance can re-send it

    function setErr(msg) {
      if (errEl) errEl.textContent = msg || '';
      drop.classList.toggle('error', !!msg);
    }

    function setStatus(text, cls) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.classList.remove('uploading', 'done', 'error');
      if (cls) statusEl.classList.add(cls);
    }

    function showPreview(file) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl  = URL.createObjectURL(file);
      img.src    = objectUrl;
      if (nameEl) nameEl.textContent = file.name + ' · ' + bytesLabel(file.size);
      preview.style.display = '';
      drop.style.display    = 'none';
    }

    function reset() {
      if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; }
      img.removeAttribute('src');
      preview.style.display = 'none';
      drop.style.display    = '';
      input.value           = '';   // so re-picking the SAME file still fires change
      lastFile              = null;
      window._uploads[cfg.kind] = null;
      setErr('');
    }

    function validate(file) {
      const type = (file.type || '').toLowerCase();
      // Some Android browsers report an empty MIME type — fall back to the
      // extension rather than rejecting a legitimate photo.
      const extOk = /\.(png|jpe?g|webp|heic|heif)$/i.test(file.name || '');
      if (!type ? !extOk : !OK_TYPES.includes(type)) {
        return 'That file isn\u2019t an image. Please upload a PNG or JPG screenshot.';
      }
      if (file.size > MAX_BYTES) {
        return 'That image is ' + bytesLabel(file.size) + '. Please keep it under 8MB.';
      }
      if (file.size === 0) return 'That file appears to be empty.';
      return null;
    }

    async function upload(file) {
      lastFile = file;
      setStatus('Uploading\u2026', 'uploading');
      window._uploadsPending++;
      try {
        const path = cfg.kind + '/' + new Date().toISOString().substring(0, 10) + '/' + randomName(file);
        const res  = await mediaStorage.upload(BOOKING_PROOF_BUCKET, path, file);
        window._uploads[cfg.kind] = { path: res.path, publicUrl: res.publicUrl, name: file.name };
        setStatus('Uploaded \u2713', 'done');
        setErr('');
      } catch (e) {
        console.error('[MA_UPLOAD] ' + cfg.kind + ' upload failed:', e);
        window._uploads[cfg.kind] = null;
        setStatus('Upload failed — tap to retry', 'error');
        setErr('We couldn\u2019t upload that screenshot. Check your connection and try again — you can still submit without it.');
      } finally {
        window._uploadsPending = Math.max(0, window._uploadsPending - 1);
      }
    }

    function accept(file) {
      if (!file) return;
      const problem = validate(file);
      if (problem) { setErr(problem); return; }
      setErr('');
      showPreview(file);
      upload(file);
    }

    // ── Click / keyboard ──────────────────────────────────────
    drop.addEventListener('click', () => input.click());
    drop.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
    });
    input.addEventListener('change', () => accept(input.files && input.files[0]));

    // ── Drag & drop ───────────────────────────────────────────
    // Without these preventDefault() calls the browser's own default
    // kicks in and simply opens the dropped image in the tab, losing the
    // half-filled booking form. That was the behaviour before this file.
    ['dragenter', 'dragover'].forEach(evt =>
      drop.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); drop.classList.add('drag'); }));
    ['dragleave', 'dragend'].forEach(evt =>
      drop.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('drag'); }));
    drop.addEventListener('drop', e => {
      e.preventDefault(); e.stopPropagation();
      drop.classList.remove('drag');
      const dt = e.dataTransfer;
      accept(dt && dt.files && dt.files[0]);
    });

    // ── Paste (Ctrl+V a screenshot straight from Snipping Tool) ──
    drop.addEventListener('paste', e => {
      const items = (e.clipboardData || {}).items || [];
      for (const it of items) {
        if (it.kind === 'file') { e.preventDefault(); accept(it.getAsFile()); return; }
      }
    });

    // ── Retry by tapping the failed status ────────────────────
    if (statusEl) statusEl.addEventListener('click', () => {
      if (statusEl.classList.contains('error') && lastFile) upload(lastFile);
    });

    // ── Remove ────────────────────────────────────────────────
    if (removeEl) removeEl.addEventListener('click', async () => {
      const current = window._uploads[cfg.kind];
      reset();
      // Best effort tidy-up of the orphaned object. The anon role has no
      // DELETE grant on the bucket by design, so this may legitimately
      // fail; the booking simply won't reference the file.
      if (current && current.path) {
        try { await mediaStorage.remove(BOOKING_PROOF_BUCKET, current.path); } catch (_) {}
      }
    });

    return { reset, kind: cfg.kind };
  }

  function init() {
    // Both uploaders share the same markup shape, so one factory covers both.
    window._maUploaders = {
      social: initUploader({
        kind: 'social',
        inputId: 'socialFileInput', dropId: 'socialDrop',
        previewId: 'socialPreview', imgId: 'socialPreviewImg',
        nameId: 'socialFileName',   statusId: 'socialStatus',
        removeId: 'socialRemoveBtn', errId: 'err-socialUpload'
      }),
      payment: initUploader({
        kind: 'payment',
        inputId: 'proofFileInput', dropId: 'proofDrop',
        previewId: 'proofPreview', imgId: 'proofPreviewImg',
        nameId: 'proofFileName',   statusId: 'proofStatus',
        removeId: 'proofRemoveBtn', errId: 'err-proofUpload'
      })
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.MAUpload = { BUCKET: BOOKING_PROOF_BUCKET, MAX_BYTES };
})();
