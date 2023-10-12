import { Resizable } from "re-resizable";
import { useCallback, useEffect } from "react";
import {
  AiFillDelete,
  AiOutlineDelete,
  AiOutlineDown,
  AiOutlineFolder,
  AiOutlineFunction,
  AiOutlinePlus,
  AiOutlineRight,
} from "react-icons/ai";
import { eventEmitter } from "../../util/eventEmitter";
import {
  FolderProvider,
  getPathType,
  isExpanded,
  isPathPointingToItem,
  isSamePath,
  useFolder,
  useFolderContext,
} from "../../util/folder/context";
import { Folder, Item } from "../../util/folder/types";
import { localFolderAction, readFolder } from "../../util/folderActions";
import { IconButton } from "../common/Button";
import { PanelHeader } from "../common/PanelHeader";

const compareFolderNode = (a: Folder | Item, b: Folder | Item) => {
  if (a.type === "folder" && b.type === "item") {
    return -1;
  } else if (a.type === "item" && b.type === "folder") {
    return 1;
  }
  return a.name.localeCompare(b.name);
};

export const FunctionFolderDisplay = ({
  folder,
  path,
}: {
  folder: Folder;
  path: string[];
}) => {
  const {
    setSelectedPath,
    selectedPath,
    expanded,
    expand,
    collapse,
    deletionConfirm,
    addPrompt,
  } = useFolderContext();
  return (
    <div className="flex flex-col">
      {addPrompt &&
        isSamePath(path, addPrompt.path) &&
        addPrompt.type === "folder" && (
          <div
            className="p-0.5 flex flex-row justify-between items-center gap-1"
            style={{
              paddingLeft: `${path.length * 1}rem`,
            }}
          >
            <AiOutlineFolder className="h-4 w-4" />
            <input
              autoFocus
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  addPrompt.deferred.resolve({
                    cancel: true,
                    name: "",
                  });
                } else if (e.key === "Enter") {
                  addPrompt.deferred.resolve({
                    cancel: false,
                    name: e.currentTarget.value,
                  });
                }
              }}
              className="w-full text-white bg-gray-700 border-none outline-none py-0.5"
            />
          </div>
        )}
      {folder.children.sort(compareFolderNode).map((child) => {
        const childPath = [...path, child.name];

        if (child.type === "folder") {
          return (
            <div key={child.name} className="flex flex-col">
              <div
                className={[
                  "flex items-center gap-1 cursor-pointer hover:bg-gray-800 justify-start relative py-1",
                  selectedPath &&
                  isPathPointingToItem(child.name, path, selectedPath)
                    ? "bg-indigo-700 hover:bg-indigo-600"
                    : undefined,
                ].join(" ")}
                style={{
                  paddingLeft: `${path.length * 1}rem`,
                }}
                onClick={() => {
                  if (!isExpanded(expanded, childPath)) {
                    expand(childPath);
                  } else {
                    collapse(childPath);
                  }
                  setSelectedPath(childPath);
                }}
              >
                {isExpanded(expanded, childPath) ? (
                  <AiOutlineDown />
                ) : (
                  <AiOutlineRight />
                )}

                <div>{child.name}</div>

                {deletionConfirm &&
                  isPathPointingToItem(
                    child.name,
                    path,
                    deletionConfirm.path
                  ) && (
                    <div
                      className="h-full w-full absolute flex flex-row justify-end items-center gap-2 px-2 text-xs bg-white/25"
                      style={{
                        marginLeft: `-${path.length * 1}rem`,
                      }}
                    >
                      <AiFillDelete className="h-4 w-4 text-red-400" />
                      <button
                        className="cursor-pointer bg-red-500 px-2 rounded-md w-12 shadow-md"
                        onClick={() => {
                          deletionConfirm.deferred.resolve({
                            result: true,
                            silent: false,
                          });
                        }}
                      >
                        Yes
                      </button>
                      <button
                        className="cursor-pointer bg-gray-800 px-2 rounded-md w-12 shadow-md"
                        onClick={() => {
                          deletionConfirm.deferred.resolve({
                            result: false,
                            silent: false,
                          });
                        }}
                      >
                        No
                      </button>
                    </div>
                  )}
              </div>
              {isExpanded(expanded, childPath) && (
                <div>
                  <FunctionFolderDisplay
                    folder={child}
                    path={[...path, child.name]}
                  />
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div
              key={child.name}
              className={[
                "flex items-center gap-1 cursor-pointer hover:bg-gray-800 relative py-1",
                selectedPath &&
                isPathPointingToItem(child.name, path, selectedPath)
                  ? "bg-indigo-700 hover:bg-indigo-600"
                  : undefined,
              ].join(" ")}
              style={{
                paddingLeft: `${path.length * 1}rem`,
              }}
              onClick={() => {
                setSelectedPath([...path, child.name]);
              }}
            >
              <AiOutlineFunction className="h-4 w-4" />
              <div className="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">
                {child.name}
              </div>
              {deletionConfirm &&
                isPathPointingToItem(
                  child.name,
                  path,
                  deletionConfirm.path
                ) && (
                  <div
                    className="h-full w-full absolute flex flex-row justify-end items-center gap-2 px-2 text-xs bg-white/25"
                    style={{
                      marginLeft: `-${path.length * 1}rem`,
                    }}
                  >
                    <AiFillDelete className="h-4 w-4 text-red-400" />
                    <button
                      className="cursor-pointer bg-red-500 px-2 rounded-md w-12 shadow-md"
                      onClick={() => {
                        deletionConfirm.deferred.resolve({
                          result: true,
                          silent: false,
                        });
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="cursor-pointer bg-gray-800 px-2 rounded-md w-12 shadow-md"
                      onClick={() => {
                        deletionConfirm.deferred.resolve({
                          result: false,
                          silent: false,
                        });
                      }}
                    >
                      No
                    </button>
                  </div>
                )}
            </div>
          );
        }
      })}
      {addPrompt &&
        isSamePath(path, addPrompt.path) &&
        addPrompt.type === "item" && (
          <div
            className="p-0.5 flex flex-row justify-between items-center gap-1"
            style={{
              paddingLeft: `${path.length * 1}rem`,
            }}
          >
            <AiOutlineFunction className="h-4 w-4" />
            <input
              autoFocus
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  addPrompt.deferred.resolve({
                    cancel: true,
                    name: "",
                  });
                } else if (e.key === "Enter") {
                  addPrompt.deferred.resolve({
                    cancel: false,
                    name: e.currentTarget.value,
                  });
                }
              }}
              className="w-full text-white bg-gray-700 border-none outline-none py-0.5"
            />
          </div>
        )}
    </div>
  );
};

export const Functions = () => {
  const folder = useFolder(
    {
      name: "root",
      type: "folder",
      children: [],
    },
    localFolderAction
  );

  const { setRoot, selectedPath, root } = folder;

  useEffect(() => {
    readFolder().then(setRoot);
  }, [setRoot]);

  useEffect(() => {
    if (!selectedPath) {
      return;
    }
    const pathType = getPathType(root, selectedPath);

    if (pathType === "item") {
      eventEmitter.emit("openFile", selectedPath);
    }
  }, [selectedPath, root]);

  const add = useCallback(
    async (addType: "item" | "folder") => {
      if (folder.addPrompt !== undefined) {
        return;
      }
      let type = "folder";
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
      if (!result.cancel) {
        // TODO: check for duplicate
        await folder.add(addType, result.name, addPath);
        folder.setSelectedPath([...addPath, result.name]);
      }
      folder.cancelAdd();
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
          <IconButton
            icon={AiOutlineFunction}
            attachment={AiOutlinePlus}
            size="sm"
            onClick={() => add("item")}
          />
          <IconButton
            icon={AiOutlineFolder}
            attachment={AiOutlinePlus}
            size="sm"
            onClick={() => add("folder")}
          />
          <IconButton
            icon={AiOutlineDelete}
            size="sm"
            onClick={async () => {
              if (!folder.selectedPath) {
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
                const newPath = folder.selectedPath.slice(0, -1);
                newPath.length > 0
                  ? folder.setSelectedPath(newPath)
                  : folder.setSelectedPath(undefined);
              }
            }}
          />
        </PanelHeader>
        <div
          onClick={() => folder.setSelectedPath(undefined)}
          className={[
            "flex items-center cursor-pointer hover:bg-gray-800 text-sm mx-2 py-1",
            folder.selectedPath === undefined
              ? "bg-indigo-700 hover:bg-indigo-600"
              : undefined,
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
