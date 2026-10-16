---
title: Formatting
description: Tidy slides.md with slide-ng format.
---

# Formatting

```sh
slide-ng format [slides.md]
```

Rewrites the file with the same parser that reads it. Slide by slide it:

- trims blank lines around the content, leaving one blank line after the frontmatter and before the next `---`
- prints the frontmatter again as clean YAML, keeping comments
- puts the speaker note in an HTML comment at the end

Files that `src:` imports are not touched. Name them as arguments to format them too. A file that is already tidy is reported as such. There is no editor plugin for it.
