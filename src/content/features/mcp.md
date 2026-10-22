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
| `update_slide` | Replaces one slide: frontmatter, content and notes. It may add or remove the frontmatter, and must stay one slide. |
| `insert_slide` | Adds a slide after another one. Its `markdown` may start with its own `---` frontmatter block, or the frontmatter is given as an object. |
| `remove_slide` | Removes a slide, and returns the slides left and the number and title of the one removed. |
| `move_slide` | Moves a slide. |

- Slide 1, the headmatter, cannot be removed or moved.
- Insert, remove and move need all slides to be in the entry file.
- Every change is parsed again before it is written, and only the deck's own markdown files are touched. A path outside the deck's folder is refused.

## Over HTTP from the dev server

`slide-ng dev` also serves MCP at `http://localhost:4230/__mcp`, with the streamable HTTP transport, as Slidev does. It is stateless and takes POST only. It has the seven tools above and two more:

| Tool | What it does |
| --- | --- |
| `get_info` | The entry file, the title, the number of slides, the files, the dev address and the current slide. With `--remote` also `remoteUrls`, the addresses other machines open, without the password. |
| `goto_slide` | Moves every open window to a slide and click, and answers the click step the windows took. A step past the slide's last click becomes the last. With no window open the answer is the asked step, and `windows` is 0. |

A client configuration:

```json
{ "mcpServers": { "slide-ng": { "type": "http", "url": "http://localhost:4230/__mcp" } } }
```

- It has the dev server's rules: the Host and Origin checks, and with `--remote` the password. The client sends it as `Authorization: Bearer <password>`. Spaces at its start or end are ignored.
- A password that is not ASCII may be sent as UTF-8, as `curl` does. `fetch`, and so the MCP TypeScript SDK's client, cannot send a character above U+00FF: such a client puts the UTF-8 bytes in the header itself, in Node `'Bearer ' + Buffer.from(password, 'utf8').toString('latin1')`.
- `mcp: false` in the headmatter turns the endpoint off.
- A window whose sync is turned off does not follow `goto_slide`. It is waited for 5 seconds, and the answer is then the asked step.
