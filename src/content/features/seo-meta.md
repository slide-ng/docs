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
| `info` | Markdown for the info dialog. With the markup taken out and cut at 300 characters, it is also the page description and the PDF's subject. |
| `author`, `keywords` | Meta tags. `keywords` is a list or a comma separated text. |
| `lang`, `htmlAttrs` | Attributes on `<html>`. `lang` also picks the [interface language](./interface-language.md) and the locale of dates and numbers, and `ar`, `he`, `fa` and `ur` add `dir="rtl"` unless `htmlAttrs.dir` is set. |
| `favicon` | A file of `public/`, or a web address. |
| `seoMeta` | Open Graph and Twitter tags: `ogTitle`, `ogDescription`, `ogImage`, `ogUrl`, `twitterCard` and so on. |

`seoMeta.ogImage` is a web address, `auto` (a screenshot of slide 1 made by the build, 1470 x 828, written as `og-image.png`), or left out: an `og-image.png` next to `slides.md` is then copied and used. Crawlers need a full address, so set `seoMeta.ogUrl` to the public address of the deck.

`auto` needs a Chromium at build time.

## Your own index.html

An `index.html` next to `slides.md`, or at the top of a theme or addon, adds tags that the headmatter has no key for: analytics, an extra font, a `<meta>`. Only what is inside its `<head>` and `<body>` is used, so it does not need to be a whole page:

```html
<head>
  <meta name="robots" content="noindex" />
  <script defer data-domain="talk.example" src="https://plausible.io/js/script.js"></script>
</head>
<body>
  <noscript>This deck needs JavaScript.</noscript>
</body>
```

- The inside of its `<head>` goes into the page's head, after the tags made from the headmatter. The inside of its `<body>` goes after the app: out of sight, but screen readers read it. The parts of every root are added in order: theme, addons, deck.
- A `<title>` or a `<meta>` with the same name and `media` as one made from the headmatter replaces it, as Slidev's head manager does. Tags meant to repeat, such as several `og:image`, are all kept. While the deck runs, the tab's title still follows the slides.
- The attributes of its `<html>` and `<body>` are added to the page's. The headmatter's `htmlAttrs` win, and `class` values are joined. `lang` comes from the headmatter only, because it also picks the interface language, so the `lang` of an `index.html` is ignored with a warning.
- A root address such as `src="/analytics.js"` gets the base in front, like `/x.svg` in a slide.
- The file is the deck's own code: it is copied as it is, and its scripts run in `dev`, in a build, in an offline folder and in an export. In an offline folder a `<script type="module" src>` does not run; use a plain `<script>`.

`slide-ng build` moves its inline scripts into files, see [Hosting](../guide/hosting.md#content-security-policy). Rename the file if it was not meant for the deck.
