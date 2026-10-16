---
title: Page head and SEO
description: Title, description, Open Graph and Twitter tags, and a preview picture.
---

# Page head and SEO

Several headmatter keys shape the page's `<head>`:

```md
---
title: My talk
titleTemplate: '%s | Conf 2026'
info: |
  ## About this talk
author: Ada
keywords: [angular, slides]
lang: en
favicon: /favicon.ico
htmlAttrs: { data-theme: x }
seoMeta:
  ogImage: auto
  ogUrl: https://example.org/talk
---
```

| Key | Effect |
| --- | --- |
| `title`, `titleTemplate` | The browser tab. `%s` is the title. |
| `info` | Markdown for the info dialog. Without markup, up to 300 characters, it is also the page description. |
| `author`, `keywords` | Meta tags. `keywords` is a list or a comma separated text. |
| `lang`, `htmlAttrs` | Attributes on `<html>`. |
| `favicon` | A file of `public/`, or a web address. |
| `seoMeta` | Open Graph and Twitter tags: `ogTitle`, `ogDescription`, `ogImage`, `ogUrl`, `twitterCard` and so on. |

`seoMeta.ogImage` is a web address, `auto` (a screenshot of slide 1 made by the build, 1470 x 828, written as `og-image.png`), or left out: an `og-image.png` next to `slides.md` is then copied and used. Crawlers need a full address, so set `seoMeta.ogUrl` to the public address of the deck.

`auto` needs a Chromium at build time.
