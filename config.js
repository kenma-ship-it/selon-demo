/* ============================================================
   EDIT THIS FILE to rebrand the demo for a new salon.
   Name, address, phone, hours, services, prices and stylists
   all flow from here into every page.
   ============================================================ */
window.SITE = {
  id: 'maison-noor',
  name: 'Maison Noor',
  tagline: 'Hair, colour and skin studio. By appointment.',
  city: 'Bengaluru',
  phone: '+91 98450 12345',
  whatsapp: '919845012345', // country code + number, digits only
  email: 'hello@maisonnoor.in',
  address: {
    lines: ['2nd floor, 640 12th Main Road', 'HAL 2nd Stage, Indiranagar', 'Bengaluru 560038'],
    street: '640 12th Main Road, HAL 2nd Stage, Indiranagar',
    region: 'Karnataka', postcode: '560038', country: 'IN',
  },
  social: [{ label: 'Instagram', href: 'https://instagram.com/' }],
  hours: {
    sessions: [{ label: 'Studio', open: '10:00', close: '20:30' }],
    closedDays: [2], // 0 = Sunday … 6 = Saturday. Closed on Tuesdays.
    display: ['Wednesday to Monday, 10 am to 8:30 pm', 'Closed on Tuesdays'],
  },
  currency: '₹',
  locale: 'en-IN',
  refPrefix: 'MN-',
  schemaType: 'BeautySalon',
  priceRange: '₹₹₹',
  demo: { busy: 38 }, // % of slots shown as already booked

  nav: [
    { href: 'index.html', label: 'Studio' },
    { href: 'services.html', label: 'Services & prices' },
    { href: 'index.html#stylists', label: 'Stylists' },
  ],
  cta: { href: 'book.html', label: 'Book' },

  categories: [
    { id: 'hair', name: 'Hair', img: '1562322140-8baeececf3df', blurb: 'Cuts, blow-dries and treatments, finished the way you will actually wear it.' },
    { id: 'colour', name: 'Colour', img: '1522337360788-8b13dee7a37e', blurb: 'From a quiet gloss to a full balayage, mixed for your skin tone and base.' },
    { id: 'skin', name: 'Skin', img: '1570172619644-dfd03ed5d881', blurb: 'Facials built around what your skin needs that week, not a fixed routine.' },
    { id: 'nails', name: 'Nails', img: '1604654894610-df63bc536371', blurb: 'Gel, spa care and hand-painted art. Every tool sterilised between guests.' },
    { id: 'bridal', name: 'Bridal', img: '1487412947147-5cebf100ffc2', blurb: 'A trial first, then hair and makeup on the day, at the studio or your venue.' },
  ],

  services: [
    { id: 'cut', cat: 'hair', name: 'Signature cut and finish', mins: 60, price: 1800, desc: 'Consultation, wash, precision cut and a blow-dry.' },
    { id: 'blowdry', cat: 'hair', name: 'Blow-dry and styling', mins: 45, price: 1200, desc: 'Smooth, bouncy or textured, set to last a few days.' },
    { id: 'keratin', cat: 'hair', name: 'Keratin smoothing', mins: 150, price: 6500, desc: 'Cuts frizz and drying time for up to four months.' },
    { id: 'scalp', cat: 'hair', name: 'Scalp ritual', mins: 45, price: 1500, desc: 'Exfoliating cleanse, massage and a nourishing mask.' },
    { id: 'global', cat: 'colour', name: 'Global colour', mins: 120, price: 4500, desc: 'One even shade from roots to ends, ammonia-free.' },
    { id: 'balayage', cat: 'colour', name: 'Balayage', mins: 180, price: 8500, desc: 'Hand-painted lightening that grows out softly.' },
    { id: 'roots', cat: 'colour', name: 'Root touch-up', mins: 75, price: 2200, desc: 'Covers regrowth and greys up to two inches.' },
    { id: 'gloss', cat: 'colour', name: 'Gloss and tone', mins: 45, price: 1800, desc: 'Adds shine and corrects brassiness between colours.' },
    { id: 'hydra', cat: 'skin', name: 'Hydra facial', mins: 60, price: 3500, desc: 'Deep cleanse, extraction and serum infusion.' },
    { id: 'bright', cat: 'skin', name: 'Brightening facial', mins: 75, price: 2800, desc: 'Vitamin C peel and massage for dull or uneven skin.' },
    { id: 'cleanup', cat: 'skin', name: 'Express clean-up', mins: 40, price: 1200, desc: 'A quick reset before an event.' },
    { id: 'gelmani', cat: 'nails', name: 'Gel manicure', mins: 60, price: 1400, desc: 'Shape, cuticle care and a chip-free gel colour.' },
    { id: 'pedi', cat: 'nails', name: 'Spa pedicure', mins: 60, price: 1600, desc: 'Soak, scrub, mask and massage.' },
    { id: 'nailart', cat: 'nails', name: 'Nail art set', mins: 90, price: 2400, desc: 'Hand-painted designs on gel or extensions.' },
    { id: 'trial', cat: 'bridal', name: 'Bridal trial', mins: 120, price: 6000, desc: 'Hair and makeup run-through with photos to compare.' },
    { id: 'bridalday', cat: 'bridal', name: 'Bridal day hair and makeup', mins: 240, price: 25000, desc: 'Full look on the day, draping included.' },
  ],

  stylists: [
    { id: 'noor', name: 'Noor Haq', role: 'Founder and creative director', does: ['hair', 'colour', 'bridal'], years: 14 },
    { id: 'arjun', name: 'Arjun Menon', role: 'Colour specialist', does: ['colour', 'hair'], years: 9 },
    { id: 'leela', name: 'Leela Fernandes', role: 'Skin therapist', does: ['skin'], years: 11 },
    { id: 'tanvi', name: 'Tanvi Rao', role: 'Nail artist', does: ['nails'], years: 6 },
    { id: 'meher', name: 'Meher Kaur', role: 'Bridal and makeup artist', does: ['bridal', 'hair', 'skin'], years: 8 },
  ],

  reviews: [
    { name: 'Ananya S.', rating: 5, date: '2026-10-12', tag: 'Balayage', text: 'Arjun asked about my old colour before touching a brush. Three weeks on, it still looks like the photo.' },
    { name: 'Rhea M.', rating: 5, date: '2026-10-03', tag: 'Bridal', text: 'The trial took the nerves out of the wedding morning. Meher had every pin planned.' },
    { name: 'Kavya P.', rating: 4, date: '2026-09-21', tag: 'Hydra facial', text: 'Calm room, no hard sell on products. Skin felt different for days.' },
    { name: 'Farah K.', rating: 5, date: '2026-09-09', tag: 'Signature cut', text: 'First haircut in years that grew out well. Booking online took a minute.' },
    { name: 'Ishita R.', rating: 5, date: '2026-08-30', tag: 'Gel manicure', text: 'Tanvi is a perfectionist. Lasted almost four weeks without a chip.' },
  ],
};
