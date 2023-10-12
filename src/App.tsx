import { NodeEditor, NodeMap } from "flume";
import { useEffect, useState } from "react";
import { AiOutlineExpand } from "react-icons/ai";
import { config } from "./flume-config/config";
import { NodeRunner } from "./runtime";
import { IconButton } from "./ui/common/Button";
import { LeftPanel } from "./ui/panel/LeftPanel";
import { Output } from "./ui/panel/Output";
import { eventEmitter } from "./util/eventEmitter";
import { readFileData, writeFileData } from "./util/folderActions";
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
  const [fullScreen, setFullScreen] = useState(false);
  const [nodeMap, setNodeMap] = useState<NodeMap | undefined>();

  const [openFile, setOpenFile] = useState<string[] | null>(null);

  useEffect(() => {
    const handler = (path: string[]) => {
      setOpenFile(path);
      setNodeMap(undefined);
      setTimeout(async () => {
        const data = await readFileData(path);
        setNodeMap(data.graph);
      }, 0);
    };
    eventEmitter.on("openFile", handler);
    return () => {
      eventEmitter.off("openFile", handler);
    };
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

  useEffect(() => {
    if (!nodeMap || !openFile) {
      return;
    }
    const handler = async () => {
      const data = await readFileData(openFile);
      data.graph = nodeMap;
      await writeFileData(openFile, data);
    };
    handler();
  }, [nodeMap, openFile]);

  return (
    <div className="flex-1 flex">
      {!fullScreen && <LeftPanel />}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="flex-1 w-full relative flex flex-col">
          <div className="absolute top-1 left-1 z-10">
            <IconButton
              onClick={() => setFullScreen(!fullScreen)}
              icon={AiOutlineExpand}
              className="z-10 text-gray-600 hover:text-gray-500"
              size="lg"
            />
          </div>
          <div className="flex-1 w-full bg-gray-900">
            {openFile && nodeMap && (
              <NodeEditor
                nodes={nodeMap}
                onChange={setNodeMap}
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
            )}
          </div>
        </div>
        {!fullScreen && <Output />}
      </div>
    </div>
  );
};
