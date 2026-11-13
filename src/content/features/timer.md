---
title: Timer
description: A stopwatch or countdown on the presenter page, over the slides, or inside a slide.
---

# Timer

The presenter page has a timer. Describe it in the headmatter:

```md
---
duration: 30min
timer: countdown
---
```

- `duration` is `30min`, `1h30min`, `90s`, or a number of minutes.
- `timer` is `stopwatch` (the default) or `countdown`.

The timer starts, pauses and resets from the buttons on the presenter page. Hover the clock, or Tab to it, for the pause, play and reset buttons. On a touch screen, such as a phone used as the remote, they are always shown.

- The timer is shared: every window and device shows the same time, also when their clocks are not set alike.
- A reload of the presenter page keeps a running or paused timer. A presenter tab that was closed and opened again gets it from any other open window of the deck, and from the dev server while it runs. In a built deck with no other window open it starts again.
- A restart of the dev server (`r`) keeps the timer too.
- The newest start, pause or reset wins, so a tab that comes back with the time it kept does not undo a later reset from another window.

## Without the presenter page

New in 3.5. To keep an eye on the time while you present from the slides alone:

- **Show Timer**, in the settings menu or the right-click menu, puts the timer over the slides. Drag it anywhere, and the place is kept in the browser.
- **Timer Minutes** in the settings sets the length here and now: a countdown of that many minutes in this browser, over the deck's `duration`. Empty goes back to the deck's. Every window of the deck in this browser follows it.
- **Timer Size** in the settings picks S, M or L.
- **Timer Fades** picks when it fades: **When Idle** (after 3 seconds without mouse movement, the default) or **Always** (faint until you hover it).
- Click the clock to start or pause it, or Tab to it and press Space or Enter. Hover it for reset and hide.

To put the clock in a slide or a layer, write `<slide-ng-timer />`:

```md
Time left: <slide-ng-timer class="text-4xl" />

<slide-ng-drag pos="700,40,200,_"><slide-ng-timer /></slide-ng-drag>
```

Style it with `class`, and wrap it in [`slide-ng-drag`](./draggable.md) to move it. A click starts or pauses it. In the overview and the PDF it is shown as plain text. In a layer, import `SlideTimer` from `slide-ng/builtin/slide-timer`.

Every timer shows the same shared time, so the presenter page, the floating timer and `<slide-ng-timer />` always agree.

A bar shows how much of the duration has passed. `progressBar: { minutes: true }` shows the minutes on the slides too, see [Progress bar](./progress-bar.md).
