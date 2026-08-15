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
    throw new Error(`Unexpected require: ${id}`);
  });
  return { client, styles };
}

test("client bundle registers as a DSH module and installs its style", async () => {
  const { client, styles } = await loadClient();
  assert.deepEqual(Array.from(client.inject), ["slots", "sessions"]);
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
  };
  assert.equal(
    client.__testing.textOfContent([
      { type: "text", text: "hello" },
      { type: "image" },
    ]),
    "hello\n[Image]",
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
    { role: "assistant", label: "Agent", text: "world", key: "assistant-7" },
  );
  assert.equal(client.__testing.projectNode({ kind: "tool-result", seq: 8 }, copy), null);
});

test("session chooser hides unused blank rows and sorts by recency", async () => {
  const { client } = await loadClient();
  const rows = client.__testing.sessionRows({
    ids: ["old", "blank", "new"],
    current: "old",
    byId: {
      old: { id: "old", blank: false, updatedAt: 1 },
      blank: { id: "blank", blank: true, updatedAt: 3 },
      new: { id: "new", blank: false, updatedAt: 2 },
    },
  });
  assert.deepEqual(
    Array.from(rows, (row) => row.id),
    ["new", "old"],
  );
});
