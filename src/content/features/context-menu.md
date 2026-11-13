---
title: Context menu
description: The right-click menu, and how to turn it off or add to it.
---

# Context menu

A right click on a slide opens a menu with the same actions as the bar. Hold Shift while right clicking for the browser's own menu.

When the navigation bar is out of sight, the menu also has Show Navigation Bar, which shows it for a few seconds. Once a viewer moved the bar, Reset Navigation Bar Position puts it back in the deck's own place. See [Shortcuts](../built-in/shortcuts.md#mouse).

Show Timer and Hide Timer put the [timer](./timer.md#without-the-presenter-page) over the slides or take it away (new in 3.5).

<ngmd-image src="/images/ui/context-menu-light.webp" alt="The right-click menu over a slide" caption="The context menu" width="480"></ngmd-image>

```md
---
contextMenu: false
---
```

`contextMenu` is `true`, `false`, or `dev` or `build` to keep it only in that mode. To add entries, a `setup/context-menu.ts` file gets the list and returns the one to show, see [Setup hooks](../customize/setup-hooks.md).
