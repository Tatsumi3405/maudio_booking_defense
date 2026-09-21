/* ══════════════════════════════════════════════════════════════
   MA CALENDAR — themed date & date-range picker
   Vanilla JS, zero dependencies. One class powers both:
     • mode: 'single'  → Event Date field on the Booking page
     • mode: 'range'   → Financial Reports range filter (Admin)

   USAGE (single date):
     const cal = new MACalendar({
       trigger: document.getElementById('eventDateTrigger'),
       textEl:  document.getElementById('eventDateText'),
       hiddenInput: document.getElementById('eventDate'),
       mode: 'single',
       minDate: new Date(),                // disable past days
       getDayMeta: async (date) => ({...}) // optional availability dots
     });

   USAGE (range, e.g. Financial Reports):
     const cal = new MACalendar({
       trigger: document.getElementById('fpRangeTrigger'),
       textEl:  document.getElementById('fpRangeText'),
       mode: 'range',
       presets: MACalendar.defaultPresets(),
       onChange: ({start, end, presetLabel}) => { ... reload report ... }
     });
   ══════════════════════════════════════════════════════════════ */

(function (global) {
  const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const MON = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function toISO(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fromISO(s) { if (!s) return null; const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); }
  function sameDay(a, b) { return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
  function stripTime(d) { const c = new Date(d); c.setHours(0,0,0,0); return c; }
  function fmtLong(d) { return MON[d.getMonth()].slice(0,3) + ' ' + d.getDate() + ', ' + d.getFullYear(); }
  function fmtShort(d) { return MON[d.getMonth()].slice(0,3) + ' ' + d.getDate(); }

  class MACalendar {
    constructor(opts) {
      this.o = Object.assign({
        mode: 'single',
        minDate: null,
        maxDate: null,
        value: null,
        rangeValue: null,
        presets: null,
        getDayMeta: null,
        onChange: null,
        placeholder: 'Select date',
      }, opts);

      this.trigger = this.o.trigger;
      this.textEl  = this.o.textEl || this.trigger;
      this.hidden  = this.o.hiddenInput || null;

      this.isRange = this.o.mode === 'range';
      this.selected = this.o.value ? fromISO(this.o.value) : null;
      this.rangeStart = this.o.rangeValue?.start ? new Date(this.o.rangeValue.start) : null;
      this.rangeEnd   = this.o.rangeValue?.end   ? new Date(this.o.rangeValue.end)   : null;
      this.pickingEnd = false;
      this.activePresetKey = this.o.rangeValue?.presetKey || (this.isRange ? 'this_year' : null);

      const anchor = this.rangeStart || this.selected || new Date();
      this.viewYear  = anchor.getFullYear();
      this.viewMonth = anchor.getMonth();

      this._dayMetaCache = new Map();
      this._panel = null;
      this._open = false;
      this._onDocClick = this._onDocClick.bind(this);
      this._onKeydown = this._onKeydown.bind(this);
      this._onReposition = () => { if (this._open) this._position(); };

      this.trigger.classList.add('ma-cal-trigger');
      this.trigger.setAttribute('type', 'button');
      this.trigger.addEventListener('click', (e) => { e.stopPropagation(); this.toggle(); });

      this._renderTriggerText();
    }

    static defaultPresets() {
      const today = stripTime(new Date());
      const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth   = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
      return [
        { key: 'this_month', label: 'This Month', range: () => [startOfMonth(today), endOfMonth(today)] },
        { key: 'this_year',  label: 'This Year',  range: () => [new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 11, 31)] },
        { key: 'last_30',    label: 'Last 30 Days', range: () => { const s = new Date(today); s.setDate(s.getDate() - 29); return [s, today]; } },
        { key: 'all_time',   label: 'All Time', range: () => [new Date(2020, 0, 1), today] },
        { key: 'custom',     label: 'Custom Range', custom: true },
      ];
    }

    /* ── public API ─────────────────────────────────────── */
    open() {
      if (this._open) return;
      this._open = true;
      this.trigger.classList.add('open');
      if (!this._panel) this._build();
      this._renderMonths();
      document.body.appendChild(this._panel);
      this._position();
      requestAnimationFrame(() => this._panel.classList.add('ma-cal-open'));
      document.addEventListener('mousedown', this._onDocClick, true);
      document.addEventListener('keydown', this._onKeydown, true);
      window.addEventListener('resize', this._onReposition);
      window.addEventListener('scroll', this._onReposition, true);
    }
    close() {
      if (!this._open) return;
      this._open = false;
      this.trigger.classList.remove('open');
      if (this._panel) {
        this._panel.classList.remove('ma-cal-open');
        setTimeout(() => { if (!this._open && this._panel?.parentNode) this._panel.parentNode.removeChild(this._panel); }, 150);
      }
      document.removeEventListener('mousedown', this._onDocClick, true);
      document.removeEventListener('keydown', this._onKeydown, true);
      window.removeEventListener('resize', this._onReposition);
      window.removeEventListener('scroll', this._onReposition, true);
    }
    toggle() { this._open ? this.close() : this.open(); }

    getValue() { return this.isRange
      ? { start: this.rangeStart ? toISO(this.rangeStart) : null, end: this.rangeEnd ? toISO(this.rangeEnd) : null, presetKey: this.activePresetKey }
      : (this.selected ? toISO(this.selected) : null);
    }
    setError(has) { this.trigger.classList.toggle('error', !!has); }

    /* ── internals ──────────────────────────────────────── */
    _onDocClick(e) {
      if (this._panel && (this._panel.contains(e.target) || this.trigger.contains(e.target))) return;
      this.close();
    }
    _onKeydown(e) { if (e.key === 'Escape') this.close(); }

    _position() {
      const r = this.trigger.getBoundingClientRect();
      const pw = this._panel.offsetWidth || 260;
      const ph = this._panel.offsetHeight || 320;
      let top = r.bottom + 8;
      let left = r.left;
      if (top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 8);
      if (left + pw > window.innerWidth - 8) left = Math.max(8, window.innerWidth - pw - 8);
      this._panel.style.top = top + 'px';
      this._panel.style.left = left + 'px';
    }

    _renderTriggerText() {
      let label = this.o.placeholder;
      let isPlaceholder = true;
      if (this.isRange) {
        if (this.rangeStart && this.rangeEnd) {
          const preset = (this.o.presets || []).find(p => p.key === this.activePresetKey && !p.custom);
          label = preset ? preset.label : (fmtShort(this.rangeStart) + ' – ' + fmtShort(this.rangeEnd) + ', ' + this.rangeEnd.getFullYear());
          isPlaceholder = false;
        }
      } else if (this.selected) {
        label = fmtLong(this.selected);
        isPlaceholder = false;
      }
      if (this.textEl) {
        this.textEl.textContent = label;
        this.textEl.classList.toggle('placeholder', isPlaceholder);
      }
    }

    _build() {
      const panel = document.createElement('div');
      panel.className = 'ma-cal-panel' + (this.isRange ? ' ma-cal-range' : '');

      if (this.isRange) {
        const presetsWrap = document.createElement('div');
        presetsWrap.className = 'ma-cal-presets';
        (this.o.presets || MACalendar.defaultPresets()).forEach((p) => {
          const item = document.createElement('div');
          item.className = 'ma-cal-preset' + (this.activePresetKey === p.key ? ' active' : '');
          item.textContent = p.label;
          item.addEventListener('click', () => this._selectPreset(p, item, presetsWrap));
          presetsWrap.appendChild(item);
        });
        panel.appendChild(presetsWrap);
      }

      const body = document.createElement('div');

      const monthsWrap = document.createElement('div');
      monthsWrap.className = 'ma-cal-months';
      body.appendChild(monthsWrap);
      this._monthsWrap = monthsWrap;

      const footer = document.createElement('div');
      footer.className = 'ma-cal-footer';

      const legend = document.createElement('div');
      legend.className = 'ma-cal-legend';
      if (this.o.getDayMeta) {
        legend.innerHTML = '<span><i class="partial"></i>Partially booked</span><span><i class="full"></i>Fully booked</span>';
      } else if (this.isRange) {
        legend.className = 'ma-cal-range-readout';
        this._readoutEl = legend;
      }
      footer.appendChild(legend);

      const actions = document.createElement('div');
      actions.className = 'ma-cal-actions';
      if (this.isRange) {
        const cancel = document.createElement('button');
        cancel.className = 'ma-cal-btn'; cancel.textContent = 'Cancel'; cancel.type = 'button';
        cancel.addEventListener('click', () => this.close());
        const apply = document.createElement('button');
        apply.className = 'ma-cal-btn primary'; apply.textContent = 'Apply'; apply.type = 'button';
        apply.addEventListener('click', () => { this._commit(); this.close(); });
        this._applyBtn = apply;
        actions.appendChild(cancel); actions.appendChild(apply);
      } else {
        const today = document.createElement('button');
        today.className = 'ma-cal-btn'; today.textContent = 'Today'; today.type = 'button';
        today.addEventListener('click', () => { const t = stripTime(new Date()); this._pickSingle(t); });
        actions.appendChild(today);
      }
      footer.appendChild(actions);
      body.appendChild(footer);

      panel.appendChild(body);
      this._panel = panel;
      this._updateReadout();
    }

    _selectPreset(p, itemEl, wrap) {
      wrap.querySelectorAll('.ma-cal-preset').forEach(el => el.classList.remove('active'));
      itemEl.classList.add('active');
      this.activePresetKey = p.key;
      if (p.custom) { this._renderMonths(); return; }
      const [s, e] = p.range();
      this.rangeStart = stripTime(s); this.rangeEnd = stripTime(e);
      this._renderMonths();
      this._commit();
      this.close();
    }

    _monthGridHTML(year, month) {
      const first = new Date(year, month, 1);
      const startOffset = first.getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const cells = [];
      for (let i = 0; i < startOffset; i++) {
        const d = new Date(year, month, 1 - (startOffset - i));
        cells.push({ date: d, other: true });
      }
      for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(year, month, d), other: false });
      while (cells.length % 7 !== 0 || cells.length < 42) {
        const last = cells[cells.length - 1].date;
        const d = new Date(last); d.setDate(d.getDate() + 1);
        cells.push({ date: d, other: true });
        if (cells.length >= 42) break;
      }
      return cells;
    }

    _renderMonths() {
      const wrap = this._monthsWrap;
      wrap.innerHTML = '';
      const count = this.isRange && window.innerWidth > 640 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        wrap.appendChild(this._buildMonth(this.viewYear, this.viewMonth + i, i === 0, i === count - 1));
      }
    }

    _buildMonth(year, month, showPrev, showNext) {
      // normalize month overflow
      const d = new Date(year, month, 1);
      year = d.getFullYear(); month = d.getMonth();

      const wrap = document.createElement('div');
      wrap.className = 'ma-cal-month';

      const head = document.createElement('div');
      head.className = 'ma-cal-head';
      const prevBtn = document.createElement('button');
      prevBtn.className = 'ma-cal-nav'; prevBtn.type = 'button';
      prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>';
      prevBtn.addEventListener('click', () => { this.viewMonth--; if (this.viewMonth < 0) { this.viewMonth = 11; this.viewYear--; } this._renderMonths(); });

      const nextBtn = document.createElement('button');
      nextBtn.className = 'ma-cal-nav'; nextBtn.type = 'button';
      nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>';
      nextBtn.addEventListener('click', () => { this.viewMonth++; if (this.viewMonth > 11) { this.viewMonth = 0; this.viewYear++; } this._renderMonths(); });

      const title = document.createElement('div');
      title.className = 'ma-cal-title';
      title.innerHTML = MON[month] + ' <span class="yr">' + year + '</span>';

      head.appendChild(showPrev ? prevBtn : this._spacer());
      head.appendChild(title);
      head.appendChild(showNext ? nextBtn : this._spacer());
      wrap.appendChild(head);

      const wd = document.createElement('div');
      wd.className = 'ma-cal-weekdays';
      DOW.forEach(w => { const s = document.createElement('span'); s.textContent = w[0]; wd.appendChild(s); });
      wrap.appendChild(wd);

      const grid = document.createElement('div');
      grid.className = 'ma-cal-grid';
      const cells = this._monthGridHTML(year, month);
      const today = stripTime(new Date());
      const min = this.o.minDate ? stripTime(this.o.minDate) : null;
      const max = this.o.maxDate ? stripTime(this.o.maxDate) : null;

      cells.forEach(({ date, other }) => {
        const cell = document.createElement('div');
        cell.className = 'ma-cal-day';
        cell.textContent = date.getDate();
        if (other) cell.classList.add('other-month');
        if (sameDay(date, today)) cell.classList.add('today');

        const disabled = (min && date < min) || (max && date > max);
        if (disabled) cell.classList.add('disabled');

        if (!this.isRange && this.selected && sameDay(date, this.selected)) cell.classList.add('selected');
        if (this.isRange && this.rangeStart && this.rangeEnd) {
          if (sameDay(date, this.rangeStart)) cell.classList.add('range-start');
          if (sameDay(date, this.rangeEnd)) cell.classList.add('range-end');
          if (date > this.rangeStart && date < this.rangeEnd) cell.classList.add('in-range');
        } else if (this.isRange && this.rangeStart && sameDay(date, this.rangeStart)) {
          cell.classList.add('range-start');
        }

        if (!other && !disabled) {
          cell.addEventListener('click', () => {
            if (this.isRange) this._pickRangeDay(date); else this._pickSingle(date);
          });
          if (this.o.getDayMeta) this._applyMeta(cell, date);
        }
        grid.appendChild(cell);
      });
      wrap.appendChild(grid);
      return wrap;
    }

    _spacer() { const s = document.createElement('div'); s.className = 'ma-cal-nav-spacer'; return s; }

    async _applyMeta(cell, date) {
      const key = toISO(date);
      let meta = this._dayMetaCache.get(key);
      if (meta === undefined) {
        try { meta = await this.o.getDayMeta(date); } catch { meta = null; }
        this._dayMetaCache.set(key, meta);
      }
      if (!meta) return;
      if (meta.status === 'full') {
        cell.classList.add('disabled');
        cell.title = meta.label || 'Fully booked';
        const dot = document.createElement('span'); dot.className = 'dot full'; cell.appendChild(dot);
      } else if (meta.status === 'partial') {
        cell.title = meta.label || 'Partially booked';
        const dot = document.createElement('span'); dot.className = 'dot partial'; cell.appendChild(dot);
      }
    }

    _pickSingle(date) {
      this.selected = stripTime(date);
      if (this.hidden) this.hidden.value = toISO(this.selected);
      this.setError(false);
      this._renderTriggerText();
      if (this.o.onChange) this.o.onChange(toISO(this.selected));
      if (this.hidden) this.hidden.dispatchEvent(new Event('change', { bubbles: true }));
      this.close();
    }

    _pickRangeDay(date) {
      date = stripTime(date);
      if (!this.rangeStart || (this.rangeStart && this.rangeEnd)) {
        this.rangeStart = date; this.rangeEnd = null;
      } else if (date < this.rangeStart) {
        this.rangeEnd = this.rangeStart; this.rangeStart = date;
      } else {
        this.rangeEnd = date;
      }
      this.activePresetKey = 'custom';
      const wrap = this._panel.querySelector('.ma-cal-presets');
      if (wrap) wrap.querySelectorAll('.ma-cal-preset').forEach(el => el.classList.toggle('active', el.textContent === 'Custom Range'));
      this._renderMonths();
      this._updateReadout();
    }

    _updateReadout() {
      if (!this.isRange || !this._readoutEl) return;
      if (this.rangeStart && this.rangeEnd) {
        this._readoutEl.innerHTML = fmtShort(this.rangeStart) + ', ' + this.rangeStart.getFullYear() +
          '<span class="sep">→</span>' + fmtShort(this.rangeEnd) + ', ' + this.rangeEnd.getFullYear();
      } else if (this.rangeStart) {
        this._readoutEl.innerHTML = fmtShort(this.rangeStart) + ', ' + this.rangeStart.getFullYear() + '<span class="sep">→ …</span>';
      } else {
        this._readoutEl.textContent = 'Select a start and end date';
      }
      if (this._applyBtn) this._applyBtn.disabled = !(this.rangeStart && this.rangeEnd);
    }

    _commit() {
      this._renderTriggerText();
      if (this.o.onChange) {
        this.o.onChange({
          start: this.rangeStart ? toISO(this.rangeStart) : null,
          end: this.rangeEnd ? toISO(this.rangeEnd) : null,
          presetKey: this.activePresetKey,
        });
      }
    }
  }

  MACalendar.toISO = toISO;
  MACalendar.fromISO = fromISO;
  global.MACalendar = MACalendar;
})(window);