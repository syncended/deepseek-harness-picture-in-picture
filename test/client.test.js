import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

async function loadClient() {
  let definition;
  const styles = [];
  const document = {
    body: {
      hasAttribute: () => false,
    },
    head: {
      appendChild: (node) => styles.push(node),
    },
    querySelector: () => null,
    createElement: (name) => ({ name, dataset: {}, textContent: "" }),
  };
  const context = vm.createContext({
    window: {
      __ModuleLoader__: {
        load: (value) => {
          definition = value;
        },
      },
    },
    document,
    navigator: { language: "en" },
    URL,
    console,
    MutationObserver: class {},
  });
  const source = await readFile(new URL("../lib/client.js", import.meta.url), "utf8");
  vm.runInContext(source, context, { filename: "lib/client.js" });
  assert.equal(definition.id, "@syncended/dsh-pip");
  const React = {
    createElement: (...args) => ({ args }),
    useSyncExternalStore() {},
    useCallback: (fn) => fn,
    useEffect() {},
    useRef: () => ({ current: null }),
    useState: (value) => [value, () => {}],
  };
  const client = definition.factory((id) => {
    if (id === "react") return React;
    if (id === "react-dom") return { createPortal: (...args) => ({ args }) };
    if (id === "@deepseek-ai/dsh-client-ui-primitives") {
      return { MarkdownText: () => null, writeClipboard: async () => true };
    }
    throw new Error(`Unexpected require: ${id}`);
  });
  return { client, styles };
}

test("client bundle registers as a DSH module and installs its style", async () => {
  const { client, styles } = await loadClient();
  assert.deepEqual(Array.from(client.inject), ["slots", "sessions", "modelDirectories"]);
  assert.equal(typeof client.apply, "function");
  assert.equal(styles.length, 1);
  assert.equal(styles[0].dataset.plugin, "@syncended/dsh-pip");
});

test("client apply contributes one additive shell overlay", async () => {
  const { client } = await loadClient();
  let injectedName;
  let registration;
  const ctx = {
    sessions: {},
    modelDirectories: {},
    effect(factory) {
      return factory();
    },
    slots: {
      inject(name, factory) {
        injectedName = name;
        return factory();
      },
      register(options, component) {
        registration = { options, component };
        return () => {};
      },
    },
  };
  client.apply(ctx);
  assert.equal(injectedName, "shell.overlay");
  assert.equal(registration.options.name, "shell.overlay");
  assert.equal(registration.options.id, "picture-in-picture");
  assert.equal(typeof registration.component, "function");
});

test("message projection keeps conversational rows compact", async () => {
  const { client } = await loadClient();
  const copy = {
    image: "[Image]",
    user: "You",
    agent: "Agent",
    system: "Status",
    interrupted: "Stopped",
    maxTokens: "Limit",
    retry: "Retry",
    unknownError: "Error",
    thinking: "Thinking",
    toolRunning: "Running",
    toolDone: "Completed",
    toolFailed: "Failed",
  };
  assert.equal(
    client.__testing.textOfContent([
      { type: "text", text: "hello" },
      { type: "image" },
    ]),
    "hello\n[Image]",
  );
  assert.deepEqual(
    client.__testing.imagesOfContent([{ type: "image", attachment: { attachmentId: "image-1" } }]),
    [{ attachmentId: "image-1" }],
  );
  assert.equal(
    client.__testing.answerTextOfAssistant([
      { kind: "reasoning", text: "hidden" },
      { kind: "text", text: "copy me" },
    ]),
    "copy me",
  );
  assert.deepEqual(
    JSON.parse(
      JSON.stringify(
        client.__testing.projectNode(
          { kind: "assistant", seq: 7, blocks: [{ kind: "text", text: "world" }] },
          copy,
        ),
      ),
    ),
    { role: "assistant", label: "Agent", text: "world", blocks: [{ kind: "text", text: "world" }], copyText: "world", seq: 7, key: "assistant-7" },
  );
  assert.equal(client.__testing.projectNode({ kind: "tool-result", seq: 8 }, copy), null);
  assert.deepEqual(
    JSON.parse(
      JSON.stringify(
        client.__testing.projectNode(
          {
            kind: "assistant",
            seq: 9,
            blocks: [
              { kind: "reasoning", text: "checking the workspace" },
              { kind: "tool-call", callId: "call-1", name: "bash", argsRaw: "pwd" },
            ],
          },
          copy,
        ),
      ),
    ),
    {
      role: "assistant",
      label: "Agent",
      text: "Thinking\nchecking the workspace\n\nRunning: bash\npwd",
      blocks: [
        { kind: "reasoning", text: "checking the workspace" },
        { kind: "tool-call", callId: "call-1", name: "bash", argsRaw: "pwd" },
      ],
      copyText: "",
      seq: 9,
      key: "assistant-9",
    },
  );
  assert.deepEqual(
    JSON.parse(
      JSON.stringify(
        client.__testing.projectNode(
          {
            kind: "tool-result",
            seq: 10,
            callId: "call-1",
            call: { name: "bash" },
            content: [{ type: "text", text: "/workspace" }],
            isError: false,
          },
          copy,
        ),
      ),
    ),
    {
      role: "tool",
      label: "bash",
      text: "Completed: bash\n/workspace",
      tool: {
        kind: "tool-result",
        seq: 10,
        callId: "call-1",
        call: { name: "bash" },
        content: [{ type: "text", text: "/workspace" }],
        isError: false,
      },
      key: "tool-10",
    },
  );
});

test("queued rows keep ids and placement for send-now actions", async () => {
  const { client } = await loadClient();
  const rows = client.__testing.visibleConversationRows(
    {
      nodes: [],
      queue: [
        { id: "queued-1", placement: "queued", text: "send this next", preview: "" },
        { id: "steering-1", placement: "steering", text: null, preview: "already steering" },
      ],
      runningCalls: [
        { callId: "tool-1", name: "read", argsRaw: "{}", callView: { card: "generic", title: "Read file" }, subCalls: [] },
      ],
      partial: { blocks: [{ kind: "reasoning", text: "checking" }] },
    },
    { image: "[Image]", thinking: "Thinking", toolRunning: "Running" },
  );
  assert.deepEqual(
    Array.from(rows.queued, (row) => ({ id: row.id, placement: row.placement, text: row.text, editable: row.editable })),
    [
      { id: "queued-1", placement: "queued", text: "send this next", editable: true },
      { id: "steering-1", placement: "steering", text: "already steering", editable: false },
    ],
  );
  assert.equal(rows.runningCalls[0].callView.title, "Read file");
  assert.deepEqual(Array.from(rows.partialBlocks), [{ kind: "reasoning", text: "checking" }]);
  assert.equal(rows.partialText, "Thinking\nchecking");
});

test("composer projection helpers format access, models, context, and todos", async () => {
  const { client } = await loadClient();
  assert.equal(client.__testing.displayName("workspace-write"), "Workspace Write");
  assert.equal(client.__testing.contextPercent({ projectedTokens: 32000, contextWindow: 128000 }), 25);
  assert.deepEqual(
    JSON.parse(
      JSON.stringify(
        client.__testing.modelChoicesOf({
          groups: [
            {
              id: "openai",
              name: "OpenAI",
              models: [
                { id: "gpt", name: "GPT", description: "Fast general model", reasoning: { defaultEffort: "high" } },
              ],
            },
          ],
        }),
      ),
    ),
    [{ key: "openai\u0000gpt", provider: "openai", model: "gpt", label: "GPT", description: "Fast general model", group: "OpenAI", reasoningEffort: "high" }],
  );
  assert.deepEqual(
    Array.from(
      client.__testing.statsSegments(
        { turns: 3, steps: 5, decodeMs: 2000, decodeTokens: 80 },
        { uncachedInputTokens: 1000, cacheReadTokens: 3000, cacheWriteTokens: 0, outputTokens: 500 },
        { projectedTokens: 32000, contextWindow: 128000 },
        {
          context: "Context",
          turns: "turns",
          steps: "steps",
          tokensPerSecond: "tok/s",
          input: "Input",
          output: "Output",
          cache: "cache",
        },
      ),
    ),
    ["Context 25% · 32K/128K", "3 turns · 5 steps", "40 tok/s", "Input 4K · Output 500", "cache 75%"],
  );
  assert.equal(
    client.__testing.todoSummary(
      [
        { content: "one", status: "completed" },
        { content: "two", status: "in_progress" },
        { content: "three", status: "pending" },
      ],
      { todoDone: "done", todoActive: "active", todoPending: "pending" },
    ),
    "1 done · 1 active · 1 pending",
  );
});

test("session chooser hides unused blank rows and sorts by recency", async () => {
  const { client } = await loadClient();
  const rows = client.__testing.sessionRows({
    ids: ["old", "blank", "subagent", "child", "new"],
    current: "old",
    byId: {
      old: { id: "old", blank: false, cwd: "/work/alpha", updatedAt: 1 },
      blank: { id: "blank", blank: true, cwd: "/work/alpha", updatedAt: 5 },
      subagent: { id: "subagent", blank: false, origin: "subagent", updatedAt: 4 },
      child: { id: "child", blank: false, parentId: "old", updatedAt: 3 },
      new: { id: "new", blank: false, cwd: "/work/beta", updatedAt: 2 },
    },
  });
  assert.deepEqual(
    Array.from(rows, (row) => row.id),
    ["new", "old"],
  );
  assert.deepEqual(
    Array.from(client.__testing.sessionGroups(rows, { noWorkspace: "Other" }), (group) => ({
      label: group.label,
      ids: Array.from(group.rows, (row) => row.id),
    })),
    [
      { label: "beta", ids: ["new"] },
      { label: "alpha", ids: ["old"] },
    ],
  );
});
