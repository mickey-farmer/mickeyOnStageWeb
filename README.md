# Mickey Farmer — Actor Website

A custom, cinematic single-page actor site built with HTML, CSS, and JavaScript. No Squarespace, no monthly fees—just a fast, beautiful site that puts your reel and headshots front and center.

## What’s included

- **Hero** — Full-viewport hero with your name and a “Watch Reel” CTA
- **About** — Bio and a second headshot
- **Reel** — Video player with play overlay (use your demo reel)
- **Credits** — Film/TV credits list (edit in `index.html`)
- **Photos** — Headshot gallery
- **Contact** — Email and representation info

**Features:** Scroll-triggered reveal animations, sticky header with blur on scroll, mobile menu, smooth scrolling, film-grain texture, gold accent and dark theme.

## Quick start

1. **Add your assets**  
   Put your images and reel in the `assets/` folder. See `assets/README.md` for exact filenames (`hero.jpg`, `about.jpg`, `reel.mp4`, `headshot-1.jpg` … `headshot-6.jpg`).

2. **Copy your reel**  
   Copy `Mickey_Farmer_Reel.mp4` from your Acting folder into `assets/reel.mp4` (or point the video `src` in `index.html` to your hosted reel URL).

3. **Edit content**  
   Open `index.html` and update:
   - About bio and city/training
   - Credits (duplicate the `.credit-item` block for each project)
   - Contact email and representation
   - Gallery: add/remove `.gallery-item` and set `data-gallery-img` or update `style.css` background-image for each slot

4. **Preview**  
   Open `index.html` in a browser, or run a local server (e.g. `npx serve .` or `python3 -m http.server 8000`) to avoid CORS issues with video.

## Deployment with GitHub Pages

This repo is set up so the **root of the repo** is the site root (e.g. `index.html` at top level). Use it as follows.

### 1. Create the repo on GitHub

- Go to [github.com/new](https://github.com/new).
- Name it whatever you like (e.g. `actor-website` or `mickeyfarmer`).
- Leave it empty (no README, .gitignore, or license).
- Create the repo.

### 2. Push this folder

Open Terminal, go to this folder, then run (replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name):

```bash
cd "/Users/mickeyfarmer/Library/CloudStorage/GoogleDrive-mickeylee6425@gmail.com/My Drive/Acting/actor-website"

git init
git add .
git commit -m "Initial commit: actor website"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

If you already created the repo with a README on GitHub, use:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### 3. Turn on GitHub Pages

- In the repo: **Settings → Pages**.
- Under **Build and deployment**, **Source**: choose **Deploy from a branch**.
- **Branch**: `main`, folder **/ (root)**.
- Save. After a minute or two the site will be at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`.

### 4. Use your custom domain

- In the same **Pages** settings, under **Custom domain**, enter your domain (e.g. `mickeyfarmer.com`).
- Save. GitHub will show you the DNS records to add.
- In **Squarespace** (or wherever the domain is registered): **Settings → Domains → [your domain] → DNS** (or **Advanced**). Add the records GitHub shows (usually an **A** record for the root and a **CNAME** for `www`, or the reverse—follow GitHub’s instructions).
- Back in GitHub Pages settings, enable **Enforce HTTPS** once DNS has propagated.

The site will then be served from your custom domain.

### Video file size

GitHub has a **100 MB per-file** limit. If `assets/reel.mp4` is larger:

1. Add `assets/reel.mp4` to `.gitignore` (uncomment the line there).
2. Host the video on **Vimeo** or **YouTube**, or another host.
3. In `index.html`, replace the `<video>` tag’s `src` with the hosted URL, or use an iframe embed for Vimeo/YouTube.

## Customization

- **Colors** — Edit CSS variables in `css/style.css` (`:root`): `--accent`, `--text`, `--bg`, etc.
- **Fonts** — The site uses Cormorant Garamond (headings) and Outfit (body) from Google Fonts. Change the `<link>` in `index.html` and the `--font-display` / `--font-body` variables in CSS.
- **Sections** — Add or remove sections in `index.html` and add matching styles in `style.css`. Keep `data-reveal` on new blocks for scroll animations.

## File structure

```
actor-website/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── README.md
│   ├── hero.jpg
│   ├── about.jpg
│   ├── reel.mp4
│   └── headshot-1.jpg … headshot-6.jpg
└── README.md
```

You own the code and the design. Tweak it until it feels like you.
