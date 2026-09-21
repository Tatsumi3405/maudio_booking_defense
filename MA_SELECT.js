/* ══════════════════════════════════════════════════════════════
   MA SELECT — themed dropdown/select replacement
   Companion to MA_CALENDAR.js. Progressively enhances every
   <select> already on the page (and any added later) with a
   custom-styled trigger + floating option panel matching the
   M-Audio Pro red/black theme — replacing the native browser
   dropdown list, which CSS can never restyle.

   IMPORTANT: the original <select> is kept in the DOM (just made
   invisible/non-interactive). It stays the real source of truth,
   so nothing elsewhere has to change:
     - existing code reading `select.value`/`select.selectedIndex`
       keeps working
     - existing code SETTING `select.value =` / `.selectedIndex =`
       (e.g. resetting a form, populating an edit modal) is
       transparently mirrored to the visible trigger
     - `select.classList.add('error')` from existing validation
       helpers still shows a red border on the trigger
     - inline `onchange="..."` handlers and addEventListener('change')
       listeners still fire, because we dispatch a real 'change'
       event on the original element after updating it
     - selects whose <option> list is rebuilt at runtime via
       `select.innerHTML = ...` (e.g. Financial Report filters)
       are picked up automatically via MutationObserver
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  let openState = null; // { select, trigger, panel, cleanup }

  function labelFor(select) {
    const opt = select.options[select.selectedIndex];
    return opt ? opt.textContent : '';
  }

  function isPlaceholder(select) {
    const opt = select.options[select.selectedIndex];
    return !opt || opt.value === '';
  }

  function syncTrigger(select, trigger) {
    const label = trigger.querySelector('.ma-select-label');
    if (!label) return;
    label.textContent = labelFor(select);
    label.classList.toggle('placeholder', isPlaceholder(select));
    trigger.classList.toggle('error', select.classList.contains('error'));
    trigger.disabled = !!select.disabled;
    trigger.classList.toggle('disabled', !!select.disabled);

    // If this select's panel happens to be open, keep its highlighted
    // row in sync too (covers programmatic value changes mid-interaction).
    if (openState && openState.select === select) {
      const rows = [...openState.panel.querySelectorAll('.ma-select-option')];
      rows.forEach((row, idx) => row.classList.toggle('selected', idx === select.selectedIndex));
    }
  }

  function closeOpen() {
    if (!openState) return;
    const { trigger, panel, cleanup } = openState;
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('ma-select-open');
    cleanup();
    setTimeout(() => { if (panel.parentNode) panel.parentNode.removeChild(panel); }, 160);
    openState = null;
  }

  function commitSelection(select, trigger, idx) {
    if (select.options[idx]?.disabled) return;
    select.selectedIndex = idx; // goes through the hooked setter -> auto-syncs trigger
    select.dispatchEvent(new Event('input',  { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function buildPanelRows(select, trigger, panel) {
    panel.innerHTML = '';
    [...select.options].forEach((opt, idx) => {
      const row = document.createElement('div');
      row.className   = 'ma-select-option';
      row.setAttribute('role', 'option');
      row.dataset.idx = String(idx);
      if (opt.disabled)               row.classList.add('disabled');
      if (idx === select.selectedIndex) row.classList.add('selected', 'hover');
      if (opt.value === '')           row.classList.add('placeholder-opt');
      row.textContent = opt.textContent;
      if (!opt.disabled) {
        row.addEventListener('click', () => {
          commitSelection(select, trigger, idx);
          closeOpen();
          trigger.focus();
        });
      }
      panel.appendChild(row);
    });
  }

  function positionPanel(trigger, panel) {
    const r  = trigger.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    panel.style.minWidth   = r.width + 'px';
    panel.style.visibility = 'hidden';
    panel.style.display    = 'block';
    const pr = panel.getBoundingClientRect();
    let top  = r.bottom + 6;
    if (top + pr.height > vh - 8) top = Math.max(8, r.top - pr.height - 6);
    let left = r.left;
    if (left + pr.width > vw - 8) left = Math.max(8, vw - pr.width - 8);
    panel.style.top        = top + 'px';
    panel.style.left       = left + 'px';
    panel.style.visibility = '';
  }

  function openFor(select, trigger) {
    if (select.disabled) return;
    if (openState) closeOpen();

    const panel = document.createElement('div');
    panel.className = 'ma-select-panel';
    panel.setAttribute('role', 'listbox');
    document.body.appendChild(panel);
    buildPanelRows(select, trigger, panel);
    positionPanel(trigger, panel);
    requestAnimationFrame(() => panel.classList.add('ma-select-open'));

    trigger.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');

    function moveHover(dir) {
      const rows = [...panel.querySelectorAll('.ma-select-option:not(.disabled)')];
      if (!rows.length) return;
      let hi = rows.findIndex(o => o.classList.contains('hover'));
      rows.forEach(o => o.classList.remove('hover'));
      hi = Math.min(rows.length - 1, Math.max(0, hi + dir));
      rows[hi].classList.add('hover');
      rows[hi].scrollIntoView({ block: 'nearest' });
    }

    function onDocClick(e) {
      if (!panel.contains(e.target) && !trigger.contains(e.target)) closeOpen();
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); closeOpen(); trigger.focus(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); moveHover(1); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); moveHover(-1); }
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const cur = panel.querySelector('.ma-select-option.hover') || panel.querySelector('.ma-select-option:not(.disabled)');
        if (cur) { commitSelection(select, trigger, +cur.dataset.idx); closeOpen(); trigger.focus(); }
      }
    }
    function onScroll(e) {
      if (panel.contains(e.target)) return;
      closeOpen();
    }

    document.addEventListener('mousedown', onDocClick, true);
    document.addEventListener('keydown',   onKey,      true);
    window.addEventListener('scroll',      onScroll,   true);
    window.addEventListener('resize',      closeOpen);

    openState = {
      select, trigger, panel,
      cleanup() {
        document.removeEventListener('mousedown', onDocClick, true);
        document.removeEventListener('keydown',   onKey,      true);
        window.removeEventListener('scroll',      onScroll,   true);
        window.removeEventListener('resize',      closeOpen);
      }
    };
  }

  // Hook `.value` and `.selectedIndex` so ANY existing code that sets
  // them directly (form resets, populating an edit modal, etc.) keeps
  // the custom trigger in sync without those call sites changing at all.
  function hookProperty(select, prop, onSet) {
    const flag = '_maHooked_' + prop;
    if (select[flag]) return;
    const desc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, prop);
    if (!desc || !desc.set) return;
    Object.defineProperty(select, prop, {
      configurable: true,
      enumerable: desc.enumerable,
      get() { return desc.get.call(select); },
      set(v) { desc.set.call(select, v); onSet(); }
    });
    select[flag] = true;
  }

  function enhanceSelect(select) {
    if (select.dataset.maEnhanced) return;
    if (select.classList.contains('ma-select-skip')) return;
    select.dataset.maEnhanced = '1';

    const wrap = document.createElement('div');
    wrap.className = 'ma-select-wrap';
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    select.classList.add('ma-select-native');
    select.tabIndex = -1;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'ma-select-trigger';
    // Selects styled inline as compact toolbar filters (Financial Reports)
    // get the pill treatment instead of a full-width block control.
    if (select.getAttribute('style')) trigger.classList.add('pill');
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML =
      '<span class="ma-select-label"></span>' +
      '<svg class="ma-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
    wrap.appendChild(trigger);

    syncTrigger(select, trigger);

    trigger.addEventListener('click', () => {
      if (openState && openState.trigger === trigger) { closeOpen(); return; }
      openFor(select, trigger);
    });

    // Native-select-like arrow key cycling while the panel is closed.
    trigger.addEventListener('keydown', e => {
      if (openState && openState.trigger === trigger) return;
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const opts = [...select.options];
      if (!opts.length) return;
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      let next = select.selectedIndex;
      for (let i = 0; i < opts.length; i++) {
        next = (next + dir + opts.length) % opts.length;
        if (!opts[next].disabled) break;
      }
      commitSelection(select, trigger, next);
    });

    hookProperty(select, 'value',         () => syncTrigger(select, trigger));
    hookProperty(select, 'selectedIndex', () => syncTrigger(select, trigger));

    // Catches: option lists rebuilt via innerHTML/appendChild, and the
    // `error`/`disabled` class-or-attribute toggles from existing
    // validation code.
    const mo = new MutationObserver(muts => {
      let optsChanged = false, attrChanged = false;
      muts.forEach(m => {
        if (m.type === 'childList') optsChanged = true;
        if (m.type === 'attributes') attrChanged = true;
      });
      if (optsChanged) {
        syncTrigger(select, trigger);
        if (openState && openState.trigger === trigger) buildPanelRows(select, trigger, openState.panel);
      }
      if (attrChanged) syncTrigger(select, trigger);
    });
    mo.observe(select, { attributes: true, attributeFilter: ['class', 'disabled'], childList: true, subtree: true });
  }

  function enhanceAll(root) {
    (root || document).querySelectorAll('select').forEach(enhanceSelect);
  }

  function init() { enhanceAll(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Enhance any <select> added to the page later (e.g. a modal whose
  // body is injected dynamically) without needing to call anything.
  new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.matches && node.matches('select')) enhanceSelect(node);
        else if (node.querySelectorAll) node.querySelectorAll('select').forEach(enhanceSelect);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  window.MASelect = { enhance: enhanceSelect, enhanceAll };
})();
