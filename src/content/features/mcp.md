---
title: MCP server
description: Read and edit slides from a tool client over the Model Context Protocol.
---

# MCP server

```sh
slide-ng mcp [slides.md]
```

Starts an MCP server on stdio. A client that speaks the protocol can read and edit the deck's slides. There are seven tools:

| Tool | What it does |
| --- | --- |
| `list_slides` | Lists the slides. |
| `get_outline` | Returns the outline built from slide titles. |
| `get_slide` | Returns one slide's markdown and metadata. |
| `update_slide` | Replaces a slide's content. |
| `insert_slide` | Adds a slide. |
| `remove_slide` | Removes a slide. |
| `move_slide` | Moves a slide. |

- Slide 1, the headmatter, cannot be removed or moved.
- Insert, remove and move need all slides to be in the entry file.
- Every change is parsed again before it is written, and only the deck's own markdown files are touched. A path outside the deck's folder is refused.
