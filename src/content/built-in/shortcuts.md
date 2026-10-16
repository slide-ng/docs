---
title: Shortcuts
description: The keyboard and mouse controls of a deck, and how to change them.
---

# Shortcuts

| Key | Action |
| --- | --- |
| Right, Space, Page Down | Next click, or next slide |
| Left, Shift + Space, Page Up | Previous click, or previous slide |
| Down, Shift + Right | Next slide, skipping the clicks |
| Up, Shift + Left | Previous slide |
| `f` | Fullscreen |
| `o` or backtick | Slide overview. Arrows move, Enter opens, Escape closes. |
| `d` | Dark or light mode |
| `g` | Go to a slide: type a number or part of a title, then Enter |
| Escape | Close the overview, dialogs and menus |

Shortcuts are off while you type in an editor and while the drawing toolbar is open. When a `slide-ng-drag` element is selected, the arrow keys nudge it instead of moving through the slides.

## Mouse

The bar at the bottom left has buttons for fullscreen, previous, next, overview, dark mode, drawing, presenter mode, info, settings and a counter. It shows when the mouse is there.

<ngmd-image src="/images/ui/nav-bar-light.png" alt="The navigation bar at the bottom left of a slide" caption="The navigation bar" width="480"></ngmd-image>

The settings button (More Options) opens the same menu as in Slidev: Invert, then sliders with a number box for Brightness, Contrast, Saturation, Sepia and Hue Rotate (double click a slider to reset it; a dot on the button shows that a filter is active), then Cursor Style (Cursor or Laser), Slide Scale (Fit or 1:1), Wake Lock (where the browser has it) and Hide Idle Cursor. The filters change how the slides look on your screen and are remembered. With Laser selected, a red dot follows your pointer on the slide, in the normal view and in the presenter view (where the audience sees it too). A switch for the dark mode (when the deck does not fix it), the camera and microphone choices and "Download as PDF" are listed below a divider.

Right click opens a menu with the same actions. Hold Shift while right clicking for the browser's own menu. Click the dark area beside the slide: the right half goes to the next click, the left half to the previous one. On a touch screen, swiping left or right moves through clicks, and swiping up or down moves between slides.

## Change the keys

Shortcuts are a list of `{ name, key, run, when? }`. A `setup/shortcuts.ts` file gets the default list and returns the list to use.

```ts
// setup/shortcuts.ts
import type { Shortcut, ShortcutActions } from 'slide-ng/lib/shortcuts';

export default (actions: ShortcutActions, list: Shortcut[]): Shortcut[] => [
  ...list.filter((s) => s.name !== 'fullscreen'),
  { name: 'dark', key: 'x', run: actions.toggleDark },
];
```

`key` is a `KeyboardEvent.key` name, with `shift+` in front if needed, and `space` for the space bar. The names of the default shortcuts are `next_space`, `prev_space`, `next_right`, `prev_left`, `next_page_key`, `prev_page_key`, `next_down`, `prev_up`, `next_shift`, `prev_shift`, `toggle_dark`, `toggle_overview`, `toggle_overview_backtick`, `hide_overview`, `goto`, `fullscreen`, and the overview moves `right_overview`, `left_overview`, `up_overview`, `down_overview` and `goto_from_overview`.

## Color mode

Dark mode follows the system until the viewer presses `d` or the sun and moon button. The choice is kept in the browser's `localStorage` under the key `slidev-color-schema`. `colorSchema: light` or `dark` in the headmatter fixes it and hides the button.
