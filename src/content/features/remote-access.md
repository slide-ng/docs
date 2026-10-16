---
title: Remote access
description: Let other devices open the deck and follow the presenter.
---

# Remote access

```sh
slide-ng --remote=secret     # others on your network can open the deck and follow the presenter
slide-ng --remote            # the same, without a password; it prints a warning
```

The command prints the public and private deck addresses and the presenter address, `/presenter/1?password=secret`. Use that address on the presenter's device. A viewer opens `http://<your address>:4230/1?password=secret`.

- Only the dev server listens on the network, on `0.0.0.0` unless you pass `--bind <address>`. Its companion server stays on `127.0.0.1`.
- The password is optional, as in Slidev. Without one, the host, origin and session token of every request are still checked.
- It lets a device sync and write. It is sent without encryption and there is no HTTPS, so use it on a network you trust.
- Windows of one browser sync with no server. Other devices need this.

See [Security](../project/security.md) for the checks the server makes. `--tunnel` is not available.
