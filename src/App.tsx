import { NodeEditor, NodeMap } from "flume";
import { useCallback, useEffect, useState } from "react";
import { config } from "./flume-config/config";
import { NodeRunner } from "./runtime";
import { LeftPanel } from "./ui/panel/LeftPanel";
import { Output } from "./ui/panel/Output";
import { eventEmitter } from "./util/eventEmitter";
import { LocalStorageKvStore } from "./util/kvStore";

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
    localStorage.setItem("nodeMap", JSON.stringify(nodeMap));
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
    <div className="flex-1 flex">
      <LeftPanel />
      <div className="flex-1 flex flex-col justify-center items-center">
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
        <Output />
      </div>
    </div>
  );
};
