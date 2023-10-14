import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Configuration, FunctionData } from "../..";
import { eventEmitter } from "../eventEmitter";

export const useOpenFile = () => {
  const [openFile, setOpenFile] = useState<string[] | undefined>(undefined);
  const [data, setData] = useState<FunctionData | undefined>(undefined);
  useEffect(() => {
    const handler = (file: string[] | undefined) => {
      if (file === undefined) {
        setOpenFile(undefined);
        setData(undefined);
      } else {
        setOpenFile(file);
        setData(undefined);
        setTimeout(async () => {
          const data = await Configuration.functionProvider.readFunctionData(file);
          setData(data);
        }, 0);
      }
    };
    eventEmitter.on("openFile", handler);
    return () => {
      eventEmitter.off("openFile", handler);
    };
  }, []);

  const saveData = useCallback(
    async (data: FunctionData) => {
      if (openFile === undefined) {
        return;
      }
      setData(data);
      await Configuration.functionProvider.writeFunctionData(openFile, data);
    },
    [openFile]
  );

  return { openFile, data, saveData };
};

const OpenFileContext = createContext<ReturnType<typeof useOpenFile> | undefined>(undefined);
export const OpenFileProvider = OpenFileContext.Provider;
export const useOpenFileContext = () => {
  const context = useContext(OpenFileContext);
  if (context === undefined) {
    throw new Error("OpenFileContext not found");
  }
  return context;
};
