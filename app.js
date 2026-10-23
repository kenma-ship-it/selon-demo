/* Page behaviour for the salon demo. Content comes from config.js. */
(() => {
  const { S, $, $$, esc, money, dayFmt, isOpenDay, slots, dayPicker, timePicker, wizard, ticket, saveBooking, parseIso, longDate, time12, stars, scrollSpy, reduced } = Core;
  const img = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`;
  const dur = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
  const svc = (id) => S.services.find((s) => s.id === id);
  const cat = (id) => S.categories.find((c) => c.id === id);
  const initials = (n) => n.split(' ').map((w) => w[0]).join('');
  const page = document.body.dataset.page;

  /* ---------------- home ---------------- */
  if (page === 'home') {
    const h = $('.hero-name');
    let k = 0;
    h.setAttribute('aria-label', S.name);
    h.innerHTML = `<span aria-hidden="true">${S.name.split(' ').map((w) => `<span class="word">${[...w].map((c) => `<span class="ch" style="--i:${k++}">${esc(c)}</span>`).join('')}</span>`).join(' ')}</span>`;
    const ring = $('[data-ring]');
    ring.textContent = `${S.name}, ${S.address.lines[1].split(',').pop().trim()}, by appointment, `;
    ring.setAttribute('textLength', 486);

    for (let i = 0; i < 10; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const free = isOpenDay(d) && slots(d, { key: 'any' }).find((s) => !s.taken);
      if (!free) continue;
      const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : dayFmt(d, { weekday: 'long' });
      const el = $('[data-next-chair]');
      el.innerHTML = `<span class="pulse" aria-hidden="true"></span>Next free chair ${when} at ${free.label}. <a href="book.html">Take it</a>`;
      el.hidden = false;
      break;
    }

    const list = $('[data-cat-list]');
    list.innerHTML = S.categories.map((c) => {
      const items = S.services.filter((s) => s.cat === c.id);
      return `<li><a class="cat-row" href="services.html#${c.id}" data-img="${img(c.img, 520, 680)}">
        <span class="cat-name">${esc(c.name)}</span>
        <span class="cat-blurb">${esc(c.blurb)}</span>
        <span class="cat-meta">${items.length} services<br>from ${money(Math.min(...items.map((s) => s.price)))}</span>
        <img class="cat-thumb" src="${img(c.img, 240, 240)}" alt="" loading="lazy" width="240" height="240">
      </a></li>`;
    }).join('');

    // A photo trails the cursor across the category list (fine pointers only).
    const peek = $('.cat-peek'), pimg = $('img', peek);
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      S.categories.forEach((c) => { new Image().src = img(c.img, 520, 680); });
      let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0;
      const loop = () => {
        x += (tx - x) * (reduced ? 1 : 0.16); y += (ty - y) * (reduced ? 1 : 0.16);
        peek.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${reduced ? 0 : (tx - x) * 0.04}deg)`;
        raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
      };
      list.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(loop); });
      list.addEventListener('pointerover', (e) => {
        const a = e.target.closest('.cat-row');
        if (!a) return;
        if (!peek.classList.contains('on')) { x = tx = e.clientX; y = ty = e.clientY; loop(); }
        pimg.src = a.dataset.img; peek.classList.add('on');
      });
      list.addEventListener('pointerleave', () => peek.classList.remove('on'));
    }

    $('[data-stylists]').innerHTML = S.stylists.map((p, i) => `
      <li class="stylist" data-reveal style="--i:${i}">
        <div class="arch arch-mono" aria-hidden="true"><span>${esc(initials(p.name))}</span></div>
        <h3>${esc(p.name)}</h3>
        <p class="role">${esc(p.role)}</p>
        <p class="does">${p.does.map((d) => esc(cat(d).name)).join(', ')}. ${p.years} years behind the chair.</p>
        <a class="btn btn-link" href="book.html?stylist=${p.id}">Book with ${esc(p.name.split(' ')[0])}</a>
      </li>`).join('');

    $('[data-quotes]').innerHTML = S.reviews.slice(0, 4).map((r) => `
      <figure class="quote"><blockquote>${esc(r.text)}</blockquote>
        <figcaption>${stars(r.rating)}<span>${esc(r.name)}, ${esc(r.tag)}</span></figcaption></figure>`).join('');

    $('[data-address]').innerHTML = S.address.lines.map(esc).join('<br>');
    $('[data-hours]').innerHTML = S.hours.display.map((x) => `<li>${esc(x)}</li>`).join('');
  }

  /* ---------------- services ---------------- */
  if (page === 'services') {
    $('[data-cat-tabs]').innerHTML = S.categories.map((c) => `<a href="#${c.id}">${esc(c.name)}</a>`).join('');
    $('[data-service-menu]').innerHTML = S.categories.map((c) => `
      <section class="svc-sec" id="${c.id}" aria-labelledby="h-${c.id}">
        <div class="svc-side"><div class="arch"><img src="${img(c.img, 640, 860)}" alt="" loading="lazy" width="640" height="860"></div></div>
        <div class="svc-body">
          <h2 id="h-${c.id}">${esc(c.name)}</h2>
          <p class="svc-blurb">${esc(c.blurb)}</p>
          <ul class="plain svc-list">${S.services.filter((s) => s.cat === c.id).map((s) => `
            <li><label class="svc">
              <input type="checkbox" value="${s.id}"><span class="svc-check" aria-hidden="true"></span>
              <span class="svc-text"><span class="svc-name">${esc(s.name)}</span><span class="svc-desc">${esc(s.desc)}</span></span>
              <span class="svc-dur">${dur(s.mins)}</span><span class="svc-price">${money(s.price)}</span>
            </label></li>`).join('')}
          </ul>
        </div>
      </section>`).join('');
    scrollSpy($('.cat-tabs'));

    const bar = $('[data-pick-bar]');
    $('[data-service-menu]').addEventListener('change', () => {
      const picked = $$('.svc input:checked').map((i) => svc(i.value));
      bar.hidden = !picked.length;
      $('[data-pick-summary]').innerHTML = `<b>${picked.length} ${picked.length === 1 ? 'service' : 'services'}</b> ${dur(picked.reduce((a, s) => a + s.mins, 0))}, ${money(picked.reduce((a, s) => a + s.price, 0))}`;
      $('[data-pick-go]').href = `book.html?s=${picked.map((s) => s.id).join(',')}`;
    });
  }

  /* ---------------- booking ---------------- */
  if (page === 'book') {
    const form = $('#booking');
    const q = new URLSearchParams(location.search);
    const pre = (q.get('s') || '').split(',').filter(svc);
    let preStylist = q.get('stylist');
    const val = (n) => $(`[name="${n}"]:checked`, form)?.value || '';
    const chosen = () => $$('input[name=svc]:checked', form).map((i) => svc(i.value));
    const mins = () => chosen().reduce((a, s) => a + s.mins, 0);
    const total = () => chosen().reduce((a, s) => a + s.price, 0);
    const person = (id) => (id === 'any' ? { id: 'any', name: 'First available' } : S.stylists.find((p) => p.id === id));

    $('[data-svc-picker]').innerHTML = S.categories.map((c) => `
      <div class="svc-group"><p class="svc-group-name">${esc(c.name)}</p>
        ${S.services.filter((s) => s.cat === c.id).map((s) => `
          <label class="opt"><input type="checkbox" name="svc" value="${s.id}"${pre.includes(s.id) ? ' checked' : ''}>
            <span class="opt-box" aria-hidden="true"></span><span class="opt-name">${esc(s.name)}</span>
            <span class="opt-meta">${dur(s.mins)}</span><span class="opt-price">${money(s.price)}</span></label>`).join('')}
      </div>`).join('');

    const renderStylists = () => {
      const need = [...new Set(chosen().map((s) => s.cat))];
      const cur = val('stylist') || preStylist;
      preStylist = null;
      const people = [{ id: 'any', name: 'First available', role: 'Whoever is free first for everything you picked', does: need }, ...S.stylists];
      $('[data-stylist-picker]').innerHTML = people.map((p) => {
        const missing = need.filter((c) => !p.does.includes(c)).map((c) => cat(c).name.toLowerCase());
        const ok = !missing.length;
        return `<label class="opt opt-person${ok ? '' : ' is-off'}">
          <input type="radio" name="stylist" value="${p.id}" required${ok ? '' : ' disabled'}${ok && cur === p.id ? ' checked' : ''}>
          <span class="mono" aria-hidden="true">${p.id === 'any' ? '✦' : esc(initials(p.name))}</span>
          <span class="opt-name">${esc(p.name)}</span>
          <span class="opt-meta">${ok ? esc(p.role) : `Doesn't do ${missing.join(' or ')}`}</span></label>`;
      }).join('');
    };

    const renderTimes = () => {
      const d = val('date');
      if (!d) return;
      const keep = val('time');
      timePicker($('[data-times]'), slots(parseIso(d), { duration: mins(), key: val('stylist') }));
      if (keep) { const t = $(`[name=time][value="${keep}"]:not(:disabled)`, form); if (t) t.checked = true; }
      update();
    };

    let daysReady = false;
    const enterTime = () => {
      if (!daysReady) {
        dayPicker($('[data-days]'), { days: 21, onChange: () => { $('[data-times]').innerHTML = ''; renderTimes(); } });
        const first = $$('[data-days] input:not(:disabled)').find((i) => slots(parseIso(i.value), { duration: mins(), key: val('stylist') }).some((s) => !s.taken));
        if (first) first.checked = true;
        daysReady = true;
      }
      renderTimes();
      $('[data-time-lede]').textContent = `${dur(mins())} with ${person(val('stylist')).name}. Times shown are when you start.`;
    };

    const update = () => {
      const list = chosen();
      const sum = $('[data-sum-list]');
      sum.innerHTML = list.length ? list.map((s) => `<li><span>${esc(s.name)}</span><span>${money(s.price)}</span></li>`).join('') : '<li class="muted">No services yet</li>';
      $('[data-sum-stylist]').textContent = val('stylist') ? person(val('stylist')).name : 'Not chosen';
      const d = val('date'), t = val('time');
      $('[data-sum-when]').textContent = d && t ? `${longDate(parseIso(d))}, ${time12(t)}` : d ? longDate(parseIso(d)) : 'Not chosen';
      $('[data-sum-time]').textContent = dur(mins());
      const tot = $('[data-sum-total]');
      if (tot.textContent !== money(total())) {
        tot.textContent = money(total());
        tot.animate?.([{ transform: 'translateY(-30%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: reduced ? 0 : 350, easing: 'cubic-bezier(.2,.8,.2,1)' });
      }
    };
    form.addEventListener('change', update);

    wizard(form, {
      validate: (i) => (i === 0 && !chosen().length ? 'Choose at least one service.' : ''),
      onEnter: (i) => { if (i === 1) renderStylists(); if (i === 2) enterTime(); update(); },
      onSubmit: (fd) => {
        const day = val('date'), t = val('time'), st = val('stylist');
        const start = parseIso(day);
        start.setHours(...t.split(':').map(Number));
        saveBooking({ date: day, time: t, key: st });
        form.hidden = true;
        $('[data-step-nav]').hidden = true;
        ticket($('[data-confirm]'), {
          heading: `You're booked, ${fd.get('name').trim().split(' ')[0]}.`,
          note: `Your chair is held for ${dur(mins())}. Arrive five minutes early so we can talk through the look.`,
          start, minutes: mins(), title: `${S.name}: ${chosen().map((s) => s.name).join(', ')}`,
          rows: [
            ['Services', chosen().map((s) => s.name).join(', ')],
            ['Stylist', person(st).name],
            ['When', `${longDate(start)}, ${time12(t)}`],
            ['Total, pay at the studio', money(total())],
          ],
          again: 'Book another appointment',
        });
      },
    });
    update();
  }
})();
