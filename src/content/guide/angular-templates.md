---
title: Angular in markdown
description: Use interpolation, control flow and components inside a slide, and the rules that keep them intact.
---

# Angular in markdown

Normal Angular template syntax works inside a slide:

```md
Total: {{ items.length }}

@if (n > 5) {
Big number.
}

<my-chart [data]="values" (picked)="x = $event" />
```

The generator turns the markdown of each slide into an Angular template, and it protects the Angular parts so the markdown converter does not break them.

## Rules

- `@if`, `@for`, `@switch` lines (`@name ( ... ) {`) and the closing `}` or `} @else {` must each be on their own line.
- `@let name = value;` must be on its own line.
- A tag that uses a binding, an event, a `#ref` or a `*directive` is passed through untouched. Put it on its own line, or inline in a paragraph.
- `{{ ... }}` is passed through untouched.
- A single `{`, `}` or `@` in normal text, such as an email address, is safe. It is escaped for you.

## Sharing state

A slide has no component class of its own. To share state between parts of a slide, use template references or `@let`:

```md
<app-counter #c [start]="5" />

Count is {{ c.n() }}.
```

`app-counter` is a small example component that comes with slide.ng. Your own components work the same way, see [Layouts and components](../customize/layouts-components.md).

## Showing code that contains braces

Code fences and inline code are always plain text. Nothing inside them is read as Angular.

````md
```ts
const o = { a: 1 }; // @Component {{ x }}
```

Inline too: `{{ x }}` and `@if`.
````

## Math is not interpolation

Inside math, `{{` is math, never an interpolation. Math is covered in [Diagrams and math](./diagrams-math.md).
