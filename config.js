/* ============================================================
   EDIT THIS FILE to rebrand the demo for a new salon.
   Name, address, phone, hours, currency, services, prices and
   stylists all flow from here into every page.
   ============================================================ */
window.SITE = {
  id: 'maison-noor',
  name: 'Maison Noor',
  tagline: 'Hair, colour and skin atelier. By appointment.',
  city: 'Dubai',
  phone: '+971 4 388 2140',
  whatsapp: '97143882140', // digits only. Leave '' to confirm by SMS instead (US clients).
  email: 'hello@maisonnoor.ae',
  address: {
    lines: ['Villa 21, Al Wasl Road', 'Jumeirah 1', 'Dubai, United Arab Emirates'],
    street: 'Villa 21, Al Wasl Road, Jumeirah 1',
    region: 'Dubai', postcode: '', country: 'AE',
  },
  social: [{ label: 'Instagram', href: 'https://instagram.com/' }],
  hours: {
    sessions: [{ label: 'Atelier', open: '10:00', close: '22:00' }],
    closedDays: [], // 0 = Sunday … 6 = Saturday
    display: ['Open every day', '10 am to 10 pm'],
  },
  currency: 'AED', // ISO code: AED, KWD, SAR, QAR, USD …
  currencyDigits: 0, // decimals shown: 0 for AED, 3 for KWD, 2 for USD
  locale: 'en-GB', // date style: en-GB (24 October) or en-US (October 24)
  refPrefix: 'MN-',
  schemaType: 'BeautySalon',
  priceRange: '$$$',
  demo: { busy: 38 }, // % of slots shown as already booked

  nav: [
    { href: 'index.html', label: 'Atelier' },
    { href: 'services.html', label: 'Services & prices' },
    { href: 'index.html#stylists', label: 'Stylists' },
  ],
  cta: { href: 'book.html', label: 'Book' },
  /* Logo mark: an arched mirror with the first letter of the name (%I%). */
  logoMark: `<svg class="logo-mark" viewBox="0 0 36 44" aria-hidden="true"><path d="M2 43V19a16 16 0 0 1 32 0v24z" fill="currentColor"/><text x="18" y="36" text-anchor="middle" font-family="'Bodoni Moda',serif" font-style="italic" font-size="23" fill="var(--logo-cut,var(--bg))">%I%</text></svg>`,

  categories: [
    { id: 'hair', name: 'Hair', img: '1562322140-8baeececf3df', blurb: 'Cuts, blow-dries and treatments, finished the way you will actually wear it.' },
    { id: 'colour', name: 'Colour', img: '1522337360788-8b13dee7a37e', blurb: 'From a quiet gloss to a full balayage, mixed for your skin tone and base.' },
    { id: 'skin', name: 'Skin', img: '1570172619644-dfd03ed5d881', blurb: 'Facials built around what your skin needs that week, not a fixed routine.' },
    { id: 'nails', name: 'Nails', img: '1604654894610-df63bc536371', blurb: 'Gel, spa care and hand-painted art. Every tool sterilised between guests.' },
    { id: 'bridal', name: 'Bridal', img: '1487412947147-5cebf100ffc2', blurb: 'A trial first, then hair and makeup on the day, at the atelier or your venue.' },
  ],

  services: [
    { id: 'cut', cat: 'hair', name: 'Signature cut and finish', mins: 60, price: 380, desc: 'Consultation, wash, precision cut and a blow-dry.' },
    { id: 'blowdry', cat: 'hair', name: 'Blow-dry and styling', mins: 45, price: 220, desc: 'Smooth, bouncy or textured, set to last a few days.' },
    { id: 'keratin', cat: 'hair', name: 'Keratin smoothing', mins: 150, price: 1450, desc: 'Cuts frizz and drying time for up to four months.' },
    { id: 'scalp', cat: 'hair', name: 'Scalp ritual', mins: 45, price: 320, desc: 'Exfoliating cleanse, massage and a nourishing mask.' },
    { id: 'global', cat: 'colour', name: 'Global colour', mins: 120, price: 750, desc: 'One even shade from roots to ends, ammonia-free.' },
    { id: 'balayage', cat: 'colour', name: 'Balayage', mins: 180, price: 1650, desc: 'Hand-painted lightening that grows out softly.' },
    { id: 'roots', cat: 'colour', name: 'Root touch-up', mins: 75, price: 420, desc: 'Covers regrowth and greys up to two inches.' },
    { id: 'gloss', cat: 'colour', name: 'Gloss and tone', mins: 45, price: 350, desc: 'Adds shine and corrects brassiness between colours.' },
    { id: 'hydra', cat: 'skin', name: 'Hydra facial', mins: 60, price: 650, desc: 'Deep cleanse, extraction and serum infusion.' },
    { id: 'bright', cat: 'skin', name: 'Brightening facial', mins: 75, price: 550, desc: 'Vitamin C peel and massage for dull or uneven skin.' },
    { id: 'cleanup', cat: 'skin', name: 'Express glow', mins: 40, price: 280, desc: 'A quick reset before an event.' },
    { id: 'gelmani', cat: 'nails', name: 'Gel manicure', mins: 60, price: 190, desc: 'Shape, cuticle care and a chip-free gel colour.' },
    { id: 'pedi', cat: 'nails', name: 'Spa pedicure', mins: 60, price: 220, desc: 'Soak, scrub, mask and massage.' },
    { id: 'nailart', cat: 'nails', name: 'Nail art set', mins: 90, price: 350, desc: 'Hand-painted designs on gel or extensions.' },
    { id: 'trial', cat: 'bridal', name: 'Bridal trial', mins: 120, price: 1200, desc: 'Hair and makeup run-through with photos to compare.' },
    { id: 'bridalday', cat: 'bridal', name: 'Bridal day hair and makeup', mins: 240, price: 4500, desc: 'The full look on the day, with touch-up kit.' },
  ],

  stylists: [
    { id: 'noor', name: 'Noor Haddad', role: 'Founder and creative director', does: ['hair', 'colour', 'bridal'], years: 14 },
    { id: 'julien', name: 'Julien Moreau', role: 'Colour specialist', does: ['colour', 'hair'], years: 11 },
    { id: 'layla', name: 'Layla Mansour', role: 'Skin therapist', does: ['skin'], years: 9 },
    { id: 'hana', name: 'Hana Kim', role: 'Nail artist', does: ['nails'], years: 7 },
    { id: 'sofia', name: 'Sofia Marín', role: 'Bridal and makeup artist', does: ['bridal', 'hair', 'skin'], years: 10 },
  ],

  reviews: [
    { name: 'Mariam A.', rating: 5, date: '2026-10-12', tag: 'Balayage', text: 'Julien asked about my old colour before touching a brush. Three weeks on, it still looks like the photo.' },
    { name: 'Charlotte W.', rating: 5, date: '2026-10-03', tag: 'Bridal', text: 'The trial took the nerves out of the wedding morning. Sofia had every pin planned.' },
    { name: 'Reem K.', rating: 4, date: '2026-09-21', tag: 'Hydra facial', text: 'Calm room, no hard sell on products. Skin felt different for days.' },
    { name: 'Dana F.', rating: 5, date: '2026-09-09', tag: 'Signature cut', text: 'First haircut in years that grew out well. Booking online took a minute.' },
    { name: 'Aisha R.', rating: 5, date: '2026-08-30', tag: 'Gel manicure', text: 'Hana is a perfectionist. Lasted almost four weeks without a chip.' },
  ],
};
