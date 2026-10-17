---
title: Markdown extras
description: GitHub alerts, task lists and footnotes.
---

# Markdown extras

```md
> [!NOTE]
> Useful information.

- [x] done
- [ ] to do

A claim[^1].

[^1]: The note is listed at the bottom of the slide.

## Results {#results .text-red}

![logo](/logo.png){width=120}
```

- GitHub alerts: `NOTE`, `TIP`, `IMPORTANT`, `WARNING` and `CAUTION`.
- Task lists render as checkboxes.
- Footnotes are listed at the bottom of the slide. Footnote numbers are not links, and a note is one paragraph of inline markdown.
- `{#id .class}` at the end of a heading puts an id and classes on it.
- `{width=120}` or `{height=80}` right after a picture sets its size.
- A link to a `javascript:` address is replaced by `#`, with a warning, because it would run code when clicked.

`:emoji:` shortcodes are not converted: type the emoji. MDC or Comark syntax is not supported, and `mdc: true` in the headmatter gives a warning.
