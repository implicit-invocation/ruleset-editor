import { NodeMap as FlumeNodeMap, NodeEditor } from "flume";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineExpand } from "react-icons/ai";
import { Configuration } from ".";
import { config } from "./flume-config/config";
import { NodeMap } from "./runtime";
import { IconButton } from "./ui/common/Button";
import { BottomPanel } from "./ui/panel/BottomPanel";
import { LeftPanel } from "./ui/panel/LeftPanel";
import { eventEmitter } from "./util/eventEmitter";
import { OpenFileProvider, useOpenFile, useOpenFileContext } from "./util/file/openFile";

const convertNodeMap = (nodeMap: FlumeNodeMap): NodeMap => {
  return {
    ...nodeMap,
  };
};

const testRun = async (nodeMap: FlumeNodeMap, data: unknown) => {
  console.log("==============================================");
  console.log("Start running with data: ", data);
  const runner = await Configuration.testRun.nodeRunner();
  const result = await runner.run(convertNodeMap(nodeMap), data);
  console.log("Got the result: ", result);
  console.log("==============================================");
};

const InternalEditor = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLDivElement>) => {
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
    (nodeMap: FlumeNodeMap) => {
      if (!openFile || !data) {
        return;
      }
      data.graph = nodeMap;
      saveData(data);
    },
    [openFile, data, saveData]
  );

  return (
    <div {...props} className={["flex-1 flex", className].join(" ")}>
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
        <BottomPanel hidden={fullScreen} />
      </div>
    </div>
  );
};

export const Editor = () => {
  const openFileHandler = useOpenFile();
  return (
    <OpenFileProvider value={openFileHandler}>
      <InternalEditor />
    </OpenFileProvider>
  );
};
