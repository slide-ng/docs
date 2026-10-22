---
title: Slide addresses
description: Slide numbers in the URL, aliases, and hash or history routing.
---

# Slide addresses

Every slide has an address, `/3` for the third slide. The URL is the state: `/7?clicks=2` is slide 7 at click 2.

## Aliases

`routeAlias` gives a slide an extra address:

```md
---
routeAlias: intro
---
```

Now `/intro` opens the slide. `<slide-ng-link to="intro">` links to it, see [Components](../built-in/components.md), and so does the markdown link `[intro](/intro)`, see [Links](../guide/syntax.md#links).

## Hash or history

```md
---
routerMode: hash
---
```

With `hash` the address looks like `/#/3`. The default is `history`. Hash mode needs nothing from the web server, see [Hosting](../guide/hosting.md). Slidev's `memory` mode is not available.

An address that matches no slide shows the `404` layout.
