---
title: Security
description: How to report a vulnerability, and what slide.ng does to protect you when you run someone else's deck.
---

# Security

## Reporting a vulnerability

Do not open a public issue for a security problem. Use GitHub's private vulnerability reporting: open the Security tab of the repository and choose Report a vulnerability. Say what you found, which version it affects and how to reproduce it. The report stays private until a fix is released.

Problems in a theme belong in the slide.ng-themes repository, and problems in the tool itself in the slide.ng repository. Only the latest release gets fixes.

## A deck is code

A deck can contain Angular templates, components, setup files and themes, and slide.ng compiles and runs them. Treat a deck from someone else as you would treat a project from someone else: read it before you run `slide-ng` on it. A `<script>` element in a slide is removed with a warning, and a link to a `javascript:` address is replaced by `#`, but components, setup files and themes still run code. The checks below limit what a deck can ask the tool to do. They do not make it safe to run an unknown deck.

## What the tool checks

**The dev server.** `slide-ng dev` runs three processes. The companion server, which saves slides, drawings and `slide-ng-drag` positions, listens on `127.0.0.1` only, and the dev server proxies `/__slide-ng/*` to it. For every request and every WebSocket upgrade it checks the `Host` and `Origin`. Writes need a random session token and a JSON content type, and with a password the cookie as well. A request never names a file: it names a slide number, which is looked up with the parser, or an `<integer>.svg`. Every path is confined to the deck's folder, so `..`, absolute paths and symlinks out are refused. Bodies and WebSocket messages have size limits, and drawing markup is checked against a whitelist of shapes.

**`--remote`.** Only the dev server listens on the network, and always with a password: the one given, `SLIDE_NG_PASSWORD`, a prompt on a terminal, or a random one that is printed. Wrong passwords are limited per client address. A login lasts 8 hours and is signed with the password, so it survives a restart with the same password, and changing the password ends every login. Whoever has the password can edit your slides. It is sent without encryption and there is no HTTPS, so use it on a network you trust.

**Export and build.** File names pass a sanitiser, so `exportFilename` from a deck can only be a plain name in the current folder. A deck cannot choose the output folder or the browser program: `output` and `executablePath` come only from the command line or the environment. The build only empties a folder that is new, empty or marked `.slide-ng-build`, and refuses the current folder, your home folder and `/`. The static server used for export confines paths too.

**The MCP server.** Every change is parsed again before it is written, and only the deck's own markdown files are touched.

**The code runner.** `{monaco-run}` code runs in a sandboxed frame with no access to the slides, and stops after 5 seconds.

## Options that make the build machine fetch things

`remoteAssets` and `fonts.selfHost` make the machine that builds download files from addresses the deck names. A deck from someone else can use that to make your machine request addresses of its choice. Build decks you do not trust without these options. Remote pictures are limited to `image/*` answers up to 20 MB.

## Themes and addons

A theme or addon can bring code that runs while slides are generated (the `setup/` Node hooks) and in the browser. A missing theme stops the build with the install command, and in a terminal asks before installing. Install only themes you trust.

## This site

The documentation site is static, has no server code and collects nothing. The demos are plain builds of slide.ng decks served from the same site.
