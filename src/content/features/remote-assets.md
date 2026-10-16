---
title: Bundle remote assets
description: Download pictures at build time and serve them from the site.
---

# Bundle remote assets

```md
---
remoteAssets: true
---
```

The build downloads the remote pictures a deck uses and rewrites the slides to use the copies, which land in `remote-assets/`. It looks at markdown images `![](https://...)`, `<img src>`, CSS `url()`, and the frontmatter keys `image`, `background`, `backgroundImage` and `poster`.

- Only answers with an `image/*` content type up to 20 MB are taken. Anything else is left as it is and reported.
- It is on by default for `slide-ng build --offline`.
- The download runs on the machine that builds, so a deck from someone else can make that machine request addresses of its choice. Build untrusted decks without `remoteAssets`.
