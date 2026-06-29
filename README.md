# Metal Scrap UAE Website

Static website for `https://metalusscrap.com/` with a UAE scrap metal calculator, currency conversion, request-a-quote form, SEO metadata, FAQ content, privacy/terms pages, rate disclaimer, and ad-ready placements.

For non-technical launch instructions, open `BEGINNER-SETUP-GUIDE.md`.

For your GitHub + Netlify setup, open `GITHUB-NETLIFY-DEPLOYMENT.md`.

## Files to upload

Upload the contents of this folder to the root of the live website, usually `public_html` or the root folder provided by your GoDaddy hosting plan.

Important files:

- `index.html`: main website and calculator
- `assets/calculator.js`: calculator, currency API, form estimate summary, and optional AdSense loader
- `data/uae-scrap-rates.json`: editable AED/kg scrap rates
- `privacy.html`, `terms.html`, and `rate-disclaimer.html`: policy pages useful for visitors and ad review
- `robots.txt` and `sitemap.xml`: crawler files
- `netlify.toml`: Netlify publish and header settings
- `GITHUB-NETLIFY-DEPLOYMENT.md`: beginner-friendly GitHub and Netlify deployment steps
- `ads.txt.template`: copy to `ads.txt` after you receive a Google AdSense publisher ID

## Free APIs and services

- Currency conversion: `https://api.frankfurter.dev/v2/rates?base=AED&quotes=USD,EUR,GBP,INR,PKR,SAR,QAR,KWD,OMR`
- Form forwarding: `https://formsubmit.co/contact@metalusscrap.com`

The first FormSubmit message from the live domain usually requires one-time email verification from `contact@metalusscrap.com`.

## Updating scrap rates

Edit `data/uae-scrap-rates.json`. Rates are AED per kg for `clean`, `mixed`, and `low` grade material. The website fetches this file on load, so replacing the JSON updates the public calculator without changing HTML.

## Enabling Google AdSense

After Google approves the site:

1. Open `assets/calculator.js`.
2. Set `adsenseClientId` to your real value, for example `ca-pub-1234567890123456`.
3. Add the ad slot IDs from your AdSense account inside `adsenseSlots`.
4. Copy `ads.txt.template` to `ads.txt`.
5. Replace `pub-0000000000000000` with your publisher ID.
6. Upload `ads.txt` to the site root so it is available at `https://metalusscrap.com/ads.txt`.

## Notes before launch

- The scrap rates included here are indicative starter values, not guaranteed live UAE purchase prices.
- For true live UAE scrap rates, connect `data/uae-scrap-rates.json` to a daily manual update process, a spreadsheet export, or a later backend/admin panel.
- Submit the domain to Google Search Console after launch.
- Add Google Analytics or another privacy-friendly analytics tool only after updating the privacy policy if needed.
