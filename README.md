# Maison Noor — salon demo

Hair, colour, skin, nails and bridal atelier, set up for Dubai (AED). A premium, multi-page demo site with working booking. Plain HTML, CSS and JavaScript: no build step, no server.

## Rebrand it for a new client

Edit **`config.js`** only. Name, tagline, address, phone, WhatsApp number, email, opening hours, currency (`currency: 'AED' | 'KWD' | 'USD'…` plus `currencyDigits`), date style (`locale`), services, prices, categories, stylists and reviews all flow into every page, the footer, the "open now" status, the booking rules and the search-engine structured data.

Photos are Unsplash demo images referenced by ID in `config.js` and the HTML. Swap them for the client's own photos before going live.

## Pages

| Page | What it does |
| --- | --- |
| `index.html` | Studio home: arched hero, live "next free chair", category list with cursor-trailing photo, stylists, reviews, visit |
| `services.html` | Every service with time and price, sticky category tabs, multi-select then "Book these" |
| `book.html` | 4-step appointment booking: services → stylist (filtered by what they do) → day and time → details. Live summary, booking reference, WhatsApp confirm, .ics calendar invite |

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

To publish: GitHub repo → Settings → Pages → deploy from the `main` branch, root folder.

## How it is built

- `core.js` / `core.css`: shared engine (header, footer, booking steps, day and time pickers, confirmation ticket with a WhatsApp confirmation, or SMS when `whatsapp` is empty, and a calendar invite, reviews, lightbox, toasts, JSON-LD). Same files in all three demo sites.
- `app.js`: this site's page behaviour. `theme.css`: this site's look.
- Cross-page view transitions, one orchestrated entrance per page, `prefers-reduced-motion` respected, keyboard and screen-reader friendly pickers (real radio inputs), mobile first.

## Before going live

- **Bookings and reviews are a demo.** Availability is generated, and bookings, orders and new reviews are saved only in the visitor's browser (`localStorage`). Connect `saveBooking` / the review form in `core.js` to the client's real booking system, WhatsApp Business API or a sheet.
- Replace the demo photos, address, phone and reviews with the client's own.
