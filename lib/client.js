window.__ModuleLoader__.load({
  id: "@syncended/dsh-pip",
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");
    const ReactDOM = require("react-dom");
    const { MarkdownText, writeClipboard } = require("@deepseek-ai/dsh-client-ui-primitives");
    const h = React.createElement;

    const PLUGIN_ID = "@syncended/dsh-pip";
    const STYLE_ID = `${PLUGIN_ID}/client.css`;
    const EMPTY_LIST = Object.freeze({
      ids: Object.freeze([]),
      byId: Object.freeze({}),
      current: undefined,
      phase: "pending",
      subagentsByParent: Object.freeze({}),
      jobsBySession: Object.freeze({}),
      currentAddress: undefined,
    });
    const EMPTY_MODEL_DIRECTORY = Object.freeze({
      current: null,
      routable: null,
      groups: Object.freeze([]),
      failures: Object.freeze([]),
      status: "idle",
      error: null,
    });
    const EMPTY_SESSION = Object.freeze({
      sessionId: "",
      nodes: Object.freeze([]),
      partial: null,
      pending: Object.freeze([]),
      queue: Object.freeze([]),
      runningCalls: Object.freeze([]),
      running: false,
      composerPhase: "blank",
      removed: false,
      openState: "cold",
      openError: null,
      hasMore: false,
      loadingOlder: false,
      promptError: null,
      blank: true,
      lastAgentError: null,
    });

    const CSS = String.raw`
:root {
  --dsh-pip-accent: #4d6bfe;
  --dsh-pip-accent-strong: #3b5af1;
  --dsh-pip-bg: #ffffff;
  --dsh-pip-bg-soft: #f5f6f8;
  --dsh-pip-bg-user: #f3f4f6;
  --dsh-pip-composer: #ffffff;
  --dsh-pip-border: rgba(27, 31, 36, 0.11);
  --dsh-pip-text: #171a1f;
  --dsh-pip-muted: #7b818c;
  --dsh-pip-danger: #d14343;
  --dsh-pip-shadow: 0 24px 72px rgba(15, 23, 42, 0.22);
  --dsh-pip-card-shadow: 0 8px 26px rgba(15, 23, 42, 0.10);
}
body[data-ds-dark-theme] {
  --dsh-pip-bg: #151517;
  --dsh-pip-bg-soft: #232324;
  --dsh-pip-bg-user: #2c2c2e;
  --dsh-pip-composer: #2c2c2e;
  --dsh-pip-border: rgba(255, 255, 255, 0.10);
  --dsh-pip-text: #f9fafb;
  --dsh-pip-muted: #adb2b8;
  --dsh-pip-danger: #ff7b7b;
  --dsh-pip-shadow: 0 24px 76px rgba(0, 0, 0, 0.52);
  --dsh-pip-card-shadow: 0 10px 30px rgba(0, 0, 0, 0.26);
}
.dsh-pip-entry { pointer-events: auto; }
.dsh-pip-launcher {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 70;
  width: 50px;
  height: 50px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(145deg, #6d87ff, var(--dsh-pip-accent-strong));
  box-shadow: 0 10px 30px rgba(60, 85, 220, 0.36);
  cursor: pointer;
  transition: transform 140ms ease, box-shadow 140ms ease;
}
.dsh-pip-launcher:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(60, 85, 220, 0.44); }
.dsh-pip-launcher:disabled { cursor: progress; opacity: .72; transform: none; }
.dsh-pip-launcher[hidden] { display: none; }
.dsh-pip-launcher:focus-visible, .dsh-pip-icon-button:focus-visible, .dsh-pip-send:focus-visible,
.dsh-pip-queue-action:focus-visible, .dsh-pip-select:focus-visible, .dsh-pip-chat-option:focus-visible,
.dsh-pip-control:focus-visible,
.dsh-pip-control-select:focus-visible, .dsh-pip-dock-header:focus-visible, .dsh-pip-load-older:focus-visible,
.dsh-pip-message-action:focus-visible, .dsh-pip-attachment-remove:focus-visible,
.dsh-pip-interaction-option:focus-visible, .dsh-pip-interaction-action:focus-visible, .dsh-pip-interaction-input:focus-visible {
  outline: 2px solid var(--dsh-pip-accent);
  outline-offset: 2px;
}
.dsh-pip-launcher-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border: 2px solid var(--dsh-pip-bg);
  border-radius: 50%;
  background: #33b36b;
}
.dsh-pip-launcher-badge[data-state="running"] { background: #6b8cff; animation: dsh-pip-pulse 1.4s infinite; }
.dsh-pip-launcher-badge[data-state="waiting"] { background: #e5a838; }
@keyframes dsh-pip-pulse { 50% { opacity: .45; transform: scale(.82); } }
.dsh-pip-inline {
  position: fixed;
  z-index: 71;
  right: 22px;
  bottom: 22px;
  width: min(420px, calc(100vw - 28px));
  height: min(660px, calc(100vh - 28px));
  min-height: 0;
  border: 1px solid var(--dsh-pip-border);
  border-radius: 28px;
  overflow: hidden;
  background: var(--dsh-pip-bg);
  box-shadow: var(--dsh-pip-shadow);
}
.dsh-pip-root { width: 100%; height: 100%; min-width: 0; color: var(--dsh-pip-text); background: var(--dsh-pip-bg); overflow: hidden; }
.dsh-pip-card { width: 100%; height: 100%; min-width: 0; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); font: 13px/1.45 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
.dsh-pip-header { position: relative; z-index: 20; display: flex; align-items: center; gap: 8px; padding: 12px 12px 10px 16px; border-bottom: 1px solid var(--dsh-pip-border); background: var(--dsh-pip-bg); }
.dsh-pip-mark { width: 26px; height: 26px; flex: none; display: grid; place-items: center; color: var(--dsh-pip-text); }
.dsh-pip-mark .dsh-pip-fish { width: 22px; height: auto; }
.dsh-pip-chat-selector { position: relative; min-width: 0; flex: 1; }
.dsh-pip-select { width: 100%; min-width: 0; height: 32px; display: flex; align-items: center; gap: 7px; border: 0; border-radius: 16px; padding: 0 9px 0 10px; color: var(--dsh-pip-text); background: transparent; font: inherit; font-weight: 600; text-align: left; cursor: pointer; }
.dsh-pip-select:hover, .dsh-pip-select[aria-expanded="true"] { background: var(--dsh-pip-bg-soft); }
.dsh-pip-select-label { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-pip-select-chevron { flex: none; color: var(--dsh-pip-muted); font-size: 13px; transition: transform 120ms ease; }
.dsh-pip-select[aria-expanded="true"] .dsh-pip-select-chevron { transform: rotate(180deg); }
.dsh-pip-chat-menu { position: absolute; top: calc(100% + 7px); left: 0; right: 0; z-index: 30; box-sizing: border-box; max-height: min(340px, calc(100vh - 86px)); border: 1px solid var(--dsh-pip-border); border-radius: 15px; padding: 6px; overflow-y: auto; overscroll-behavior: contain; color: var(--dsh-pip-text); background: var(--dsh-pip-composer); box-shadow: 0 16px 42px rgba(0, 0, 0, .22); scrollbar-width: thin; }
.dsh-pip-chat-group + .dsh-pip-chat-group { margin-top: 5px; padding-top: 5px; border-top: 1px solid var(--dsh-pip-border); }
.dsh-pip-chat-group-label { padding: 4px 9px 3px; overflow: hidden; color: var(--dsh-pip-muted); text-overflow: ellipsis; white-space: nowrap; font-size: 10px; font-weight: 650; letter-spacing: .02em; }
.dsh-pip-chat-option { box-sizing: border-box; width: 100%; min-height: 32px; border: 0; border-radius: 10px; padding: 6px 9px; overflow: hidden; color: var(--dsh-pip-text); background: transparent; text-align: left; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; font: 500 12px/18px Inter, ui-sans-serif, system-ui, sans-serif; }
.dsh-pip-chat-option:hover, .dsh-pip-chat-option[aria-selected="true"] { background: var(--dsh-pip-bg-soft); }
.dsh-pip-chat-option[aria-selected="true"] { color: var(--dsh-pip-accent-strong); }
.dsh-pip-icon-button { width: 32px; height: 32px; flex: none; display: grid; place-items: center; border: 0; border-radius: 50%; color: var(--dsh-pip-muted); background: transparent; cursor: pointer; font-size: 18px; }
.dsh-pip-icon-button:hover { color: var(--dsh-pip-text); background: var(--dsh-pip-bg-soft); }
.dsh-pip-conversation { width: 100%; min-width: 0; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr) auto; overflow: hidden; }
.dsh-pip-status { min-height: 30px; display: flex; align-items: center; gap: 7px; padding: 7px 18px; color: var(--dsh-pip-muted); font-size: 12px; }
.dsh-pip-dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: #8b929f; }
.dsh-pip-dot[data-state="running"] { background: #6b8cff; animation: dsh-pip-pulse 1.4s infinite; }
.dsh-pip-dot[data-state="waiting"] { background: #e5a838; }
.dsh-pip-dot[data-state="done"] { background: #33b36b; }
.dsh-pip-messages { min-height: 0; overflow: auto; overscroll-behavior: contain; padding: 12px 18px 24px; scrollbar-width: thin; }
.dsh-pip-load-older { display: block; min-height: 28px; margin: 0 auto 14px; border: 0; border-radius: 14px; padding: 4px 11px; color: var(--dsh-pip-muted); background: var(--dsh-pip-bg-soft); font: 500 11px/18px Inter, ui-sans-serif, system-ui, sans-serif; cursor: pointer; }
.dsh-pip-load-older:hover:not(:disabled) { color: var(--dsh-pip-text); }
.dsh-pip-load-older:disabled { cursor: progress; opacity: .65; }
.dsh-pip-empty { height: 100%; box-sizing: border-box; display: grid; place-items: center; padding: 28px; color: var(--dsh-pip-muted); text-align: center; }
.dsh-pip-message { max-width: 100%; margin: 0 0 16px; padding: 0; border: 0; border-radius: 0; color: var(--dsh-pip-text); white-space: pre-wrap; overflow-wrap: anywhere; background: transparent; font-size: 15px; line-height: 1.65; }
.dsh-pip-message[data-role="user"] { width: fit-content; max-width: 82%; margin-left: auto; padding: 10px 15px; border-radius: 22px; background: var(--dsh-pip-bg-user); line-height: 1.5; }
.dsh-pip-message[data-queued="true"] { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 8px; padding: 9px 9px 9px 15px; }
.dsh-pip-queued-text { min-width: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.dsh-pip-queue-actions { display: flex; align-items: center; gap: 3px; }
.dsh-pip-queue-action { width: 27px; height: 27px; flex: none; display: grid; place-items: center; border: 0; border-radius: 50%; color: var(--dsh-pip-muted); background: color-mix(in srgb, var(--dsh-pip-muted) 8%, transparent); cursor: pointer; font-size: 12px; }
.dsh-pip-queue-action[data-primary="true"] { color: white; background: var(--dsh-pip-accent); }
.dsh-pip-queue-action:hover:not(:disabled) { color: white; background: var(--dsh-pip-accent-strong); }
.dsh-pip-queue-action:disabled { color: var(--dsh-pip-muted); background: color-mix(in srgb, var(--dsh-pip-muted) 10%, transparent); cursor: not-allowed; }
.dsh-pip-message[data-role="system"] { max-width: 100%; padding: 7px 10px; color: var(--dsh-pip-muted); background: var(--dsh-pip-bg-soft); border-radius: 10px; font-size: 12px; line-height: 1.45; }
.dsh-pip-message[data-role="log"] { max-width: 100%; padding: 8px 10px; color: var(--dsh-pip-muted); background: var(--dsh-pip-bg-soft); border-radius: 10px; font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; }
.dsh-pip-message[data-role="error"] { max-width: 100%; padding: 7px 10px; color: var(--dsh-pip-danger); background: color-mix(in srgb, var(--dsh-pip-danger) 8%, transparent); border-radius: 10px; font-size: 12px; }
.dsh-pip-role { display: none; }
.dsh-pip-markdown { min-width: 0; }
.dsh-pip-markdown p { margin: 0 0 10px; }
.dsh-pip-markdown p:last-child { margin-bottom: 0; }
.dsh-pip-markdown code { border-radius: 5px; padding: 1px 4px; background: var(--dsh-pip-bg-soft); font: .88em/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; }
.dsh-pip-markdown pre { max-width: 100%; margin: 8px 0; border: 1px solid var(--dsh-pip-border); border-radius: 10px; padding: 10px 11px; overflow: auto; background: var(--dsh-pip-bg-soft); white-space: pre; }
.dsh-pip-markdown pre code { padding: 0; background: transparent; }
.dsh-pip-markdown a { color: var(--dsh-pip-accent-strong); text-decoration: none; }
.dsh-pip-markdown a:hover { text-decoration: underline; }
.dsh-pip-message-images { display: flex; flex-wrap: wrap; gap: 6px; margin: 7px 0; }
.dsh-pip-message-image { display: block; width: min(180px, 100%); border-radius: 12px; overflow: hidden; background: var(--dsh-pip-bg-soft); }
.dsh-pip-message-image img { display: block; width: 100%; max-height: 220px; object-fit: contain; }
.dsh-pip-message-actions { display: flex; align-items: center; gap: 3px; margin: -8px 0 12px -5px; }
.dsh-pip-message-actions:empty { display: none; }
.dsh-pip-message-action { width: 28px; height: 28px; display: grid; place-items: center; border: 0; border-radius: 50%; color: var(--dsh-pip-muted); background: transparent; cursor: pointer; font-size: 12px; }
.dsh-pip-message-action:hover:not(:disabled) { color: var(--dsh-pip-text); background: var(--dsh-pip-bg-soft); }
.dsh-pip-message-action:disabled { cursor: progress; opacity: .55; }
.dsh-pip-message[data-role="system"] .dsh-pip-role, .dsh-pip-message[data-role="log"] .dsh-pip-role, .dsh-pip-message[data-role="error"] .dsh-pip-role { display: block; margin-bottom: 2px; font-family: Inter, ui-sans-serif, system-ui, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.dsh-pip-stream { opacity: .88; }
.dsh-pip-interaction { flex: none; max-height: 245px; margin: 0 14px 8px; border: 1px solid color-mix(in srgb, var(--dsh-pip-accent) 38%, var(--dsh-pip-border)); border-radius: 16px; padding: 11px 12px; overflow: auto; background: var(--dsh-pip-composer); box-shadow: var(--dsh-pip-card-shadow); }
.dsh-pip-interaction-title { color: var(--dsh-pip-muted); margin-bottom: 5px; font-size: 11px; font-weight: 600; }
.dsh-pip-interaction-question { margin: 7px 0; font-size: 13px; line-height: 18px; }
.dsh-pip-interaction-detail { margin: 5px 0 8px; color: var(--dsh-pip-muted); font-size: 12px; line-height: 17px; }
.dsh-pip-interaction-options { display: flex; flex-wrap: wrap; gap: 5px; margin: 6px 0; }
.dsh-pip-interaction-option { min-height: 28px; border: 1px solid var(--dsh-pip-border); border-radius: 14px; padding: 4px 9px; color: var(--dsh-pip-text); background: var(--dsh-pip-bg-soft); cursor: pointer; font-size: 11px; }
.dsh-pip-interaction-option[data-selected="true"] { border-color: var(--dsh-pip-accent); color: white; background: var(--dsh-pip-accent); }
.dsh-pip-interaction-input { box-sizing: border-box; width: 100%; min-height: 32px; border: 1px solid var(--dsh-pip-border); border-radius: 10px; padding: 6px 9px; color: var(--dsh-pip-text); background: var(--dsh-pip-bg); outline: none; font: 12px/18px Inter, ui-sans-serif, system-ui, sans-serif; }
.dsh-pip-interaction-actions { display: flex; justify-content: flex-end; gap: 6px; margin-top: 9px; }
.dsh-pip-interaction-action { min-height: 30px; border: 0; border-radius: 15px; padding: 5px 11px; color: var(--dsh-pip-text); background: var(--dsh-pip-bg-soft); cursor: pointer; font-size: 11px; }
.dsh-pip-interaction-action[data-primary="true"] { color: white; background: var(--dsh-pip-accent); }
.dsh-pip-interaction-action:disabled { cursor: progress; opacity: .55; }
.dsh-pip-interaction-error { color: var(--dsh-pip-danger); margin-top: 5px; font-size: 11px; }
.dsh-pip-compose { box-sizing: border-box; width: 100%; min-width: 0; padding: 8px 20px 14px; background: linear-gradient(180deg, transparent, var(--dsh-pip-bg) 22%); }
.dsh-pip-compose-card { box-sizing: border-box; width: 100%; min-width: 0; border: 1px solid var(--dsh-pip-border); border-radius: 22px; padding: 10px 10px 8px 14px; background: var(--dsh-pip-composer); box-shadow: var(--dsh-pip-card-shadow); }
.dsh-pip-compose-card:focus-within { border-color: color-mix(in srgb, var(--dsh-pip-accent) 58%, var(--dsh-pip-border)); box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsh-pip-accent) 18%, transparent), var(--dsh-pip-card-shadow); }
.dsh-pip-attachment-rail { display: flex; gap: 7px; margin: 0 0 8px; padding: 0 2px; overflow-x: auto; scrollbar-width: thin; }
.dsh-pip-attachment { position: relative; width: 54px; height: 54px; flex: none; border-radius: 10px; overflow: hidden; background: var(--dsh-pip-bg-soft); }
.dsh-pip-attachment img { width: 100%; height: 100%; object-fit: cover; }
.dsh-pip-attachment-remove { position: absolute; top: 3px; right: 3px; width: 18px; height: 18px; display: grid; place-items: center; border: 0; border-radius: 50%; color: white; background: rgba(0,0,0,.62); cursor: pointer; font: 14px/1 sans-serif; }
.dsh-pip-file-input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.dsh-pip-add-image { width: 28px; flex: none; padding: 0; font-size: 18px; font-weight: 400; }
.dsh-pip-compose textarea { box-sizing: border-box; width: 100%; min-width: 0; min-height: 48px; max-height: 132px; resize: none; border: 0; outline: 0; padding: 1px 2px 8px; color: var(--dsh-pip-text); background: transparent; font: 15px/1.55 Inter, ui-sans-serif, system-ui, sans-serif; }
.dsh-pip-compose textarea::placeholder { color: var(--dsh-pip-muted); }
.dsh-pip-bottom { min-width: 0; background: var(--dsh-pip-bg); }
.dsh-pip-session-dock { display: grid; gap: 6px; margin: 0 14px 2px; }
.dsh-pip-todo, .dsh-pip-goal { border: 1px solid var(--dsh-pip-border); border-radius: 13px; background: var(--dsh-pip-bg-soft); overflow: hidden; }
.dsh-pip-dock-header { width: 100%; min-height: 34px; display: flex; align-items: center; gap: 8px; border: 0; padding: 6px 10px; color: var(--dsh-pip-text); background: transparent; text-align: left; font: 500 12px/18px Inter, ui-sans-serif, system-ui, sans-serif; cursor: pointer; }
.dsh-pip-dock-icon { color: var(--dsh-pip-muted); font-size: 14px; }
.dsh-pip-dock-progress { min-width: 0; flex: 1; overflow: hidden; color: var(--dsh-pip-muted); text-overflow: ellipsis; white-space: nowrap; font-weight: 400; }
.dsh-pip-todo-list { display: grid; gap: 6px; max-height: 132px; margin: 0; padding: 1px 10px 9px; overflow: auto; list-style: none; }
.dsh-pip-todo-item { display: flex; align-items: flex-start; gap: 8px; color: var(--dsh-pip-muted); font-size: 11px; line-height: 1.45; }
.dsh-pip-todo-item[data-status="in_progress"] { color: var(--dsh-pip-text); }
.dsh-pip-todo-item[data-status="completed"] { opacity: .7; text-decoration: line-through; }
.dsh-pip-todo-dot { width: 12px; flex: none; text-align: center; color: var(--dsh-pip-accent); }
.dsh-pip-goal { display: flex; align-items: center; gap: 8px; padding: 7px 10px; color: var(--dsh-pip-muted); font-size: 11px; line-height: 1.4; }
.dsh-pip-goal-label { flex: none; color: var(--dsh-pip-text); font-weight: 600; }
.dsh-pip-goal-objective { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-pip-goal-phase { flex: none; padding: 1px 6px; border-radius: 999px; color: var(--dsh-pip-accent-strong); background: color-mix(in srgb, var(--dsh-pip-accent) 10%, transparent); font-size: 10px; }
.dsh-pip-compose-footer { min-width: 0; display: flex; align-items: center; gap: 6px; min-height: 32px; }
.dsh-pip-compose-controls { min-width: 0; flex: 1; display: flex; align-items: center; gap: 4px; overflow: hidden; }
.dsh-pip-control, .dsh-pip-control-select { box-sizing: border-box; height: 28px; min-width: 0; border: 0; border-radius: 14px; padding: 0 8px; color: var(--dsh-pip-muted); background-color: transparent; font: 500 11px/18px Inter, ui-sans-serif, system-ui, sans-serif; cursor: pointer; }
.dsh-pip-control-select { width: auto; field-sizing: content; appearance: none; -webkit-appearance: none; padding: 0 17px 0 7px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10' fill='none'%3E%3Cpath d='m2.25 3.75 2.75 2.5 2.75-2.5' stroke='%23878d98' stroke-width='1.35' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 4px center; background-size: 10px 10px; }
.dsh-pip-control-select option { color: var(--dsh-pip-text); background-color: var(--dsh-pip-composer); }
.dsh-pip-control:hover:not(:disabled), .dsh-pip-control-select:hover:not(:disabled) { color: var(--dsh-pip-text); background-color: var(--dsh-pip-bg-soft); }
.dsh-pip-control:disabled, .dsh-pip-control-select:disabled { cursor: not-allowed; opacity: .55; }
.dsh-pip-access-select { max-width: 126px; }
.dsh-pip-model-select { max-width: 104px; }
.dsh-pip-control[data-active="true"] { color: var(--dsh-pip-accent-strong); background-color: color-mix(in srgb, var(--dsh-pip-accent) 10%, transparent); }
.dsh-pip-context-pill { box-sizing: border-box; width: 28px; height: 28px; flex: none; display: grid; place-items: center; border-radius: 50%; color: var(--dsh-pip-accent); cursor: default; }
.dsh-pip-context-pill:hover { background: var(--dsh-pip-bg-soft); }
.dsh-pip-context-pill[data-level="warning"] { color: #d28a25; }
.dsh-pip-context-pill[data-level="critical"] { color: var(--dsh-pip-danger); }
.dsh-pip-context-ring { width: 17px; height: 17px; overflow: visible; }
.dsh-pip-context-track, .dsh-pip-context-fill { fill: none; stroke-width: 2; }
.dsh-pip-context-track { stroke: color-mix(in srgb, var(--dsh-pip-muted) 22%, transparent); }
.dsh-pip-context-fill { stroke: currentColor; stroke-linecap: round; transition: stroke-dasharray 180ms ease; }
.dsh-pip-compose-meta { min-height: 14px; margin-top: 3px; padding-left: 2px; color: var(--dsh-pip-muted); font-size: 10px; line-height: 1.35; }
.dsh-pip-compose-meta[data-error="true"] { color: var(--dsh-pip-danger); }
.dsh-pip-stats { box-sizing: border-box; width: 100%; display: flex; flex-wrap: wrap; align-items: center; column-gap: 7px; row-gap: 0; padding: 5px 4px 0; overflow: hidden; color: var(--dsh-pip-muted); font-size: 9px; line-height: 14px; }
.dsh-pip-stat { display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; }
.dsh-pip-send { width: 32px; height: 32px; flex: none; display: grid; place-items: center; border: 0; border-radius: 50%; color: white; background: var(--dsh-pip-accent); cursor: pointer; }
.dsh-pip-send:hover { background: var(--dsh-pip-accent-strong); }
.dsh-pip-send[data-stop="true"] { background: var(--dsh-pip-text); }
.dsh-pip-send[data-stop="true"]::before { content: ""; width: 9px; height: 9px; border-radius: 2px; background: var(--dsh-pip-bg); }
.dsh-pip-send[data-stop="true"] svg { display: none; }
.dsh-pip-send:disabled { color: var(--dsh-pip-muted); background: var(--dsh-pip-bg-soft); cursor: not-allowed; opacity: .7; }
.dsh-pip-compose textarea:disabled { cursor: not-allowed; opacity: .55; }
.dsh-pip-conversation[data-empty="true"] { display: block; overflow: auto; }
.dsh-pip-hero-stage { position: relative; box-sizing: border-box; width: 100%; min-width: 0; min-height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 34px 0 28px; overflow: hidden; }
.dsh-pip-hero-glow { position: absolute; left: 50%; top: 49%; width: 150%; height: 240px; border-radius: 50%; background: rgba(97, 135, 216, .10); filter: blur(46px); transform: translate(-50%, -50%); pointer-events: none; }
.dsh-pip-hero { position: relative; display: flex; justify-content: center; align-items: center; gap: 9px; margin: 0 22px 18px; color: var(--dsh-pip-text); }
.dsh-pip-fish { width: 29px; height: 22px; flex: none; transform-origin: 50% 60%; }
.dsh-pip-hero-title { font-size: 23px; font-weight: 550; line-height: 30px; letter-spacing: -.02em; }
.dsh-pip-preview { align-self: flex-start; margin: 1px 0 0 -3px; padding: 1px 7px; border: 1px solid rgba(77, 107, 254, .12); border-radius: 999px; color: #526ecb; background: rgba(77, 107, 254, .09); font: 500 10px/16px ui-monospace, SFMono-Regular, Menlo, monospace; }
.dsh-pip-hero-stage .dsh-pip-compose { position: relative; width: 100%; box-sizing: border-box; padding: 0 22px; background: transparent; }
.dsh-pip-hero-stage .dsh-pip-compose-card { border-radius: 24px; }
.dsh-pip-no-sessions { position: relative; z-index: 1; max-width: 280px; margin: 0 auto 18px; color: var(--dsh-pip-muted); text-align: center; font-size: 12px; line-height: 1.55; }
body.dsh-pip-window { box-sizing: border-box; width: 100vw; height: 100vh; margin: 0; min-width: 280px; min-height: 300px; overflow: hidden; background: var(--dsh-pip-bg); }
body.dsh-pip-window #dsh-picture-in-picture-root { width: 100%; height: 100%; }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .dsh-pip-hero:hover .dsh-pip-fish { animation: dsh-pip-fish-swim 700ms ease-in-out; }
}
@keyframes dsh-pip-fish-swim { 35% { transform: translate(-1px, -1px) rotate(-5deg); } 70% { transform: translate(1px, 0) rotate(3deg); } }
@media (max-width: 520px) {
  .dsh-pip-inline { right: 7px; bottom: 7px; width: calc(100vw - 14px); height: calc(100vh - 14px); border-radius: 24px; }
  .dsh-pip-launcher { right: 14px; bottom: 14px; }
}
@media (max-width: 340px) {
  .dsh-pip-hero-title { font-size: 20px; }
  .dsh-pip-preview { display: none; }
  .dsh-pip-compose, .dsh-pip-hero-stage .dsh-pip-compose { padding-inline: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-pip-launcher, .dsh-pip-dot, .dsh-pip-launcher-badge, .dsh-pip-fish { animation: none !important; transition: none !important; }
}`;

    function installStyle(doc, id = STYLE_ID) {
      if (doc.querySelector(`style[data-plugin-css=${JSON.stringify(id)}]`)) return;
      const tag = doc.createElement("style");
      tag.dataset.plugin = PLUGIN_ID;
      tag.dataset.pluginCss = id;
      tag.textContent = CSS;
      doc.head.appendChild(tag);
    }

    if (typeof document !== "undefined") installStyle(document);

    function isRussian() {
      return typeof navigator !== "undefined" && /^ru(?:-|$)/i.test(navigator.language || "");
    }

    const COPY = {
      en: {
        title: "Mini chat",
        close: "Close mini chat",
        open: "Open chat picture-in-picture",
        focus: "Focus picture-in-picture chat",
        opening: "Opening picture-in-picture…",
        main: "Focus the main Harness window",
        select: "Select a chat",
        noWorkspace: "Other chats",
        noChats: "No active chats yet. Create a session in the main Harness window.",
        loadingChats: "Loading chats…",
        loading: "Loading conversation…",
        loadOlder: "Load older messages",
        loadingOlder: "Loading history…",
        loadError: "Could not load this conversation.",
        noMessages: "No messages in this chat yet.",
        hero: "Into the Unknown",
        preview: "Preview",
        thinking: "Thinking",
        toolRunning: "Running",
        toolDone: "Completed",
        toolFailed: "Failed",
        working: "Agent is working",
        waiting: "Agent needs your input",
        done: "Completed",
        ready: "Ready",
        removed: "Session was removed",
        placeholder: "Reply to the agent…",
        attachImages: "Attach images",
        removeImage: "Remove image",
        imageFailed: "Could not add this image.",
        accessMode: "Access",
        planMode: "Plan",
        planOn: "Plan mode on",
        planOff: "Plan mode off",
        model: "Model",
        selectModel: "Select model",
        context: "Context",
        turns: "turns",
        steps: "steps",
        input: "Input",
        output: "Output",
        cache: "cache",
        tokensPerSecond: "tok/s",
        todos: "To-dos",
        todoDone: "done",
        todoActive: "active",
        todoPending: "pending",
        goal: "Goal",
        permissionFailed: "Could not change access mode.",
        planFailed: "Could not change plan mode.",
        modelFailed: "Could not change model.",
        fullAccessConfirm: "Enable Full access? This allows sensitive operations with fewer confirmations.",
        queueHint: "Enter to send · Shift+Enter for a new line",
        queuedHint: "The reply will be queued after the current turn",
        pendingHint: "Complete the request above",
        approval: "Approval required",
        allowOnce: "Allow once",
        reject: "Reject",
        questionRequest: "Agent question",
        customAnswer: "Type another answer…",
        answer: "Answer",
        cancelRequest: "Cancel",
        interactionFailed: "Could not submit the response.",
        send: "Send reply",
        stop: "Stop generating",
        stopping: "Stopping…",
        cancelFailed: "Could not stop the current turn.",
        sending: "Sending…",
        openFailed: "Native picture-in-picture was unavailable; using the floating panel.",
        user: "You",
        queued: "Queued",
        steer: "Send now",
        editQueued: "Edit queued message",
        removeQueued: "Remove queued message",
        removeQueuedConfirm: "Remove this queued message?",
        queueActionFailed: "Could not update the queued message.",
        steering: "Sending now…",
        steerUnavailable: "Available while the agent is working",
        steerFailed: "Could not send the queued message now.",
        agent: "Agent",
        copyMessage: "Copy response",
        copied: "Copied",
        branchMessage: "Branch from here",
        branchFailed: "Could not create a branch.",
        system: "Status",
        image: "[Image]",
        interrupted: "Response stopped",
        maxTokens: "The response reached its output limit.",
        retry: "The model request is being retried.",
        unknownError: "Could not send the reply.",
      },
      ru: {
        title: "Мини-чат",
        close: "Закрыть мини-чат",
        open: "Открыть чат в picture-in-picture",
        focus: "Перейти к окну picture-in-picture",
        opening: "Открываем picture-in-picture…",
        main: "Перейти в основное окно Harness",
        select: "Выберите чат",
        noWorkspace: "Другие чаты",
        noChats: "Активных чатов пока нет. Создайте сессию в основном окне Harness.",
        loadingChats: "Загружаем чаты…",
        loading: "Загружаем переписку…",
        loadOlder: "Загрузить ранние сообщения",
        loadingOlder: "Загружаем историю…",
        loadError: "Не удалось загрузить переписку.",
        noMessages: "В этом чате пока нет сообщений.",
        hero: "Into the Unknown",
        preview: "Превью",
        thinking: "Размышляет",
        toolRunning: "Выполняется",
        toolDone: "Завершено",
        toolFailed: "Ошибка",
        working: "Агент работает",
        waiting: "Агент ждёт вашего ответа",
        done: "Завершено",
        ready: "Готов к сообщению",
        removed: "Сессия удалена",
        placeholder: "Ответить агенту…",
        attachImages: "Прикрепить изображения",
        removeImage: "Удалить изображение",
        imageFailed: "Не удалось добавить изображение.",
        accessMode: "Доступ",
        planMode: "План",
        planOn: "Режим плана включён",
        planOff: "Режим плана выключен",
        model: "Модель",
        selectModel: "Выбрать модель",
        context: "Контекст",
        turns: "ходов",
        steps: "шагов",
        input: "Вход",
        output: "Выход",
        cache: "кэш",
        tokensPerSecond: "ток/с",
        todos: "Задачи",
        todoDone: "готово",
        todoActive: "в работе",
        todoPending: "ожидает",
        goal: "Цель",
        permissionFailed: "Не удалось изменить режим доступа.",
        planFailed: "Не удалось изменить режим плана.",
        modelFailed: "Не удалось изменить модель.",
        fullAccessConfirm: "Включить Full access? Этот режим разрешает чувствительные операции с меньшим числом подтверждений.",
        queueHint: "Enter — отправить · Shift+Enter — новая строка",
        queuedHint: "Ответ будет поставлен в очередь после текущего хода",
        pendingHint: "Ответьте на запрос выше",
        approval: "Требуется подтверждение",
        allowOnce: "Разрешить один раз",
        reject: "Отклонить",
        questionRequest: "Вопрос агента",
        customAnswer: "Другой ответ…",
        answer: "Ответить",
        cancelRequest: "Отмена",
        interactionFailed: "Не удалось отправить ответ.",
        send: "Отправить ответ",
        stop: "Остановить генерацию",
        stopping: "Останавливаем…",
        cancelFailed: "Не удалось остановить текущий ход.",
        sending: "Отправляем…",
        openFailed: "Нативный picture-in-picture недоступен — открыта панель внутри страницы.",
        user: "Вы",
        queued: "В очереди",
        steer: "Отправить сейчас",
        editQueued: "Изменить сообщение в очереди",
        removeQueued: "Удалить сообщение из очереди",
        removeQueuedConfirm: "Удалить это сообщение из очереди?",
        queueActionFailed: "Не удалось изменить сообщение в очереди.",
        steering: "Отправляем сейчас…",
        steerUnavailable: "Доступно, пока агент работает",
        steerFailed: "Не удалось отправить сообщение из очереди сейчас.",
        agent: "Агент",
        copyMessage: "Копировать ответ",
        copied: "Скопировано",
        branchMessage: "Ответвить отсюда",
        branchFailed: "Не удалось создать ответвление.",
        system: "Статус",
        image: "[Изображение]",
        interrupted: "Ответ остановлен",
        maxTokens: "Ответ достиг лимита вывода.",
        retry: "Запрос к модели повторяется.",
        unknownError: "Не удалось отправить ответ.",
      },
    };

    function activeCopy() {
      return isRussian() ? COPY.ru : COPY.en;
    }

    function textOfContent(content, imageLabel = "[Image]") {
      if (!Array.isArray(content)) return "";
      return content
        .map((block) => {
          if (block && block.type === "text" && typeof block.text === "string") return block.text;
          if (block && (block.type === "image" || block.type === "image_url")) return imageLabel;
          return "";
        })
        .filter(Boolean)
        .join("\n");
    }

    function imagesOfContent(content) {
      if (!Array.isArray(content)) return [];
      return content.filter((block) => block && block.type === "image" && block.attachment).map((block) => block.attachment);
    }

    function browserDraftImage(file) {
      const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `image-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      return { id, file, previewUrl: URL.createObjectURL(file) };
    }

    function fileBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error || new Error("image read failed"));
        reader.onload = () => {
          const value = typeof reader.result === "string" ? reader.result : "";
          const separator = value.indexOf(",");
          if (separator < 0) reject(new Error("image serialization failed"));
          else resolve(value.slice(separator + 1));
        };
        reader.readAsDataURL(file);
      });
    }

    function compactLogText(value, limit = 1800) {
      const text = typeof value === "string" ? value.trim() : "";
      if (text.length <= limit) return text;
      return `${text.slice(0, limit).trimEnd()}…`;
    }

    function textOfAssistant(blocks, imageLabel = "[Image]", thinkingLabel = "Thinking") {
      if (!Array.isArray(blocks)) return "";
      return blocks
        .map((block) => {
          if (block && block.kind === "text" && typeof block.text === "string") return block.text;
          if (block && block.kind === "reasoning" && typeof block.text === "string" && block.text.trim()) {
            return `${thinkingLabel}\n${compactLogText(block.text)}`;
          }
          if (block && block.kind === "image") return imageLabel;
          return "";
        })
        .filter(Boolean)
        .join("\n\n");
    }

    function answerTextOfAssistant(blocks) {
      if (!Array.isArray(blocks)) return "";
      return blocks.flatMap((block) => block && block.kind === "text" && typeof block.text === "string" ? [block.text] : []).join("");
    }

    function toolCallText(call, copy) {
      if (!call || typeof call !== "object") return "";
      const name = call.name || call.callId || "tool";
      const args = compactLogText(call.argsRaw, 900);
      return `${copy.toolRunning || "Running"}: ${name}${args ? `\n${args}` : ""}`;
    }

    function projectNode(node, copy) {
      if (!node || typeof node !== "object") return null;
      if (node.kind === "user" || node.kind === "steering") {
        const text = textOfContent(node.content, copy.image);
        const images = imagesOfContent(node.content);
        return text ? { role: "user", label: copy.user, text, ...(images.length ? { images } : {}), key: `${node.kind}-${node.seq}` } : null;
      }
      if (node.kind === "assistant") {
        const text = textOfAssistant(node.blocks, copy.image, copy.thinking);
        const toolCalls = (node.blocks || []).filter((block) => block && block.kind === "tool-call");
        const images = (node.blocks || []).filter((block) => block && block.kind === "image" && block.attachment).map((block) => block.attachment);
        const toolLog = toolCalls.map((call) => toolCallText(call, copy)).filter(Boolean).join("\n\n");
        if (!text && !toolLog && !node.interrupted) return null;
        return {
          role: text ? "assistant" : "log",
          label: copy.agent,
          text: [text, toolLog, node.interrupted ? copy.interrupted : ""].filter(Boolean).join("\n\n"),
          copyText: answerTextOfAssistant(node.blocks),
          seq: node.seq,
          turn: node.turn,
          messageId: node.messageId,
          ...(images.length ? { images } : {}),
          key: `assistant-${node.seq}`,
        };
      }
      if (node.kind === "tool-result") {
        const output = compactLogText(textOfContent(node.content, copy.image));
        const images = imagesOfContent(node.content);
        if (!node.callId && !node.call && !output && !node.isError) return null;
        const name = (node.call && node.call.name) || node.callId || "tool";
        const failed = Boolean(node.isError);
        const outcome = failed ? copy.toolFailed || "Failed" : copy.toolDone || "Completed";
        return {
          role: failed ? "error" : "log",
          label: name,
          text: `${outcome}: ${name}${output ? `\n${output}` : ""}`,
          ...(images.length ? { images } : {}),
          key: `tool-${node.seq}`,
        };
      }
      if (node.kind === "turn-error") {
        return { role: "error", label: copy.system, text: node.message || copy.unknownError, key: `error-${node.seq}` };
      }
      if (node.kind === "turn-max-tokens") {
        return { role: "system", label: copy.system, text: copy.maxTokens, key: `max-${node.seq}` };
      }
      if (node.kind === "model-retry") {
        return { role: "system", label: copy.system, text: copy.retry, key: `retry-${node.seq}` };
      }
      if (node.kind === "command" && node.outcome) {
        const line = `/${node.name || "command"}${node.args || ""}`;
        const outcome = node.outcome.text ? `\n${node.outcome.text}` : "";
        return { role: "system", label: copy.system, text: `${line}${outcome}`, key: `command-${node.seq}` };
      }
      return null;
    }

    function errorMessage(error, fallback) {
      if (!error) return fallback;
      if (typeof error.message === "string" && error.message) return error.message;
      if (typeof error === "string") return error;
      return fallback;
    }

    function ChatGlyph({ size = 22 }) {
      return h(
        "svg",
        { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true },
        h("rect", { x: "3", y: "4", width: "14", height: "11", rx: "3", stroke: "currentColor", strokeWidth: "1.8" }),
        h("path", { d: "M7 15v4l4-4", stroke: "currentColor", strokeWidth: "1.8", strokeLinejoin: "round" }),
        h("path", { d: "M14.5 8.5h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H18l-2.5 2v-4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
      );
    }

    function FishGlyph({ size = 29 }) {
      return h(
        "svg",
        {
          className: "dsh-pip-fish",
          width: size,
          height: size * 17.04 / 23.16,
          viewBox: "0 0 32 24",
          fill: "none",
          "aria-hidden": true,
        },
        h("path", {
          d: "M2.5 12c3.3-5.4 8.2-8.2 13.7-8.2 3.8 0 7 1.3 9.4 3.6l4.5-2.3c.5-.3 1 .2.8.8L29.5 12l1.4 6.1c.2.6-.3 1.1-.8.8l-4.5-2.3c-2.4 2.3-5.6 3.6-9.4 3.6C10.7 20.2 5.8 17.4 2.5 12Z",
          fill: "currentColor",
        }),
        h("circle", { cx: "11", cy: "9.5", r: "1.15", fill: "var(--dsh-pip-bg)" }),
      );
    }

    function HeroHeading({ copy }) {
      return h(
        "div",
        { className: "dsh-pip-hero" },
        h(FishGlyph),
        h("span", { className: "dsh-pip-hero-title" }, copy.hero),
        h("span", { className: "dsh-pip-preview" }, copy.preview),
      );
    }

    function ArrowGlyph() {
      return h(
        "svg",
        { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true },
        h("path", { d: "M5 12h13m-5-5 5 5-5 5", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
      );
    }

    function ExternalGlyph() {
      return h(
        "svg",
        { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true },
        h("path", { d: "M14 5h5v5M19 5l-8 8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
        h("path", { d: "M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }),
      );
    }

    function useSessionsList(sessions) {
      return React.useSyncExternalStore(
        sessions.list.subscribe,
        sessions.list.getSnapshot,
        () => EMPTY_LIST,
      );
    }

    function useSessionSnapshot(sessions, sessionId) {
      const binding = sessionId ? sessions.binding(sessionId) : undefined;
      const session = binding && binding.session;
      const subscribe = React.useCallback((listener) => (session ? session.subscribe(listener) : () => {}), [session]);
      const getSnapshot = React.useCallback(() => (session ? session.getSnapshot() : EMPTY_SESSION), [session]);
      const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
      return { session, snapshot };
    }

    function useSessionProjection(session, key) {
      const face = session && session.projections && typeof session.projections.faceOf === "function"
        ? session.projections.faceOf(key)
        : null;
      const subscribe = React.useCallback((listener) => (face ? face.subscribe(listener) : () => {}), [face]);
      const getSnapshot = React.useCallback(() => (face ? face.getSnapshot() : undefined), [face]);
      return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    }

    function resolveModelDirectory(modelDirectories, sessionId) {
      if (!modelDirectories || !sessionId || typeof modelDirectories.directoryFor !== "function") return null;
      try {
        return modelDirectories.directoryFor(sessionId);
      } catch {
        return null;
      }
    }

    function useModelDirectory(modelDirectories, sessionId) {
      const directory = resolveModelDirectory(modelDirectories, sessionId);
      const store = directory && directory.store;
      const subscribe = React.useCallback((listener) => (store ? store.subscribe(listener) : () => {}), [store]);
      const getSnapshot = React.useCallback(() => (store ? store.getSnapshot() : EMPTY_MODEL_DIRECTORY), [store]);
      const state = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
      React.useEffect(() => {
        if (!directory || state.status !== "idle") return;
        directory.load().catch(() => {});
      }, [directory, state.status]);
      return { directory, state };
    }

    function displayName(name) {
      if (typeof name !== "string" || !name) return "";
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) return name;
      return name.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }

    function permissionLabel(option) {
      if (!option) return "";
      if (option.value === "danger-full-access") return "Full access";
      return displayName(option.name || option.value);
    }

    function modelChoicesOf(state) {
      const choices = [];
      for (const group of state && Array.isArray(state.groups) ? state.groups : []) {
        for (const model of Array.isArray(group.models) ? group.models : []) {
          choices.push({
            key: `${group.id}\u0000${model.id}`,
            provider: group.id,
            model: model.id,
            label: model.name || model.id,
            reasoningEffort: model.reasoning && model.reasoning.defaultEffort,
          });
        }
      }
      return choices;
    }

    function formatTokens(value) {
      const number = typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;
      const scaled = (amount) => amount >= 100 ? String(Math.round(amount)) : String(Math.round(amount * 10) / 10);
      if (number < 1000) return String(Math.round(number));
      if (number < 1000000) return `${scaled(number / 1000)}K`;
      return `${scaled(number / 1000000)}M`;
    }

    function formatTokensPerSecond(value) {
      const number = typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;
      return number >= 10 ? String(Math.round(number)) : String(Math.round(number * 10) / 10);
    }

    function contextOccupancy(pressure) {
      if (!pressure || !pressure.contextWindow) return null;
      const usedTokens = pressure.projectedTokens ?? pressure.pressureTokens;
      if (typeof usedTokens !== "number") return null;
      return {
        usedTokens,
        contextWindow: pressure.contextWindow,
        percent: Math.max(0, Math.min(100, Math.round((usedTokens / pressure.contextWindow) * 100))),
      };
    }

    function contextPercent(pressure) {
      const occupancy = contextOccupancy(pressure);
      return occupancy ? occupancy.percent : null;
    }

    function statsSegments(sessionStats, tokenUsage, contextPressure, copy) {
      const segments = [];
      const context = contextOccupancy(contextPressure);
      if (context) {
        segments.push(`${copy.context} ${context.percent}% · ${formatTokens(context.usedTokens)}/${formatTokens(context.contextWindow)}`);
      }
      if (sessionStats && (sessionStats.turns > 0 || sessionStats.steps > 0)) {
        segments.push(`${sessionStats.turns} ${copy.turns} · ${sessionStats.steps} ${copy.steps}`);
        if (sessionStats.decodeMs > 0 && sessionStats.decodeTokens >= 0) {
          segments.push(`${formatTokensPerSecond(sessionStats.decodeTokens / (sessionStats.decodeMs / 1000))} ${copy.tokensPerSecond}`);
        }
      }
      if (tokenUsage) {
        const input = (tokenUsage.uncachedInputTokens || 0) + (tokenUsage.cacheReadTokens || 0) + (tokenUsage.cacheWriteTokens || 0);
        const output = tokenUsage.outputTokens || 0;
        if (input > 0 || output > 0) {
          segments.push(`${copy.input} ${formatTokens(input)} · ${copy.output} ${formatTokens(output)}`);
          if (input > 0 && tokenUsage.cacheReadTokens > 0) {
            segments.push(`${copy.cache} ${Math.round((tokenUsage.cacheReadTokens / input) * 100)}%`);
          }
        }
      }
      return segments;
    }

    function sessionRows(list) {
      const seen = new Set();
      const rows = [];
      for (const id of list.ids || []) {
        const row = list.byId && list.byId[id];
        const internal = row && (row.origin === "subagent" || Boolean(row.parentId));
        if (!row || internal || seen.has(id) || (row.blank && id !== list.current)) continue;
        seen.add(id);
        rows.push(row);
      }
      const current = list.current && list.byId && list.byId[list.current];
      const currentInternal = current && (current.origin === "subagent" || Boolean(current.parentId));
      if (current && !currentInternal && !seen.has(current.id)) rows.unshift(current);
      rows.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      return rows;
    }

    function workspaceName(cwd, fallback) {
      if (typeof cwd !== "string" || !cwd.trim()) return fallback;
      const normalized = cwd.replace(/[\\/]+$/, "");
      const parts = normalized.split(/[\\/]/).filter(Boolean);
      return parts[parts.length - 1] || normalized || fallback;
    }

    function sessionGroups(rows, copy) {
      const groups = [];
      const byWorkspace = new Map();
      for (const row of rows) {
        const key = typeof row.cwd === "string" && row.cwd ? row.cwd : "";
        let group = byWorkspace.get(key);
        if (!group) {
          group = { key, label: workspaceName(key, copy.noWorkspace), rows: [] };
          byWorkspace.set(key, group);
          groups.push(group);
        }
        group.rows.push(row);
      }
      const labelCounts = new Map();
      for (const group of groups) labelCounts.set(group.label, (labelCounts.get(group.label) || 0) + 1);
      for (const group of groups) {
        if (group.key && labelCounts.get(group.label) > 1) group.label = group.key;
      }
      return groups;
    }

    function stateOf(summary, snapshot) {
      if ((summary && summary.pendingInteraction) || (snapshot && snapshot.pending && snapshot.pending.length)) return "waiting";
      if ((summary && summary.running) || (snapshot && snapshot.running)) return "running";
      if (summary && summary.completed) return "done";
      return "ready";
    }

    function statusText(state, snapshot, copy) {
      if (snapshot && snapshot.removed) return copy.removed;
      if (state === "waiting") return copy.waiting;
      if (state === "running") return copy.working;
      if (state === "done") return copy.done;
      return copy.ready;
    }

    function visibleConversationRows(snapshot, copy) {
      const projected = (snapshot.nodes || []).map((node) => projectNode(node, copy)).filter(Boolean);
      const queued = (snapshot.queue || [])
        .map((item) => ({ key: `queue-${item.id}`, id: item.id, placement: item.placement, text: item.text || item.preview || "", editable: item.text !== null }))
        .filter((item) => item.text);
      const runningCalls = (snapshot.runningCalls || []).map((call) => ({
        key: `running-tool-${call.callId}`,
        label: call.name || call.callId || "tool",
        text: toolCallText(call, copy),
      }));
      const partialText = snapshot.partial ? textOfAssistant(snapshot.partial.blocks, copy.image, copy.thinking) : "";
      return { projected, queued, runningCalls, partialText };
    }

    function renderMarkdown(text) {
      return h("div", { className: "dsh-pip-markdown" }, h(MarkdownText, { text, streaming: false }));
    }

    function HistoricalImage({ session, attachment, copy }) {
      const [url, setUrl] = React.useState("");
      React.useEffect(() => {
        let live = true;
        let objectUrl = "";
        if (!session || typeof session.readAttachment !== "function") return () => {};
        session.readAttachment(attachment.attachmentId).then((result) => {
          if (!result.ok) return;
          objectUrl = URL.createObjectURL(new Blob([result.value.data], { type: result.value.attachment.mediaType }));
          if (live) setUrl(objectUrl);
          else URL.revokeObjectURL(objectUrl);
        }, () => {});
        return () => {
          live = false;
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
      }, [session, attachment.attachmentId]);
      if (!url) return h("span", { className: "dsh-pip-message-image", "aria-label": copy.image });
      return h(
        "a",
        { className: "dsh-pip-message-image", href: url, target: "_blank", rel: "noreferrer", title: attachment.name || copy.image },
        h("img", { src: url, alt: attachment.name || copy.image }),
      );
    }

    function MessageList({ snapshot, copy, session, steeringId, queueBusyId, branchingSeq, onSteerQueue, onQueueAction, onLoadOlder, onBranch }) {
      const endRef = React.useRef(null);
      const [copiedKey, setCopiedKey] = React.useState(null);
      const rows = visibleConversationRows(snapshot, copy);
      const projected = rows.projected;
      const { queued, runningCalls, partialText } = rows;
      const tailKey = projected.length ? projected[projected.length - 1].key : "";
      React.useEffect(() => {
        endRef.current && endRef.current.scrollIntoView({ block: "end" });
      }, [snapshot.sessionId, tailKey, queued.length, runningCalls.length, partialText]);

      if (snapshot.openState === "cold" || snapshot.openState === "loading") {
        return h("div", { className: "dsh-pip-messages" }, h("div", { className: "dsh-pip-empty" }, copy.loading));
      }
      if (snapshot.openState === "error") {
        return h(
          "div",
          { className: "dsh-pip-messages", role: "alert" },
          h("div", { className: "dsh-pip-empty" }, errorMessage(snapshot.openError, copy.loadError)),
        );
      }
      if (projected.length === 0 && queued.length === 0 && runningCalls.length === 0 && !partialText) {
        return h("div", { className: "dsh-pip-messages" }, h("div", { className: "dsh-pip-empty" }, copy.noMessages));
      }
      const lastAssistantByTurn = new Map();
      let runningTurn = null;
      for (const message of projected) {
        if (message.role === "assistant" && message.messageId && Number.isFinite(message.turn)) {
          lastAssistantByTurn.set(message.turn, message.key);
          if (snapshot.running && (runningTurn === null || message.turn > runningTurn)) runningTurn = message.turn;
        }
      }
      const messages = projected.map((message) => {
        const canCopy = Boolean(message.copyText);
        const canBranch = Boolean(
          typeof onBranch === "function" &&
          message.messageId &&
          Number.isFinite(message.seq) &&
          lastAssistantByTurn.get(message.turn) === message.key &&
          message.turn !== runningTurn
        );
        const body = message.role === "assistant" ? renderMarkdown(message.text) : message.text;
        const messageNode = h(
          "div",
          { className: "dsh-pip-message", "data-role": message.role },
          h("span", { className: "dsh-pip-role" }, message.label),
          body,
          message.images && message.images.length
            ? h(
                "div",
                { className: "dsh-pip-message-images" },
                message.images.map((attachment) => h(HistoricalImage, { session, attachment, copy, key: attachment.attachmentId })),
              )
            : null,
        );
        if (message.role !== "assistant") return React.cloneElement(messageNode, { key: message.key });
        return h(
          "div",
          { className: "dsh-pip-message-group", key: message.key },
          messageNode,
          h(
            "div",
            { className: "dsh-pip-message-actions" },
            canCopy
              ? h(
                  "button",
                  {
                    type: "button",
                    className: "dsh-pip-message-action",
                    title: copiedKey === message.key ? copy.copied : copy.copyMessage,
                    "aria-label": copiedKey === message.key ? copy.copied : copy.copyMessage,
                    onClick: async () => {
                      if (await writeClipboard(message.copyText)) setCopiedKey(message.key);
                    },
                  },
                  copiedKey === message.key ? "✓" : "⧉",
                )
              : null,
            canBranch
              ? h(
                  "button",
                  {
                    type: "button",
                    className: "dsh-pip-message-action",
                    disabled: branchingSeq === message.seq,
                    title: copy.branchMessage,
                    "aria-label": copy.branchMessage,
                    onClick: () => void onBranch(message.seq),
                  },
                  "⑂",
                )
              : null,
          ),
        );
      });
      if (snapshot.hasMore && typeof onLoadOlder === "function") {
        messages.unshift(
          h(
            "button",
            {
              type: "button",
              className: "dsh-pip-load-older",
              disabled: snapshot.loadingOlder,
              onClick: () => void onLoadOlder(),
              key: "load-older",
            },
            snapshot.loadingOlder ? copy.loadingOlder : copy.loadOlder,
          ),
        );
      }
      for (const item of queued) {
        const canSteer = item.placement === "queued" && snapshot.running && typeof onSteerQueue === "function";
        const steering = steeringId === item.id;
        messages.push(
          h(
            "div",
            {
              className: "dsh-pip-message dsh-pip-stream",
              "data-role": "user",
              "data-queued": item.placement === "queued" ? "true" : undefined,
              key: item.key,
            },
            h("span", { className: "dsh-pip-role" }, copy.queued),
            h("span", { className: "dsh-pip-queued-text" }, item.text),
            item.placement === "queued"
              ? h(
                  "span",
                  { className: "dsh-pip-queue-actions" },
                  item.editable
                    ? h(
                        "button",
                        {
                          type: "button",
                          className: "dsh-pip-queue-action",
                          disabled: Boolean(queueBusyId || steeringId) || typeof onQueueAction !== "function",
                          title: copy.editQueued,
                          "aria-label": copy.editQueued,
                          onClick: (event) => {
                            const view = event.currentTarget.ownerDocument.defaultView;
                            const next = view && view.prompt ? view.prompt(copy.editQueued, item.text) : null;
                            if (next && next.trim() && next.trim() !== item.text) {
                              void onQueueAction(item.id, { kind: "edit", content: [{ type: "text", text: next.trim() }] });
                            }
                          },
                        },
                        "✎",
                      )
                    : null,
                  h(
                    "button",
                    {
                      type: "button",
                      className: "dsh-pip-queue-action",
                      disabled: Boolean(queueBusyId || steeringId) || typeof onQueueAction !== "function",
                      title: copy.removeQueued,
                      "aria-label": copy.removeQueued,
                      onClick: (event) => {
                        const view = event.currentTarget.ownerDocument.defaultView;
                        if (!view || !view.confirm || view.confirm(copy.removeQueuedConfirm)) {
                          void onQueueAction(item.id, { kind: "remove" });
                        }
                      },
                    },
                    "×",
                  ),
                  h(
                    "button",
                    {
                      type: "button",
                      className: "dsh-pip-queue-action",
                      "data-primary": "true",
                      disabled: !canSteer || Boolean(steeringId || queueBusyId),
                      title: canSteer ? (steering ? copy.steering : copy.steer) : copy.steerUnavailable,
                      "aria-label": steering ? copy.steering : copy.steer,
                      onClick: () => {
                        if (canSteer && !steeringId && !queueBusyId) void onSteerQueue(item.id);
                      },
                    },
                    h(ArrowGlyph),
                  ),
                )
              : null,
          ),
        );
      }
      for (const call of runningCalls) {
        messages.push(
          h(
            "div",
            { className: "dsh-pip-message dsh-pip-stream", "data-role": "log", key: call.key },
            h("span", { className: "dsh-pip-role" }, call.label),
            call.text,
          ),
        );
      }
      if (partialText) {
        messages.push(
          h(
            "div",
            { className: "dsh-pip-message dsh-pip-stream", "data-role": "assistant", key: "partial" },
            h("span", { className: "dsh-pip-role" }, copy.agent),
            partialText,
          ),
        );
      }
      messages.push(h("div", { ref: endRef, key: "end" }));
      return h("div", { className: "dsh-pip-messages", "aria-live": "polite" }, messages);
    }

    function InteractionPanel({ pending, copy }) {
      const [drafts, setDrafts] = React.useState({});
      const [busy, setBusy] = React.useState(false);
      const [error, setError] = React.useState("");
      if (!pending) return null;

      const settle = async (result) => {
        setBusy(true);
        setError("");
        try {
          const receipt = await pending.respond(result);
          if (!receipt || !receipt.accepted) throw new Error((receipt && receipt.reason) || copy.interactionFailed);
        } catch (cause) {
          setBusy(false);
          setError(errorMessage(cause, copy.interactionFailed));
        }
      };

      if (pending.kind === "approval") {
        const payload = pending.payload || {};
        const decide = (outcome) => settle({
          ok: true,
          value: {
            sessionId: pending.sessionId,
            approvalId: payload.approvalId,
            outcome,
          },
        });
        return h(
          "section",
          { className: "dsh-pip-interaction", "aria-label": copy.approval },
          h("div", { className: "dsh-pip-interaction-title" }, copy.approval),
          h("div", { className: "dsh-pip-interaction-question" }, payload.reason || payload.toolName || copy.approval),
          payload.reason && payload.toolName ? h("div", { className: "dsh-pip-interaction-detail" }, payload.toolName) : null,
          error ? h("div", { className: "dsh-pip-interaction-error", role: "alert" }, error) : null,
          h(
            "div",
            { className: "dsh-pip-interaction-actions" },
            h("button", { type: "button", className: "dsh-pip-interaction-action", disabled: busy, onClick: () => void decide("rejected") }, copy.reject),
            h("button", { type: "button", className: "dsh-pip-interaction-action", "data-primary": "true", disabled: busy, onClick: () => void decide("allowed-once") }, copy.allowOnce),
          ),
        );
      }

      const questions = pending.payload && Array.isArray(pending.payload.questions) ? pending.payload.questions : [];
      const updateQuestion = (id, update) => {
        setDrafts((current) => ({
          ...current,
          [id]: update(current[id] || { selected: [], custom: "" }),
        }));
        setError("");
      };
      const submit = () => {
        const answers = questions.map((question) => {
          const draft = drafts[question.id] || { selected: [], custom: "" };
          const custom = draft.custom.trim();
          return {
            id: question.id,
            selected: custom && question.multiSelect !== true ? [] : draft.selected,
            ...(custom ? { custom } : {}),
          };
        });
        void settle({ ok: true, value: { sessionId: pending.sessionId, answer: { answers } } });
      };
      const cancel = () => settle({ ok: false, error: { code: "cancelled", message: "the user closed this question request", details: {} } });
      return h(
        "section",
        { className: "dsh-pip-interaction", "aria-label": copy.questionRequest },
        h("div", { className: "dsh-pip-interaction-title" }, copy.questionRequest),
        questions.map((question) => {
          const draft = drafts[question.id] || { selected: [], custom: "" };
          return h(
            "div",
            { key: question.id },
            h("div", { className: "dsh-pip-interaction-question" }, question.header ? `${question.header}: ${question.question}` : question.question),
            question.detail ? h("div", { className: "dsh-pip-interaction-detail" }, renderMarkdown(question.detail)) : null,
            Array.isArray(question.options) && question.options.length
              ? h(
                  "div",
                  { className: "dsh-pip-interaction-options" },
                  question.options.map((option) => {
                    const selected = draft.selected.includes(option.label);
                    return h(
                      "button",
                      {
                        type: "button",
                        className: "dsh-pip-interaction-option",
                        "data-selected": selected ? "true" : undefined,
                        disabled: busy,
                        title: option.description,
                        key: option.label,
                        onClick: () => updateQuestion(question.id, (current) => ({
                          ...current,
                          selected: question.multiSelect
                            ? selected
                              ? current.selected.filter((label) => label !== option.label)
                              : [...current.selected, option.label]
                            : [option.label],
                          custom: question.multiSelect ? current.custom : "",
                        })),
                      },
                      option.label,
                    );
                  }),
                )
              : null,
            h("input", {
              className: "dsh-pip-interaction-input",
              value: draft.custom,
              disabled: busy,
              placeholder: copy.customAnswer,
              "aria-label": `${question.question}: ${copy.customAnswer}`,
              onChange: (event) => updateQuestion(question.id, (current) => ({
                ...current,
                custom: event.currentTarget.value,
                selected: question.multiSelect ? current.selected : [],
              })),
            }),
          );
        }),
        error ? h("div", { className: "dsh-pip-interaction-error", role: "alert" }, error) : null,
        h(
          "div",
          { className: "dsh-pip-interaction-actions" },
          h("button", { type: "button", className: "dsh-pip-interaction-action", disabled: busy, onClick: () => void cancel() }, copy.cancelRequest),
          h("button", { type: "button", className: "dsh-pip-interaction-action", "data-primary": "true", disabled: busy, onClick: submit }, copy.answer),
        ),
      );
    }

    function todoSummary(todos, copy) {
      const done = todos.filter((item) => item.status === "completed").length;
      const active = todos.filter((item) => item.status === "in_progress").length;
      const pending = todos.length - done - active;
      return [
        done ? `${done} ${copy.todoDone}` : "",
        active ? `${active} ${copy.todoActive}` : "",
        pending ? `${pending} ${copy.todoPending}` : "",
      ].filter(Boolean).join(" · ");
    }

    function TodoPanel({ todos, copy }) {
      const [expanded, setExpanded] = React.useState(false);
      if (!Array.isArray(todos) || todos.length === 0) return null;
      return h(
        "section",
        { className: "dsh-pip-todo", "aria-label": copy.todos },
        h(
          "button",
          {
            type: "button",
            className: "dsh-pip-dock-header",
            "aria-expanded": expanded,
            onClick: () => setExpanded((value) => !value),
          },
          h("span", { className: "dsh-pip-dock-icon", "aria-hidden": true }, "☑"),
          h("span", null, copy.todos),
          h("span", { className: "dsh-pip-dock-progress" }, todoSummary(todos, copy)),
          h("span", { "aria-hidden": true }, expanded ? "⌄" : "⌃"),
        ),
        expanded
          ? h(
              "ul",
              { className: "dsh-pip-todo-list" },
              todos.map((item, index) =>
                h(
                  "li",
                  { className: "dsh-pip-todo-item", "data-status": item.status, key: `${index}-${item.content}` },
                  h("span", { className: "dsh-pip-todo-dot", "aria-hidden": true }, item.status === "completed" ? "✓" : item.status === "in_progress" ? "◉" : "○"),
                  h("span", null, item.content),
                ),
              ),
            )
          : null,
      );
    }

    function SessionDock({ todos, goal, copy }) {
      const goalState = goal && goal.goal;
      if ((!Array.isArray(todos) || todos.length === 0) && !goalState) return null;
      return h(
        "div",
        { className: "dsh-pip-session-dock" },
        h(TodoPanel, { todos: todos || [], copy }),
        goalState
          ? h(
              "div",
              { className: "dsh-pip-goal", title: goalState.objective },
              h("span", { className: "dsh-pip-goal-label" }, copy.goal),
              h("span", { className: "dsh-pip-goal-objective" }, goalState.objective),
              h("span", { className: "dsh-pip-goal-phase" }, goalState.phase),
            )
          : null,
      );
    }

    function Composer({ copy, draft, attachments, imageEnabled, session, snapshot, structuredPending, sending, cancelling, sendError, canSend, permissions, plan, modelState, contextPressure, sessionStats, tokenUsage, controlsBusy, onPermission, onPlan, onModel, onAddImages, onRemoveImage, onDraft, onSend, onCancel }) {
      const fileInputRef = React.useRef(null);
      const meta =
        sendError ||
        (cancelling
          ? copy.stopping
          : sending
            ? copy.sending
          : structuredPending
            ? copy.pendingHint
            : snapshot.running
              ? copy.queuedHint
              : copy.queueHint);
      const permissionOptions = permissions && Array.isArray(permissions.options) ? permissions.options : [];
      const planActive = Boolean(plan && (plan.pending ? !plan.active : plan.active));
      const modelChoices = modelChoicesOf(modelState);
      const modelValue = modelState && modelState.current
        ? `${modelState.current.provider}\u0000${modelState.current.model}`
        : "";
      const pressure = contextPercent(contextPressure);
      const stats = statsSegments(sessionStats, tokenUsage, contextPressure, copy);
      const controlsLocked = Boolean(controlsBusy || !session || snapshot.removed);
      return h(
        "form",
        {
          className: "dsh-pip-compose",
          onSubmit: (event) => {
            event.preventDefault();
            void onSend();
          },
          onDragOver: (event) => {
            if (imageEnabled && event.dataTransfer && Array.from(event.dataTransfer.types || []).includes("Files")) event.preventDefault();
          },
          onDrop: (event) => {
            if (!imageEnabled) return;
            const files = Array.from(event.dataTransfer?.files || []).filter((file) => file.type.startsWith("image/"));
            if (files.length) {
              event.preventDefault();
              onAddImages(files);
            }
          },
        },
        h(
          "div",
          { className: "dsh-pip-compose-card" },
          attachments.length
            ? h(
                "div",
                { className: "dsh-pip-attachment-rail" },
                attachments.map((attachment) =>
                  h(
                    "span",
                    { className: "dsh-pip-attachment", key: attachment.id },
                    h("img", { src: attachment.previewUrl, alt: attachment.file?.name || copy.image }),
                    h(
                      "button",
                      {
                        type: "button",
                        className: "dsh-pip-attachment-remove",
                        title: copy.removeImage,
                        "aria-label": copy.removeImage,
                        onClick: () => onRemoveImage(attachment.id),
                      },
                      "×",
                    ),
                  ),
                ),
              )
            : null,
          h("input", {
            ref: fileInputRef,
            type: "file",
            className: "dsh-pip-file-input",
            accept: "image/png,image/jpeg,image/webp,image/gif",
            multiple: true,
            tabIndex: -1,
            onChange: (event) => {
              const files = Array.from(event.currentTarget.files || []);
              event.currentTarget.value = "";
              if (files.length) onAddImages(files);
            },
          }),
          h("textarea", {
            value: draft,
            rows: 2,
            disabled: !session || snapshot.openState !== "open" || snapshot.removed || structuredPending,
            placeholder: copy.placeholder,
            "aria-label": copy.placeholder,
            onChange: (event) => onDraft(event.currentTarget.value),
            onPaste: (event) => {
              if (!imageEnabled) return;
              const files = Array.from(event.clipboardData?.files || []).filter((file) => file.type.startsWith("image/"));
              if (files.length) {
                event.preventDefault();
                onAddImages(files);
              }
            },
            onKeyDown: (event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                void onSend();
              }
            },
          }),
          h(
            "div",
            { className: "dsh-pip-compose-footer" },
            h(
              "div",
              { className: "dsh-pip-compose-controls" },
              imageEnabled
                ? h(
                    "button",
                    {
                      type: "button",
                      className: "dsh-pip-control dsh-pip-add-image",
                      disabled: controlsLocked || structuredPending,
                      title: copy.attachImages,
                      "aria-label": copy.attachImages,
                      onClick: () => fileInputRef.current && fileInputRef.current.click(),
                    },
                    "+",
                  )
                : null,
              permissionOptions.length
                ? h(
                    "select",
                    {
                      className: "dsh-pip-control-select dsh-pip-access-select",
                      value: permissions.currentValue,
                      disabled: controlsLocked,
                      title: copy.accessMode,
                      "aria-label": copy.accessMode,
                      onChange: (event) => void onPermission(event.currentTarget.value),
                    },
                    permissionOptions.map((option) => h("option", { value: option.value, key: option.value, disabled: option.value === "custom" }, permissionLabel(option))),
                  )
                : null,
              plan !== undefined
                ? h(
                    "button",
                    {
                      type: "button",
                      className: "dsh-pip-control",
                      "data-active": planActive ? "true" : undefined,
                      disabled: controlsLocked,
                      title: planActive ? copy.planOn : copy.planOff,
                      "aria-pressed": planActive,
                      onClick: () => void onPlan(!planActive),
                    },
                    copy.planMode,
                  )
                : null,
              modelState && modelState !== EMPTY_MODEL_DIRECTORY
                ? h(
                    "select",
                    {
                      className: "dsh-pip-control-select dsh-pip-model-select",
                      value: modelValue,
                      disabled: controlsLocked || modelState.status === "loading" || modelState.status === "selecting" || modelChoices.length === 0,
                      title: copy.model,
                      "aria-label": copy.model,
                      onChange: (event) => void onModel(event.currentTarget.value),
                    },
                    !modelValue ? h("option", { value: "" }, copy.selectModel) : null,
                    modelChoices.map((choice) => h("option", { value: choice.key, key: choice.key }, choice.label)),
                  )
                : null,
              pressure !== null
                ? h(
                    "span",
                    {
                      className: "dsh-pip-context-pill",
                      "data-level": pressure >= 95 ? "critical" : pressure >= 80 ? "warning" : "normal",
                      role: "progressbar",
                      "aria-label": `${copy.context}: ${pressure}%`,
                      "aria-valuemin": 0,
                      "aria-valuemax": 100,
                      "aria-valuenow": pressure,
                      title: `${copy.context}: ${pressure}%`,
                    },
                    h(
                      "svg",
                      { className: "dsh-pip-context-ring", viewBox: "0 0 14 14", "aria-hidden": true },
                      h("circle", { className: "dsh-pip-context-track", cx: 7, cy: 7, r: 5.5 }),
                      h("circle", {
                        className: "dsh-pip-context-fill",
                        cx: 7,
                        cy: 7,
                        r: 5.5,
                        strokeDasharray: `${34.5575 * pressure / 100} 34.5575`,
                        transform: "rotate(-90 7 7)",
                      }),
                    ),
                  )
                : null,
            ),
            h(
              "button",
              snapshot.running
                ? {
                    type: "button",
                    className: "dsh-pip-send",
                    "data-stop": "true",
                    disabled: cancelling,
                    title: cancelling ? copy.stopping : copy.stop,
                    "aria-label": cancelling ? copy.stopping : copy.stop,
                    onClick: () => void onCancel(),
                  }
                : {
                    type: "submit",
                    className: "dsh-pip-send",
                    disabled: !canSend,
                    title: copy.send,
                    "aria-label": copy.send,
                  },
              h(ArrowGlyph),
            ),
          ),
          h(
            "div",
            {
              className: "dsh-pip-compose-meta",
              "data-error": Boolean(sendError) || undefined,
              role: sendError ? "alert" : "status",
              "aria-live": sendError ? "assertive" : "polite",
            },
            meta,
          ),
        ),
        stats.length
          ? h(
              "div",
              { className: "dsh-pip-stats", role: "status", "aria-label": stats.join(" | ") },
              stats.map((segment, index) => h("span", { className: "dsh-pip-stat", key: `${index}-${segment}` }, segment)),
            )
          : null,
      );
    }

    function ChatSelector({ groups, selectedId, copy, onSelect }) {
      const [open, setOpen] = React.useState(false);
      const rootRef = React.useRef(null);
      const selected = groups.flatMap((group) => group.rows).find((row) => row.id === selectedId);
      const selectedLabel = selected ? selected.displayTitle || selected.title || selected.id : copy.select;

      React.useEffect(() => {
        if (!open || !rootRef.current) return () => {};
        const doc = rootRef.current.ownerDocument;
        const closeOutside = (event) => {
          if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
        };
        const closeEscape = (event) => {
          if (event.key === "Escape") {
            setOpen(false);
            rootRef.current?.querySelector(".dsh-pip-select")?.focus();
          }
        };
        doc.addEventListener("pointerdown", closeOutside);
        doc.addEventListener("keydown", closeEscape);
        return () => {
          doc.removeEventListener("pointerdown", closeOutside);
          doc.removeEventListener("keydown", closeEscape);
        };
      }, [open]);

      return h(
        "div",
        { className: "dsh-pip-chat-selector", ref: rootRef },
        h(
          "button",
          {
            type: "button",
            className: "dsh-pip-select",
            "aria-label": copy.select,
            "aria-haspopup": "listbox",
            "aria-expanded": open,
            onClick: () => setOpen((current) => !current),
            onKeyDown: (event) => {
              if ((event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") && !open) {
                event.preventDefault();
                setOpen(true);
              }
            },
          },
          h("span", { className: "dsh-pip-select-label" }, selectedLabel),
          h("span", { className: "dsh-pip-select-chevron", "aria-hidden": true }, "⌄"),
        ),
        open
          ? h(
              "div",
              { className: "dsh-pip-chat-menu", role: "listbox", "aria-label": copy.select },
              groups.map((group) =>
                h(
                  "div",
                  { className: "dsh-pip-chat-group", key: group.key || "no-workspace", role: "group", "aria-label": group.label },
                  h("div", { className: "dsh-pip-chat-group-label" }, group.label),
                  group.rows.map((row) => {
                    const active = row.id === selectedId;
                    return h(
                      "button",
                      {
                        type: "button",
                        className: "dsh-pip-chat-option",
                        role: "option",
                        "aria-selected": active,
                        title: row.displayTitle || row.title || row.id,
                        key: row.id,
                        onClick: () => {
                          setOpen(false);
                          if (!active) onSelect(row.id);
                        },
                      },
                      row.displayTitle || row.title || row.id,
                    );
                  }),
                ),
              ),
            )
          : null,
      );
    }

    function MiniChat({ sessions, modelDirectories, onClose, focusMain, notice }) {
      const copy = activeCopy();
      const list = useSessionsList(sessions);
      const rows = sessionRows(list);
      const groups = sessionGroups(rows, copy);
      const selectedId = list.current || "";
      const summary = selectedId && list.byId ? list.byId[selectedId] : undefined;
      const { session, snapshot } = useSessionSnapshot(sessions, selectedId);
      const permissions = useSessionProjection(session, "permissions");
      const plan = useSessionProjection(session, "plan");
      const todos = useSessionProjection(session, "todos");
      const goal = useSessionProjection(session, "goal");
      const contextPressure = useSessionProjection(session, "contextPressure");
      const sessionStats = useSessionProjection(session, "sessionStats");
      const tokenUsage = useSessionProjection(session, "tokenUsage");
      const imageLimits = useSessionProjection(session, "imageLimits");
      const { directory: modelDirectory, state: modelState } = useModelDirectory(modelDirectories, selectedId);
      const [drafts, setDrafts] = React.useState({});
      const [attachmentDrafts, setAttachmentDrafts] = React.useState({});
      const attachmentDraftsRef = React.useRef({});
      const [sendingId, setSendingId] = React.useState(null);
      const [cancellingId, setCancellingId] = React.useState(null);
      const [steeringId, setSteeringId] = React.useState(null);
      const [queueBusyId, setQueueBusyId] = React.useState(null);
      const [branchingSeq, setBranchingSeq] = React.useState(null);
      const [controlsBusy, setControlsBusy] = React.useState(null);
      const [sendErrors, setSendErrors] = React.useState({});
      const draft = selectedId ? drafts[selectedId] || "" : "";
      const attachments = selectedId ? attachmentDrafts[selectedId] || [] : [];
      React.useEffect(() => () => {
        for (const rows of Object.values(attachmentDraftsRef.current)) {
          for (const attachment of rows) URL.revokeObjectURL(attachment.previewUrl);
        }
        attachmentDraftsRef.current = {};
      }, []);
      const sendError = selectedId ? sendErrors[selectedId] || "" : "";
      const state = stateOf(summary, snapshot);
      const pendingInteraction = snapshot.pending && snapshot.pending.length ? snapshot.pending[0] : null;
      const structuredPending = Boolean(
        (summary && summary.pendingInteraction) || pendingInteraction,
      );
      const canSend = Boolean(
        session &&
          selectedId &&
          snapshot.openState === "open" &&
          !snapshot.removed &&
          !structuredPending &&
          (draft.trim() || attachments.length > 0) &&
          sendingId !== selectedId,
      );
      const visibleRows = visibleConversationRows(snapshot, copy);
      const conversationEmpty = Boolean(
        snapshot.openState === "open" &&
          !snapshot.running &&
          visibleRows.projected.length === 0 &&
          visibleRows.queued.length === 0 &&
          visibleRows.runningCalls.length === 0 &&
          !visibleRows.partialText,
      );

      const selectSession = (next) => {
        if (next) sessions.open(next);
      };

      const updateDraft = (value) => {
        if (!selectedId) return;
        setDrafts((current) => ({ ...current, [selectedId]: value }));
      };

      const updateAttachmentsFor = (sessionId, update) => {
        setAttachmentDrafts((current) => {
          const rows = update(current[sessionId] || []);
          const next = { ...current, [sessionId]: rows };
          attachmentDraftsRef.current = next;
          return next;
        });
      };

      const addImages = (files) => {
        const targetId = selectedId;
        if (!targetId) return;
        setSendErrors((current) => ({ ...current, [targetId]: "" }));
        try {
          const accepted = files.filter(Boolean);
          const mediaTypes = imageLimits && Array.isArray(imageLimits.mediaTypes)
            ? imageLimits.mediaTypes
            : ["image/png", "image/jpeg", "image/webp", "image/gif"];
          if (accepted.length === 0 || accepted.some((file) => !mediaTypes.includes(file.type))) throw new Error(copy.imageFailed);
          if (
            imageLimits &&
            (
              attachments.length + accepted.length > imageLimits.maxImagesPerMessage ||
              accepted.some((file) => file.size > imageLimits.maxImageBytes) ||
              attachments.reduce((sum, attachment) => sum + (attachment.file?.size || 0), 0) + accepted.reduce((sum, file) => sum + file.size, 0) > imageLimits.maxMessageImageBytes
            )
          ) throw new Error(copy.imageFailed);
          const created = accepted.map(browserDraftImage);
          updateAttachmentsFor(targetId, (current) => [...current, ...created]);
        } catch (error) {
          setSendErrors((current) => ({ ...current, [targetId]: errorMessage(error, copy.imageFailed) }));
        }
      };

      const removeImage = (attachmentId) => {
        const targetId = selectedId;
        if (!targetId || !attachmentId) return;
        const attachment = attachments.find((item) => item.id === attachmentId);
        if (attachment) URL.revokeObjectURL(attachment.previewUrl);
        updateAttachmentsFor(targetId, (current) => current.filter((attachment) => attachment.id !== attachmentId));
      };

      const send = async () => {
        const targetId = selectedId;
        const target = session;
        const text = draft.trim();
        const targetAttachments = attachments;
        if (!targetId || !target || (!text && targetAttachments.length === 0) || !canSend) return;
        setSendingId(targetId);
        setSendErrors((current) => ({ ...current, [targetId]: "" }));
        try {
          const content = [];
          for (const attachment of targetAttachments) {
            content.push({
              type: "image",
              mediaType: attachment.file.type,
              data: await fileBase64(attachment.file),
              ...(attachment.file.name ? { name: attachment.file.name } : {}),
            });
          }
          if (text) content.push({ type: "text", text });
          const result = await target.prompt(content, "queue");
          if (!result.ok) throw result.error;
          for (const attachment of targetAttachments) URL.revokeObjectURL(attachment.previewUrl);
          setDrafts((current) => ({ ...current, [targetId]: "" }));
          updateAttachmentsFor(targetId, () => []);
        } catch (error) {
          const message = errorMessage(error, copy.unknownError);
          setSendErrors((current) => ({ ...current, [targetId]: message }));
        } finally {
          setSendingId((current) => (current === targetId ? null : current));
        }
      };

      const cancelTurn = async () => {
        const targetId = selectedId;
        const target = session;
        if (!targetId || !target || !snapshot.running || cancellingId) return;
        setCancellingId(targetId);
        setSendErrors((current) => ({ ...current, [targetId]: "" }));
        try {
          const result = await target.cancel();
          if (!result.ok) throw result.error;
        } catch (error) {
          setSendErrors((current) => ({ ...current, [targetId]: errorMessage(error, copy.cancelFailed) }));
        } finally {
          setCancellingId((current) => (current === targetId ? null : current));
        }
      };

      const loadOlder = async () => {
        const targetId = selectedId;
        if (!targetId || !session || snapshot.loadingOlder || !snapshot.hasMore) return;
        setSendErrors((current) => ({ ...current, [targetId]: "" }));
        try {
          await session.loadOlder();
        } catch (error) {
          setSendErrors((current) => ({ ...current, [targetId]: errorMessage(error, copy.loadError) }));
        }
      };

      const updateQueued = async (itemId, action) => {
        const targetId = selectedId;
        if (!targetId || !session || !itemId || !action || queueBusyId) return;
        setQueueBusyId(itemId);
        setSendErrors((current) => ({ ...current, [targetId]: "" }));
        try {
          const result = await session.updateQueue(itemId, action);
          if (!result.ok) throw result.error;
        } catch (error) {
          setSendErrors((current) => ({ ...current, [targetId]: errorMessage(error, copy.queueActionFailed) }));
        } finally {
          setQueueBusyId((current) => (current === itemId ? null : current));
        }
      };

      const steerQueued = async (itemId) => {
        const targetId = selectedId;
        const target = session;
        if (!targetId || !target || !snapshot.running || !itemId || steeringId) return;
        setSteeringId(itemId);
        setSendErrors((current) => ({ ...current, [targetId]: "" }));
        try {
          const result = await target.updateQueue(itemId, { kind: "steer" });
          if (!result.ok) throw result.error;
        } catch (error) {
          const fallback = copy.steerFailed;
          setSendErrors((current) => ({ ...current, [targetId]: errorMessage(error, fallback) }));
        } finally {
          setSteeringId((current) => (current === itemId ? null : current));
        }
      };

      const branchFrom = async (seq) => {
        const targetId = selectedId;
        if (!targetId || !Number.isFinite(seq) || branchingSeq !== null) return;
        setBranchingSeq(seq);
        setSendErrors((current) => ({ ...current, [targetId]: "" }));
        try {
          const childId = await sessions.fork({ sessionId: targetId, atSeq: seq, increaseTitle: true });
          await sessions.open(childId);
        } catch (error) {
          setSendErrors((current) => ({ ...current, [targetId]: errorMessage(error, copy.branchFailed) }));
        } finally {
          setBranchingSeq(null);
        }
      };

      const runSessionCommand = async (busyKey, line, fallback) => {
        const targetId = selectedId;
        if (!targetId || !session || controlsBusy) return;
        setControlsBusy(busyKey);
        setSendErrors((current) => ({ ...current, [targetId]: "" }));
        try {
          const result = await session.command(line);
          if (!result.ok) throw result.error;
          if (!result.value || !result.value.matched) throw new Error(fallback);
        } catch (error) {
          setSendErrors((current) => ({ ...current, [targetId]: errorMessage(error, fallback) }));
        } finally {
          setControlsBusy((current) => (current === busyKey ? null : current));
        }
      };

      const changePermission = async (value) => {
        if (!permissions || !permissions.options.some((option) => option.value === value && value !== "custom")) return;
        if (value === "danger-full-access" && typeof window.confirm === "function" && !window.confirm(copy.fullAccessConfirm)) return;
        await runSessionCommand("permission", `/permission ${value}`, copy.permissionFailed);
      };

      const togglePlan = async (enable) => {
        await runSessionCommand("plan", enable ? "/plan" : "/plan off", copy.planFailed);
      };

      const changeModel = async (key) => {
        if (!modelDirectory || controlsBusy) return;
        const choice = modelChoicesOf(modelState).find((item) => item.key === key);
        if (!choice) return;
        const targetId = selectedId;
        setControlsBusy("model");
        setSendErrors((current) => ({ ...current, [targetId]: "" }));
        try {
          await modelDirectory.select({
            provider: choice.provider,
            model: choice.model,
            ...(choice.reasoningEffort === undefined ? {} : { reasoningEffort: choice.reasoningEffort }),
          });
        } catch (error) {
          setSendErrors((current) => ({ ...current, [targetId]: errorMessage(error, copy.modelFailed) }));
        } finally {
          setControlsBusy((current) => (current === "model" ? null : current));
        }
      };

      if (rows.length === 0) {
        return h(
          "div",
          { className: "dsh-pip-root" },
          h(
            "div",
            { className: "dsh-pip-card" },
            h(
              "header",
              { className: "dsh-pip-header" },
              h("span", { className: "dsh-pip-mark" }, h(FishGlyph, { size: 22 })),
              h("strong", { style: { flex: 1 } }, copy.title),
              h("button", { type: "button", className: "dsh-pip-icon-button", title: copy.close, "aria-label": copy.close, onClick: onClose }, "×"),
            ),
            h(
              "div",
              { className: "dsh-pip-conversation", "data-empty": "true" },
              h(
                "div",
                { className: "dsh-pip-hero-stage" },
                h("div", { className: "dsh-pip-hero-glow", "aria-hidden": true }),
                h(HeroHeading, { copy }),
                h("div", { className: "dsh-pip-no-sessions", role: "status" }, list.phase === "ready" ? copy.noChats : copy.loadingChats),
              ),
            ),
          ),
        );
      }

      const composerProps = {
        copy,
        draft,
        attachments,
        imageEnabled: Boolean(session && !snapshot.removed),
        session,
        snapshot,
        structuredPending,
        sending: sendingId === selectedId,
        cancelling: cancellingId === selectedId,
        sendError,
        canSend,
        permissions,
        plan,
        modelState: modelDirectory ? modelState : null,
        contextPressure,
        sessionStats,
        tokenUsage,
        controlsBusy,
        onPermission: changePermission,
        onPlan: togglePlan,
        onModel: changeModel,
        onAddImages: addImages,
        onRemoveImage: removeImage,
        onDraft: updateDraft,
        onSend: send,
        onCancel: cancelTurn,
      };

      return h(
        "div",
        { className: "dsh-pip-root" },
        h(
          "div",
          { className: "dsh-pip-card" },
          h(
            "header",
            { className: "dsh-pip-header" },
            h("span", { className: "dsh-pip-mark", title: copy.title }, h(FishGlyph, { size: 22 })),
            h(ChatSelector, { groups, selectedId, copy, onSelect: selectSession }),
            h("button", { type: "button", className: "dsh-pip-icon-button", title: copy.main, "aria-label": copy.main, onClick: focusMain }, h(ExternalGlyph)),
            h("button", { type: "button", className: "dsh-pip-icon-button", title: copy.close, "aria-label": copy.close, onClick: onClose }, "×"),
          ),
          h(
            "div",
            { className: "dsh-pip-conversation", "data-empty": conversationEmpty ? "true" : undefined },
            conversationEmpty
              ? h(
                  "div",
                  { className: "dsh-pip-hero-stage" },
                  h("div", { className: "dsh-pip-hero-glow", "aria-hidden": true }),
                  h(HeroHeading, { copy }),
                  pendingInteraction ? h(InteractionPanel, { pending: pendingInteraction, copy, key: pendingInteraction.key }) : null,
                  h(Composer, composerProps),
                )
              : [
                  h(
                    "div",
                    { className: "dsh-pip-status", role: "status", "aria-live": "polite", key: "status" },
                    h("span", { className: "dsh-pip-dot", "data-state": state }),
                    h("span", null, statusText(state, snapshot, copy)),
                    notice ? h("span", { title: notice, style: { marginLeft: "auto" } }, "ⓘ") : null,
                  ),
                  h(MessageList, { snapshot, copy, session, steeringId, queueBusyId, branchingSeq, onSteerQueue: steerQueued, onQueueAction: updateQueued, onLoadOlder: loadOlder, onBranch: branchFrom, key: "messages" }),
                  h(
                    "div",
                    { className: "dsh-pip-bottom", key: "bottom" },
                    h(SessionDock, { todos: todos || [], goal, copy }),
                    pendingInteraction ? h(InteractionPanel, { pending: pendingInteraction, copy, key: pendingInteraction.key }) : null,
                  h(Composer, composerProps),
                  ),
                ],
          ),
        ),
      );
    }

    function preparePipWindow(pipWindow) {
      const doc = pipWindow.document;
      doc.title = activeCopy().title;
      doc.documentElement.lang = isRussian() ? "ru" : "en";
      doc.body.replaceChildren();
      doc.body.className = "dsh-pip-window";
      installStyle(doc, `${STYLE_ID}/pip`);
      const root = doc.createElement("div");
      root.id = "dsh-picture-in-picture-root";
      doc.body.appendChild(root);
      return root;
    }

    function syncThemeToWindow(pipWindow) {
      const dark = document.body.hasAttribute("data-ds-dark-theme");
      if (dark) pipWindow.document.body.setAttribute("data-ds-dark-theme", "");
      else pipWindow.document.body.removeAttribute("data-ds-dark-theme");
      pipWindow.document.documentElement.style.colorScheme = dark ? "dark" : "light";
    }

    function PictureInPictureEntry({ sessions, modelDirectories }) {
      const copy = activeCopy();
      const list = useSessionsList(sessions);
      const summary = list.current && list.byId ? list.byId[list.current] : undefined;
      const state = stateOf(summary, null);
      const [surface, setSurface] = React.useState(null);
      const [inlineOpen, setInlineOpen] = React.useState(false);
      const [opening, setOpening] = React.useState(false);
      const [notice, setNotice] = React.useState("");
      const mountedRef = React.useRef(false);
      const openingRef = React.useRef(false);
      const requestSequence = React.useRef(0);
      const ownedWindowRef = React.useRef(null);
      const launcherRef = React.useRef(null);
      const inlineRef = React.useRef(null);

      const ensureSelection = () => {
        const latest = sessions.list.getSnapshot();
        if (latest.current) return;
        const first = sessionRows(latest)[0];
        if (first) sessions.open(first.id);
      };

      const open = async () => {
        ensureSelection();
        if (surface && !surface.win.closed) {
          surface.win.focus();
          return;
        }
        if (openingRef.current) return;
        const api = window.documentPictureInPicture;
        if (!api || typeof api.requestWindow !== "function") {
          setInlineOpen(true);
          return;
        }

        const sequence = ++requestSequence.current;
        let pipWindow = null;
        openingRef.current = true;
        setOpening(true);
        try {
          pipWindow = await api.requestWindow({ width: 420, height: 660 });
          ownedWindowRef.current = pipWindow;
          if (!mountedRef.current || sequence !== requestSequence.current) {
            pipWindow.close();
            ownedWindowRef.current = null;
            return;
          }
          const root = preparePipWindow(pipWindow);
          syncThemeToWindow(pipWindow);
          if (!mountedRef.current || sequence !== requestSequence.current) {
            pipWindow.close();
            ownedWindowRef.current = null;
            return;
          }
          const nextSurface = { win: pipWindow, root };
          pipWindow.addEventListener(
            "pagehide",
            () => {
              if (ownedWindowRef.current === pipWindow) ownedWindowRef.current = null;
              if (!mountedRef.current) return;
              setSurface((current) => (current && current.win === pipWindow ? null : current));
            },
            { once: true },
          );
          setNotice("");
          setInlineOpen(false);
          setSurface(nextSurface);
          pipWindow = null;
        } catch (error) {
          if (pipWindow && !pipWindow.closed) pipWindow.close();
          if (ownedWindowRef.current === pipWindow) ownedWindowRef.current = null;
          if (!mountedRef.current || sequence !== requestSequence.current) return;
          console.warn("dsh picture-in-picture: native request failed; using inline panel", error);
          setNotice(copy.openFailed);
          setInlineOpen(true);
        } finally {
          if (sequence === requestSequence.current) {
            openingRef.current = false;
            if (mountedRef.current) setOpening(false);
          }
        }
      };

      const close = () => {
        const restoreLauncher = inlineOpen;
        requestSequence.current++;
        openingRef.current = false;
        setOpening(false);
        const ownedWindow = ownedWindowRef.current;
        ownedWindowRef.current = null;
        if (ownedWindow && !ownedWindow.closed) ownedWindow.close();
        setSurface(null);
        setInlineOpen(false);
        if (restoreLauncher) {
          const restore = () => launcherRef.current && launcherRef.current.focus();
          if (typeof window.requestAnimationFrame === "function") window.requestAnimationFrame(restore);
          else window.setTimeout(restore, 0);
        }
      };

      const focusMain = () => {
        if (list.current) sessions.open(list.current);
        window.focus();
      };

      React.useEffect(() => {
        mountedRef.current = true;
        return () => {
          mountedRef.current = false;
          requestSequence.current++;
          openingRef.current = false;
          const ownedWindow = ownedWindowRef.current;
          ownedWindowRef.current = null;
          if (ownedWindow && !ownedWindow.closed) ownedWindow.close();
        };
      }, []);

      React.useEffect(() => {
        if (!inlineOpen || !inlineRef.current) return;
        const target =
          inlineRef.current.querySelector("textarea:not(:disabled)") || inlineRef.current.querySelector("button");
        target && target.focus();
      }, [inlineOpen]);

      React.useEffect(() => {
        if (!surface) return undefined;
        const observer = new MutationObserver(() => syncThemeToWindow(surface.win));
        observer.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
        return () => observer.disconnect();
      }, [surface]);

      React.useEffect(
        () => () => {
          if (surface && !surface.win.closed) surface.win.close();
        },
        [surface],
      );

      const children = [
        h(
          "button",
          {
            ref: launcherRef,
            type: "button",
            className: "dsh-pip-launcher",
            title: opening ? copy.opening : surface ? copy.focus : copy.open,
            "aria-label": opening ? copy.opening : surface ? copy.focus : copy.open,
            disabled: opening,
            hidden: inlineOpen,
            onClick: () => void open(),
            key: "launcher",
          },
          h(ChatGlyph, { size: 24 }),
          state !== "ready" ? h("span", { className: "dsh-pip-launcher-badge", "data-state": state }) : null,
        ),
      ];
      if (inlineOpen) {
        children.push(
          h(
            "section",
            {
              ref: inlineRef,
              className: "dsh-pip-inline",
              role: "dialog",
              "aria-label": copy.title,
              onKeyDown: (event) => {
                if (event.key !== "Escape") return;
                event.preventDefault();
                event.stopPropagation();
                close();
              },
              key: "inline",
            },
            h(MiniChat, { sessions, modelDirectories, onClose: close, focusMain, notice }),
          ),
        );
      }
      if (surface && !surface.win.closed) {
        children.push(ReactDOM.createPortal(h(MiniChat, { sessions, modelDirectories, onClose: close, focusMain, notice }), surface.root, "native-pip"));
      }
      return h("div", { className: "dsh-pip-entry" }, children);
    }

    const inject = ["slots", "sessions", "modelDirectories"];

    function apply(ctx) {
      ctx.effect(
        () =>
          ctx.slots.inject("shell.overlay", () =>
            ctx.slots.register(
              {
                name: "shell.overlay",
                id: "picture-in-picture",
                order: 900,
                label: "Picture-in-picture chat",
              },
              () => h(PictureInPictureEntry, { sessions: ctx.sessions, modelDirectories: ctx.modelDirectories }),
            ),
          ),
        "picture-in-picture: shell overlay",
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.__testing = { textOfContent, imagesOfContent, textOfAssistant, answerTextOfAssistant, projectNode, visibleConversationRows, displayName, modelChoicesOf, contextPercent, statsSegments, todoSummary, sessionRows, sessionGroups, stateOf };
    return module.exports;
  },
});
