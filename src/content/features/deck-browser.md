---
title: Deck browser
description: A browser inside the deck, so a talk can show websites without leaving the slides.
---

# Deck browser

slide.ng's own, new in 3.0. Press `b`, or the globe button in the bar, and a browser opens as a layer over the current slide. The **Slides** button, `b` or Escape close it and bring back the same slide and click. Its tabs stay loaded while it is closed, so a page you prepared is still there when you come back to it.

## Links on slides

A click on a link to another site, on a slide, opens it in a tab of the deck browser, or in the tab that already shows it. Cmd, Ctrl, Shift or Alt with the click, or a middle click, opens the browser's own tab as before. Links inside the deck move through the slides as always.

```md
---
browser:
  links: false   # links on slides open a new browser tab, as in 2.x
---
```

## What it has

- **Tabs** with the site's icon. They can be closed and dragged into another order.
- **Back, forward, home and reload.** Back and forward move through the pages a tab showed.
- **An address field** that takes an address (`angular.dev`, `localhost:4200/demo`) or words to search for. A single word searches.
- **Bookmarks.** The star in the address field bookmarks the page. Bookmarks show in a bar under the toolbar, in the bookmarks menu and first on the start page.
- **Open in window** opens the real page in a window over the deck browser, for a site that only works there (some sign-ins, for example).
- **The start page**, which a new tab opens on: a search box, and tiles for the bookmarks, the deck's `browser.tabs` and the pages opened recently. A tile can be removed.
- **The gear menu**: the search engine, whether slide links open in the deck browser, whether the bookmarks bar shows, and buttons that clear the recent pages and the bookmarks.

## Customise

**Customise**, on the start page or in the gear menu, opens a larger window:

- **Background** of the start page: the slide.ng artwork (default), solid colours, gradients or images uploaded from this device. Each kind can pick a new one on every new tab. Text stays readable on light and dark backgrounds.
- **Appearance**: like the deck, light or dark.
- **Search engine**: DuckDuckGo (default), Bing, Wikipedia, or your own address with `%s` for the words.
- **Shortcuts**: which groups of tiles show.
- **Clock and date**: the time and the date, with or without seconds, 12 or 24 hours, a font, a size and a date style.
- **Weather**, off until you turn it on. Turning it on asks for your location; you can also type a city. It shows the current condition, high and low, feels-like, wind and humidity, with a five-day forecast on hover, in °C or °F.
- **Links and data**: the same switches as the gear menu.

Everything is kept in this browser for this deck, and wins over the headmatter.

## In the headmatter

```md
---
browser:
  tabs:
    - name: Docs
      url: https://angular.dev
  search: https://www.bing.com/search?q=%s
---
```

| Key | What it does |
| --- | --- |
| `browser: false` | Removes the deck browser: the key, the button and the link handling. |
| `links` | `false` keeps links on slides opening a new browser tab. |
| `tabs` | Pages that show as shortcut tiles on the start page. A plain address works too. |
| `search` | The search address, with `%s` for the words. DuckDuckGo by default. |

The generator warns about other values.

## With the dev server: the proxy

Many sites refuse to be shown inside another page. With `slide-ng dev` on your machine, pages load through a proxy in the dev server's companion, so these sites (GitHub, most large sites) still show inside the deck, and the address field follows the clicks inside a page.

- Each site gets its own address under `localhost`, with a random key for each session, apart from the deck and from the other sites.
- The proxy drops the headers that refuse framing, keeps each site's cookies on its own address, turns off service workers and sends links that open a new window to a new tab.
- An address on your computer or your local network, such as `localhost:4200` or a router, loads only when you opened it: from the address field, a slide link, a tile or a bookmark. A page in the deck browser cannot open one.
- Some sites still break through it, for example sign-ins that check where they run. **Open in window** shows the real page.
- Google and some other search engines show a bot check through the proxy, so DuckDuckGo is the default.

Without the proxy (a built deck, or `--remote`), pages load directly. With the dev server running, a site that refuses framing gets a card with **Open in window**. In a built deck such a site stays blank and the same button is in the toolbar. Back, forward and the address field then only know the pages opened from the deck, not the clicks inside a page.

See [Security](../project/security.md#what-the-tool-checks) for what the proxy checks.

## Fullscreen

In fullscreen, Escape first closes the deck browser and keeps fullscreen, and the next Escape leaves fullscreen. For that the deck takes the Escape key when it goes fullscreen, which Chrome and Edge allow (they show "Press and hold Esc to exit full screen"). In Brave, Firefox and Safari, Escape leaves fullscreen at once.

## Several windows

The page shown in the deck browser is part of what the windows share, so the other windows follow it. The presenter page shows which page is open, with a button that closes it everywhere.
