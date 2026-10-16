---
title: Your first deck
description: Create a deck folder, run it, edit a slide, and build a static site.
---

# Your first deck

## 1. Create the folder

```sh
node /path/to/slide.ng/bin/slide-ng.mjs create my-deck
cd my-deck
```

`create` copies a small template: `slides.md`, `package.json` with `dev`, `build`, `export` and `format` scripts, a `README.md` and a `.gitignore`. It refuses a folder that already has files, unless you pass `--force`, which adds only the missing files.

The template's `package.json` depends on the `slide-ng` package. Until the package is published, point it at your checkout, then install:

```sh
npm pkg set dependencies.slide-ng="file:/path/to/slide.ng"
npm install
```

## 2. Run it

```sh
npm run dev
```

Open `http://localhost:4230`. The page reloads when you save `slides.md`.

## 3. Read the starter deck

This is the starter repository's deck; `create` makes a shorter one. Press the right arrow or space to step through it, `o` for the overview.

<ngmd-demo src="/demos/starter/" title="The starter deck"></ngmd-demo>

Its source is short:

````md
---
title: Welcome to slide.ng
theme: default
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
````

The first block of YAML is the headmatter: it describes the whole deck. Each later `---` line starts a new slide, and a YAML block right after it is that slide's frontmatter. [Syntax](../guide/syntax.md) explains the rest.

## 4. Change something

Add a slide at the end of `slides.md`:

```md
---
layout: fact
---

# 100%

of this slide is markdown
```

Save the file. The new slide appears in the dev server without a reload.

## 5. Build a site

```sh
npm run build
```

The result is a static site in `dist/`. Any web server can host it. See [Hosting](../guide/hosting.md) for base paths and hosts, and [Export](../guide/export.md) for PDF.
