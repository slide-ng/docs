---
title: Presenter mode
description: The presenter page, speaker notes, the timer, the laser pointer and syncing windows.
---

# Presenter mode

Open `/presenter` or press the presenter button in the bar. The page shows the current slide, a preview of the next step, your notes with click markers, a slider for the clicks, and a timer.

<ngmd-image src="/images/ui/presenter-layout-1.png" alt="The presenter page: the current slide, the next step and the notes" caption="The presenter page, first layout" width="640"></ngmd-image>

The audience page, for example `/3`, in another window or on another device follows the presenter. `/notes` shows only the notes and follows too. A layout button cycles through three arrangements of the presenter page.

## Notes

A slide's note is its last HTML comment. In a note, `[click]` and `[click:3]` mark where a click starts. Double click a marker to jump to it.

```md
# A slide

<!--
Say hello.
[click] Then show the first point.
[click:3] And the third.
-->
```

`slide-ng export-notes` makes a PDF of the notes. See [Speaker notes](../features/speaker-notes.md).

## Timer

```md
---
duration: 30min
timer: countdown
---
```

`duration` takes `30min`, `1h30min`, `90s`, or a number of minutes. `timer` is `stopwatch` (the default) or `countdown`. See [Timer](../features/timer.md).

## Cursor and laser

The presenter's mouse is shown on the audience page as a pointer or a red laser dot. Switch it in the settings menu or with the bar button.

## Syncing

Windows of one browser follow each other with no server, over a `BroadcastChannel`. Other devices need the dev server with `--remote`, see [Remote access](../features/remote-access.md).

## Turning it off

`presenter: false` in the headmatter removes the presenter page, its button and its menu entry. `presenter: dev` or `build` keeps it only in that mode.
