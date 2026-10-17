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

The timer starts, pauses and resets from the buttons on the presenter page, and the state is shared with the other presenter windows. A reload of the presenter page keeps a running or paused timer, and a window that opens later gets the same time. A bar shows how much of the duration has passed.
