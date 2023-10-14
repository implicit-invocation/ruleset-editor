import {
  AiFillDelete,
  AiOutlineDown,
  AiOutlineFolder,
  AiOutlineFunction,
  AiOutlineLock,
  AiOutlineRight,
} from "react-icons/ai";
import { useFolderContext } from "../../util/folder/context";
import { Folder } from "../../util/folder/types";
import { compareFolderNode, isExpanded, isPathPointingToItem, isSamePath } from "../../util/folder/util";

export const FunctionFolderDisplay = ({ folder, path }: { folder: Folder; path: string[] }) => {
  const { setSelectedPath, selectedPath, expanded, expand, collapse, deletionConfirm, addPrompt } = useFolderContext();
  return (
    <div className="flex flex-col">
      {addPrompt && isSamePath(path, addPrompt.path) && addPrompt.type === "folder" && (
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

        return (
          <div
            key={child.name}
            className="flex flex-col"
            draggable={child.type === "item"}
            onDragStart={(e) => {
              if (child.type !== "item") {
                return;
              }
              e.dataTransfer.setData("text", childPath[0] === "builtin:" ? childPath.join("") : childPath.join("/"));
            }}
          >
            <div
              className={[
                "flex items-center gap-1 cursor-pointer hover:bg-gray-800 justify-start relative py-1",
                selectedPath && isPathPointingToItem(child.name, path, selectedPath)
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
              {child.type === "folder" && (isExpanded(expanded, childPath) ? <AiOutlineDown /> : <AiOutlineRight />)}

              {child.type === "item" && <AiOutlineFunction className="h-4 w-4" />}
              <div
                className={[
                  "flex flex-row justify-start items-center gap-0.5",
                  childPath[0] === "builtin:" ? "text-indigo-400" : undefined,
                ].join(" ")}
              >
                {childPath[0] === "builtin:" && <AiOutlineLock />}
                {child.name}
              </div>

              {deletionConfirm && isPathPointingToItem(child.name, path, deletionConfirm.path) && (
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
            {child.type === "folder" && isExpanded(expanded, childPath) && (
              <div>
                <FunctionFolderDisplay folder={child} path={[...path, child.name]} />
              </div>
            )}
          </div>
        );
      })}
      {addPrompt && isSamePath(path, addPrompt.path) && addPrompt.type === "item" && (
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
