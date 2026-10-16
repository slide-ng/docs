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
```

## Safe output folders

The build empties its output folder. To make sure it never wipes something of yours, it only does so when the folder is new, empty, or has a `.slide-ng-build` file written by an earlier build. Any other folder with files in it is refused. The current folder, your home folder and `/` are always refused.

## What is in the build

| File | What for |
| --- | --- |
| `index.html`, `main-*.js`, `chunk-*.js`, `styles-*.css` | The app. Monaco, Mermaid and the like are separate chunks, fetched only when a slide uses them. |
| `404.html` | A copy of `index.html`. GitHub Pages shows it for unknown paths, so `/talk/3` opens the app. |
| `_redirects` | The same rule for Netlify. |
| `<exportFilename>.pdf` | Only with `--download` or `download: true`. |
| `og-image.png` | The link preview picture, see [Page head and SEO](../features/seo-meta.md). |
| `remote-assets/` | Remote pictures that were downloaded, see [Bundle remote assets](../features/remote-assets.md). |
| `media/` | Font files for KaTeX and for web fonts with `fonts.selfHost`. |
| `sw.js`, `manifest.webmanifest` | Offline support, `pwa: true`. |

## Addresses and the base path

The deck lives at the base. Every slide is `<base><number>` in history mode, the default, or `<base>#/<number>` with `routerMode: hash`.

- History mode needs the host to answer unknown paths with `index.html`. `404.html`, `_redirects` and the examples below do that.
- Hash mode needs nothing from the host. Use it where you cannot change the server, such as a plain file share.
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

## Size

A deck without heavy features is about 450 kB at startup, about 110 kB compressed. Decks that use Monaco or KaTeX add their style sheets to that. The build warns above 1.5 MB at startup and fails above 3 MB. Monaco, Mermaid and Magic Move are lazy chunks and do not count.
