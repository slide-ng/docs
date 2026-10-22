---
title: Presenter mode
description: The presenter page, speaker notes, the timer, the laser pointer and syncing windows.
---

# Presenter mode

Open `/presenter` or press the presenter button in the bar. The page shows the current slide, a preview of the next step, your notes with click markers, a slider for the clicks, and a timer.

<ngmd-image src="/images/ui/presenter-layout-1.png" alt="The presenter page: the current slide, the next step and the notes" caption="The presenter page, first layout" width="640"></ngmd-image>

The audience page, for example `/3`, in another window or on another device follows the presenter. `/notes` shows only the notes and follows too. A layout button cycles through three arrangements of the presenter page. `/overview` lists every slide with its notes, and `/entry` links to all these pages, see [Overview and notes pages](../features/overview-pages.md).

## Notes

A slide's note is its last HTML comment. In a note, `[click]` marks where the next click starts, and `[click:3]` moves three clicks on from the marker before it. Double click a marker to jump to it.

```md
# A slide

<!--
Say hello.
[click] Then show the first point.
[click:3] Three clicks later, at click 4.
-->
```

Drag the borders of the notes pane to change its width and height. Each layout keeps its own sizes in the browser, from 240 to 720 pixels wide (at most 70% of the page) and at least 160 pixels high (at most 75%). The borders are Tab stops too: the arrow keys move one by 16 pixels, 64 with Shift, and Home and End give the notes their smallest and biggest size. Layout 1 on a tall, narrow screen has no borders to drag.

While the dev server runs, **Edit Notes** (the pencil next to the font size buttons) turns the notes into a text box. What you type is saved as the slide's note in the markdown, and only the note, half a second after you stop or at once with Ctrl or Cmd + S. Escape, a click outside or the pencil ends editing, and Escape gives the focus back to the pencil. The bar's editor button shows the [side editor](../features/side-editor.md) in the notes pane. Neither is in a build.

`slide-ng export-notes` makes a PDF of the notes. See [Speaker notes](../features/speaker-notes.md).

## Click preview

The eye button next to the layout button, or `u`, turns on a click preview of the current slide. The preview is on the presenter page only. The audience page, `/notes` and the next-step pane do not change.

- Parts that are already shown look as usual.
- The part of the next click is brighter and has a dashed outline.
- The parts of later clicks are greyed out.
- Each part that a later click changes has a badge with the number of that click.

Click a badge or a greyed-out part to go to that click. Every window follows. A link or button inside a greyed-out part is not run; parts already shown keep their own clicks. While you draw, the pen gets the click and the slide does not move. The choice is remembered in the browser, under the key `slide-ng-presenter-click-preview`. The shortcut is named `toggle_click_preview`, see [Shortcuts](../built-in/shortcuts.md#change-the-keys).

- `slide-ng-click`, `slide-ng-after`, ranges, `<slide-ng-clicks>` items and the output of `{monaco-run}` are greyed out until their click. A range that is on screen gets a second badge where it ends.
- A part that a click hides (`slide-ng-click-hide`) stays as it is until it goes. Its badge has a struck-through number, and as the next click its outline is dotted, not dashed.
- A part with a [click animation preset](../features/click-animations.md) is drawn at its place and size, and always at the ghost opacity, also with `fade`.
- A fractional click such as `slide-ng-click="1.5"` gets the badge of the whole click it shows at, 2.
- In a right-to-left deck the badge sits at the right edge of the part.

A theme or a deck can change the look with CSS variables:

| Variable | Default | What it sets |
| --- | --- | --- |
| `--slide-ng-ghost-opacity` | `0.47`, `0.4` in dark mode | Opacity of the parts of later clicks, about 3:1 for the default text colours |
| `--slide-ng-ghost-next-opacity` | `0.75` | Opacity of the part of the next click |
| `--slide-ng-ghost-next` | unset: the theme's primary colour | Colour of the outline and the badge of the next click. A `themeConfig.primary` counts too. |
| `--slide-ng-ghost-badge-background` | `#6b7280` | Background of the other badges |
| `--slide-ng-ghost-badge-foreground` | `white` | Text of the badges |

The parts carry the classes `slide-ng-click-ahead` and, for the next click, `slide-ng-click-next` (`slide-ng-click-hides` for a part that goes away). The click is in `data-slide-ng-click-at`.

Screen readers skip the greyed-out parts, since the next-step pane already shows the next click. What a greyed-out part holds is inert: its links, buttons and fields are no Tab stops until the part shows. The keyboard way is the badges. Each badge is a button named "Go to click N", 24 by 24 pixels at any size of the slide, and after Enter on one the focus moves to the badge of the click after it.

The preview has limits:

- Content inside `@if (clicks.current() > 2) { ... }` is not on the page until its click, so it has no greyed-out part and no badge. Use `slide-ng-click` for content the preview should show.
- A `<slide-ng-switch>` shows only its current child. The badge on the switch says when it changes.
- Code line steps, Magic Move, `slide-ng-mark` and `slide-ng-motion` show their state at the current click, not their later state. A badge says when they change next.
- The notes PDF has no click preview.

Slidev has no click preview, see [What differs from Slidev](../migrating/from-slidev.md#added-in-slide-ng).

## Timer

```md
---
duration: 30min
timer: countdown
---
```

`duration` takes `30min`, `1h30min`, `90s`, or a number of minutes. `timer` is `stopwatch` (the default) or `countdown`. Every window and device shows the same time, and a reload of the presenter page keeps it. See [Timer](../features/timer.md).

## Cursor and laser

The presenter's mouse is shown on the audience page as a pointer or a red laser dot. Switch it in the settings menu or with the bar button.

## Syncing

Windows of one browser follow each other with no server, over a `BroadcastChannel`. Other devices need the dev server with `--remote`, see [Remote access](../features/remote-access.md). There, the presenter and notes pages need the password; without it they go to the slides. A window or device that joins later catches up with the presenter, timer included.

An audience page that opens or reloads while a presenter page is open goes to the presenter's slide and click, once that presenter has moved. A presenter page that only opened does not move the audience: an audience page at the start of the deck joins it, and one opened at another slide keeps that slide until a presenter moves.

Use one presenter page. Two presenter pages do not follow each other: each keeps its own slide, and the audience follows the one that moved last, also when the devices' clocks are not set alike. To use a phone as the remote, open the presenter page on the phone and only the audience page on the laptop that drives the projector.

### Sync mode

The sync button in the bar (up and down arrows, before the settings) opens Slidev's sync mode menu:

| Mode | What the window does |
| --- | --- |
| Bidirectional Sync | Sends its moves and follows the others. The default. |
| Receive Only | Follows the others, and its own moves stay on this screen. |
| Send Only | Sends its moves, and does not follow. |
| Disable | Neither. Use it to look around on your own. |

The choice is kept for each role, viewer or presenter, in the browser (`slidev-sync-directions`), and applies to every window of that role in the browser. A viewer on another device only follows, so there Bidirectional Sync and Send Only are disabled, with a note that says why. Opening the menu puts the focus on the ticked mode. The arrow keys move between the modes, and Escape closes the menu and gives the focus back to the button.

Several decks on one site, such as the decks of `slide-ng build a.md b.md` or the project sites of one GitHub Pages user, do not follow each other: the sync channel and the stored settings belong to the deck's base path. Only dark mode is shared.

## Turning it off

`presenter: false` in the headmatter removes the presenter page, its button and its menu entry. `presenter: dev` or `build` keeps it only in that mode.
