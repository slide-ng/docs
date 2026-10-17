---
title: Presenting offline
description: Three ways to carry a deck into a room with no internet, and a checklist for the day before.
---

# Presenting offline

There are three ways to carry a deck into a room with no network. Pick one and rehearse it on the machine you will present from. "Tested" on this page always means Chromium, the engine of Chrome and Edge.

| | Works with no network | Needs a first visit online | Needs a server | Opens by double click |
| --- | --- | --- | --- | --- |
| Offline folder, `slide-ng build --offline` | yes | no | no | yes |
| PWA, `pwa: true` in a normal build | yes, after one visit | yes | yes (HTTPS or `localhost`) | no |
| PDF, `slide-ng export` | yes | no | no | yes |

## Option 1: an offline folder

```sh
slide-ng build --offline --out talk-offline      # add --download to put the PDF in the folder too
```

Copy `talk-offline` to the presenting machine, or to a USB stick, and open `talk-offline/index.html` in Chrome or Edge. No server, no install.

What the flag does:

- One classic script holds the app and all its lazy chunks (Mermaid, Monaco, KaTeX). Chromium does not run module scripts or `import()` from `file://`, so a normal build shows a blank page there.
- Addresses are relative and there is no `<base>`, so the folder works from any place on disk. The slide is after a `#`, as in `index.html#/3`, and `routerMode` is forced to `hash`.
- There is no service worker, because browsers do not allow one on `file://`. `pwa` is ignored.
- Pictures from other servers are downloaded into the folder, unless the deck says `remoteAssets: false`.
- Web fonts are downloaded into the folder, unless the deck says `fonts: { selfHost: false }`.
- Monaco's workers are stored as text and started from blobs.
- Files of `public/` written with a leading slash in slides (`![](/photo.png)`) are found next to the page. That does not work for `url(/photo.png)` in a slide's `<style>`, which cannot be rewritten, and the build warns. Use an inline `style="background-image: url(/photo.png)"` or an `<img>`, which are rewritten.

Things to know:

- All lazy code is in one file, so a deck with Monaco and Mermaid is a large script. A deck without them is about 450 kB.
- The PDF button opens `<exportFilename>.pdf` in a new tab. Save it from the PDF viewer.
- Presenter and audience windows sync with a `BroadcastChannel`. They must be windows of the same browser profile, opened from the same folder: the presenter at `index.html#/presenter/1`, the audience at `index.html#/1`.
- Not offline by nature: PlantUML, `<slide-ng-youtube>`, `<slide-ng-tweet>`, `<slide-ng-blue-sky>`, and any picture or font that could not be downloaded at build time. The build warns with `could not download` lines.

## Option 2: a PWA

`pwa: true` makes the build write a manifest, install icons and `sw.js`, a service worker that stores every file of the deck the first time it is opened. A label in the corner says "Available offline" when everything is stored.

The limit: a browser that has never opened the deck cannot get it without a network. The first visit must be online. A new profile, a private window, cleared site data, or another computer starts from nothing. So open the deck once on the presenting machine, in the profile you will use, wait for the label, turn the network off, reload, and check that it opens. Do this the evening before.

## Option 3: a PDF

```sh
slide-ng export --format pdf --with-clicks        # one page per click step
```

Any computer opens a PDF. You lose animations, live code, Monaco, drawing and the presenter view. Keep it next to the folder as plan C.

## The checklist

The day before:

1. Build the folder with `slide-ng build --offline --download --out talk-offline` and read the output for `could not download` or font warnings.
2. Copy it to the machine you present from, to a second place such as a USB stick, and the PDF with it.
3. Turn the network off completely, not only "no internet".
4. Open `index.html`. Step through every slide and every click. Look at pictures, fonts, math, diagrams, Monaco slides and videos. A video file must be in `public/`, because a link to YouTube cannot work.
5. Open the presenter page and a second window, and move in one: the other must follow.
6. Test the projector: resolution, full screen with `f`, and which screen the second window opens on.
7. Charge the laptop and make sure it will not sleep or update.

In the room, open the folder before the talk starts. If the browser shows a blank page, you opened a normal build from disk: use the offline folder, or serve the build with `python3 -m http.server`.

## What is not verified

Firefox and Safari, camera and screen recording on `file://`, opening the folder from a network share or another operating system, updates of an installed PWA, and real projectors and wake lock behaviour were not tried.
