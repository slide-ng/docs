---
title: Remote access
description: Let other devices open the deck and follow the presenter.
---

# Remote access

```sh
slide-ng --remote=secret     # others on your network can open the deck and follow the presenter
slide-ng --remote            # the same, with a random password that is printed
SLIDE_NG_PASSWORD=secret slide-ng --remote   # keeps the password out of the process list
```

The command prints the public and private deck addresses and the presenter address, `/presenter/1?password=secret`. Use that address on the presenter's device. A viewer opens `http://<your address>:4230/1?password=secret`.

- Only the dev server listens on the network, on `0.0.0.0` unless you pass `--bind <address>`. Its companion server stays on `127.0.0.1`.
- There is always a password: the one given, `SLIDE_NG_PASSWORD`, a prompt on a terminal, or a random one. This differs from Slidev, which allows a remote mode without one. The host, origin and session token of every request are checked as well.
- It lets a device sync and write, and opens the presenter and notes pages. Without it, those addresses go to the slides.
- It is sent without encryption and there is no HTTPS, so use it on a network you trust. Whoever has it can edit your slides.
- A login lasts 8 hours. It is signed with the password, so it survives a restart of the dev server with the same password. Changing the password ends every login at once. There is no other way to log a device out.
- Windows of one browser sync with no server. Other devices need this.

See [Security](../project/security.md) for the checks the server makes. `--tunnel` is not available.
