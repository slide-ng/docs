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
| `g` | Go to a slide: type a number or part of a title, in any case and with or without accents, then Enter |
| Escape | Close the overview, dialogs and menus |
| `u` | Presenter page: show or hide the [click preview](../guide/presenter-mode.md#click-preview) |

Shortcuts are off while you type in a text field or an editor, and while the drawing toolbar is open. Escape leaves a text field (not an editor), so the keys work again. After a click on a checkbox or a button, the arrow keys still move the slides. While the info dialog or a modal `<dialog>` of a slide is open, only Escape works. When a `slide-ng-drag` element is selected, the arrow keys nudge it instead of moving through the slides.

## Mouse

The bar at the bottom left has buttons for fullscreen, previous, next, overview, dark mode, drawing, presenter mode, info, sync mode, settings and a counter. A deck with `languages` also has a language button before the settings, see [One deck in several languages](../features/interface-language.md#one-deck-in-several-languages). The bar shows when the mouse is there. `navPosition` in the headmatter puts it in another corner, or in the middle of the top or bottom edge, see [Headmatter and frontmatter](./headmatter.md#the-deck-and-its-look), and a viewer can move it from the settings menu. On the presenter page the bar stays where it is and also has the layout button and the [click preview](../guide/presenter-mode.md#click-preview). A `layers/custom-nav-controls.ts` adds buttons of your own at its end, see [Global layers](../features/global-layers.md). The fullscreen button is left out where the page may not go fullscreen: in an iframe without `allow="fullscreen"`, and on an iPhone. `f` does nothing there.

<ngmd-image src="/images/ui/nav-bar-light.png" alt="The navigation bar at the bottom left of a slide" caption="The navigation bar" width="480"></ngmd-image>

The settings button (More Options) opens the same menu as in Slidev: Invert, then sliders with a number box for Brightness, Contrast, Saturation, Sepia and Hue Rotate (double click a slider to reset it; a dot on the button shows that a filter is active), then Cursor Style (Cursor or Laser), Slide Scale (Fit or 1:1), Nav Bar Position, Wake Lock and Hide Idle Cursor. Slide Scale, Nav Bar Position and Hide Idle Cursor are not on the presenter page. Wake Lock keeps the screen from going to sleep, where the browser has it. It is on by default, as in Slidev; a choice stored in the browser wins, and `wakeLock: false` in the headmatter turns it off and removes the entry (`dev` or `build` keeps it for that mode only). The filters change how the slides look on your screen and are remembered. With Laser selected, a red dot follows your pointer on the slide, in the normal view and in the presenter view (where the audience sees it too). A switch for the dark mode (when neither the deck nor its theme fixes it), the camera and microphone choices and "Download as PDF" are listed below a divider.

Nav Bar Position is slide.ng's own. It is a small picture of the page with the six places of `navPosition`. Choosing a place moves the bar there at once, with its menus, and wins over the headmatter in this browser for this deck. Deck Default, or a double click on the title, forgets the choice, so the bar follows the headmatter again, also when the author changes it later. The arrow keys move through the places. In a right-to-left deck the picture is mirrored like the bar, and each place is named by where it is on the screen.

Right click opens a menu with the same actions. Hold Shift while right clicking for the browser's own menu. From the keyboard, Shift+F10 or the menu key opens it with the focus on its first item; the arrow keys, Home, End and Tab move between the items, Enter or Space runs one, and Escape closes it and gives the focus back. While the menu is open the deck's keys do nothing. Click the dark area beside the slide: the right half goes to the next click, the left half to the previous one.

## Touch

On the audience page, swiping left or right moves through clicks, and swiping up or down moves between slides. A swipe that starts on a `slide-ng-drag` element or one of its handles moves the element instead, and there are no swipes while drawing. The presenter page and `/notes` have no swipes. The bar has no hover on a touch screen: the first tap on the hidden bar only shows it, the next tap presses a button. On a screen taller than the slide, such as a phone held upright, the bar is always shown.

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

`key` is a `KeyboardEvent.key` name, with `shift+` in front if needed, and `space` for the space bar. When two shortcuts have the same key, the one later in the list wins, so appending `{ key: 'k' }` replaces a built-in `k`. A deck's `setup/shortcuts.ts` runs after the shortcuts of its theme and addons, so it gets their list and has the last word. The names of the default shortcuts are `next_space`, `prev_space`, `next_right`, `prev_left`, `next_page_key`, `prev_page_key`, `next_down`, `prev_up`, `next_shift`, `prev_shift`, `toggle_dark`, `toggle_overview`, `toggle_overview_backtick`, `hide_overview`, `goto`, `fullscreen`, `toggle_click_preview` (presenter page only), and the overview moves `right_overview`, `left_overview`, `up_overview`, `down_overview` and `goto_from_overview`.

## Color mode

Dark mode follows the system until the viewer presses `d` or the sun and moon button. The choice is kept in the browser's `localStorage` under the key `slidev-color-schema`. `colorSchema: light` or `dark` in the headmatter fixes it and hides the button. A theme made for one mode (`colorSchema` in its `theme.json`) fixes it too, whatever the deck says.
