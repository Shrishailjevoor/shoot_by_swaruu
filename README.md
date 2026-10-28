
# Shoot by Swaruu — Cinematic Reel Studio

A responsive static website for a mobile filmmaking and short-form
content studio.

The visual direction uses a near-black background, violet-blue ambient
lighting, glassmorphism cards, a creative-workspace preview, connected
service cards and cinematic portfolio imagery.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts
- WhatsApp click-to-chat
- Vercel static hosting

No frontend framework or build command is required.

## Project structure

```text
shoot_by_swaruu/
├── index.html
├── README.md
├── css/
│   └── styles.css
└── js/
    ├── main.js
    └── animations.js
```

## Features

- Dark futuristic visual design
- Violet-blue glassmorphism
- Mobile filmmaking hero section
- Responsive mobile navigation
- Creative-workspace interface preview
- Connected services diagram
- Filterable portfolio gallery
- Wedding, car delivery, brand, event and food categories
- Pricing packages
- Booking form and AM/PM time selector
- Future-date restriction
- Add-on price estimates
- Optional Google Maps link
- WhatsApp booking request
- Scroll-reveal animations
- Active section navigation
- Reduced-motion support
- Responsive mobile booking dialog

## Run locally

1. Open the project folder in Visual Studio Code.
2. Check that the CSS and JS files are in the correct locations.
3. Open `index.html` using Live Server.
4. Test the mobile navigation, portfolio filters and package buttons.
5. Test the booking form and WhatsApp request.
6. Check the layout at 320px, 360px, 390px and 430px viewport widths.

The site can also open directly in a browser, although Live Server is
recommended during development.

## WhatsApp number

In `js/main.js`, locate:

```javascript
const STUDIO_WHATSAPP = "918310873925";
```

Use the correct international country code followed by the studio
phone number, without spaces or punctuation.

Update the contact links in `index.html` as well if the number changes.

## Edit package prices

Package options and their prices are defined in `index.html`.
Update both the package cards and the booking form when changing a price.

The estimate adds the configured add-on amounts. Hourly services are
estimated as one hour until the duration is confirmed with the client.

The estimate is not a final quotation.

## Portfolio images

The current images are examples loaded from external photo providers.
Replace them with your own approved client work before presenting them
as your portfolio.

For best results:

- Use images you own or have permission to use.
- Compress large images before deployment.
- Prefer WebP or AVIF when suitable.
- Keep the original aspect ratio or crop intentionally.
- Write meaningful alt text for informative images.
- Test image loading on mobile connections.

External photographs and Google Fonts require an internet connection.

## Booking workflow

The form creates a WhatsApp message with the customer's selected package,
contact details, date, time, location and optional notes.

The customer must review and send the message in WhatsApp.
The form does not save bookings in a database or automatically email
the details.

A booking is not confirmed until the studio confirms availability,
the final quote and the agreed payment terms.

## Deploy on Vercel

1. Push the project to your GitHub repository.
2. Open the Vercel project connected to that repository.
3. Ensure the root directory contains `index.html`.
4. Use the static site configuration; a build command is not required.
5. Deploy the project and open the production URL.
6. Test the live site after deployment.

If GitHub is connected to Vercel, pushing to the configured production
branch should initiate a new deployment.

## Before publishing

- Confirm the studio WhatsApp number.
- Confirm every package and add-on price.
- Replace the sample portfolio photographs.
- Test the WhatsApp booking message on a phone.
- Check the page on a narrow mobile viewport.
- Verify remote images and fonts load.
- Test the production website after deployment.

## License and assets

The source code is intended for Shoot by Swaruu.
Check the relevant usage terms for third-party photos, fonts and assets.
