# GitHub + Netlify Deployment Guide

Use this guide if you want to keep the website files in GitHub and have Netlify publish the website automatically.

## What You Will Create

- A GitHub repository that stores the website files.
- A Netlify site connected to that GitHub repository.
- A custom domain connection for `metalusscrap.com`.

## Important Recommendation

Put the website files directly in the main folder of the GitHub repository.

Correct:

```text
index.html
privacy.html
terms.html
rate-disclaimer.html
netlify.toml
assets/
data/
```

Avoid this:

```text
metalusscrap-site/
  index.html
  assets/
  data/
```

The first structure is easier because Netlify can publish the repository root directly.

## Step 1. Create a GitHub Account

1. Go to GitHub.
2. Create an account or sign in.
3. Keep your login details somewhere safe.

## Step 2. Create a New GitHub Repository

1. Click the plus button in GitHub.
2. Choose New repository.
3. Repository name: `metal-scrap-uae`
4. Visibility: Public or Private.
5. Do not worry about advanced options.
6. Create the repository.

Public is simpler for free static websites. Private also works with Netlify, but public is easier when you are starting.

## Step 3. Upload the Website Files to GitHub

Beginner-friendly browser method:

1. Open your new GitHub repository.
2. Click Add file.
3. Click Upload files.
4. Open the website folder on your computer.
5. Select all files and folders inside it.
6. Drag them into GitHub.
7. Click Commit changes.

Make sure `index.html` appears on the first page of the repository. If `index.html` is hidden inside another folder, Netlify may not publish the site correctly.

## Step 4. Create a Netlify Account

1. Go to Netlify.
2. Sign up or log in.
3. Choose Continue with GitHub if offered.
4. Allow Netlify to access your GitHub account.

## Step 5. Import the GitHub Repository into Netlify

1. In Netlify, choose Add new site.
2. Choose Import an existing project.
3. Choose GitHub.
4. Select the repository named `metal-scrap-uae`.

Use these settings:

```text
Build command: leave empty
Publish directory: .
```

Then click Deploy.

## Step 6. Test the Temporary Netlify Website

Netlify will give you a temporary website address like:

```text
https://something-random.netlify.app
```

Open it and test:

- Calculator
- Currency conversion
- Rates table
- Request a Scrap Quote form
- FAQ
- Privacy Policy
- Terms
- Rate Disclaimer

## Step 7. Connect Your GoDaddy Domain

1. In Netlify, open your site.
2. Go to Domain management.
3. Add custom domain.
4. Enter `metalusscrap.com`.
5. Netlify will show DNS instructions.
6. Open GoDaddy.
7. Go to your domain DNS settings.
8. Add or update the records exactly as Netlify shows.

Netlify may ask you to point:

- `metalusscrap.com`
- `www.metalusscrap.com`

Follow the values shown inside your own Netlify account, because Netlify will show the exact records for your site.

## Step 8. Wait for the Domain to Start Working

DNS changes are not instant.

It can work in a few minutes, but sometimes it takes several hours.

When ready, test:

```text
https://metalusscrap.com/
https://www.metalusscrap.com/
```

## Step 9. Activate the Quote Form

The website uses FormSubmit to send quote requests to `contact@metalusscrap.com`.

1. Open the live website.
2. Submit a test quote form.
3. Check `contact@metalusscrap.com`.
4. Open the FormSubmit verification email.
5. Click the activation link.
6. Submit another test quote.
7. Confirm the second request arrives.

## Step 10. Update the Website Later

Every future website update follows this pattern:

1. Edit the file in GitHub.
2. Commit the change.
3. Netlify automatically rebuilds and republishes the site.
4. Refresh the live website after Netlify finishes deployment.

To update scrap prices:

1. Open `data/uae-scrap-rates.json` in GitHub.
2. Click the pencil/edit button.
3. Change the AED/kg rates.
4. Update `lastUpdated`.
5. Commit changes.
6. Wait for Netlify to deploy.

## Step 11. Add Google AdSense Later

Do this only after the site is live and has been reviewed or approved by Google AdSense.

1. Open `assets/calculator.js`.
2. Add your AdSense publisher ID in `adsenseClientId`.
3. Add your ad slot IDs in `adsenseSlots`.
4. Commit changes in GitHub.
5. Netlify deploys automatically.
6. Copy `ads.txt.template`.
7. Rename the copy to `ads.txt`.
8. Replace the placeholder publisher ID with your real ID.
9. Commit `ads.txt`.
10. Check `https://metalusscrap.com/ads.txt`.

## Netlify Settings Summary

Use these exact values if the website files are at the root of the GitHub repository:

```text
Framework preset: None or Other
Build command: leave empty
Publish directory: .
Functions directory: leave empty
```

If you accidentally upload the whole folder as a subfolder, then the publish directory would need to be:

```text
outputs/metalusscrap-site
```

That setup is more confusing, so the recommended approach is to upload only the contents of the website folder as the repository root.

