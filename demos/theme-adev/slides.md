---
theme: adev
routerMode: hash
title: adev
layout: cover
---

# adev

The look of angular.dev, for slides

---
layout: intro
---

# Signals, from the start

Reactive state in Angular

Ada Lovelace, ng-conf

---
layout: intro
class: dark
---

# Signals, from the start

Reactive state in Angular

Ada Lovelace, ng-conf

---
layout: default
---

# The default layout

Body text in Inter, headings in Inter Tight. Links look like [angular.dev](https://angular.dev), inline code like `signal()`.

- Gradient markers on lists
- Hairline borders from the gray scale
- Four pixel corners

```ts [counter.ts]
import { signal } from '@angular/core';

export const count = signal(0);
count.update((n) => n + 1);
```

---
layout: default
class: dark
---

# The default layout

Body text in Inter, headings in Inter Tight. Links look like [angular.dev](https://angular.dev), inline code like `signal()`.

- Gradient markers on lists
- Hairline borders from the gray scale
- Four pixel corners

```ts [counter.ts]
import { signal } from '@angular/core';

export const count = signal(0);
count.update((n) => n + 1);
```

---
layout: center
---

# Centered

Content in the middle of the slide

---
layout: center
class: dark
---

# Centered

Content in the middle of the slide

---
layout: section
---

# A new section

What comes next

---
layout: section
class: dark
---

# A new section

What comes next

---
layout: two-cols
---

# Two columns

Left column

::right::

## Right column

- One
- Two
- Three

---
layout: two-cols
layoutClass: dark
---

# Two columns

Left column

::right::

## Right column

- One
- Two
- Three

---
layout: image-right
class: dark
---

# Image right

The picture side is drawn in CSS when no image is given.

- Pass `image: /photo.png` to show a photo

---
layout: image-left
---

# Image left

The same layout with the picture first.

- Pass `image: /photo.png` to show a photo

---
layout: quote
---

# Make it work, make it right, make it fast.

Kent Beck

---
layout: quote
class: dark
---

# Make it work, make it right, make it fast.

Kent Beck

---
layout: fact
---

# 100%

of the slides, in light and dark

---
layout: fact
class: dark
---

# 100%

of the slides, in light and dark

---
layout: statement
---

# Small, safe, and useful

Slides that look like the docs

---
layout: statement
class: dark
---

# Small, safe, and useful

Slides that look like the docs

---
layout: default
---

# Callouts

<div class="grid grid-cols-2 gap-x-6">
<adev-callout type="note" title="Note">Notes use the blue rail.</adev-callout>
<adev-callout type="tip" title="Tip">Tips use the green and cyan rail.</adev-callout>
<adev-callout type="important" title="Important">Important is red to pink.</adev-callout>
<adev-callout type="warning" title="Warning">Warnings are amber to orange.</adev-callout>
<adev-callout type="critical" title="Critical">Critical is pink to orange red.</adev-callout>
</div>

---
layout: default
class: dark
---

# Callouts

<div class="grid grid-cols-2 gap-x-6">
<adev-callout type="note" title="Note">Notes use the blue rail.</adev-callout>
<adev-callout type="tip" title="Tip">Tips use the green and cyan rail.</adev-callout>
<adev-callout type="important" title="Important">Important is red to pink.</adev-callout>
<adev-callout type="warning" title="Warning">Warnings are amber to orange.</adev-callout>
<adev-callout type="critical" title="Critical">Critical is pink to orange red.</adev-callout>
</div>

---
layout: default
---

# Cards

<adev-card-grid cols="3">
  <adev-card label="Step 1" title="Fork">Fork the repository and clone it.</adev-card>
  <adev-card label="Step 2" title="Fix">Make a small change with a test.</adev-card>
  <adev-card label="Step 3" title="Send" hot>Open the pull request.</adev-card>
</adev-card-grid>

<adev-card-grid cols="2">
  <adev-card title="Signals">Fine grained reactivity.</adev-card>
  <adev-card title="Zoneless">Change detection without zone.js.</adev-card>
</adev-card-grid>

---
layout: default
class: dark
---

# Cards

<adev-card-grid cols="3">
  <adev-card label="Step 1" title="Fork">Fork the repository and clone it.</adev-card>
  <adev-card label="Step 2" title="Fix">Make a small change with a test.</adev-card>
  <adev-card label="Step 3" title="Send" hot>Open the pull request.</adev-card>
</adev-card-grid>

<adev-card-grid cols="2">
  <adev-card title="Signals">Fine grained reactivity.</adev-card>
  <adev-card title="Zoneless">Change detection without zone.js.</adev-card>
</adev-card-grid>

---
layout: center
---

<div class="adev-stats">
<adev-stat value="15+" label="small pull requests" />
<adev-stat label="issues closed"><adev-count-up value to="240" suffix="+" /></adev-stat>
<adev-stat label="docs pages touched"><adev-count-up value to="38" /></adev-stat>
</div>

---
layout: center
class: dark
---

<div class="adev-stats">
<adev-stat value="15+" label="small pull requests" />
<adev-stat label="issues closed"><adev-count-up value to="240" suffix="+" /></adev-stat>
<adev-stat label="docs pages touched"><adev-count-up value to="38" /></adev-stat>
</div>

---
layout: default
---

# Code, steps and buttons

<adev-code-card title="app.ts" label="TypeScript">

```ts
@Component({ selector: 'app-root', template: '<h1>Hello</h1>' })
export class App {}
```

</adev-code-card>

<adev-steps>

1. Install the CLI
2. Run `ng new`
3. Start the dev server

</adev-steps>

<adev-button>Get started</adev-button> <adev-button variant="secondary">Read the docs</adev-button>

---
layout: default
class: dark
---

# Code, steps and buttons

<adev-code-card title="app.ts" label="TypeScript">

```ts
@Component({ selector: 'app-root', template: '<h1>Hello</h1>' })
export class App {}
```

</adev-code-card>

<adev-steps>

1. Install the CLI
2. Run `ng new`
3. Start the dev server

</adev-steps>

<adev-button>Get started</adev-button> <adev-button variant="secondary">Read the docs</adev-button>

---
layout: default
---

# Tables and quotes

| Token | Light | Dark |
| ----- | ----- | ---- |
| Page | `white` | `gray-1000` |
| Border | `gray-200` | `gray-700` |

> Quotes get the same gradient rail as an alert.

---
layout: default
class: dark
---

# Tables and quotes

| Token | Light | Dark |
| ----- | ----- | ---- |
| Page | `white` | `gray-1000` |
| Border | `gray-200` | `gray-700` |

> Quotes get the same gradient rail as an alert.

---
layout: end
---

# Thank you

adev for slide.ng
