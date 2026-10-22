---
title: Timer
description: A stopwatch or countdown on the presenter page.
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

A bar shows how much of the duration has passed. `progressBar: { minutes: true }` shows the minutes on the slides too, see [Progress bar](./progress-bar.md).
