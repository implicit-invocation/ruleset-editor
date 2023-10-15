import { Resizable } from "re-resizable";
import { useCallback, useEffect } from "react";
import { AiOutlineDelete, AiOutlineFolder, AiOutlineFunction, AiOutlinePlus } from "react-icons/ai";

import { Configuration, handleFolderAction } from "../..";
import { eventEmitter } from "../../util/eventEmitter";
import { FolderProvider, useFolder } from "../../util/folder/context";
import { getPathType } from "../../util/folder/util";
import { IconButton } from "../common/Button";
import { PanelHeader } from "../common/PanelHeader";
import { FunctionFolderDisplay } from "./FunctionFolderDisplay";

export const Functions = () => {
  const folder = useFolder(
    {
      name: "root",
      type: "folder",
      children: [],
    },
    handleFolderAction
  );

  const { setRoot, selectedPath, root } = folder;

  useEffect(() => {
    Promise.resolve(Configuration.functionProvider.readFolder()).then(setRoot);
  }, [setRoot]);

  useEffect(() => {
    if (!selectedPath) {
      return;
    }
    const pathType = getPathType(root, selectedPath);

    if (pathType === "item") {
      eventEmitter.emit("openFile", selectedPath[0] === "builtin:" ? undefined : selectedPath);
    }
  }, [selectedPath, root]);

  const add = useCallback(
    async (addType: "item" | "folder") => {
      if (folder.addPrompt !== undefined) {
        return;
      }
      let type = "folder";
      if (folder.selectedPath && folder.selectedPath[0] === "builtin:") {
        return;
      }
      if (!folder.selectedPath) {
        folder.selectedPath = [];
      } else {
        type = getPathType(folder.root, folder.selectedPath);
      }
      let addPath = folder.selectedPath;
      if (type === "folder") {
        folder.expand(folder.selectedPath);
      } else if (type === "item") {
        addPath = folder.selectedPath.slice(0, folder.selectedPath.length - 1);
      }
      const result = await folder.requestAdd(addPath, addType);
      if (result.cancel) {
        folder.cancelAdd();
      }
      const newPath = [...addPath, result.name];
      const available = getPathType(folder.root, newPath) === "none";
      if (available) {
        await folder.add(addType, result.name, addPath);
        if (addType === "item") {
          await Configuration.functionProvider.writeFunctionData(newPath, {
            graph: {},
            input: "",
            name: result.name,
          });
        }
        folder.setSelectedPath([...addPath, result.name]);
        folder.cancelAdd();
      } else {
        alert("Name already exists");
        folder.cancelAdd();
      }
    },
    [folder]
  );

  return (
    <FolderProvider value={folder}>
      <Resizable
        className="border-b-2 border-gray-800 shadow-lg flex flex-col"
        enable={{
          bottom: true,
        }}
        defaultSize={{
          width: "100%",
          height: 400,
        }}
      >
        <PanelHeader headerTitle="FUNCTIONS">
          <IconButton icon={AiOutlineFunction} attachment={AiOutlinePlus} size="sm" onClick={() => add("item")} />
          <IconButton icon={AiOutlineFolder} attachment={AiOutlinePlus} size="sm" onClick={() => add("folder")} />
          <IconButton
            icon={AiOutlineDelete}
            size="sm"
            onClick={async () => {
              if (!folder.selectedPath) {
                return;
              }
              if (folder.selectedPath[0] === "builtin:") {
                return;
              }
              const confirmed = await folder.confirmDelete(folder.selectedPath);
              if (!confirmed.silent) {
                folder.cancelConfirmDelete();
              }
              if (confirmed.result) {
                folder.remove(
                  folder.selectedPath[folder.selectedPath.length - 1],
                  folder.selectedPath.slice(0, folder.selectedPath.length - 1)
                );
                eventEmitter.emit("openFile", undefined);
                const newPath = folder.selectedPath.slice(0, -1);
                newPath.length > 0 ? folder.setSelectedPath(newPath) : folder.setSelectedPath(undefined);
              }
            }}
          />
        </PanelHeader>
        <div
          onClick={() => folder.setSelectedPath(undefined)}
          className={[
            "flex items-center cursor-pointer hover:bg-gray-800 text-sm mx-2 py-1",
            folder.selectedPath === undefined ? "bg-indigo-700 hover:bg-indigo-600" : undefined,
          ].join(" ")}
        >
          Root
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex-1 p-2 text-sm select-none">
          <FunctionFolderDisplay folder={folder.root} path={[]} />
        </div>
      </Resizable>
    </FolderProvider>
  );
};
