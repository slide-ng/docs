---
title: Upgrading from 2.x to 3.0
description: How to move a deck from slide.ng 2.x to 3.0, and the changes that can alter a deck that 2.x showed correctly.
---

# Upgrading from 2.x to 3.0

slide.ng 3.0 needs the same Node (22.22.3 or newer) and the same Angular (22.2) as 2.x. Update the package in the deck's folder:

```sh
npm install -D @slide-ng/core@^3.0.0
npx slide-ng dev
```

Most decks need no change. 3.0 is a major version because of the new [deck browser](../features/deck-browser.md), which changes what a few keys and links do.

## Changes that can alter a deck

- A click on a link to another site, on a slide, opens it in the deck browser instead of a new browser tab. Cmd, Ctrl, Shift or Alt with the click, or a middle click, still opens a real tab. To keep the 2.x behaviour, add `browser: { links: false }` to the headmatter. `browser: false` removes the deck browser altogether.
- `b` on the slide page opens and closes the deck browser. A `setup/shortcuts.ts` that used `b` for something else should pick another key, or the deck can set `browser: false`.
- In fullscreen, Chrome and Edge give the deck the Escape key, so the first Escape closes the deck browser and the next one leaves fullscreen. These browsers then say "Press and hold Esc to exit full screen". Other browsers leave fullscreen at once, as before. `browser: false` keeps the 2.x fullscreen.
- `slide-ng dev` on your machine opens one more port on `127.0.0.1`, for the deck browser's proxy. Not with `--remote`.

## What is new

The full list is in the [release notes](https://github.com/slide-ng/slide.ng/blob/main/CHANGELOG.md).

- The [deck browser](../features/deck-browser.md): tabs, search, bookmarks, a start page with a clock and weather, and a proxy in the dev server so sites that refuse framing still show inside the deck.
- The navigation bar can be dragged by its grip to one of its six places, and the right-click menu can show it or reset its place. See [Shortcuts](../built-in/shortcuts.md#mouse).
