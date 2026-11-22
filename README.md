# Crave 2.0 — Installable Food Discovery App

Crave is a responsive, installable web app (PWA) for discovering meal ideas, browsing simple recipes, estimating nutrition, saving favorites, and finding nearby restaurants.

## What's included

- Responsive website for desktop, tablet, and mobile
- Installable PWA shell with manifest, icon, and service worker
- Meal discovery with mood, meal, budget, and eating-style filters
- Surprise-me meal picker
- Recipe cards with ingredients, steps, prep time, and estimated macros
- Favorites saved locally in the browser
- Nearby restaurant lookup using OpenStreetMap / Overpass and Nominatim
- Guest-first experience with an account-ready placeholder

## Run it locally

A service worker and PWA installation require localhost or HTTPS. From this folder, run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Publish it

### Option A: Netlify (simple)
1. Create a free account at https://www.netlify.com/
2. Choose **Add new site → Deploy manually**.
3. Drag the contents of this folder (not just the ZIP) into the deploy area.
4. Netlify gives you a public HTTPS URL. You can connect a custom domain in site settings.

### Option B: Vercel
1. Create a free account at https://vercel.com/.
2. Create a new project and import this folder from a GitHub repository.
3. Deploy. No build command is required; the project is static.
4. Add a custom domain in project settings if desired.

## Install on phones

- **iPhone/iPad:** Open the published HTTPS site in Safari → Share → Add to Home Screen.
- **Android:** Open the published HTTPS site in Chrome → use the Install app prompt or browser menu → Install app.
- **Desktop:** Use the install icon in supported browsers, or the browser's install option.

## Important production notes

This is a working starter project, not yet a production-scale commercial service.

- Favorites are stored on the current device using localStorage. Optional sign-in and cross-device syncing require a backend and authentication provider (for example, Supabase or Firebase).
- Restaurant lookup uses public OpenStreetMap services. Results can be incomplete, and public endpoints have usage policies and availability limits. Review their policies and consider a commercial places API or a self-hosted service before significant public traffic.
- Restaurant listings do not currently provide verified live menus, opening hours, ratings, or prices. Those require a data provider and, in some cases, API keys and licensing.
- Nutrition values are illustrative estimates, not medical or dietary advice.
- Food images are loaded from Unsplash image URLs and require an internet connection. Replace or license imagery appropriately before commercial launch.
- The app has no advertising or paid features enabled. Monetization can be added later without changing the guest-first approach.
- Add privacy policy, terms, accessibility review, analytics consent, error monitoring, and security review before a broad public launch.
- For stronger PWA compatibility across all browsers, generate and include 192×192 and 512×512 PNG icons in addition to the SVG icon.

## Project structure

```text
crave-2.0/
  index.html
  styles.css
  app.js
  manifest.webmanifest
  sw.js
  icons/
    icon.svg
  README.md
```

## Suggested next development milestones

1. Connect optional accounts and cloud-synced favorites.
2. Add verified restaurant menus, ratings, opening hours, and links to ordering/reservations.
3. Add richer dietary preferences and ingredient exclusions.
4. Add grocery lists and meal planning.
5. Add privacy-respecting analytics and optional monetization.
6. Package for App Store / Google Play if native-store distribution is desired.
