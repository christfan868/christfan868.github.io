# Cornerstone — one-page website

A black-led website for **Cornerstone Advisory Group**, with champagne gold and muted teal accents. The Three.js background begins with three small shopfronts, then grows into an illuminated business district and skyline.

The website is plain HTML, CSS, and JavaScript. Three.js and the font are included locally. There is no package installation, build step, backend, analytics, or external runtime dependency.

## Publish with GitHub Pages

1. Extract this ZIP.
2. Create a GitHub repository, or open the repository you want to use.
3. Upload the **contents** of this folder to the repository's root on the `main` branch. `index.html` must be at the root, beside `assets/` and `site-config.js`; do not upload only the ZIP or an enclosing folder.
4. Open the repository's **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select **main** and **/(root)**, then click **Save**.
7. GitHub will show the published website address on that page after deployment completes.

All asset references are relative, so the site works at both a user-domain root and a repository subpath. The included `.nojekyll` file tells GitHub Pages to serve the static files directly. If your upload method omits it, add an empty file named `.nojekyll` at the repository root.

Official GitHub instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Add your contact email

Open `site-config.js` and set `contactEmail` to Cornerstone's public email address. You can also edit the subject line.

When a valid email is present:

- The navigation and closing calls to action become **Let's talk** email links.
- The email address appears below the closing button.
- Clicking a link opens the visitor's email application. There is no server-side enquiry form.

The default configuration is blank because a business contact email was not supplied. Until you add one, those buttons link to the page's expertise and approach sections. The website does not claim to send or collect enquiries.

## Edit the website

| File | What to change |
| --- | --- |
| `index.html` | Page copy, services, headings, navigation, search and sharing metadata |
| `site-config.js` | Public business contact email and enquiry subject |
| `assets/styles.css` | Colours, layout, typography, and mobile rules |
| `assets/main.js` | Navigation, contact links, and animation loading |
| `assets/empire.js` | Three.js buildings, materials, lighting, and growth sequence |
| `assets/favicon.svg` | Cornerstone's geometric browser icon |

The proposed copy positions Cornerstone around growth strategy, business operations, and technology. No client names, testimonials, revenue claims, or case-study results are included.

The colour variables at the top of `assets/styles.css` are:

| Role | Colour |
| --- | --- |
| Primary black | `#080909` |
| Champagne gold | `#d8b870` |
| Muted teal | `#79b9ab` |
| Main text | `#f0f0e9` |

## Preview on your computer

The accompanying **Cornerstone.html** is a self-contained preview: open it directly in a current browser. It embeds the same page, font, and animation. Use the editable files in this ZIP for ongoing changes; changes to them do not update the standalone preview automatically.

From the extracted folder, run:

```sh
python -m http.server 8080
```

Then open http://localhost:8080 in a current browser. On some systems the command is `python3` instead of `python`.

Use a local server or GitHub Pages to preview the animation. Opening `index.html` directly with a `file://` address can prevent JavaScript modules from loading.

## Animation and accessibility

- A roughly 36-second repeating journey progresses through Foundation, Momentum, and Empire. A brief fade resets the cycle.
- The three stage buttons jump to a still view of that stage. Press Play to continue the journey.
- The pause button stops the motion. The animation also stops when the page is hidden or the hero leaves the viewport.
- Visitors who prefer reduced motion see a still skyline initially and can choose to play the scene.
- Touch and lower-power devices use a lower rendering resolution and frame-rate cap.
- The background uses WebGL 2 through Three.js r170. The text and navigation remain usable when rendering is unavailable.
- The page includes semantic landmarks, visible keyboard focus, a skip link, mobile navigation, and responsive layouts.

## Included third-party assets

- **Three.js 0.170.0**, MIT licence: `assets/vendor/LICENSE-three.txt`. Source: https://github.com/mrdoob/three.js/tree/r170
- **Manrope**, SIL Open Font License 1.1: `assets/fonts/OFL-Manrope.txt`. Source: https://github.com/google/fonts/tree/main/ofl/manrope

Both assets are self-hosted. Keep their licence files when redistributing the website.

The website package was checked for JavaScript syntax and local file/anchor references. It has not been deployed to your GitHub account or tested in a live browser in this session.
