---
title: Recording
description: A camera bubble and in-browser recording of the screen or camera.
---

# Recording

```md
---
record: true
---
```

`record` is `dev` by default, so recording is available only while developing. `true`, `false` and `build` also work.

With it on, the bar gets a camera button and a record button, and the settings menu gets camera, microphone and "record screen or camera". The camera is a round, draggable picture over the slides. Recording uses the browser's `MediaRecorder` and downloads a `.webm` file named after the deck when you stop. Pause and resume work.

Limits: no separate camera file, no mp4 or mkv, no cloud upload, and the file has no duration field, so some players show the length only after a seek.
