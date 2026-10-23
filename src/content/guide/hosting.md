---
title: Hosting
description: Build a static site and host it on GitHub Pages, Netlify, Vercel or nginx.
---

# Hosting

`slide-ng build` writes a static site: plain files that any web server can hand out. No Node is needed to serve it.

```sh
slide-ng build                       # ./dist, served at /
slide-ng build --base /talk/         # for https://you.github.io/talk/
slide-ng build --out public-html     # another output folder
slide-ng build --download            # also writes the PDF and adds the download button
slide-ng build --without-notes       # speaker notes are not shipped
slide-ng build --offline             # a folder that opens from disk
slide-ng build a.md b.md --base /x/  # several decks: dist/a at /x/a/, dist/b at /x/b/
```

## Safe output folders

The build empties its output folder. To make sure it never wipes something of yours, it only does so when the folder is new, empty, or has a `.slide-ng-build` file written by an earlier build. Any other folder with files in it is refused. The current folder, your home folder and `/` are always refused.

## Several decks

With several entries each deck is built in turn into its own folder of `--out`, named after its file without `.md`, and served under that name below `--base`, as Slidev's multiple builds. The rest of `--out` is emptied, so it holds only these folders. Each folder is a whole site with its own `404.html` and `_redirects`. A host that serves one folder per site needs one site per deck, or a rule that sends `/x/a/*` to `/x/a/index.html`. With a deck at the root as well, the rule of each deck under the sub-path must come before the root's catch-all.

Decks on one origin, such as these folders or the project sites of one GitHub Pages user, keep to themselves: the windows that follow each other, the drawings and the settings kept in the browser belong to the deck's base path. Only dark mode is shared. A deck at `/` keeps the names of 1.x; settings that a deck under a sub-path saved with 1.x are not read.

## What is in the build

| File | What for |
| --- | --- |
| `index.html`, `main-*.js`, `chunk-*.js`, `styles-*.css` | The app. Monaco, Mermaid and the like are separate chunks, fetched only when a slide uses them. |
| `inline-*.js` | The inline scripts of `index.html`, as files, see [Content-Security-Policy](#content-security-policy). |
| `404.html` | A copy of `index.html`. GitHub Pages shows it for unknown paths, so `/talk/3` opens the app. |
| `_redirects` | The same rule for Netlify. |
| `<exportFilename>.pdf` | Only with `--download` or `download: true`. With `download: true` alone, a build without a working Chromium warns and leaves it out. |
| `og-image.png` | The link preview picture, see [Page head and SEO](../features/seo-meta.md). |
| `remote-assets/` | Remote pictures that were downloaded, see [Bundle remote assets](../features/remote-assets.md). |
| `media/` | Font files for KaTeX and for web fonts with `fonts.selfHost`. |
| `_local/` | Pictures next to `slides.md` that slides name with a relative address, see [Directory structure](../customize/directory-structure.md#pictures-next-to-the-deck). |
| `sw.js`, `manifest.webmanifest` | Offline support, `pwa: true`. |

## Addresses and the base path

The deck lives at the base. Every slide is `<base><number>` in history mode, the default, or `<base>#/<number>` with `routerMode: hash`.

- History mode needs the host to answer unknown paths with `index.html`. `404.html`, `_redirects` and the examples below do that.
- Hash mode needs nothing from the host. Use it where you cannot change the server, such as a plain file share.
- Memory mode, `routerMode: memory`, never changes the address, for a kiosk or a deck inside another page. See [Slide addresses](../features/routing.md#memory-mode).
- `--router-mode` picks the mode for one build, without changing the headmatter.
- `--base` is a path such as `/talk/`, not a full address. Build for the prefix you will serve under.

## GitHub Pages

```yaml
# .github/workflows/pages.yml
name: Deploy slides
on:
  push: { branches: [main] }
permissions: { pages: write, id-token: write, contents: read }
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.deployment.outputs.page_url }}' }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx slide-ng build --base /${{ github.event.repository.name }}/
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
      - id: deployment
        uses: actions/deploy-pages@v4
```

For a user site (`you.github.io`) use `--base /`. If you use `--download` or `seoMeta.ogImage: auto`, the runner also needs a Chromium.

## Netlify

The build contains `_redirects`. Or use `netlify.toml`:

```toml
[build]
  command = "npx slide-ng build"
  publish = "dist"
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Vercel

```json
{
  "buildCommand": "npx slide-ng build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## nginx

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  location / {
    try_files $uri $uri/ /index.html;       # history mode: unknown paths are deck addresses
  }
  location = /sw.js {
    add_header Cache-Control "no-cache";    # the offline worker must be checked for updates
  }
}
```

Under a sub-path build with `--base /talk/`, put the files in `/usr/share/nginx/html/talk/` and use `try_files $uri $uri/ /talk/index.html;`.

## Content-Security-Policy

`index.html` has no inline script. The few lines Angular adds there, and the inline scripts of the deck's own [`index.html`](../features/seo-meta.md#your-own-index-html), are written to `inline-*.js` files next to it. A `type="module"` script stays a module, and other attributes such as `data-cfasync="false"` are kept. Data blocks (`application/ld+json`) stay inline. An inline import map or `speculationrules` cannot be a file, so the build leaves it and warns. A host that sends a strict policy therefore runs the deck, as long as styles may be inline:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:
```

Add what the slides load from elsewhere: `img-src https:` for remote pictures, `frame-src` for `<slide-ng-youtube>` and other frames, `font-src` and `style-src` for a web font provider. Only `slide-ng build` moves the scripts, not `--offline`. Trusted Types are not supported: with them Mermaid diagrams are not drawn.

## Embedding the deck in another page

A built deck works in an `<iframe>`. Give the frame `allow="fullscreen"`, or the fullscreen button is left out:

```html
<iframe src="https://you.github.io/talk/" allow="fullscreen" width="960" height="540"></iframe>
```

The wake lock, which keeps the screen from going to sleep, is on by default. In a frame the deck asks for it only once the reader clicks, taps or presses a key in the deck, or makes it full screen, so a reader who only scrolls past it is not kept awake. To let an embedded deck keep the screen awake, add `screen-wake-lock` to `allow`. For a deck that is mostly shown embedded, `wakeLock: false` in the headmatter turns it off.

A host that sends `frame-ancestors` or `X-Frame-Options` must allow the page that embeds the deck. `routerMode: memory` keeps the address of a deck in a frame unchanged.

## Size

A deck without heavy features is about 450 kB at startup, about 110 kB compressed. Decks that use Monaco or KaTeX add their style sheets to that. Every slide is in the first bundle, and highlighted code compiles to a lot of markup, so a long workshop with code on every slide can pass 3 MB. The build warns above 6 MB at startup and fails only above 100 MB. Monaco, Mermaid and Magic Move are lazy chunks and do not count.
