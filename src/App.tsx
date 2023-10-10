/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeEditor, NodeMap } from "flume";
import { useCallback, useEffect, useState } from "react";
import { config } from "./flume-config/config";
import { KVStore, NodeRunner } from "./runtime";
import { eventEmitter } from "./util/eventEmitter";

export const LocalStorageKvStore: KVStore = {
  async get(key) {
    return JSON.parse(localStorage.getItem(key) || "{}");
  },
  async set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const testRun = async (nodeMap: NodeMap) => {
  console.log("==============================================");
  console.log("try to run");
  const runner = new NodeRunner();
  runner.setKVStore(LocalStorageKvStore);
  const result = await runner.run(nodeMap, {
    type: "payBill",
    payload: {
      cif: "12341234123",
      amount: 1000,
    },
  });
  console.log(JSON.stringify(result, null, 2));
};

export const App = () => {
  const [nodeMap, setNodeMap] = useState<NodeMap>(
    JSON.parse(localStorage.getItem("nodeMap") || "{}")
  );

  const persistNodeMap = useCallback((nodeMap: NodeMap) => {
    LocalStorageKvStore.set("nodeMap", nodeMap);
    setNodeMap(nodeMap);
  }, []);

  useEffect(() => {
    if (!nodeMap) {
      return;
    }
    const handler = () => {
      testRun(nodeMap!);
    };
    eventEmitter.on("Start", handler);
    return () => {
      eventEmitter.off("Start", handler);
    };
  }, [nodeMap]);
  return (
    <div className="flex flex-1">
      <NodeEditor
        nodes={nodeMap}
        onChange={persistNodeMap}
        nodeTypes={config.nodeTypes}
        portTypes={config.portTypes}
        defaultNodes={[
          {
            type: "input",
            x: -500,
            y: 0,
          },
        ]}
      />
    </div>
  );
};
