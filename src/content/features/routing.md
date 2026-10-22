---
title: Slide addresses
description: Slide numbers in the URL, aliases, and hash or history routing.
---

# Slide addresses

Every slide has an address, `/3` for the third slide. The URL is the state: `/7?clicks=2` is slide 7 at click 2. A slide at its first click is just `/7`, as in Slidev.

## Aliases

`routeAlias` gives a slide an extra address:

```md
---
routeAlias: intro
---
```

Now `/intro` opens the slide. `<slide-ng-link to="intro">` links to it, see [Components](../built-in/components.md), and so does the markdown link `[intro](./intro)`, see [Links](../guide/syntax.md#links). An alias may be any name, also `café`.

The build stops, naming the slides, on an alias that cannot work:

- `print`, `notes`, `presenter`, `overview`, `entry` or `notes-edit`, which are pages of the app;
- a number, because `/2` is slide 2;
- an empty one, or one with `/`, `.`, `?`, `#` or `\`;
- one on two slides, also through a `src:` import of several slides.

A page a deck adds itself with `setup/routes.ts` is not seen by the build, so give it a name no slide uses as an alias.

## Hash or history

```md
---
routerMode: hash
---
```

With `hash` the address looks like `/#/3`. The default is `history`. Hash mode needs nothing from the web server, see [Hosting](../guide/hosting.md).

`slide-ng build --router-mode history|hash|memory` replaces the headmatter's `routerMode` for one build. The build records it, so `export --dist` opens it with the right addresses. `build --offline` always uses hash mode.

## Memory mode

`routerMode: memory` never changes the address bar, as Slidev's memory router. Use it for a kiosk, or a deck shown inside another page.

- The deck always opens at slide 1. An address such as `/7` or `/presenter/1` opens slide 1 too.
- `/presenter`, `/notes`, `/overview` and the other pages of the app cannot be opened by their address, and a new tab starts at slide 1. Open the presenter with the bar's button, in the same window.
- A slide link, `[x](5)` or `<slide-ng-link to="5">`, has the address `<base>#/5`. The deck reads it once when it starts, so "open in new tab" shows that slide, and then drops it from the address.
- The browser's Back and Forward buttons leave the deck, which adds no history entries. Reloading the presenter page returns to the audience view at slide 1.
- The print pages that `export` opens are still read from the address, so `--download` and the Open Graph picture work.
- In the dev server the slide is kept when the page reloads after a save.

An address that matches no slide shows the `404` layout.
