window.__ModuleLoader__.load({
  id: "@syncended/dsh-pip",
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");
    const ReactDOM = require("react-dom");
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
    const EMPTY_SESSION = Object.freeze({
      sessionId: "",
      nodes: Object.freeze([]),
      partial: null,
      pending: Object.freeze([]),
      queue: Object.freeze([]),
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
  --dsh-pip-accent: #4f6ef7;
  --dsh-pip-accent-strong: #3d5ce7;
  --dsh-pip-bg: #ffffff;
  --dsh-pip-bg-soft: #f5f6f8;
  --dsh-pip-bg-user: #edf1ff;
  --dsh-pip-border: rgba(27, 31, 36, 0.13);
  --dsh-pip-text: #171a1f;
  --dsh-pip-muted: #6b7280;
  --dsh-pip-danger: #d14343;
  --dsh-pip-shadow: 0 18px 56px rgba(15, 23, 42, 0.24);
}
body[data-ds-dark-theme] {
  --dsh-pip-bg: #202124;
  --dsh-pip-bg-soft: #292b30;
  --dsh-pip-bg-user: #293352;
  --dsh-pip-border: rgba(255, 255, 255, 0.12);
  --dsh-pip-text: #f2f3f5;
  --dsh-pip-muted: #a7abb4;
  --dsh-pip-danger: #ff7b7b;
  --dsh-pip-shadow: 0 18px 64px rgba(0, 0, 0, 0.48);
}
.dsh-pip-entry { pointer-events: auto; }
.dsh-pip-launcher {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 70;
  width: 48px;
  height: 48px;
  border: 1px solid var(--dsh-pip-border);
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(145deg, #6682ff, var(--dsh-pip-accent-strong));
  box-shadow: 0 10px 30px rgba(60, 85, 220, 0.36);
  cursor: pointer;
  transition: transform 140ms ease, box-shadow 140ms ease;
}
.dsh-pip-launcher:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(60, 85, 220, 0.44); }
.dsh-pip-launcher:disabled { cursor: progress; opacity: .72; transform: none; }
.dsh-pip-launcher[hidden] { display: none; }
.dsh-pip-launcher:focus-visible, .dsh-pip-icon-button:focus-visible, .dsh-pip-send:focus-visible,
.dsh-pip-select:focus-visible, .dsh-pip-compose textarea:focus-visible {
  outline: 2px solid var(--dsh-pip-accent);
  outline-offset: 2px;
}
.dsh-pip-launcher-badge {
  position: absolute;
  top: -3px;
  right: -3px;
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
  width: min(390px, calc(100vw - 28px));
  height: min(620px, calc(100vh - 28px));
  min-height: 0;
  border: 1px solid var(--dsh-pip-border);
  border-radius: 20px;
  overflow: hidden;
  background: var(--dsh-pip-bg);
  box-shadow: var(--dsh-pip-shadow);
}
.dsh-pip-root { width: 100%; height: 100%; color: var(--dsh-pip-text); background: var(--dsh-pip-bg); }
.dsh-pip-card { height: 100%; min-height: 0; display: grid; grid-template-rows: auto auto minmax(0, 1fr) auto; font: 13px/1.45 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
.dsh-pip-header { display: flex; align-items: center; gap: 8px; padding: 10px 10px 8px 12px; border-bottom: 1px solid var(--dsh-pip-border); background: var(--dsh-pip-bg); }
.dsh-pip-mark { width: 24px; height: 24px; flex: none; border-radius: 8px; display: grid; place-items: center; color: white; background: linear-gradient(145deg, #6682ff, var(--dsh-pip-accent-strong)); }
.dsh-pip-select { min-width: 0; flex: 1; height: 32px; border: 1px solid var(--dsh-pip-border); border-radius: 9px; padding: 0 28px 0 10px; color: var(--dsh-pip-text); background: var(--dsh-pip-bg-soft); font: inherit; font-weight: 600; }
.dsh-pip-icon-button { width: 30px; height: 30px; flex: none; display: grid; place-items: center; border: 0; border-radius: 9px; color: var(--dsh-pip-muted); background: transparent; cursor: pointer; font-size: 18px; }
.dsh-pip-icon-button:hover { color: var(--dsh-pip-text); background: var(--dsh-pip-bg-soft); }
.dsh-pip-status { min-height: 30px; display: flex; align-items: center; gap: 7px; padding: 6px 12px; color: var(--dsh-pip-muted); background: var(--dsh-pip-bg-soft); border-bottom: 1px solid var(--dsh-pip-border); font-size: 12px; }
.dsh-pip-dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: #8b929f; }
.dsh-pip-dot[data-state="running"] { background: #6b8cff; animation: dsh-pip-pulse 1.4s infinite; }
.dsh-pip-dot[data-state="waiting"] { background: #e5a838; }
.dsh-pip-dot[data-state="done"] { background: #33b36b; }
.dsh-pip-messages { min-height: 0; overflow: auto; overscroll-behavior: contain; padding: 13px 12px 18px; scrollbar-width: thin; }
.dsh-pip-empty { height: 100%; display: grid; place-items: center; padding: 24px; color: var(--dsh-pip-muted); text-align: center; }
.dsh-pip-message { max-width: 92%; margin: 0 0 10px; padding: 9px 11px; border: 1px solid var(--dsh-pip-border); border-radius: 13px 13px 13px 4px; white-space: pre-wrap; overflow-wrap: anywhere; background: var(--dsh-pip-bg-soft); }
.dsh-pip-message[data-role="user"] { margin-left: auto; border-radius: 13px 13px 4px 13px; background: var(--dsh-pip-bg-user); }
.dsh-pip-message[data-role="system"] { max-width: 100%; padding: 6px 9px; color: var(--dsh-pip-muted); background: transparent; border-style: dashed; font-size: 12px; }
.dsh-pip-message[data-role="error"] { max-width: 100%; color: var(--dsh-pip-danger); background: transparent; }
.dsh-pip-role { display: block; margin-bottom: 3px; color: var(--dsh-pip-muted); font-size: 10px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.dsh-pip-stream { opacity: .88; }
.dsh-pip-compose { border-top: 1px solid var(--dsh-pip-border); padding: 9px; background: var(--dsh-pip-bg); }
.dsh-pip-compose-row { display: flex; align-items: flex-end; gap: 7px; }
.dsh-pip-compose textarea { box-sizing: border-box; min-width: 0; flex: 1; min-height: 38px; max-height: 120px; resize: none; border: 1px solid var(--dsh-pip-border); border-radius: 11px; padding: 9px 10px; color: var(--dsh-pip-text); background: var(--dsh-pip-bg-soft); font: inherit; }
.dsh-pip-compose textarea::placeholder { color: var(--dsh-pip-muted); }
.dsh-pip-send { width: 38px; height: 38px; flex: none; display: grid; place-items: center; border: 0; border-radius: 11px; color: white; background: var(--dsh-pip-accent); cursor: pointer; }
.dsh-pip-send:hover { background: var(--dsh-pip-accent-strong); }
.dsh-pip-send:disabled, .dsh-pip-compose textarea:disabled { cursor: not-allowed; opacity: .55; }
.dsh-pip-compose-meta { min-height: 17px; margin-top: 5px; padding: 0 2px; color: var(--dsh-pip-muted); font-size: 11px; }
.dsh-pip-compose-meta[data-error="true"] { color: var(--dsh-pip-danger); }
body.dsh-pip-window { margin: 0; min-width: 280px; min-height: 300px; overflow: hidden; background: var(--dsh-pip-bg); }
body.dsh-pip-window #dsh-picture-in-picture-root { width: 100vw; height: 100vh; }
@media (max-width: 520px) {
  .dsh-pip-inline { right: 7px; bottom: 7px; width: calc(100vw - 14px); height: calc(100vh - 14px); border-radius: 16px; }
  .dsh-pip-launcher { right: 14px; bottom: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-pip-launcher, .dsh-pip-dot, .dsh-pip-launcher-badge { animation: none !important; transition: none !important; }
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
        noChats: "No active chats yet. Create a session in the main Harness window.",
        loadingChats: "Loading chats…",
        loading: "Loading conversation…",
        loadError: "Could not load this conversation.",
        noMessages: "No messages in this chat yet.",
        working: "Agent is working",
        waiting: "Agent needs your input",
        done: "Completed",
        ready: "Ready",
        removed: "Session was removed",
        placeholder: "Reply to the agent…",
        queueHint: "Enter to send · Shift+Enter for a new line",
        queuedHint: "The reply will be queued after the current turn",
        pendingHint: "Complete the pending request in the main chat",
        send: "Send reply",
        sending: "Sending…",
        openFailed: "Native picture-in-picture was unavailable; using the floating panel.",
        user: "You",
        queued: "Queued",
        agent: "Agent",
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
        noChats: "Активных чатов пока нет. Создайте сессию в основном окне Harness.",
        loadingChats: "Загружаем чаты…",
        loading: "Загружаем переписку…",
        loadError: "Не удалось загрузить переписку.",
        noMessages: "В этом чате пока нет сообщений.",
        working: "Агент работает",
        waiting: "Агент ждёт вашего ответа",
        done: "Завершено",
        ready: "Готов к сообщению",
        removed: "Сессия удалена",
        placeholder: "Ответить агенту…",
        queueHint: "Enter — отправить · Shift+Enter — новая строка",
        queuedHint: "Ответ будет поставлен в очередь после текущего хода",
        pendingHint: "Завершите ожидающий запрос в основном чате",
        send: "Отправить ответ",
        sending: "Отправляем…",
        openFailed: "Нативный picture-in-picture недоступен — открыта панель внутри страницы.",
        user: "Вы",
        queued: "В очереди",
        agent: "Агент",
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

    function textOfAssistant(blocks, imageLabel = "[Image]") {
      if (!Array.isArray(blocks)) return "";
      return blocks
        .map((block) => {
          if (block && block.kind === "text" && typeof block.text === "string") return block.text;
          if (block && block.kind === "image") return imageLabel;
          return "";
        })
        .filter(Boolean)
        .join("\n");
    }

    function projectNode(node, copy) {
      if (!node || typeof node !== "object") return null;
      if (node.kind === "user" || node.kind === "steering") {
        const text = textOfContent(node.content, copy.image);
        return text ? { role: "user", label: copy.user, text, key: `${node.kind}-${node.seq}` } : null;
      }
      if (node.kind === "assistant") {
        const text = textOfAssistant(node.blocks, copy.image);
        if (!text && !node.interrupted) return null;
        return {
          role: "assistant",
          label: copy.agent,
          text: text || copy.interrupted,
          key: `assistant-${node.seq}`,
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

    function sessionRows(list) {
      const seen = new Set();
      const rows = [];
      for (const id of list.ids || []) {
        const row = list.byId && list.byId[id];
        if (!row || seen.has(id) || (row.blank && id !== list.current)) continue;
        seen.add(id);
        rows.push(row);
      }
      const current = list.current && list.byId && list.byId[list.current];
      if (current && !seen.has(current.id)) rows.unshift(current);
      rows.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      return rows;
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

    function MessageList({ snapshot, copy }) {
      const endRef = React.useRef(null);
      const projected = (snapshot.nodes || []).map((node) => projectNode(node, copy)).filter(Boolean).slice(-18);
      const queued = (snapshot.queue || [])
        .map((item) => ({ key: `queue-${item.id}`, text: item.text || item.preview || "" }))
        .filter((item) => item.text);
      const partialText = snapshot.partial ? textOfAssistant(snapshot.partial.blocks, copy.image) : "";
      React.useEffect(() => {
        endRef.current && endRef.current.scrollIntoView({ block: "end" });
      }, [snapshot.sessionId, projected.length, queued.length, partialText]);

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
      if (projected.length === 0 && queued.length === 0 && !partialText) {
        return h("div", { className: "dsh-pip-messages" }, h("div", { className: "dsh-pip-empty" }, copy.noMessages));
      }
      const messages = projected.map((message) =>
        h(
          "div",
          { className: "dsh-pip-message", "data-role": message.role, key: message.key },
          h("span", { className: "dsh-pip-role" }, message.label),
          message.text,
        ),
      );
      for (const item of queued) {
        messages.push(
          h(
            "div",
            { className: "dsh-pip-message dsh-pip-stream", "data-role": "user", key: item.key },
            h("span", { className: "dsh-pip-role" }, copy.queued),
            item.text,
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

    function MiniChat({ sessions, onClose, focusMain, notice }) {
      const copy = activeCopy();
      const list = useSessionsList(sessions);
      const rows = sessionRows(list);
      const selectedId = list.current || "";
      const summary = selectedId && list.byId ? list.byId[selectedId] : undefined;
      const { session, snapshot } = useSessionSnapshot(sessions, selectedId);
      const [drafts, setDrafts] = React.useState({});
      const [sendingId, setSendingId] = React.useState(null);
      const [sendErrors, setSendErrors] = React.useState({});
      const draft = selectedId ? drafts[selectedId] || "" : "";
      const sendError = selectedId ? sendErrors[selectedId] || "" : "";
      const state = stateOf(summary, snapshot);
      const structuredPending = Boolean(
        (summary && summary.pendingInteraction) || (snapshot.pending && snapshot.pending.length),
      );
      const canSend = Boolean(
        session &&
          selectedId &&
          snapshot.openState === "open" &&
          !snapshot.removed &&
          !structuredPending &&
          draft.trim() &&
          sendingId !== selectedId,
      );

      const selectSession = (event) => {
        const next = event.currentTarget.value;
        if (next) sessions.open(next);
      };

      const updateDraft = (value) => {
        if (!selectedId) return;
        setDrafts((current) => ({ ...current, [selectedId]: value }));
      };

      const send = async () => {
        const targetId = selectedId;
        const target = session;
        const text = draft.trim();
        if (!targetId || !target || !text || !canSend) return;
        setSendingId(targetId);
        setSendErrors((current) => ({ ...current, [targetId]: "" }));
        try {
          const result = await target.prompt([{ type: "text", text }], "queue");
          if (!result.ok) throw result.error;
          setDrafts((current) => ({ ...current, [targetId]: "" }));
        } catch (error) {
          const message = errorMessage(error, copy.unknownError);
          setSendErrors((current) => ({ ...current, [targetId]: message }));
        } finally {
          setSendingId((current) => (current === targetId ? null : current));
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
              h("span", { className: "dsh-pip-mark" }, h(ChatGlyph, { size: 16 })),
              h("strong", { style: { flex: 1 } }, copy.title),
              h("button", { type: "button", className: "dsh-pip-icon-button", title: copy.close, "aria-label": copy.close, onClick: onClose }, "×"),
            ),
            h("div", { className: "dsh-pip-status", role: "status", "aria-live": "polite" }, copy.select),
            h("div", { className: "dsh-pip-empty" }, list.phase === "ready" ? copy.noChats : copy.loadingChats),
            h("div"),
          ),
        );
      }

      return h(
        "div",
        { className: "dsh-pip-root" },
        h(
          "div",
          { className: "dsh-pip-card" },
          h(
            "header",
            { className: "dsh-pip-header" },
            h("span", { className: "dsh-pip-mark", title: copy.title }, h(ChatGlyph, { size: 16 })),
            h(
              "select",
              { className: "dsh-pip-select", value: selectedId, onChange: selectSession, "aria-label": copy.select },
              rows.map((row) => h("option", { value: row.id, key: row.id }, row.displayTitle || row.title || row.id)),
            ),
            h("button", { type: "button", className: "dsh-pip-icon-button", title: copy.main, "aria-label": copy.main, onClick: focusMain }, h(ExternalGlyph)),
            h("button", { type: "button", className: "dsh-pip-icon-button", title: copy.close, "aria-label": copy.close, onClick: onClose }, "×"),
          ),
          h(
            "div",
            { className: "dsh-pip-status", role: "status", "aria-live": "polite" },
            h("span", { className: "dsh-pip-dot", "data-state": state }),
            h("span", null, statusText(state, snapshot, copy)),
            notice ? h("span", { title: notice, style: { marginLeft: "auto" } }, "ⓘ") : null,
          ),
          h(MessageList, { snapshot, copy }),
          h(
            "form",
            {
              className: "dsh-pip-compose",
              onSubmit: (event) => {
                event.preventDefault();
                void send();
              },
            },
            h(
              "div",
              { className: "dsh-pip-compose-row" },
              h("textarea", {
                value: draft,
                rows: 1,
                disabled: !session || snapshot.openState !== "open" || snapshot.removed || structuredPending,
                placeholder: copy.placeholder,
                "aria-label": copy.placeholder,
                onChange: (event) => updateDraft(event.currentTarget.value),
                onKeyDown: (event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    void send();
                  }
                },
              }),
              h(
                "button",
                { type: "submit", className: "dsh-pip-send", disabled: !canSend, title: copy.send, "aria-label": copy.send },
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
              sendError ||
                (sendingId === selectedId
                  ? copy.sending
                  : structuredPending
                    ? copy.pendingHint
                    : snapshot.running
                      ? copy.queuedHint
                      : copy.queueHint),
            ),
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

    function PictureInPictureEntry({ sessions }) {
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
          pipWindow = await api.requestWindow({ width: 390, height: 620 });
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
            h(MiniChat, { sessions, onClose: close, focusMain, notice }),
          ),
        );
      }
      if (surface && !surface.win.closed) {
        children.push(ReactDOM.createPortal(h(MiniChat, { sessions, onClose: close, focusMain, notice }), surface.root, "native-pip"));
      }
      return h("div", { className: "dsh-pip-entry" }, children);
    }

    const inject = ["slots", "sessions"];

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
              () => h(PictureInPictureEntry, { sessions: ctx.sessions }),
            ),
          ),
        "picture-in-picture: shell overlay",
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.__testing = { textOfContent, textOfAssistant, projectNode, sessionRows, stateOf };
    return module.exports;
  },
});
