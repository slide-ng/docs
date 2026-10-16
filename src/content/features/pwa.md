---
title: Offline and PWA
description: Store the deck in the browser so it opens without a network.
---

# Offline and PWA

```md
---
pwa: true
---
```

`pwa: true` (or `pwa: build`) makes `slide-ng build` write `manifest.webmanifest` and `sw.js`, a small service worker that stores every file of the build the first time the deck is opened. It also draws install icons, 192 and 512 pixels plus a maskable 512, so the deck can be installed.

- The icon is `public/icon.png`, else `public/icon.svg`, else a local `favicon` file in `public/`, else a generated one: a dark square with the first letter of the title.
- Drawing the icons needs Chromium. Without one the build warns and goes on without icons.
- A label in the bottom right corner says "Available offline" once everything is stored, and "Offline" while the browser has no network.
- Serve it over HTTPS or `localhost`. Browsers only allow service workers there.
- A new build gets a new cache name, so visitors get the new version on their next visit.

**The first visit must be online.** A browser that has never opened the deck cannot get it without a network. For talks with no network, use an [offline folder](../guide/offline.md).
