# Beginner Setup Guide for Metal Scrap UAE

This guide assumes you already own `metalusscrap.com` at GoDaddy and do not have website development experience.

## 1. Understand What You Have

The website is inside this folder. The important thing is to upload the contents of the folder, not the folder itself.

Main files:

- `index.html`: the main homepage, calculator, FAQ, and Request a Scrap Quote form.
- `privacy.html`: privacy policy.
- `terms.html`: website terms.
- `rate-disclaimer.html`: explains that scrap rates are estimates.
- `data/uae-scrap-rates.json`: the scrap prices used by the calculator.
- `assets/calculator.js`: calculator logic, currency conversion, and future AdSense setup.
- `ads.txt.template`: a template you will use after Google AdSense gives you a publisher ID.
- `GITHUB-NETLIFY-DEPLOYMENT.md`: the exact guide to use if you are publishing with GitHub and Netlify.

## 2. Choose Where the Website Will Live

Owning a domain is not always the same as owning hosting.

If you already bought GoDaddy hosting, use GoDaddy hosting and upload the files there.

If you only bought the domain and do not want to pay for hosting yet, use a free static website host such as Netlify, then connect your GoDaddy domain to that host.

For your chosen setup, use `GITHUB-NETLIFY-DEPLOYMENT.md` and upload the website files to GitHub first.

## 3. Upload the Website on GoDaddy Hosting

Use this path only if you have a GoDaddy hosting plan.

1. Log in to GoDaddy.
2. Open your hosting product.
3. Open File Manager.
4. Look for a folder usually called `public_html`, `www`, or the domain root.
5. Open the website folder on your computer.
6. Upload everything inside the website folder into the GoDaddy root folder.
7. Make sure `index.html` is directly in the root folder, not inside another folder.
8. Visit `https://metalusscrap.com/`.
9. Test the calculator, FAQ, Privacy Policy, Terms, and Rate Disclaimer links.

## 4. Upload the Website on a Free Static Host

Use this path if you do not have hosting and want to avoid monthly hosting cost.

1. Create an account with Cloudflare Pages, Netlify, or GitHub Pages.
2. Create a new site/project.
3. Upload the contents of this website folder.
4. The service will give you a temporary website URL.
5. Test the calculator on that temporary URL.
6. In that hosting service, add your custom domain `metalusscrap.com`.
7. The host will show DNS records to add at GoDaddy.
8. Log in to GoDaddy.
9. Open DNS settings for `metalusscrap.com`.
10. Add or update the records exactly as the host tells you.
11. Wait for DNS to update. This can take a few minutes, but sometimes it takes several hours.
12. Visit `https://metalusscrap.com/` and test again.

## 5. Activate the Quote Form

The form uses FormSubmit so you do not need to pay for a backend server.

1. Upload the site first.
2. Open `https://metalusscrap.com/`.
3. Scroll to Request a Scrap Quote.
4. Submit a test quote using your own details.
5. FormSubmit should send a verification email to `contact@metalusscrap.com`.
6. Open that email and click the activation link.
7. Submit a second test quote.
8. Confirm it arrives at `contact@metalusscrap.com`.

## 6. Update Scrap Rates

The current scrap rates are starter guide rates only.

1. Open `data/uae-scrap-rates.json`.
2. Change the AED/kg values for each metal and grade.
3. Update the `lastUpdated` date.
4. Upload the changed file back to the website.
5. Refresh the website and check the rates table.

## 7. Prepare for Google AdSense

Google Ads and Google AdSense are different.

Google Ads is for paying Google to advertise your business.

Google AdSense is for earning money by showing Google ads on your website.

Before applying for AdSense:

1. Make sure the website is live on `https://metalusscrap.com/`.
2. Make sure all links work.
3. Make sure the calculator works.
4. Make sure the Request a Scrap Quote form works.
5. Keep the FAQ, Privacy Policy, Terms, and Rate Disclaimer pages visible.
6. Do not show empty pages or broken sections.
7. Do not copy large amounts of content from other websites.
8. Add real, useful scrap metal information over time to improve approval chances.

## 8. Apply for AdSense

1. Go to Google AdSense.
2. Create or sign in to your AdSense account.
3. Add `metalusscrap.com` as your site.
4. Google will give you code to place on the site.
5. After approval, create ad units inside AdSense.
6. Copy your publisher ID and ad slot IDs.
7. Open `assets/calculator.js`.
8. Put your publisher ID in `adsenseClientId`.
9. Put each ad slot ID in `adsenseSlots`.
10. Upload the updated file.

## 9. Add ads.txt After AdSense Gives You a Publisher ID

Do this after AdSense gives you your real publisher ID.

1. Copy `ads.txt.template`.
2. Rename the copy to `ads.txt`.
3. Replace `pub-0000000000000000` with your real AdSense publisher ID.
4. Upload `ads.txt` to the website root.
5. Visit `https://metalusscrap.com/ads.txt`.
6. Confirm the file opens in the browser.

## 10. Submit the Website to Google Search Console

1. Go to Google Search Console.
2. Add `metalusscrap.com`.
3. Follow Google's verification steps.
4. Submit this sitemap: `https://metalusscrap.com/sitemap.xml`.
5. Wait for Google to crawl the site.

## 11. Test Before Sharing

Check these pages:

- `https://metalusscrap.com/`
- `https://metalusscrap.com/privacy.html`
- `https://metalusscrap.com/terms.html`
- `https://metalusscrap.com/rate-disclaimer.html`
- `https://metalusscrap.com/sitemap.xml`

Check these actions:

- Calculator works in AED and another currency.
- Unit changes work for grams, kilograms, and tonnes.
- Clean, mixed, and low grade rates calculate differently.
- Quote form sends to `contact@metalusscrap.com`.
- Mobile view looks clean.
