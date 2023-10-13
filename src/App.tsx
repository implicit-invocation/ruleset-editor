import { NodeEditor, NodeMap } from "flume";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineExpand } from "react-icons/ai";
import { config } from "./flume-config/config";
import { MaybePromise, NodeRunner } from "./runtime";
import { IconButton } from "./ui/common/Button";
import { LeftPanel } from "./ui/panel/LeftPanel";
import { Output } from "./ui/panel/Output";
import { eventEmitter } from "./util/eventEmitter";
import { OpenFileProvider, useOpenFile, useOpenFileContext } from "./util/file/openFile";
import { readFileData } from "./util/folderActions";
import { LocalStorageKvStore } from "./util/kvStore";

const functionRegistry: Record<string, (payload: unknown) => MaybePromise<unknown>> = {
  add: async (payload) => {
    const { input1, input2 } = payload as {
      input1: number;
      input2: number;
    };
    return {
      result: input1 + input2,
    };
  },
};

const runBuildInFunction = async (name: string, payload: unknown) => {
  const fn = functionRegistry[name];
  if (!fn) {
    throw new Error(`Function ${name} not found`);
  }
  return await fn(payload);
};

const testRun = async (nodeMap: NodeMap, data: unknown) => {
  console.log("==============================================");
  console.log("Start running with data: ", data);
  const runner = new NodeRunner();
  runner.setKVStore(LocalStorageKvStore);
  runner.setFunctionHandler(async (name, payload) => {
    if (name.startsWith("builtin:")) {
      return runBuildInFunction(name.substring(8, name.length), payload);
    }
    const data = await readFileData(name.split("/"));
    const runner = new NodeRunner();
    return await runner.run(data.graph, payload);
  });
  const result = await runner.run(nodeMap, data);
  console.log("Got the result: ", result);
  console.log("==============================================");
};

export const Editor = () => {
  const [fullScreen, setFullScreen] = useState(false);

  const { openFile, data, saveData } = useOpenFileContext();

  useEffect(() => {
    if (!data) {
      return;
    }
    const handler = (testData: unknown) => {
      testRun(data.graph, testData);
    };
    eventEmitter.on("Start", handler);
    return () => {
      eventEmitter.off("Start", handler);
    };
  }, [data]);

  const persistNodeMap = useCallback(
    (nodeMap: NodeMap) => {
      if (!openFile || !data) {
        return;
      }
      data.graph = nodeMap;
      saveData(data);
    },
    [openFile, data, saveData],
  );

  return (
    <div className="flex-1 flex">
      <LeftPanel hidden={fullScreen} />
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
            {openFile && data && (
              <NodeEditor
                nodes={data.graph}
                onChange={persistNodeMap}
                nodeTypes={config.nodeTypes}
                portTypes={config.portTypes}
                initialScale={0.8}
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
        <Output hidden={fullScreen} />
      </div>
    </div>
  );
};

export const App = () => {
  const openFileHandler = useOpenFile();
  return (
    <OpenFileProvider value={openFileHandler}>
      <Editor />
    </OpenFileProvider>
  );
};
