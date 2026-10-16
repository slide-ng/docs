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
layout: center
---

# Centered

Content in the middle of the slide

---
layout: section
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
layout: image-right
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
layout: fact
---

# 100%

of the slides, in light and dark

---
layout: statement
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
---

# Tables and quotes

| Token | Light | Dark |
| ----- | ----- | ---- |
| Page | `white` | `gray-1000` |
| Border | `gray-200` | `gray-700` |

> Quotes get the same gradient rail as an alert.

---
layout: default
---

# Angular, built in

```angular-ts [user.component.ts]
@Component({
  selector: 'app-user',
  template: `
    @if (user(); as u) {
      <h2 [class.admin]="u.admin">{{ u.name | titlecase }}</h2>
    }
  `,
})
export class UserComponent {
  user = input<User>();
}
```

```ng-html [alias.html]
@if (ready()) { <input [(ngModel)]="draft" #field (keyup.enter)="save(field.value)" /> }
```

---
layout: default
---

# Control flow

```angular-html [list.component.html]
@for (item of items(); track item.id) {
  <li [class.done]="item.done" (click)="toggle(item)">{{ item.title }}</li>
} @empty {
  <li>Nothing yet</li>
}
@defer (on viewport) {
  <app-chart [data]="data" />
} @placeholder {
  <p>Chart</p>
}
@switch (status) {
  @case ('ok') { <app-ok /> }
  @default { <app-fail /> }
}
```

---
layout: default
---

# Buttons

<adev-button>Get started</adev-button> <adev-button variant="secondary">Read the docs</adev-button>

<div class="flex gap-4 mt-8"><adev-button>In a flex row</adev-button><adev-button variant="secondary">With a gap</adev-button></div>

<div class="mt-8"><adev-button>On its own line</adev-button></div>
<div class="mt-4"><adev-button variant="secondary">And another</adev-button></div>

---
layout: end
---

# Thank you

adev for slide.ng
