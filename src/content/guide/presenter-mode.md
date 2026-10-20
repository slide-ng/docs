---
title: Presenter mode
description: The presenter page, speaker notes, the timer, the laser pointer and syncing windows.
---

# Presenter mode

Open `/presenter` or press the presenter button in the bar. The page shows the current slide, a preview of the next step, your notes with click markers, a slider for the clicks, and a timer.

<ngmd-image src="/images/ui/presenter-layout-1.png" alt="The presenter page: the current slide, the next step and the notes" caption="The presenter page, first layout" width="640"></ngmd-image>

The audience page, for example `/3`, in another window or on another device follows the presenter. `/notes` shows only the notes and follows too. A layout button cycles through three arrangements of the presenter page.

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

`slide-ng export-notes` makes a PDF of the notes. See [Speaker notes](../features/speaker-notes.md).

## Click preview

The eye button next to the layout button, or `u`, turns on a click preview of the current slide. The preview is on the presenter page only. The audience page, `/notes` and the next-step pane do not change.

- Parts that are already shown look as usual.
- The part of the next click is brighter and has a dashed outline.
- The parts of later clicks are greyed out.
- Each part that a later click changes has a badge with the number of that click.

Click a badge or a greyed-out part to go to that click. Every window follows. A link or button inside a greyed-out part is not followed; parts already shown keep their own clicks. While you draw, the pen gets the click and the slide does not move. The choice is remembered in the browser, under the key `slide-ng-presenter-click-preview`. The shortcut is named `toggle_click_preview`, see [Shortcuts](../built-in/shortcuts.md#change-the-keys).

A theme or a deck can change the look with CSS variables:

| Variable | Default | What it sets |
| --- | --- | --- |
| `--slide-ng-ghost-opacity` | `0.25` | Opacity of the parts of later clicks |
| `--slide-ng-ghost-next-opacity` | `0.75` | Opacity of the part of the next click |
| `--slide-ng-ghost-next` | `var(--slidev-theme-primary)` | Colour of the outline and the badge of the next click |
| `--slide-ng-ghost-badge-background` | `#6b7280` | Background of the other badges |
| `--slide-ng-ghost-badge-foreground` | `white` | Text of the badges |

The parts carry the classes `slide-ng-click-ahead` and, for the next click, `slide-ng-click-next`. The click is in `data-slide-ng-click-at`.

The preview has limits:

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

`duration` takes `30min`, `1h30min`, `90s`, or a number of minutes. `timer` is `stopwatch` (the default) or `countdown`. A running timer survives a reload of the presenter page. See [Timer](../features/timer.md).

## Cursor and laser

The presenter's mouse is shown on the audience page as a pointer or a red laser dot. Switch it in the settings menu or with the bar button.

## Syncing

Windows of one browser follow each other with no server, over a `BroadcastChannel`. Other devices need the dev server with `--remote`, see [Remote access](../features/remote-access.md). There, the presenter and notes pages need the password; without it they go to the slides. A window or device that joins later catches up with the presenter, timer included.

Every window follows the presenter. Slidev's sync mode menu (send only, receive only, off) is not there.

## Turning it off

`presenter: false` in the headmatter removes the presenter page, its button and its menu entry. `presenter: dev` or `build` keeps it only in that mode.
