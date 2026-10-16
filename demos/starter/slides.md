---
title: Welcome to slide.ng
theme: default
routerMode: hash
---

# Welcome to slide.ng

Slides in markdown, with Angular templates inside.

<!--
Speaker notes go in the last HTML comment of a slide.
-->

---

# Clicks

<div slide-ng-click>Appears on the first click</div>
<div slide-ng-click>Appears on the second click</div>

---
layout: two-cols
---

# Left

Text on the left, and Angular works too: {{ 1 + 2 }}.

::right::

# Right

```ts
const hello = (name: string) => `Hello ${name}`;
```

---
layout: center
---

# The end

Edit `slides.md` and the page updates. Run `npm run build` for a site you can host,
and `npm run export` for a PDF.
