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
    const EMPTY_LOCALE = Object.freeze({ active: undefined, locales: Object.freeze([]), revision: 0 });
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
.dsh-pip-select:focus-visible, .dsh-pip-chat-option:focus-visible,
.dsh-pip-control:focus-visible,
.dsh-pip-control-select:focus-visible, .dsh-pip-dock-header:focus-visible, .dsh-pip-queue-header:focus-visible, .dsh-pip-queue-action:focus-visible, .dsh-pip-queue-editor:focus-visible, .dsh-pip-load-older:focus-visible,
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
.dsh-pip-conversation { width: 100%; min-width: 0; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, 1fr) auto; overflow: hidden; }
.dsh-pip-messages { min-height: 0; overflow: auto; overscroll-behavior: contain; padding: 12px 18px 24px; scrollbar-width: thin; }
.dsh-pip-turn-status { min-height: 26px; display: inline-flex; align-items: center; align-self: flex-start; margin: 1px 0 5px; color: transparent; -webkit-text-fill-color: transparent; background: linear-gradient(90deg, var(--dsh-pip-accent-strong) 0%, var(--dsh-pip-accent-strong) 40%, color-mix(in srgb, var(--dsh-pip-accent) 42%, white) 50%, var(--dsh-pip-accent-strong) 60%, var(--dsh-pip-accent-strong) 100%); background-position: 100% 0; background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; animation: dsh-pip-turn-status-shimmer 1.8s linear infinite; white-space: nowrap; font-size: 13px; font-weight: 650; line-height: 26px; }
.dsh-pip-turn-status-clock { margin-left: 8px; color: var(--dsh-pip-muted); -webkit-text-fill-color: var(--dsh-pip-muted); font-size: 12px; font-weight: 400; font-variant-numeric: tabular-nums; }
.dsh-pip-notice { margin-left: auto; color: var(--dsh-pip-muted); font-size: 12px; }
@keyframes dsh-pip-turn-status-shimmer { to { background-position: 0 0; } }
@media (prefers-reduced-motion: reduce) { .dsh-pip-turn-status { background-position: 0 0; background-size: 100% 100%; animation: none; } }
.dsh-pip-load-older { display: block; min-height: 28px; margin: 0 auto 14px; border: 0; border-radius: 14px; padding: 4px 11px; color: var(--dsh-pip-muted); background: var(--dsh-pip-bg-soft); font: 500 11px/18px Inter, ui-sans-serif, system-ui, sans-serif; cursor: pointer; }
.dsh-pip-load-older:hover:not(:disabled) { color: var(--dsh-pip-text); }
.dsh-pip-load-older:disabled { cursor: progress; opacity: .65; }
.dsh-pip-empty { height: 100%; box-sizing: border-box; display: grid; place-items: center; padding: 28px; color: var(--dsh-pip-muted); text-align: center; }
.dsh-pip-message { max-width: 100%; margin: 0 0 16px; padding: 0; border: 0; border-radius: 0; color: var(--dsh-pip-text); white-space: pre-wrap; overflow-wrap: anywhere; background: transparent; font-size: 15px; line-height: 1.65; }
.dsh-pip-message[data-role="user"] { width: fit-content; max-width: 82%; margin-left: auto; padding: 10px 15px; border-radius: 22px; background: var(--dsh-pip-bg-user); line-height: 1.5; }
.dsh-pip-queued-text { min-width: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.dsh-pip-message[data-role="system"] { max-width: 100%; padding: 7px 10px; color: var(--dsh-pip-muted); background: var(--dsh-pip-bg-soft); border-radius: 10px; font-size: 12px; line-height: 1.45; }
.dsh-pip-message[data-role="log"] { max-width: 100%; padding: 8px 10px; color: var(--dsh-pip-muted); background: var(--dsh-pip-bg-soft); border-radius: 10px; font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; }
.dsh-pip-assistant-blocks { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.dsh-pip-message-stopped { align-self: flex-start; border-radius: 6px; padding: 0 6px; color: var(--dsh-pip-muted); background: var(--dsh-pip-bg-soft); font-size: 10px; line-height: 18px; }
.dsh-pip-activity { min-width: 0; display: flex; flex-direction: column; color: var(--dsh-pip-muted); font-size: 12px; line-height: 20px; }
.dsh-pip-activity-row { position: relative; min-width: 0; min-height: 24px; display: flex; align-items: center; overflow: hidden; border-radius: 6px; padding: 0 3px; color: inherit; cursor: pointer; }
.dsh-pip-activity-row:hover, .dsh-pip-activity-row:focus-visible { outline: 0; background: color-mix(in srgb, var(--dsh-pip-muted) 7%, transparent); }
.dsh-pip-activity[data-running="true"] .dsh-pip-activity-row::after { content: ""; position: absolute; inset-block: 0; left: -180px; width: 180px; pointer-events: none; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--dsh-pip-bg) 62%, transparent), transparent); animation: dsh-pip-activity-sweep 2.6s ease-out infinite; }
@keyframes dsh-pip-activity-sweep { 90%, 100% { left: 100%; } }
.dsh-pip-activity-icon { width: 16px; height: 16px; flex: none; display: grid; place-items: center; margin-right: 6px; color: var(--dsh-pip-muted); }
.dsh-pip-activity-icon svg { width: 14px; height: 14px; }
.dsh-pip-activity[data-state="running"] .dsh-pip-activity-icon { color: var(--dsh-pip-accent); }
.dsh-pip-activity[data-state="error"] .dsh-pip-activity-icon { color: var(--dsh-pip-danger); }
.dsh-pip-activity-title { flex: none; color: var(--dsh-pip-text); font-weight: 450; }
.dsh-pip-activity-separator { width: 2px; height: 2px; flex: none; margin: 0 7px; border-radius: 50%; background: var(--dsh-pip-muted); opacity: .7; }
.dsh-pip-activity-summary { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-pip-activity-chevron { width: 14px; height: 14px; flex: none; margin-left: 4px; transition: transform 120ms ease; }
.dsh-pip-activity[data-open="true"] .dsh-pip-activity-chevron { transform: rotate(180deg); }
.dsh-pip-activity-body { margin: 4px 0 2px 25px; color: var(--dsh-pip-muted); white-space: pre-wrap; overflow-wrap: anywhere; }
.dsh-pip-tool-body { max-height: 240px; display: flex; flex-direction: column; margin: 5px 0 4px 4px; overflow: auto; border: 1px solid var(--dsh-pip-border); border-radius: 12px; color: var(--dsh-pip-text); background: color-mix(in srgb, var(--dsh-pip-bg-soft) 74%, var(--dsh-pip-bg)); font: 10px/16px ui-monospace, SFMono-Regular, Menlo, monospace; }
.dsh-pip-tool-section { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 8px; padding: 9px 10px; }
.dsh-pip-tool-section + .dsh-pip-tool-section { border-top: 1px solid var(--dsh-pip-border); }
.dsh-pip-tool-section-label { color: var(--dsh-pip-muted); font-size: 9px; }
.dsh-pip-tool-section-text { min-width: 0; margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; }
.dsh-pip-tool-section-text[data-error="true"] { color: var(--dsh-pip-danger); }
.dsh-pip-tool-children { display: flex; flex-direction: column; gap: 4px; margin: 4px 0 2px 22px; padding-left: 8px; border-left: 1px solid var(--dsh-pip-border); }
.dsh-pip-message[data-role="tool"] { margin-bottom: 10px; font-size: 12px; line-height: 20px; }
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
.dsh-pip-compose { position: relative; z-index: 12; box-sizing: border-box; width: 100%; min-width: 0; padding: 8px 20px 14px; background: linear-gradient(180deg, transparent, var(--dsh-pip-bg) 22%); }
.dsh-pip-compose-card { box-sizing: border-box; width: 100%; min-width: 0; border: 1px solid var(--dsh-pip-border); border-radius: 22px; padding: 10px 10px 8px 14px; background: var(--dsh-pip-composer); box-shadow: var(--dsh-pip-card-shadow); }
.dsh-pip-compose-card:has(textarea:focus) { border-color: color-mix(in srgb, var(--dsh-pip-accent) 58%, var(--dsh-pip-border)); box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsh-pip-accent) 18%, transparent), var(--dsh-pip-card-shadow); }
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
.dsh-pip-queue-dock { position: relative; z-index: 11; box-sizing: border-box; margin: 5px 20px -10px; padding: 0 4px; }
.dsh-pip-queue-panel { position: relative; width: 100%; overflow: hidden; border-radius: 12px 12px 0 0; padding: 2px 0 9px; background: var(--dsh-pip-bg-soft); }
.dsh-pip-queue-panel::after { content: ""; position: absolute; inset: 0; pointer-events: none; border: 1px solid var(--dsh-pip-border); border-bottom: 0; border-radius: inherit; }
.dsh-pip-queue-header { box-sizing: border-box; width: 100%; min-height: 34px; display: flex; align-items: center; gap: 8px; border: 0; border-radius: 8px; padding: 5px 10px; color: var(--dsh-pip-text); background: transparent; text-align: left; cursor: pointer; font: 500 11px/20px Inter, ui-sans-serif, system-ui, sans-serif; }
.dsh-pip-queue-lead { width: 16px; height: 16px; flex: none; display: grid; place-items: center; color: var(--dsh-pip-muted); }
.dsh-pip-queue-lead svg { width: 14px; height: 14px; }
.dsh-pip-queue-count { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-pip-queue-chevron { width: 13px; height: 13px; flex: none; color: var(--dsh-pip-muted); transition: transform 120ms ease; }
.dsh-pip-queue-header[aria-expanded="true"] .dsh-pip-queue-chevron { transform: rotate(180deg); }
.dsh-pip-queue-list { max-height: 144px; margin: 0; padding: 0; overflow-y: auto; list-style: none; scrollbar-width: thin; }
.dsh-pip-queue-row { box-sizing: border-box; width: 100%; min-height: 36px; display: flex; align-items: center; gap: 7px; padding: 4px 6px 4px 10px; }
.dsh-pip-queue-row + .dsh-pip-queue-row { border-top: 1px solid var(--dsh-pip-border); }
.dsh-pip-queue-preview { min-width: 0; flex: 1; overflow: hidden; color: var(--dsh-pip-text); text-overflow: ellipsis; white-space: nowrap; font: 11px/20px Inter, ui-sans-serif, system-ui, sans-serif; }
.dsh-pip-queue-editor { box-sizing: border-box; min-width: 0; height: 27px; flex: 1; border: 1px solid var(--dsh-pip-border); border-radius: 7px; padding: 3px 7px; outline: 0; color: var(--dsh-pip-text); background: var(--dsh-pip-composer); font: 11px/19px Inter, ui-sans-serif, system-ui, sans-serif; }
.dsh-pip-queue-actions { flex: none; display: flex; align-items: center; gap: 1px; }
.dsh-pip-queue-action { width: 27px; height: 27px; display: grid; place-items: center; border: 0; border-radius: 50%; color: var(--dsh-pip-muted); background: transparent; cursor: pointer; font-size: 12px; }
.dsh-pip-queue-action:hover:not(:disabled) { color: var(--dsh-pip-text); background: color-mix(in srgb, var(--dsh-pip-muted) 10%, transparent); }
.dsh-pip-queue-action[data-primary="true"] { color: white; background: var(--dsh-pip-accent); }
.dsh-pip-queue-action:disabled { cursor: not-allowed; opacity: .4; }
.dsh-pip-compose-footer { min-width: 0; display: flex; align-items: center; gap: 6px; min-height: 32px; }
.dsh-pip-compose-controls { min-width: 0; flex: 1; display: flex; align-items: center; gap: 4px; overflow: visible; }
.dsh-pip-control, .dsh-pip-control-select { box-sizing: border-box; height: 28px; min-width: 0; border: 0; border-radius: 14px; padding: 0 8px; color: var(--dsh-pip-muted); background-color: transparent; font: 500 11px/18px Inter, ui-sans-serif, system-ui, sans-serif; cursor: pointer; }
.dsh-pip-control-selector { position: relative; min-width: 0; flex: 0 1 auto; }
.dsh-pip-control-selector[data-open="true"] { z-index: 50; }
.dsh-pip-control-select { width: 100%; display: flex; align-items: center; gap: 3px; padding: 0 4px 0 7px; text-align: left; }
.dsh-pip-control-select-label { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-pip-control-select-chevron { width: 12px; height: 12px; flex: none; color: var(--dsh-pip-muted); transition: transform 120ms ease; }
.dsh-pip-control-select[aria-expanded="true"] .dsh-pip-control-select-chevron { transform: rotate(180deg); }
.dsh-pip-control:hover:not(:disabled), .dsh-pip-control-select:hover:not(:disabled), .dsh-pip-control-select[aria-expanded="true"] { color: var(--dsh-pip-text); background-color: var(--dsh-pip-bg-soft); }
.dsh-pip-control:disabled, .dsh-pip-control-select:disabled { cursor: not-allowed; opacity: .55; }
.dsh-pip-access-selector { max-width: 126px; }
.dsh-pip-model-selector { max-width: 104px; }
.dsh-pip-control-menu { position: absolute; bottom: calc(100% + 7px); z-index: 50; box-sizing: border-box; width: min(240px, calc(100vw - 32px)); max-height: min(340px, calc(100vh - 112px)); display: flex; flex-direction: column; border: 1px solid var(--dsh-pip-border); border-radius: 12px; padding: 4px; overflow: hidden; color: var(--dsh-pip-text); background: var(--dsh-pip-composer); box-shadow: 0 16px 42px rgba(0, 0, 0, .24); }
.dsh-pip-access-selector .dsh-pip-control-menu { left: 0; width: min(220px, calc(100vw - 32px)); }
.dsh-pip-model-selector .dsh-pip-control-menu { right: 0; }
.dsh-pip-control-menu-viewport { min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
.dsh-pip-control-menu-group + .dsh-pip-control-menu-group { margin-top: 3px; padding-top: 3px; border-top: 1px solid var(--dsh-pip-border); }
.dsh-pip-control-menu-label { padding: 6px 8px 3px; color: var(--dsh-pip-muted); font-size: 10px; font-weight: 600; line-height: 14px; }
.dsh-pip-control-option { box-sizing: border-box; width: 100%; min-height: 34px; display: flex; align-items: center; gap: 8px; border: 0; border-radius: 8px; padding: 6px 8px; color: var(--dsh-pip-text); background: transparent; text-align: left; cursor: pointer; }
.dsh-pip-control-option:hover:not(:disabled), .dsh-pip-control-option:focus-visible, .dsh-pip-control-option[aria-checked="true"] { outline: 0; background: var(--dsh-pip-bg-soft); }
.dsh-pip-control-option:disabled { cursor: not-allowed; opacity: .45; }
.dsh-pip-control-option-copy { min-width: 0; flex: 1; display: flex; flex-direction: column; }
.dsh-pip-control-option-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 500 12px/18px Inter, ui-sans-serif, system-ui, sans-serif; }
.dsh-pip-control-option-description { overflow: hidden; color: var(--dsh-pip-muted); text-overflow: ellipsis; white-space: nowrap; font: 10px/14px Inter, ui-sans-serif, system-ui, sans-serif; }
.dsh-pip-control-option-check { width: 16px; height: 16px; flex: none; color: var(--dsh-pip-accent); opacity: 0; }
.dsh-pip-control-option[aria-checked="true"] .dsh-pip-control-option-check { opacity: 1; }
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
  .dsh-pip-queue-dock { margin-inline: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-pip-launcher, .dsh-pip-dot, .dsh-pip-launcher-badge, .dsh-pip-fish, .dsh-pip-activity-row::after { animation: none !important; transition: none !important; }
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
        think: "Think",
        toolRunning: "Running",
        toolDone: "Completed",
        toolFailed: "Failed",
        working: "Agent is working",
        deepDiving: "Deep diving…",
        durationSeconds: "{seconds}s",
        durationMinutes: "{minutes}m {seconds}s",
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
        queuedMessages: "{n} queued messages",
        saveQueued: "Save queued message",
        cancelQueuedEdit: "Cancel editing",
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
        think: "Размышления",
        toolRunning: "Выполняется",
        toolDone: "Завершено",
        toolFailed: "Ошибка",
        working: "Агент работает",
        deepDiving: "Погружаюсь глубже…",
        durationSeconds: "{seconds} с",
        durationMinutes: "{minutes} мин {seconds} с",
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
        queuedMessages: "Сообщений в очереди: {n}",
        saveQueued: "Сохранить сообщение",
        cancelQueuedEdit: "Отменить редактирование",
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

    COPY.zh = {
      ...COPY.en,
      title: "迷你聊天",
      close: "关闭迷你聊天",
      open: "在画中画中打开聊天",
      focus: "切换到画中画窗口",
      opening: "正在打开画中画…",
      main: "返回 Harness 主窗口",
      select: "选择聊天",
      noWorkspace: "其他聊天",
      noChats: "暂无活动聊天。请在 Harness 主窗口中创建会话。",
      loadingChats: "正在加载聊天…",
      loading: "正在加载对话…",
      loadOlder: "加载更早的消息",
      loadingOlder: "正在加载历史记录…",
      loadError: "无法加载此对话。",
      noMessages: "此聊天暂无消息。",
      preview: "预览",
      thinking: "正在思考",
      think: "思考",
      toolRunning: "运行中",
      toolDone: "已完成",
      toolFailed: "失败",
      working: "Agent 正在工作",
      deepDiving: "正在深入探索…",
      durationSeconds: "{seconds}秒",
      durationMinutes: "{minutes}分{seconds}秒",
      waiting: "Agent 需要你的输入",
      done: "已完成",
      ready: "就绪",
      removed: "会话已删除",
      placeholder: "回复 Agent…",
      attachImages: "添加图片",
      removeImage: "移除图片",
      imageFailed: "无法添加此图片。",
      accessMode: "访问模式",
      planMode: "计划",
      planOn: "计划模式已开启",
      planOff: "计划模式已关闭",
      model: "模型",
      selectModel: "选择模型",
      context: "上下文",
      turns: "轮",
      steps: "步",
      input: "输入",
      output: "输出",
      cache: "缓存",
      tokensPerSecond: "词元/秒",
      todos: "待办事项",
      todoDone: "已完成",
      todoActive: "进行中",
      todoPending: "待处理",
      goal: "目标",
      permissionFailed: "无法更改访问模式。",
      planFailed: "无法更改计划模式。",
      modelFailed: "无法更改模型。",
      fullAccessConfirm: "启用 Full access？此模式会减少确认步骤并允许敏感操作。",
      queueHint: "Enter 发送 · Shift+Enter 换行",
      queuedHint: "回复将在当前轮次结束后进入队列",
      pendingHint: "请先完成上方请求",
      approval: "需要批准",
      allowOnce: "允许一次",
      reject: "拒绝",
      questionRequest: "Agent 提问",
      customAnswer: "输入其他回答…",
      answer: "回答",
      cancelRequest: "取消",
      interactionFailed: "无法提交响应。",
      send: "发送回复",
      stop: "停止生成",
      stopping: "正在停止…",
      cancelFailed: "无法停止当前轮次。",
      sending: "正在发送…",
      openFailed: "原生画中画不可用，已改用页面内浮动面板。",
      user: "你",
      queued: "已排队",
      queuedMessages: "{n} 条排队消息",
      saveQueued: "保存排队消息",
      cancelQueuedEdit: "取消编辑",
      steer: "立即发送",
      editQueued: "编辑排队消息",
      removeQueued: "移除排队消息",
      removeQueuedConfirm: "移除此排队消息？",
      queueActionFailed: "无法更新排队消息。",
      steering: "正在立即发送…",
      steerUnavailable: "Agent 工作时可用",
      steerFailed: "无法立即发送排队消息。",
      agent: "Agent",
      copyMessage: "复制回复",
      copied: "已复制",
      branchMessage: "从此处创建分支",
      branchFailed: "无法创建分支。",
      system: "状态",
      image: "[图片]",
      interrupted: "回复已停止",
      maxTokens: "回复已达到输出上限。",
      retry: "正在重试模型请求。",
      unknownError: "无法发送回复。",
    };

    function copyForLocale(localeId) {
      if (localeId && COPY[localeId]) return COPY[localeId];
      if (localeId) return COPY.en;
      return isRussian() ? COPY.ru : COPY.en;
    }

    function languageForLocale(localeId) {
      return localeId === "zh" ? "zh-CN" : localeId === "ru" ? "ru" : "en";
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
        const blocks = Array.isArray(node.blocks) ? node.blocks : [];
        const text = textOfAssistant(blocks, copy.image, copy.thinking);
        const toolCalls = blocks.filter((block) => block && block.kind === "tool-call");
        const images = blocks.filter((block) => block && block.kind === "image" && block.attachment).map((block) => block.attachment);
        const toolLog = toolCalls.map((call) => toolCallText(call, copy)).filter(Boolean).join("\n\n");
        const renderable = blocks.some((block) => block && block.kind !== "tool-call" && (block.kind !== "text" && block.kind !== "reasoning" || typeof block.text === "string" && block.text.trim()));
        if (!renderable && !node.interrupted) return null;
        return {
          role: "assistant",
          label: copy.agent,
          text: [text, toolLog, node.interrupted ? copy.interrupted : ""].filter(Boolean).join("\n\n"),
          blocks,
          ...(node.interrupted ? { interrupted: true } : {}),
          copyText: answerTextOfAssistant(blocks),
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
          role: "tool",
          label: name,
          text: `${outcome}: ${name}${output ? `\n${output}` : ""}`,
          tool: node,
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

    function useLocaleSnapshot(locale) {
      const subscribe = React.useCallback((listener) => (locale && typeof locale.subscribe === "function" ? locale.subscribe(listener) : () => {}), [locale]);
      const getSnapshot = React.useCallback(() => (locale && typeof locale.getSnapshot === "function" ? locale.getSnapshot() : EMPTY_LOCALE), [locale]);
      return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
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
            description: model.description || "",
            group: group.name || displayName(group.id),
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

    function visibleConversationRows(snapshot, copy) {
      const projected = (snapshot.nodes || []).map((node) => projectNode(node, copy)).filter(Boolean);
      const queued = (snapshot.queue || [])
        .map((item) => ({ key: `queue-${item.id}`, id: item.id, placement: item.placement, text: item.text || item.preview || "", editable: item.text !== null }))
        .filter((item) => item.text);
      const runningCalls = (snapshot.runningCalls || []).map((call) => ({
        ...call,
        key: `running-tool-${call.callId}`,
        label: call.name || call.callId || "tool",
        text: toolCallText(call, copy),
      }));
      const partialBlocks = snapshot.partial && Array.isArray(snapshot.partial.blocks) ? snapshot.partial.blocks : [];
      const partialText = partialBlocks.length ? textOfAssistant(partialBlocks, copy.image, copy.thinking) : "";
      return { projected, queued, runningCalls, partialBlocks, partialText };
    }

    function renderMarkdown(text, streaming = false) {
      return h("div", { className: "dsh-pip-markdown" }, h(MarkdownText, { text, streaming }));
    }

    function ActivityChevron() {
      return h(
        "svg",
        { className: "dsh-pip-activity-chevron", viewBox: "0 0 14 14", "aria-hidden": true },
        h("path", { d: "m3 5.25 4 3.5 4-3.5", fill: "none", stroke: "currentColor", strokeWidth: 1.35, strokeLinecap: "round", strokeLinejoin: "round" }),
      );
    }

    function ActivityIcon({ kind = "tool" }) {
      if (kind === "think") {
        return h(
          "svg",
          { viewBox: "0 0 14 14", fill: "none", "aria-hidden": true },
          h("path", { d: "M7 1.75a4.15 4.15 0 0 0-2.7 7.3c.45.39.7.82.78 1.3h3.84c.08-.48.34-.92.8-1.32A4.15 4.15 0 0 0 7 1.75Z", stroke: "currentColor", strokeWidth: 1.15, strokeLinejoin: "round" }),
          h("path", { d: "M5.25 12.1h3.5M5.75 10.35h2.5", stroke: "currentColor", strokeWidth: 1.15, strokeLinecap: "round" }),
        );
      }
      return h(
        "svg",
        { viewBox: "0 0 14 14", fill: "none", "aria-hidden": true },
        h("rect", { x: 1.75, y: 2.25, width: 10.5, height: 9.5, rx: 2, stroke: "currentColor", strokeWidth: 1.15 }),
        h("path", { d: "m4 5 1.8 1.55L4 8.1M7.2 8.15h2.6", stroke: "currentColor", strokeWidth: 1.15, strokeLinecap: "round", strokeLinejoin: "round" }),
      );
    }

    function ThinkRow({ text, running = false, copy }) {
      const [open, setOpen] = React.useState(false);
      const visible = typeof text === "string" ? text.trim() : "";
      if (!visible) return null;
      const lines = visible.split("\n").map((line) => line.trim()).filter(Boolean);
      const summary = running ? lines[lines.length - 1] || visible : lines[0] || visible;
      return h(
        "div",
        { className: "dsh-pip-activity", "data-running": running ? "true" : undefined, "data-state": running ? "running" : "ok", "data-open": open ? "true" : undefined },
        h(
          "div",
          {
            className: "dsh-pip-activity-row",
            role: "button",
            tabIndex: 0,
            "aria-expanded": open,
            onClick: () => setOpen((value) => !value),
            onKeyDown: (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setOpen((value) => !value);
              }
            },
          },
          h("span", { className: "dsh-pip-activity-icon" }, h(ActivityIcon, { kind: "think" })),
          h("span", { className: "dsh-pip-activity-title" }, copy.think || copy.thinking),
          h("span", { className: "dsh-pip-activity-separator", "aria-hidden": true }),
          h("span", { className: "dsh-pip-activity-summary" }, summary),
          h(ActivityChevron),
        ),
        open ? h("div", { className: "dsh-pip-activity-body" }, visible) : null,
      );
    }

    function assistantBlockText(block) {
      if (!block || typeof block !== "object") return "";
      if (block.kind === "other") {
        try {
          return compactLogText(JSON.stringify(block.block, null, 2));
        } catch {
          return String(block.block || "");
        }
      }
      return "";
    }

    function AssistantBlocks({ blocks, running = false, interrupted = false, copy }) {
      const list = Array.isArray(blocks) ? blocks : [];
      const last = list.length - 1;
      const rendered = [];
      for (let index = 0; index < list.length; index += 1) {
        const block = list[index];
        if (!block) continue;
        if (block.kind === "text" && typeof block.text === "string" && block.text.trim()) {
          rendered.push(h(React.Fragment, { key: `text-${index}` }, renderMarkdown(block.text, running && index === last)));
        } else if (block.kind === "reasoning" && typeof block.text === "string" && block.text.trim()) {
          rendered.push(h(ThinkRow, { text: block.text, running: running && index === last, copy, key: `think-${index}` }));
        } else if (block.kind === "other") {
          rendered.push(h("pre", { className: "dsh-pip-tool-body", key: `other-${index}` }, assistantBlockText(block)));
        }
      }
      if (interrupted) rendered.push(h("span", { className: "dsh-pip-message-stopped", key: "stopped" }, copy.interrupted));
      return h("div", { className: "dsh-pip-assistant-blocks" }, rendered);
    }

    const TOOL_TITLES = Object.freeze({
      bash: "Bash",
      read: "Read",
      edit: "Edit",
      write: "Write",
      grep: "Grep",
      glob: "Glob",
      web_search: "Search",
      web_fetch: "Fetch",
      todo_write: "To-dos",
      ask_user_question: "Question",
      subagent: "Subagent",
    });

    function toolViewContent(view, copy) {
      if (!view || typeof view !== "object") return "";
      if (typeof view.output === "string") return compactLogText(view.output);
      if (Array.isArray(view.content)) return compactLogText(textOfContent(view.content, copy.image));
      return "";
    }

    function ToolActivity({ tool, running = false, copy }) {
      const [open, setOpen] = React.useState(false);
      const settled = Boolean(tool && tool.kind === "tool-result");
      const call = settled ? tool.call : tool;
      const name = (call && call.name) || (tool && tool.name) || (tool && tool.callId) || "tool";
      const callView = tool && tool.callView;
      const resultView = settled ? tool.resultView : null;
      const failed = settled && Boolean(tool.isError);
      const state = running ? "running" : failed ? "error" : "ok";
      const title = TOOL_TITLES[name] || displayName(name.replaceAll("_", "-"));
      const presentationTitle = (resultView && resultView.title) || (callView && callView.title) || "";
      const terminalDescription = callView && callView.card === "terminal" ? callView.description || "" : "";
      const status = running ? copy.toolRunning : failed ? copy.toolFailed : copy.toolDone;
      const summary = failed
        ? (tool.error && (tool.error.message || tool.error.code || tool.error.name)) || status
        : terminalDescription || (presentationTitle && presentationTitle !== title ? presentationTitle : "") || status;
      const rawInput = callView && callView.card === "terminal"
        ? callView.title
        : callView && callView.card === "generic" && callView.rawInput !== undefined
          ? (typeof callView.rawInput === "string" ? callView.rawInput : JSON.stringify(callView.rawInput, null, 2))
          : call && call.argsRaw;
      const input = compactLogText(rawInput, 1800);
      const output = settled ? toolViewContent(resultView, copy) || compactLogText(textOfContent(tool.content, copy.image)) : "";
      const children = tool && Array.isArray(tool.subCalls) ? tool.subCalls : [];
      const expandable = Boolean(input || output || children.length);
      const toggle = () => {
        if (expandable) setOpen((value) => !value);
      };
      return h(
        "div",
        { className: "dsh-pip-activity", "data-running": running ? "true" : undefined, "data-state": state, "data-open": open ? "true" : undefined },
        h(
          "div",
          {
            className: "dsh-pip-activity-row",
            role: expandable ? "button" : undefined,
            tabIndex: expandable ? 0 : undefined,
            "aria-expanded": expandable ? open : undefined,
            onClick: toggle,
            onKeyDown: expandable
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggle();
                  }
                }
              : undefined,
          },
          h("span", { className: "dsh-pip-activity-icon" }, h(ActivityIcon)),
          h("span", { className: "dsh-pip-activity-title" }, title),
          h("span", { className: "dsh-pip-activity-separator", "aria-hidden": true }),
          h("span", { className: "dsh-pip-activity-summary", "data-error": failed ? "true" : undefined }, summary),
          expandable ? h(ActivityChevron) : null,
        ),
        open
          ? h(
              React.Fragment,
              null,
              input || output
                ? h(
                    "div",
                    { className: "dsh-pip-tool-body" },
                    input
                      ? h(
                          "div",
                          { className: "dsh-pip-tool-section" },
                          h("span", { className: "dsh-pip-tool-section-label" }, copy.input),
                          h("pre", { className: "dsh-pip-tool-section-text" }, input),
                        )
                      : null,
                    output
                      ? h(
                          "div",
                          { className: "dsh-pip-tool-section" },
                          h("span", { className: "dsh-pip-tool-section-label" }, copy.output),
                          h("pre", { className: "dsh-pip-tool-section-text", "data-error": failed ? "true" : undefined }, output),
                        )
                      : null,
                  )
                : null,
              children.length
                ? h(
                    "div",
                    { className: "dsh-pip-tool-children" },
                    children.map((child) => h(ToolActivity, { tool: child, running: child.kind !== "tool-result", copy, key: child.callId })),
                  )
                : null,
            )
          : null,
      );
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

    function runningTurnStartTime(snapshot) {
      let latest = null;
      const timings = snapshot && snapshot.turnTimings;
      if (!timings || typeof timings.values !== "function") return latest;
      for (const timing of timings.values()) {
        if (!timing || timing.endTime !== undefined || !Number.isFinite(timing.startTime)) continue;
        if (latest === null || timing.startTime > latest) latest = timing.startTime;
      }
      return latest;
    }

    function formatRunDuration(elapsedMs, copy) {
      const total = Math.max(0, Math.floor(elapsedMs / 1000));
      const minutes = Math.floor(total / 60);
      const seconds = total % 60;
      return (minutes > 0 ? copy.durationMinutes : copy.durationSeconds)
        .replace("{minutes}", String(minutes))
        .replace("{seconds}", minutes > 0 ? String(seconds).padStart(2, "0") : String(seconds));
    }

    function TurnStatus({ startTime, copy }) {
      const [mountedAt] = React.useState(() => Date.now());
      const anchor = startTime || mountedAt;
      const [elapsedMs, setElapsedMs] = React.useState(() => Math.max(0, Date.now() - anchor));
      React.useEffect(() => {
        const tick = () => setElapsedMs(Math.max(0, Date.now() - anchor));
        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
      }, [anchor]);
      return h(
        "div",
        { className: "dsh-pip-turn-status", role: "status", "aria-live": "polite" },
        copy.deepDiving,
        elapsedMs >= 15000 ? h("span", { className: "dsh-pip-turn-status-clock", "aria-hidden": true }, formatRunDuration(elapsedMs, copy)) : null,
      );
    }

    function MessageList({ snapshot, copy, session, branchingSeq, onLoadOlder, onBranch }) {
      const endRef = React.useRef(null);
      const [copiedKey, setCopiedKey] = React.useState(null);
      const rows = visibleConversationRows(snapshot, copy);
      const projected = rows.projected;
      const { queued, runningCalls, partialBlocks, partialText } = rows;
      const pendingSteering = queued.filter((item) => item.placement === "steering");
      const tailKey = projected.length ? projected[projected.length - 1].key : "";
      React.useEffect(() => {
        endRef.current && endRef.current.scrollIntoView({ block: "end" });
      }, [snapshot.sessionId, tailKey, pendingSteering.length, runningCalls.length, partialText, snapshot.running]);

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
      if (projected.length === 0 && pendingSteering.length === 0 && runningCalls.length === 0 && !partialText && !snapshot.running) {
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
        const body = message.role === "assistant"
          ? h(AssistantBlocks, { blocks: message.blocks, interrupted: message.interrupted, copy })
          : message.role === "tool"
            ? h(ToolActivity, { tool: message.tool, copy })
            : message.text;
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
      for (const item of pendingSteering) {
        messages.push(
          h(
            "div",
            { className: "dsh-pip-message dsh-pip-stream", "data-role": "user", key: item.key },
            h("span", { className: "dsh-pip-role" }, copy.user),
            h("span", { className: "dsh-pip-queued-text" }, item.text),
          ),
        );
      }
      if (partialText) {
        messages.push(
          h(
            "div",
            { className: "dsh-pip-message dsh-pip-stream", "data-role": "assistant", key: "partial" },
            h("span", { className: "dsh-pip-role" }, copy.agent),
            h(AssistantBlocks, { blocks: partialBlocks, running: true, copy }),
          ),
        );
      }
      for (const call of runningCalls) {
        messages.push(
          h(
            "div",
            { className: "dsh-pip-message dsh-pip-stream", "data-role": "tool", key: call.key },
            h(ToolActivity, { tool: call, running: true, copy }),
          ),
        );
      }
      if (snapshot.running) messages.push(h(TurnStatus, { startTime: runningTurnStartTime(snapshot), copy, key: "turn-status" }));
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

    function QueueDock({ queue, running, busyId, steeringId, copy, onAction, onSteer }) {
      const rows = (Array.isArray(queue) ? queue : [])
        .filter((item) => item && item.placement === "queued")
        .map((item) => ({
          id: item.id,
          text: item.text,
          preview: item.preview || item.text || copy.queued,
          editable: item.text !== null,
        }));
      const [collapsed, setCollapsed] = React.useState(true);
      const [editing, setEditing] = React.useState(null);

      React.useEffect(() => {
        if (editing && !rows.some((row) => row.id === editing.id)) setEditing(null);
        if (!rows.length && !collapsed) setCollapsed(true);
      }, [rows.map((row) => row.id).join("\u0000"), editing && editing.id, collapsed]);

      if (!rows.length) return null;
      const interactionActive = Boolean(editing || busyId || steeringId);
      const expanded = rows.length === 1 || !collapsed || interactionActive;
      const save = (row) => {
        const value = editing && editing.id === row.id ? editing.text.trim() : "";
        if (!value || value === row.text) {
          setEditing(null);
          return;
        }
        setEditing(null);
        void onAction(row.id, { kind: "edit", content: [{ type: "text", text: value }] });
      };
      const queueIcon = h(
        "svg",
        { viewBox: "0 0 14 14", fill: "none", "aria-hidden": true },
        h("path", { d: "M2.2 3.25h6.4M2.2 7h6.4M2.2 10.75h4.3M10.1 8.5l1.8 1.75-1.8 1.75", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" }),
      );
      return h(
        "div",
        { className: "dsh-pip-queue-dock" },
        h(
          "div",
          { className: "dsh-pip-queue-panel" },
          rows.length > 1
            ? h(
                "button",
                {
                  type: "button",
                  className: "dsh-pip-queue-header",
                  "aria-expanded": expanded,
                  disabled: interactionActive,
                  onClick: () => setCollapsed((value) => !value),
                },
                h("span", { className: "dsh-pip-queue-lead" }, queueIcon),
                h("span", { className: "dsh-pip-queue-count" }, copy.queuedMessages.replace("{n}", String(rows.length))),
                h(
                  "svg",
                  { className: "dsh-pip-queue-chevron", viewBox: "0 0 14 14", "aria-hidden": true },
                  h("path", { d: "m3 5.25 4 3.5 4-3.5", fill: "none", stroke: "currentColor", strokeWidth: 1.35, strokeLinecap: "round", strokeLinejoin: "round" }),
                ),
              )
            : null,
          expanded
            ? h(
                "ul",
                { className: "dsh-pip-queue-list" },
                rows.map((row) => {
                  const editingRow = editing && editing.id === row.id;
                  const busy = Boolean(busyId || steeringId);
                  return h(
                    "li",
                    { className: "dsh-pip-queue-row", key: row.id },
                    rows.length === 1 ? h("span", { className: "dsh-pip-queue-lead" }, queueIcon) : null,
                    editingRow
                      ? h("input", {
                          className: "dsh-pip-queue-editor",
                          value: editing.text,
                          autoFocus: true,
                          "aria-label": copy.editQueued,
                          onChange: (event) => setEditing({ id: row.id, text: event.currentTarget.value }),
                          onKeyDown: (event) => {
                            if (event.key === "Escape") setEditing(null);
                            if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                              event.preventDefault();
                              save(row);
                            }
                          },
                        })
                      : h("span", { className: "dsh-pip-queue-preview", title: row.preview }, row.preview),
                    h(
                      "span",
                      { className: "dsh-pip-queue-actions" },
                      editingRow
                        ? [
                            h("button", { type: "button", className: "dsh-pip-queue-action", disabled: busy || !editing.text.trim(), title: copy.saveQueued, "aria-label": copy.saveQueued, onClick: () => save(row), key: "save" }, "✓"),
                            h("button", { type: "button", className: "dsh-pip-queue-action", disabled: busy, title: copy.cancelQueuedEdit, "aria-label": copy.cancelQueuedEdit, onClick: () => setEditing(null), key: "cancel" }, "×"),
                          ]
                        : [
                            row.editable ? h("button", { type: "button", className: "dsh-pip-queue-action", disabled: busy, title: copy.editQueued, "aria-label": copy.editQueued, onClick: () => setEditing({ id: row.id, text: row.text || "" }), key: "edit" }, "✎") : null,
                            h("button", { type: "button", className: "dsh-pip-queue-action", disabled: busy, title: copy.removeQueued, "aria-label": copy.removeQueued, onClick: () => void onAction(row.id, { kind: "remove" }), key: "remove" }, "×"),
                            h("button", { type: "button", className: "dsh-pip-queue-action", "data-primary": "true", disabled: busy || !running, title: running ? copy.steer : copy.steerUnavailable, "aria-label": copy.steer, onClick: () => void onSteer(row.id), key: "steer" }, h(ArrowGlyph)),
                          ],
                    ),
                  );
                }),
              )
            : null,
        ),
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

    function ComposerSelector({ value, options, label, disabled, kind, onSelect }) {
      const [open, setOpen] = React.useState(false);
      const rootRef = React.useRef(null);
      const selected = options.find((option) => option.value === value);
      const selectedLabel = selected ? selected.label : label;
      const groups = [];
      for (const option of options) {
        const key = option.group || "";
        let group = groups.find((entry) => entry.key === key);
        if (!group) {
          group = { key, label: option.group || "", options: [] };
          groups.push(group);
        }
        group.options.push(option);
      }

      React.useEffect(() => {
        if (!open || !rootRef.current) return () => {};
        const root = rootRef.current;
        const doc = root.ownerDocument;
        const win = doc.defaultView;
        const focusFrame = win?.requestAnimationFrame(() => {
          const selectedOption = root.querySelector('.dsh-pip-control-option[aria-checked="true"]');
          (selectedOption || root.querySelector(".dsh-pip-control-option:not(:disabled)"))?.focus();
        });
        const closeOutside = (event) => {
          if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
        };
        const closeEscape = (event) => {
          if (event.key !== "Escape") return;
          setOpen(false);
          rootRef.current?.querySelector(".dsh-pip-control-select")?.focus();
        };
        doc.addEventListener("pointerdown", closeOutside);
        doc.addEventListener("keydown", closeEscape);
        return () => {
          if (focusFrame !== undefined) win?.cancelAnimationFrame(focusFrame);
          doc.removeEventListener("pointerdown", closeOutside);
          doc.removeEventListener("keydown", closeEscape);
        };
      }, [open]);

      React.useEffect(() => {
        if (disabled && open) setOpen(false);
      }, [disabled, open]);

      const moveFocus = (event) => {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        const items = Array.from(rootRef.current?.querySelectorAll(".dsh-pip-control-option:not(:disabled)") || []);
        if (!items.length) return;
        event.preventDefault();
        const current = items.indexOf(rootRef.current.ownerDocument.activeElement);
        const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : event.key === "ArrowDown" ? (current + 1) % items.length : (current <= 0 ? items.length : current) - 1;
        items[next]?.focus();
      };

      return h(
        "span",
        {
          className: `dsh-pip-control-selector dsh-pip-${kind}-selector`,
          "data-open": open ? "true" : undefined,
          ref: rootRef,
          onKeyDown: moveFocus,
        },
        h(
          "button",
          {
            type: "button",
            className: `dsh-pip-control-select dsh-pip-${kind}-select`,
            disabled,
            title: selected?.description || selectedLabel,
            "aria-label": label,
            "aria-haspopup": "menu",
            "aria-expanded": open,
            onClick: () => setOpen((current) => !current),
            onKeyDown: (event) => {
              if ((event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") && !open) {
                event.preventDefault();
                setOpen(true);
              }
            },
          },
          h("span", { className: "dsh-pip-control-select-label" }, selectedLabel),
          h(
            "svg",
            { className: "dsh-pip-control-select-chevron", viewBox: "0 0 12 12", "aria-hidden": true },
            h("path", { d: "m2.5 4.5 3.5 3 3.5-3", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" }),
          ),
        ),
        open
          ? h(
              "div",
              { className: "dsh-pip-control-menu", role: "menu", "aria-label": label },
              h(
                "div",
                { className: "dsh-pip-control-menu-viewport" },
                groups.map((group) =>
                  h(
                    "div",
                    { className: "dsh-pip-control-menu-group", role: "group", "aria-label": group.label || label, key: group.key || "default" },
                    group.label ? h("div", { className: "dsh-pip-control-menu-label" }, group.label) : null,
                    group.options.map((option) => {
                      const active = option.value === value;
                      return h(
                        "button",
                        {
                          type: "button",
                          className: "dsh-pip-control-option",
                          role: "menuitemradio",
                          "aria-checked": active,
                          disabled: option.disabled,
                          title: option.description || option.label,
                          key: option.value,
                          onClick: () => {
                            setOpen(false);
                            rootRef.current?.querySelector(".dsh-pip-control-select")?.focus();
                            if (!active) void onSelect(option.value);
                          },
                        },
                        h(
                          "span",
                          { className: "dsh-pip-control-option-copy" },
                          h("span", { className: "dsh-pip-control-option-label" }, option.label),
                          option.description ? h("span", { className: "dsh-pip-control-option-description" }, option.description) : null,
                        ),
                        h(
                          "svg",
                          { className: "dsh-pip-control-option-check", viewBox: "0 0 16 16", "aria-hidden": true },
                          h("path", { d: "m3.2 8.1 3.05 3.05 6.55-6.4", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" }),
                        ),
                      );
                    }),
                  ),
                ),
              ),
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
                ? h(ComposerSelector, {
                    kind: "access",
                    value: permissions.currentValue,
                    label: copy.accessMode,
                    disabled: controlsLocked,
                    options: permissionOptions
                      .filter((option) => option.value !== "custom")
                      .map((option) => ({ value: option.value, label: permissionLabel(option), description: option.description || "" })),
                    onSelect: onPermission,
                  })
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
                ? h(ComposerSelector, {
                    kind: "model",
                    value: modelValue,
                    label: modelValue ? copy.model : copy.selectModel,
                    disabled: controlsLocked || modelState.status === "loading" || modelState.status === "selecting" || modelChoices.length === 0,
                    options: modelChoices.map((choice) => ({
                      value: choice.key,
                      label: choice.label,
                      description: choice.description,
                      group: choice.group,
                    })),
                    onSelect: onModel,
                  })
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

    function MiniChat({ sessions, modelDirectories, localeId, onClose, focusMain, notice }) {
      const copy = copyForLocale(localeId);
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
            notice ? h("span", { className: "dsh-pip-notice", title: notice, "aria-label": notice }, "ⓘ") : null,
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
                  h(MessageList, { snapshot, copy, session, branchingSeq, onLoadOlder: loadOlder, onBranch: branchFrom, key: "messages" }),
                  h(
                    "div",
                    { className: "dsh-pip-bottom", key: "bottom" },
                    h(SessionDock, { todos: todos || [], goal, copy }),
                    h(QueueDock, { queue: snapshot.queue, running: snapshot.running, busyId: queueBusyId, steeringId, copy, onAction: updateQueued, onSteer: steerQueued }),
                    pendingInteraction ? h(InteractionPanel, { pending: pendingInteraction, copy, key: pendingInteraction.key }) : null,
                    h(Composer, composerProps),
                  ),
                ],
          ),
        ),
      );
    }

    function preparePipWindow(pipWindow, localeId) {
      const doc = pipWindow.document;
      doc.title = copyForLocale(localeId).title;
      doc.documentElement.lang = languageForLocale(localeId);
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

    function PictureInPictureEntry({ sessions, modelDirectories, locale }) {
      const localeSnapshot = useLocaleSnapshot(locale);
      const localeId = localeSnapshot.active;
      const copy = copyForLocale(localeId);
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
          const root = preparePipWindow(pipWindow, localeId);
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

      React.useEffect(() => {
        if (!surface || surface.win.closed) return;
        surface.win.document.title = copy.title;
        surface.win.document.documentElement.lang = languageForLocale(localeId);
      }, [surface, localeId, copy.title]);

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
            h(MiniChat, { sessions, modelDirectories, localeId, onClose: close, focusMain, notice }),
          ),
        );
      }
      if (surface && !surface.win.closed) {
        children.push(ReactDOM.createPortal(h(MiniChat, { sessions, modelDirectories, localeId, onClose: close, focusMain, notice }), surface.root, "native-pip"));
      }
      return h("div", { className: "dsh-pip-entry" }, children);
    }

    const inject = ["slots", "sessions", "modelDirectories", "locale"];

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
              () => h(PictureInPictureEntry, { sessions: ctx.sessions, modelDirectories: ctx.modelDirectories, locale: ctx.locale }),
            ),
          ),
        "picture-in-picture: shell overlay",
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.__testing = { copyForLocale, languageForLocale, runningTurnStartTime, formatRunDuration, textOfContent, imagesOfContent, textOfAssistant, answerTextOfAssistant, projectNode, visibleConversationRows, displayName, modelChoicesOf, contextPercent, statsSegments, todoSummary, sessionRows, sessionGroups, stateOf };
    return module.exports;
  },
});
