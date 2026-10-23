/* Shared engine for the demo sites. Business details live in config.js (window.SITE);
   page behaviour lives in app.js. Nothing here needs a build step or a server. */
(() => {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const get = (path) => path.split('.').reduce((o, k) => o?.[k], S);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- storage (per-browser demo data) ---------- */
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(`${S.id}:${k}`)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(`${S.id}:${k}`, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  /* ---------- formatting ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  // Currency from config: AED / KWD / USD …, with the decimals that currency uses (KWD 3, USD 2, AED 0).
  const moneyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: S.currency, minimumFractionDigits: S.currencyDigits ?? 0, maximumFractionDigits: S.currencyDigits ?? 0 });
  const money = (n) => moneyFmt.format(n);
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const fromMin = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  const time12 = (t) => {
    let [h, m] = t.split(':').map(Number);
    const ap = h >= 12 && h < 24 ? 'pm' : 'am';
    h = h % 12 || 12;
    return m ? `${h}:${pad(m)} ${ap}` : `${h} ${ap}`;
  };
  const dayFmt = (d, o) => d.toLocaleDateString(S.locale, o);
  const longDate = (d) => dayFmt(d, { weekday: 'long', day: 'numeric', month: 'long' });
  const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) % 100; };
  const ref = () => S.refPrefix + Math.random().toString(36).slice(2, 7).toUpperCase();

  /* ---------- hours ---------- */
  const isOpenDay = (d) => !S.hours.closedDays.includes(d.getDay());

  function openStatus(now = new Date()) {
    const mins = now.getHours() * 60 + now.getMinutes();
    if (isOpenDay(now)) {
      for (const s of S.hours.sessions) {
        if (mins >= toMin(s.open) && mins < toMin(s.close)) return { open: true, text: `Open now, until ${time12(s.close)}` };
      }
    }
    for (let i = 0; i < 8; i++) {
      const d = new Date(now); d.setDate(d.getDate() + i);
      if (!isOpenDay(d)) continue;
      const s = S.hours.sessions.find((x) => i > 0 || toMin(x.open) > mins);
      if (s) {
        const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : dayFmt(d, { weekday: 'long' });
        return { open: false, text: `Closed now, opens ${when} at ${time12(s.open)}` };
      }
    }
    return { open: false, text: 'Closed' };
  }

  /* Demo availability: a stable share of slots shows as booked, plus anything booked in this browser.
     ponytail: replace with the business's real calendar when going live. */
  function slots(date, { step = 30, duration = 30, key = '' } = {}) {
    if (!isOpenDay(date)) return [];
    const day = iso(date), now = new Date();
    const cutoff = iso(now) === day ? now.getHours() * 60 + now.getMinutes() + 30 : -1;
    const mine = store.get('bookings', []).filter((b) => b.date === day && b.key === key).map((b) => b.time);
    const out = [];
    for (const s of S.hours.sessions) {
      for (let m = toMin(s.open); m + duration <= toMin(s.close); m += step) {
        if (m < cutoff) continue;
        const t = fromMin(m);
        out.push({ time: t, label: time12(t), session: s.label, taken: hash(day + t + key) < S.demo.busy || mine.includes(t) });
      }
    }
    return out;
  }

  /* ---------- pickers ---------- */
  function dayPicker(el, { days = 14, name = 'date', onChange } = {}) {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    el.innerHTML = Array.from({ length: days }, (_, i) => {
      const d = new Date(start); d.setDate(d.getDate() + i);
      const closed = !isOpenDay(d);
      return `<label class="day${closed ? ' is-closed' : ''}">
        <input type="radio" name="${name}" value="${iso(d)}" required${closed ? ' disabled' : ''}>
        <span>${i === 0 ? 'Today' : i === 1 ? 'Tmrw' : dayFmt(d, { weekday: 'short' })}</span>
        <b>${d.getDate()}</b><small>${closed ? 'Closed' : dayFmt(d, { month: 'short' })}</small>
        <span class="sr-only">${longDate(d)}${closed ? ', closed' : ''}</span></label>`;
    }).join('');
    el.addEventListener('change', (e) => e.target.name === name && onChange?.(e.target.value));
  }

  function timePicker(el, list, name = 'time') {
    if (!list.length) { el.innerHTML = '<p class="empty">No times left on this day. Pick another day.</p>'; return; }
    const sessions = [...new Set(list.map((s) => s.session))];
    el.innerHTML = sessions.map((sn) => `<div class="times-group">
      ${sessions.length > 1 ? `<p class="times-label">${esc(sn)}</p>` : ''}
      <div class="times">${list.filter((s) => s.session === sn).map((s) => `
        <label class="time${s.taken ? ' is-taken' : ''}"><input type="radio" name="${name}" value="${s.time}" required${s.taken ? ' disabled' : ''}>
        <span>${s.label}</span>${s.taken ? '<span class="sr-only"> (booked)</span>' : ''}</label>`).join('')}
      </div></div>`).join('');
  }

  /* ---------- multi-step booking form ---------- */
  function wizard(form, { onEnter, validate, onSubmit } = {}) {
    const root = form.closest('[data-wizard]') || form;
    const steps = $$('.step', form);
    const nav = $$('[data-step-nav] li', root);
    let i = 0;

    const show = (n, animate = true) => {
      const swap = () => {
        steps.forEach((s, k) => { s.hidden = k !== n; });
        nav.forEach((li, k) => {
          li.toggleAttribute('data-done', k < n);
          if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
        });
        i = n;
        onEnter?.(n, steps[n]);
        const h = $('.step-title', steps[n]);
        h?.setAttribute('tabindex', '-1');
        if (animate) h?.focus({ preventScroll: true });
      };
      if (!animate) return swap();
      if (document.startViewTransition && !reduced) document.startViewTransition(swap); else swap();
      const top = root.getBoundingClientRect().top;
      if (top < 0) root.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    };

    const check = () => {
      const err = $('.step-error', steps[i]);
      const custom = validate?.(i, steps[i]);
      const bad = $$('input,select,textarea', steps[i]).find((f) => !f.disabled && !f.checkValidity());
      let msg = custom || '';
      if (!msg && bad) {
        if (bad.type === 'radio' || bad.type === 'checkbox') msg = bad.closest('[data-msg]')?.dataset.msg || 'Choose an option to continue.';
        else { bad.reportValidity(); bad.focus(); return false; }
      }
      if (err) err.textContent = msg;
      return !msg;
    };

    form.addEventListener('click', (e) => {
      if (e.target.closest('[data-next]') && check()) show(i + 1);
      if (e.target.closest('[data-back]')) show(i - 1);
    });
    form.addEventListener('change', () => { const err = $('.step-error', steps[i]); if (err) err.textContent = ''; });
    nav.forEach((li, k) => li.addEventListener('click', () => { if (k < i) show(k); }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!check()) return;
      if (i < steps.length - 1) return show(i + 1);
      onSubmit?.(new FormData(form));
    });
    show(0, false);
    return { show, get index() { return i; } };
  }

  /* ---------- confirmation ticket ---------- */
  function ics({ title, start, minutes, details }) {
    const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const end = new Date(start.getTime() + minutes * 60000);
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${S.name}//Booking//EN`, 'BEGIN:VEVENT',
      `UID:${Date.now()}@${S.id}`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
      `SUMMARY:${title}`, `LOCATION:${S.address.lines.join(', ')}`, `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    return URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
  }

  // Gulf clients confirm on WhatsApp; leave whatsapp empty in config (US) and it falls back to SMS.
  const tel = S.phone.replace(/[^+\d]/g, '');
  const confirmLink = (text) => (S.whatsapp
    ? `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}`
    : `sms:${tel}?&body=${encodeURIComponent(text)}`);

  function ticket(el, { heading, note, start, minutes, rows, title, again = 'Make another booking' }) {
    const code = ref();
    const summary = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
    el.innerHTML = `
      <div class="ticket" role="status">
        <div class="ticket-top">
          <svg class="tick" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg>
          <h2 class="step-title" tabindex="-1">${esc(heading)}</h2>
          <p>${esc(note)}</p>
        </div>
        <dl class="ticket-rows">
          <div><dt>Booking reference</dt><dd class="ref">${code}</dd></div>
          ${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        <div class="ticket-actions">
          <a class="btn btn-primary" href="${confirmLink(`Hi ${S.name}, confirming booking ${code}.\n${summary}`)}" target="_blank" rel="noopener">${S.whatsapp ? 'Confirm on WhatsApp' : 'Text us to confirm'}</a>
          <a class="btn btn-ghost" href="${ics({ title, start, minutes, details: `${code}\n${summary}` })}" download="${S.id}-${code}.ics">Add to calendar</a>
          <a class="btn btn-link" href="${location.pathname.split('/').pop() || 'index.html'}">${esc(again)}</a>
        </div>
      </div>`;
    el.hidden = false;
    $('.step-title', el).focus({ preventScroll: true });
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    return code;
  }

  function saveBooking(b) { store.set('bookings', [...store.get('bookings', []), b]); }

  /* ---------- toast ---------- */
  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* ---------- reviews ---------- */
  const stars = (n) => `<span class="stars" aria-label="${n} out of 5 stars">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>`;

  function reviews(root, seed, { tags = [] } = {}) {
    let filter = 0, sort = 'new';
    const all = () => [...store.get('reviews', []), ...seed];
    const list = $('[data-review-list]', root), summary = $('[data-review-summary]', root);

    const render = () => {
      const items = all();
      const avg = items.reduce((a, r) => a + r.rating, 0) / items.length;
      summary.innerHTML = `
        <p class="avg"><b>${avg.toFixed(1)}</b>${stars(Math.round(avg))}<span>${items.length} reviews</span></p>
        <div class="bars">${[5, 4, 3, 2, 1].map((n) => {
          const c = items.filter((r) => r.rating === n).length;
          return `<button type="button" class="bar" aria-pressed="${filter === n}" data-n="${n}">
            <span>${n} ★</span><i style="--w:${(c / items.length) * 100}%"></i><span>${c}</span>
            <span class="sr-only">Show only ${n} star reviews</span></button>`;
        }).join('')}</div>
        ${filter ? '<button type="button" class="btn btn-link" data-clear>Show all reviews</button>' : ''}`;
      const shown = items.filter((r) => !filter || r.rating === filter)
        .sort((a, b) => sort === 'top' ? b.rating - a.rating : new Date(b.date) - new Date(a.date));
      list.innerHTML = shown.map((r) => `
        <li class="review${r.mine ? ' is-new' : ''}">
          <div class="review-head"><span class="avatar" aria-hidden="true">${esc(r.name.trim()[0] || '?')}</span>
            <div><p class="review-name">${esc(r.name)}</p><p class="review-meta">${dayFmt(new Date(r.date), { day: 'numeric', month: 'short', year: 'numeric' })}${r.tag ? `, ${esc(r.tag)}` : ''}</p></div>
            ${stars(r.rating)}</div>
          <p>${esc(r.text)}</p>
        </li>`).join('') || '<li class="empty">No reviews with this rating yet.</li>';
    };

    root.addEventListener('click', (e) => {
      const b = e.target.closest('.bar');
      if (b) { filter = filter === +b.dataset.n ? 0 : +b.dataset.n; render(); }
      if (e.target.closest('[data-clear]')) { filter = 0; render(); }
    });
    $('[data-review-sort]', root)?.addEventListener('change', (e) => { sort = e.target.value; render(); });

    const form = $('[data-review-form]', root);
    if (form) {
      const tagSel = $('select[name=tag]', form);
      if (tagSel) tagSel.innerHTML += tags.map((t) => `<option>${esc(t)}</option>`).join('');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const f = new FormData(form);
        const err = $('.step-error', form);
        const bad = $$('input:not([type=radio]),select,textarea', form).find((x) => !x.checkValidity());
        if (bad) { bad.reportValidity(); bad.focus(); return; }
        if (!f.get('rating')) { err.textContent = 'Choose a star rating.'; return; }
        err.textContent = '';
        store.set('reviews', [{ name: f.get('name').trim(), rating: +f.get('rating'), text: f.get('text').trim(), tag: f.get('tag') || '', date: new Date().toISOString(), mine: true }, ...store.get('reviews', [])]);
        form.reset(); filter = 0; sort = 'new'; render();
        toast('Review posted. Thank you.');
        list.firstElementChild?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      });
    }
    render();
    return { stars };
  }

  /* ---------- gallery lightbox (native <dialog>) ---------- */
  function lightbox(container) {
    const links = $$('a[data-full]', container);
    if (!links.length) return;
    const dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.innerHTML = `<figure><img alt=""><figcaption></figcaption></figure>
      <button class="lb-btn lb-prev" type="button" aria-label="Previous photo">‹</button>
      <button class="lb-btn lb-next" type="button" aria-label="Next photo">›</button>
      <button class="lb-btn lb-close" type="button" aria-label="Close">×</button>`;
    document.body.append(dlg);
    let at = 0;
    const open = (n) => {
      at = (n + links.length) % links.length;
      const a = links[at], img = $('img', dlg);
      const go = () => { img.src = a.dataset.full; img.alt = $('img', a).alt; $('figcaption', dlg).textContent = `${a.dataset.caption || ''}  ${at + 1} / ${links.length}`; };
      if (dlg.open && document.startViewTransition && !reduced) document.startViewTransition(go); else go();
      if (!dlg.open) dlg.showModal();
    };
    links.forEach((a, n) => a.addEventListener('click', (e) => { e.preventDefault(); open(n); }));
    $('.lb-prev', dlg).onclick = () => open(at - 1);
    $('.lb-next', dlg).onclick = () => open(at + 1);
    $('.lb-close', dlg).onclick = () => dlg.close();
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') open(at - 1); if (e.key === 'ArrowRight') open(at + 1); });
  }

  /* ---------- sticky section nav with scroll-spy ---------- */
  function scrollSpy(nav) {
    const links = $$('a[href^="#"]', nav);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.toggleAttribute('aria-current', l.hash === `#${en.target.id}`));
        const cur = links.find((l) => l.hash === `#${en.target.id}`);
        cur?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced ? 'auto' : 'smooth' });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((l) => { const t = $(l.hash); if (t) io.observe(t); });
  }

  /* ---------- page chrome ---------- */
  function chrome() {
    // ?embed renders a page without header and footer, for live previews inside another page.
    if (new URLSearchParams(location.search).has('embed')) document.documentElement.classList.add('embed');
    document.title = document.title ? `${document.title} | ${S.name}` : S.name;
    const page = location.pathname.split('/').pop() || 'index.html';
    document.body.insertAdjacentHTML('afterbegin', `
      <a class="skip" href="#main">Skip to content</a>
      <header class="site-head"><div class="wrap head-row">
        <a class="brand" href="index.html" aria-label="${esc(S.name)}, home">${S.logo || esc(S.name)}</a>
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">Menu</span><i aria-hidden="true"></i></button>
        <nav id="site-nav" aria-label="Main"><ul>
          ${S.nav.map((n) => `<li><a href="${n.href}"${n.href === page ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}
        </ul></nav>
        <a class="btn btn-primary head-cta" href="${S.cta.href}">${esc(S.cta.label)}</a>
      </div></header>`);
    const btn = $('.menu-btn'), head = $('.site-head');
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open); head.classList.toggle('nav-open', open);
    });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && head.classList.contains('nav-open')) { btn.click(); btn.focus(); } });
    const onScroll = () => head.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    const a = S.address;
    document.body.insertAdjacentHTML('beforeend', `
      <footer class="site-foot"><div class="wrap foot-grid">
        <div class="foot-brand"><p class="foot-name">${S.logo || esc(S.name)}</p><p>${esc(S.tagline)}</p></div>
        <div><h2>Visit</h2><address>${a.lines.map(esc).join('<br>')}</address>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${S.name} ${a.lines.join(' ')}`)}" target="_blank" rel="noopener">Get directions</a></div>
        <div><h2>Hours</h2><ul class="plain">${S.hours.display.map((h) => `<li>${esc(h)}</li>`).join('')}</ul><p class="status" data-open-status></p></div>
        <div><h2>Contact</h2><ul class="plain">
          <li><a href="tel:${tel}">${esc(S.phone)}</a></li>
          ${S.whatsapp ? `<li><a href="https://wa.me/${S.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a></li>` : ''}
          ${S.email ? `<li><a href="mailto:${S.email}">${esc(S.email)}</a></li>` : ''}
          ${(S.social || []).map((s) => `<li><a href="${s.href}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}
        </ul></div>
      </div><div class="wrap foot-base"><p>© ${new Date().getFullYear()} ${esc(S.name)}, ${esc(S.city)}</p></div></footer>`);

    const st = openStatus();
    $$('[data-open-status]').forEach((el) => { el.textContent = st.text; el.dataset.open = st.open; });
    $$('[data-s]').forEach((el) => { const v = get(el.dataset.s); if (v != null) el.textContent = v; });
    $$('[data-tel]').forEach((el) => { el.href = `tel:${tel}`; });

    // Structured data for search engines and AI answer engines.
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': S.schemaType, name: S.name, description: S.tagline,
      telephone: S.phone, email: S.email || undefined, url: location.origin + location.pathname.replace(/[^/]*$/, ''),
      address: { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: S.city, addressRegion: a.region, postalCode: a.postcode, addressCountry: a.country },
      openingHoursSpecification: S.hours.sessions.map((s) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].filter((_, k) => !S.hours.closedDays.includes(k)),
        opens: s.open, closes: s.close,
      })),
      priceRange: S.priceRange, ...(S.schemaExtra || {}),
    });
    document.head.append(ld);

    // One reveal pass for elements that opt in; everything is visible without JS.
    if (!reduced && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
      $$('[data-reveal]').forEach((el) => { el.classList.add('pre'); io.observe(el); });
    }
  }

  window.Core = { S, $, $$, esc, store, hash, money, iso, parseIso, toMin, time12, dayFmt, longDate, openStatus, isOpenDay, slots, dayPicker, timePicker, wizard, ticket, saveBooking, toast, reviews, stars, lightbox, scrollSpy, reduced };
  chrome();
})();
