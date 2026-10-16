---
title: Agents and the skill
description: Install the slide.ng agent skill and connect an MCP client, so a coding agent can write and edit decks.
---

# Agents and the skill

Two things help a coding agent work on a deck: the agent skill, which teaches it how slide.ng works, and the MCP server, which lets a tool client read and edit slides.

## The agent skill

The skill is a folder in the common `SKILL.md` format. The main file has the quick start, the syntax and a table of topics. One short reference per topic sits in `references/`. Slide.ng is Angular, so the skill says where Slidev (Vue) habits fail, and it lists what does not exist so that an agent does not invent it.

Install it in a deck:

```sh
slide-ng skills install                        # .agents/skills/slide-ng in the current folder
slide-ng skills install --dir tools/skills     # tools/skills/slide-ng
slide-ng skills install --force                # replace an earlier copy
```

- `--dir` is the folder that holds skills. The skill itself goes in `<dir>/slide-ng`. The default is `.agents/skills`.
- It never overwrites. An existing `slide-ng` folder is an error unless you pass `--force`, and `--force` only replaces a folder whose `SKILL.md` is this skill.
- It never writes outside the current folder. A `--dir` that leads out, also through a symbolic link, is refused.

The skill is part of the `slide-ng` package, so an installed copy has it. Point your agent tooling at the installed folder if it does not look in `.agents/skills` by itself.

## The MCP server

```sh
slide-ng mcp [slides.md]
```

This starts an MCP server on stdio, so a client can read and edit the deck's slides. See [MCP server](../features/mcp.md) for the tools.

## See also

- [CLI reference](../built-in/cli.md)
