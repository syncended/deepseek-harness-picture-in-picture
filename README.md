# DeepSeek Harness — Picture-in-Picture Chat

A browser plugin for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI. It adds a compact chat that can stay above other windows, switch the active Harness session, follow streaming replies, and send a reply without returning to the full page.

## Features

- **Native Document Picture-in-Picture** on supported Chromium browsers.
- **In-page floating fallback** when the Document Picture-in-Picture API is unavailable or denied.
- Session switcher with live **working / waiting / completed** state.
- Compact user and assistant transcript with streaming assistant output.
- Replies are sent through the public `Session.prompt(..., "queue")` API. While an agent is working, a reply is queued for the next turn.
- English and Russian UI copy, dark-theme synchronization, keyboard and screen-reader labels.
- `Enter` sends; `Shift+Enter` inserts a new line.

> Switching a chat in the mini window calls `ctx.sessions.open(id)`, so the main Harness window follows the same active chat.

## Requirements

- DeepSeek Harness `0.1.0-rc.6` or a compatible release with client plugins and the `shell.overlay` slot.
- The Web profile (`dsh web`).
- For native always-on-top PiP: a Chromium browser supporting the [Document Picture-in-Picture API](https://developer.mozilla.org/en-US/docs/Web/API/Document_Picture-in-Picture_API). Other browsers use the in-page panel.

## Install

From npm after publication:

```bash
dsh plugin --profile web add @syncended/dsh-pip
```

From this checkout during development:

```bash
dsh plugin --profile web add /absolute/path/to/deepseek-harness-picture-in-picture-plugin
```

Some pnpm-backed profiles require the workspace-root flag:

```bash
dsh plugin --profile web add -w /absolute/path/to/deepseek-harness-picture-in-picture-plugin
```

Restart `dsh web` after first installation. A chat-bubble button then appears in the bottom-right corner of the Web GUI.

## Development

The published browser entry is deliberately dependency-free source in DSH's lazy client-module format; React and ReactDOM are resolved from the Web shell's platform module table.

```bash
npm run check
npm test
npm pack --dry-run
```

Tag-driven npm publication is documented in [`RELEASING.md`](./RELEASING.md).

The package has two faces:

- `lib/index.js` — no-op Host loader entry.
- `lib/client.js` — browser implementation registered in the additive `shell.overlay` slot.

`package.json#dsh.client` orders the client after runtime, layout, and conversation assembly. `cordis.patch.yml` inserts the package into the active profile.

## Architecture notes

The full API investigation and design rationale are recorded in [`docs/RESEARCH.md`](./docs/RESEARCH.md).

The implementation uses only supported DSH client seams:

- `ctx.slots.inject("shell.overlay", ...)` for a lifecycle-safe floating UI contribution.
- `ctx.sessions.list` for the session list and current selection.
- `ctx.sessions.open(id)` to switch the active session.
- `ctx.sessions.binding(id).session` for the conversation observable and `prompt` behavior.
- `react-dom#createPortal` to render the same React mini-chat tree into the Document PiP window.

The PiP view intentionally renders conversational text and status notices rather than cloning the full Harness conversation component. Tool cards, attachments, structured approvals, plan review, and `ask_user_question` controls remain in the main UI; the mini-chat shows that input is needed and provides a button to focus the main window.

## Current limitations

- Document Picture-in-Picture is Chromium-only at the time of writing.
- Replies use queue mode; steering/interruption controls are intentionally not exposed in the first version.
- Structured pending interactions must be completed in the main Harness window.
- The mini transcript displays the latest 18 conversational rows and omits tool-result cards.

## License

MIT — see [`LICENSE`](./LICENSE).
