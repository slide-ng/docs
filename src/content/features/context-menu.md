---
title: Context menu
description: The right-click menu, and how to turn it off or add to it.
---

# Context menu

A right click on a slide opens a menu with the same actions as the bar. Hold Shift while right clicking for the browser's own menu.

<ngmd-image src="/images/ui/context-menu-light.png" alt="The right-click menu over a slide" caption="The context menu" width="480"></ngmd-image>

```md
---
contextMenu: false
---
```

`contextMenu` is `true`, `false`, or `dev` or `build` to keep it only in that mode. To add entries, a `setup/context-menu.ts` file gets the list and returns the one to show, see [Setup hooks](../customize/setup-hooks.md).
