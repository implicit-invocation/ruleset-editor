import { FlumeConfig, NodeMap as FlumeNodeMap, NodeEditor } from "flume";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineExpand } from "react-icons/ai";
import { Configuration } from ".";
import { initConfig } from "./flume-config/config";
import { registerAllSchemaPort } from "./flume-config/port/schema";
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

const InternalEditor = ({
  className,
  customTypes,
  ...props
}: React.ButtonHTMLAttributes<HTMLDivElement> & { customTypes: string[] }) => {
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

  const customConfig = useMemo<FlumeConfig>(() => {
    const newConfig = new FlumeConfig();
    registerAllSchemaPort(newConfig, customTypes);
    initConfig(newConfig);
    return newConfig;
  }, [customTypes]);

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
                nodeTypes={customConfig.nodeTypes}
                portTypes={customConfig.portTypes}
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
  const [ready, setReady] = useState(false);
  const [customTypes, setCustomTypes] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const schemaList = await Configuration.functionProvider.getSchemaList();
      setCustomTypes(schemaList);
      setReady(true);
    })();
  }, []);

  if (!ready) {
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="text-3xl text-gray-500">Loading...</div>
    </div>;
  }

  return (
    <OpenFileProvider value={openFileHandler}>
      <InternalEditor customTypes={customTypes} />
    </OpenFileProvider>
  );
};
