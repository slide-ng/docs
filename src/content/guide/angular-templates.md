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

@let values = [3, 1, 4];

<app-counter #c />
<my-chart [data]="values" (picked)="c.n.set($event)" />
```

The generator turns the markdown of each slide into an Angular template, and it protects the Angular parts so the markdown converter does not break them.

## Rules

- `@if`, `@for`, `@switch` lines (`@name ( ... ) {`) and the closing `}` or `} @else {` must each be on their own line.
- `@let name = value;` must be on its own line.
- A tag that uses a binding, an event, a `#ref` or a `*directive` is passed through untouched. Put it on its own line, or inline in a paragraph. It may span several lines, as Prettier writes a tag with many bindings, when it starts its first line and its `>` or `/>` ends the last. `@let` may span lines too.
- A wrapper tag alone on its line keeps the lines below it as HTML up to the next empty line, with or without bindings. Leave an empty line after it to write markdown inside.
- `{{ ... }}` is passed through untouched.
- A single `{`, `}` or `@` in normal text, such as an email address, is safe. It is escaped for you.
- An `@if` or `@for` in the middle of a line is not read as control flow, and the generator warns.

## Pipes and directives

Angular's common pipes work in a slide's expressions: `number`, `currency`, `percent`, `date`, `json`, `uppercase`, `lowercase`, `titlecase`, `slice`, `keyvalue`, `async`, `i18nPlural` and `i18nSelect`.

```md
Price: {{ 1234.5 | currency }}
```

So do the common directives (`*ngTemplateOutlet`, `[ngClass]`, `[ngStyle]`, `*ngIf`, `*ngFor`, `[ngSwitch]`, `[ngPlural]`, `ngComponentOutlet`) and the forms directives: `[(ngModel)]` imports `FormsModule`, and `[formGroup]`, `formControlName` and the like import `ReactiveFormsModule`. Each is imported only by the slides that use it. A pipe or a directive of your own in `components/` is imported the same way, see [Layouts and components](../customize/layouts-components.md).

## Sharing state

A slide has no component class of its own, so an event handler cannot assign a slide field: `(click)="x = 1"` does not compile. Call a method or set a signal of a template reference instead. To share state between parts of a slide, use template references or `@let`:

```md
<app-counter #c [start]="5" />

Count is {{ c.n() }}.
```

`app-counter` is a small example component that comes with slide.ng. Your own components work the same way, see [Layouts and components](../customize/layouts-components.md).

## Showing code that contains braces

Code fences and inline code are always plain text. Nothing inside them is read as Angular. For a literal `{{` in HTML, put Angular's `ngNonBindable` on the element (where Slidev uses `v-pre`), or write `\{\{` or `&#123;&#123;` in the text.

````md
```ts
const o = { a: 1 }; // @Component {{ x }}
```

Inline too: `{{ x }}` and `@if`.
````

## Math is not interpolation

Inside math, `{{` is math, never an interpolation. Math is covered in [Diagrams and math](./diagrams-math.md).
