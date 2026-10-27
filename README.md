# Shoot by Swaruu — Cinematic Reel Studio

A responsive, static front-end for **Shoot by Swaruu**, styled to follow the supplied two-page PDF: black and deep-red cinematic branding, lens-inspired logo, dramatic hero, portfolio grid, red-accented packages, add-on services, and booking/travel policies.

## Project structure

```text
shoot-by-swaruu-refactor/
├── index.html          # Page content and semantic structure
├── css/
│   └── styles.css      # Theme, layout, responsive styles and CSS animation
├── js/
│   ├── main.js         # Navigation, booking form, WhatsApp and accordion
│   └── animations.js   # Scroll reveal, hover tilt and pointer interactions
└── README.md
```

## Run locally in VS Code

1. Extract this folder.
2. Open the folder in VS Code.
3. Install the **Live Server** extension if needed.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Use browser responsive mode or a real phone to test mobile navigation, booking form and touch interactions.

No build step or npm packages are required.

## Where to edit

- **Text, sections, services and package details:** `index.html`
- **Brand colours, layout, typography and animation speed:** `css/styles.css`, near the top in `:root` for the main tokens
- **Booking form, WhatsApp hand-off, mobile navigation and accordion:** `js/main.js`
- **Scroll reveal, hero pointer tilt and package hover tilt:** `js/animations.js`

## Visual and price reference

Package and add-on prices are aligned to the supplied PDF:

- 1 reel: ₹2,000
- 2 reels: ₹3,800 (save ₹200)
- 3 reels: ₹5,500 (save ₹500)
- 5 reels: ₹8,900 (save ₹1,100)
- Additional reel: ₹1,800
- Extra shoot hour: ₹900/hour
- Urgent delivery (within 4 hours): ₹500
- iPhone photography: ₹1,500/hour
- Editing services: from ₹1,500
- Additional revision: ₹200/revision
- Travel: ₹200 for 0–15 km; ₹300 above 15 km; toll/parking extra

Review package prices, policies and contact details before production deployment.

## Booking behavior / limitations

The form validates the required fields and opens a WhatsApp-ready booking message to +91 83108 73925. It does **not** save enquiries to a database, verify availability, accept payments, or reserve a shoot date. A confirmed booking still requires direct studio confirmation and the 50% advance noted in the reference PDF.

## Images

Remote sample images are used to preview the composition. Replace them with licensed studio photographs and your own completed client work before publishing. Remote images and Google Fonts require an internet connection. No images are bundled locally.

## Mobile and accessibility notes

- Navigation becomes a touch-friendly menu at tablet/mobile widths.
- Booking is accessible from a fixed mobile call-to-action.
- Package cards use a single-column layout on narrow screens for readability.
- Form controls have touch-friendly heights and the booking panel becomes a bottom sheet on phones.
- Scroll/hover motion respects `prefers-reduced-motion`; essential content does not depend on hovering.
