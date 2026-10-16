---
title: Fonts
description: Load web fonts, and serve them from the build instead of a provider.
---

# Fonts

```md
---
fonts:
  sans: Inter
  mono: Fira Code
  selfHost: true
---
```

`fonts` follows Slidev: `sans`, `serif`, `mono`, `local`, `weights`, `italic`, `fallbacks` and `provider`. A provider is `google`, `coollabs`, `none`, or the address of a Google-compatible `css2` endpoint.

By default the fonts are an `@import` from the provider, so the deck needs the network when it is shown. slide.ng adds `selfHost: true`, which makes the build download the provider's style sheet and every font file in it and serve them from `media/`. It is on by default with `pwa: true` and with `build --offline`, and `selfHost: false` turns it off. If the download fails the build warns and the deck keeps the `@import`.

A theme's fonts are merged with the deck's `fonts` key by key, so `fonts: { mono: 'Fira Code' }` keeps the theme's `sans`. `fonts: { provider: none }` loads nothing.

The download runs on the machine that builds, so build decks from others without `selfHost`.
