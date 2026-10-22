---
title: Clicks and transitions
description: Reveal things step by step with clicks, and move between slides with transitions.
---

# Clicks and transitions

## Clicks

Clicks reveal things one step at a time. Add `slide-ng-click` to any HTML element:

```md
<div slide-ng-click>Shows on the next click</div>
<div slide-ng-click="3">Shows at click 3</div>
<div slide-ng-click="+2">Shows two clicks after the previous element</div>
<div [slide-ng-click]="[2, 4]">Shows from click 2 until click 4, then hides</div>
<div slide-ng-after>Same click as the element before it (a relative +0)</div>
<div slide-ng-click="2" slide-ng-click-hide>Visible first, hides at click 2</div>
<div slide-ng-click-hide="3">Visible first, hides at click 3</div>
<div slide-ng-click.hide="2">Visible first, hides at click 2</div>
<div slide-ng-click="2" slide-ng-click-hide="3">Shows at click 2, hides at click 3</div>
```

With a value on both, `slide-ng-click` is the click that shows the element and `slide-ng-click-hide` the click that hides it again, the same as `[slide-ng-click]="[2, 3]"`. With the bare `slide-ng-click-hide` flag, the `slide-ng-click` value is the click that hides it. These work as `v-click-hide` and `v-click.hide` do in Slidev.

There are two forms because of how Angular reads attributes. `slide-ng-click="3"` and `slide-ng-click="+2"` are plain text, and slide.ng turns them into a number or a relative step. `[slide-ng-click]="[2, 4]"` is an Angular binding, for ranges and for any value you compute. A range written as plain text, `slide-ng-click="[2, 4]"`, is bound for you, so a deck copied from Slidev keeps its ranges.

The generator warns, with the slide and its line, about values written as text that cannot work: `slide-ng-click="abc"`, `"0"` (clicks count from 1), a range with one value or whose end is not after its start (`[3, 1]`), and an `at="x"` of a `<slide-ng-switch>` child. It warns too about `clicks` and `clicksStart` that are not numbers or are negative. Values computed in a binding are checked by the app only.

`slide-ng-after` and `+n` count from the relative counter, as in Slidev: the last plain or `+n` click before them, not an absolute `slide-ng-click="3"`. After only absolute clicks, `slide-ng-after` shows from the start, so give it a number too.

To reveal list items one by one, wrap the list in `<slide-ng-clicks>`. Leave an empty line after the opening tag and before the closing one, otherwise markdown does not turn the list into HTML.

```md
<slide-ng-clicks>

- first
- second

</slide-ng-clicks>
```

As in Slidev's `v-clicks`, a single list gives each item a click, a single table each body row, and anything else (paragraphs, pictures, several lists) each child of `<slide-ng-clicks>`.

Options: `depth="2"` includes nested lists, `every="2"` shows two items per click and `every="0.5"` gives each item two clicks, `at="3"` sets the first click, `hide` makes the items hide instead of show, and `animation="fade up"` gives every item a [click animation preset](../features/click-animations.md).

`<slide-ng-switch>` shows one child per click (`at="3-5"` is clicks 3 and 4, the end is not included), and `<slide-ng-click-gap size="2" />` leaves two clicks empty. See [Directives](../built-in/directives.md) and [Components](../built-in/components.md).

<ngmd-callout type="tip" title="Set the number of clicks yourself">

`clicks: 3` in a slide's frontmatter fixes the number of clicks, whatever its elements ask for. `clicksStart` sets the first click number, `0` by default. A negative `clicksStart` counts as 0.

</ngmd-callout>

The URL carries the state: `/7?clicks=2` is slide 7 at click 2. A slide at its first click is just `/7`, as in Slidev; an address with `?clicks=0` still opens.

## How a part comes in

A part that waits for its click is hidden. `clickAnimation: up` in the headmatter or a slide's frontmatter, or a modifier such as `slide-ng-click.fade.right`, changes how it comes in, as Slidev's presets do. See [Click animations](../features/click-animations.md).

## Transitions

Set a transition in a slide's frontmatter. It is used between that slide and the next one, in both directions:

```md
---
transition: slide-left
---
```

| Name | Notes |
| --- | --- |
| `slide-left`, `slide-right`, `slide-up`, `slide-down` | Go the other way when you move backwards. |
| `fade`, `fade-out` | |
| `view-transition` | Uses the browser's View Transitions API. There is no animation in browsers without it. |

`transition: slide-left | slide-right` gives the forward and the backward variant yourself. Set `transition` in the headmatter for the whole deck. The default is no transition.

The duration is the CSS variable `--slidev-transition-duration` (0.5s). After a move, the class `slidev-nav-go-forward` or `slidev-nav-go-backward` is on the stage until the next move, so the UnoCSS variants `forward:` and `backward:` work. See [Direction variants](../features/direction-variants.md).

### Your own transition

Any other name is a transition written in CSS, as in Slidev. During the move the entering slide gets Vue's classes `<name>-enter-from` and `<name>-enter-active`, a frame later `<name>-enter-to` instead of `-enter-from`, and the leaving slide the same with `leave`. Each slide's classes are removed when its CSS transition or animation ends.

```css
/* styles/index.css */
.my-fade-enter-active,
.my-fade-leave-active {
  transition: opacity 0.6s ease;
}
.my-fade-enter-from,
.my-fade-leave-to {
  opacity: 0;
}
```

```md
---
transition: my-fade
---
```

The object form takes other class names (`enterFromClass`, `enterActiveClass`, `enterToClass`, `leaveFromClass`, `leaveActiveClass`, `leaveToClass`) and a fixed `duration` in milliseconds, a number or `{ enter, leave }`:

```md
---
transition:
  name: grow
  enterFromClass: scale-50
  enterActiveClass: transition-transform duration-500
---
```

The built-in names keep their own animation unless the object names a class. `<slide-ng-switch transition="my-fade">` uses the same classes, see [Components](../built-in/components.md).

When the system asks for less motion (`prefers-reduced-motion`), transitions run in almost no time and a fixed `duration` ends at once, so the slide changes straight away.

## More

[Marks](../features/marks.md) draw hand-made marks on a click, and [Motion](../features/motion.md) moves an element between states.
