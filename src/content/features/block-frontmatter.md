---
title: Block frontmatter
description: Write a slide's frontmatter as a fenced yaml block.
---

# Block frontmatter

Instead of the `---` lines around the frontmatter, a slide can start with a fenced `yaml` block. It is useful when your editor treats `---` as something else.

````md
---

```yaml
layout: center
class: text-center
```

# A centred slide
````

The block is read by the markdown parser, which is Slidev's own, and gives the same result as the usual form. It must be at the very top of the slide.
