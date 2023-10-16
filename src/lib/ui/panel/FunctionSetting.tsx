import { useEffect, useState } from "react";
import { Configuration } from "../..";
import { eventEmitter } from "../../util/eventEmitter";
import { SimpleButton } from "../common/Button";
import { Monaco } from "../common/Editor";
import { PanelHeader } from "../common/PanelHeader";

export const FunctionSettings = () => {
  const [openFile, setOpenFile] = useState<string[] | null>(null);
  const [input, setInput] = useState<string>("");
  useEffect(() => {
    const handler = (path: string[] | undefined) => {
      if (path === undefined) {
        setOpenFile(null);
        return;
      }
      setOpenFile(path);
      setInput("");
      setTimeout(async () => {
        const data = await Configuration.functionProvider.readFunctionData(path);
        setInput(data.input);
      }, 0);
    };
    eventEmitter.on("openFile", handler);
    return () => {
      eventEmitter.off("openFile", handler);
    };
  }, []);
  useEffect(() => {
    if (!openFile || input === "" || input === undefined) {
      return;
    }
    const handler = async () => {
      const data = await Configuration.functionProvider.readFunctionData(openFile);
      data.input = input;
      await Configuration.functionProvider.writeFunctionData(openFile, data);
    };
    handler();
  }, [input, openFile]);
  return (
    <div className="flex-1 flex flex-col">
      <PanelHeader headerTitle="Function Settings" />
      <div className="p-2 flex flex-col justify-center items-center flex-1">
        {openFile && (
          <div className="flex flex-col w-full flex-1">
            <div className="flex flex-row justify-between items-center pb-2">
              <label className="text-sm font-bold">Function Input:</label>
              <SimpleButton
                text="Run"
                primaryStyle
                onClick={() => {
                  eventEmitter.emit("Start", JSON.parse(input));
                }}
              />
            </div>
            <div className="flex-1">
              <Monaco value={input} onContentChange={setInput} className="w-full h-full" />
              {/* <textarea
                className="w-full h-full outline-none bg-gray-800 text-white p-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
