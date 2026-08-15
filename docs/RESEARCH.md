# DeepSeek Harness client-plugin research

Research target: installed DeepSeek Harness `0.1.0-rc.6` and the sibling `@syncended/dsh-codex` plugin.

## Reference plugin

`../deepseek-harness-openai-codex-plugin` establishes the reusable npm/bundle conventions:

- a Cordis package with an ESM Host entry;
- `cordis.patch.yml` inserted through `package.json#dsh.bundle.patch`;
- a small publish allowlist in `files`;
- profile installation through `dsh plugin --profile web add ...`.

It is Host-only, so it does not contain the client half needed by this project. Picture-in-picture adds `exports["./client"]` and `package.json#dsh.client`.

## How DSH loads browser plugins

`@deepseek-ai/dsh-client-modules` scans enabled Host Loader entries for packages declaring `dsh.client`. It resolves each package's `./client` export, adds the bundle to `window.__DSH_BOOT__`, and serves it from `/plugins/<id>/client.js`.

The bundle uses DSH's lazy module format:

```js
window.__ModuleLoader__.load({
  id: "@scope/package",
  factory(require) {
    return { apply, inject };
  },
});
```

There are two separate dependency layers:

1. `package.json#dsh.client.inject` lists **client package ids** and controls browser Loader ordering/HMR propagation.
2. The browser module's exported `inject` lists **Cordis service names** such as `slots` and `sessions`.

React and ReactDOM are platform modules supplied by the Web shell and must share the shell's module instances.

## Chosen extension point

`@deepseek-ai/dsh-client-ui-layout` declares:

```ts
"shell.overlay": {
  kind: "list";
  scope: "root";
}
```

It is the correct additive, frame-wide floating layer. Registering into `root`, `conversation`, or `sidebar` would shadow an existing single-slot owner and replace major parts of the UI.

The contribution uses `ctx.slots.inject("shell.overlay", callback)` instead of a bare registration. This waits for the declaration, tears down with its lifetime, and re-registers after a declaration/HMR rebuild.

Because `shell.overlay` is root-scoped, it does not receive `sessionId` or `useSession`. The plugin subscribes directly to the public root services instead.

## Session APIs used

The public `ctx.sessions` contract provides:

- `sessions.list.getSnapshot()` / `subscribe()` — list, summary state, and current selection;
- `sessions.open(id)` — switch the current session;
- `sessions.binding(id)` — obtain a stable `SessionBinding`;
- `binding.session.getSnapshot()` / `subscribe()` — observe the conversation;
- `binding.session.prompt([{type: "text", text}], "queue")` — send a reply.

`ConversationSnapshot.nodes` and `partial` are suitable for a compact text transcript. The full Harness renderer is composed from keyed business slots and should not be cloned into a detached document.

## Important runtime constraint

The current client runtime is single-stage: the open history window follows `sessions.list.current`. Calling `binding(id)` for a non-current session does not independently stage its history.

Therefore the supported design is:

- PiP mirrors the active session;
- choosing another session in PiP calls `sessions.open(id)`;
- the main Web GUI follows the same selection.

A PiP window pinned to Session B while the main GUI remains on Session A requires a future multi-pane/multi-stage runtime API.

## Pending interactions

`ConversationSnapshot.pending` includes approvals, plan reviews, and structured user questions. These use specialized `PendingWait.respond(...)` payloads and the main composer has domain-specific validation/takeover UI.

The MVP does not duplicate those controls. It:

- marks the session as waiting;
- disables ordinary prompt submission while the structured wait is active;
- exposes a button that focuses the main Harness window.

Ordinary text replies continue to use queue mode. If the agent is running, Harness queues the reply for the next turn.

## Native PiP and fallback

The Document Picture-in-Picture API can host arbitrary HTML in a browser-managed always-on-top window. The implementation requests a `390 × 620` document, installs plugin-owned CSS, mirrors the Harness dark-theme attribute, and portals the existing React mini-chat tree into that document.

When the API is absent or the browser denies the request, the same component renders as a fixed panel in `shell.overlay`. This keeps all non-Chromium browsers functional without a separate UI implementation.

## Primary inspected packages

- `@deepseek-ai/dsh-client-modules`
- `@deepseek-ai/dsh-client-runtime`
- `@deepseek-ai/dsh-client-ui-slots`
- `@deepseek-ai/dsh-client-ui-layout`
- `@deepseek-ai/dsh-client-ui-conversation`
- `@deepseek-ai/dsh-client-web`
- `@deepseek-ai/dsh-client-hmr`

The installed package READMEs and generated `.d.ts` contracts were treated as the public API authority.
