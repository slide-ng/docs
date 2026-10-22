---
title: Click animations
description: Choose how a part comes in at its click, with Slidev's presets or your own CSS.
---

# Click animations

A part that waits for its click is hidden. A preset changes how it looks while hidden, and so how it comes in, as Slidev's click animation presets do.

```md
---
clickAnimation: up
---

<div slide-ng-click>Uses the slide's preset</div>
<div slide-ng-click.scale>Scales up from 0.9</div>
<div slide-ng-click.fade.right="3">Dimmed and 20px to the left until click 3</div>
<div slide-ng-click.none>No animation</div>
```

`clickAnimation` in the headmatter sets the preset of every slide, also through `defaults`. In a slide's frontmatter it sets that slide's. A modifier on the attribute wins over both, and several can be combined. The presets work on `slide-ng-click`, `slide-ng-after` and `slide-ng-click-hide`, and `<slide-ng-clicks animation="fade up">` gives one to every item.

| Preset | While hidden |
| --- | --- |
| `fade` | At 0.5 opacity instead of invisible. |
| `fade-in` | Invisible, and it fades in over 0.3s. |
| `up`, `down`, `left`, `right` | 20px away, so it moves 20px up, down, left or right as it comes in. |
| `scale` | Scaled to 0.9. |
| `none` | No transition: it shows at once. |

A part that waits for its click is inert, also with `fade`, where it is dimmed but visible: screen readers skip it, and its links and buttons take no focus or clicks.

## A preset of your own

The element gets the class `slidev-vclick-anim-<name>`, so a preset of your own is CSS in `styles/index.css`:

```css
.slidev-vclick-anim-pop.slidev-vclick-hidden {
  transform: scale(0.96) translateY(8px);
}
```

```md
<div slide-ng-click.pop>Pops in</div>
```

A name one or two letters away from a built-in preset, such as `slide-ng-click.fadee`, or from the `hide` modifier, gets a warning that names the one meant, unless the deck's styles define it.

## Limits

- In a PDF or PNG export nothing moves: each page shows the state of its click at once.
- When the system asks for less motion, the parts change at once.
- The presenter's [click preview](../guide/presenter-mode.md#click-preview) draws every part at its place, at the ghost opacity, whatever its preset.
