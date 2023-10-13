import { NodeMap } from "flume";
import { Folder, FolderActionCallback } from "./folder/types";

export type FunctionData = {
  name: string;
  input: string;
  graph: NodeMap;
};

export const readFolder = async (): Promise<Folder> => {
  const data =
    localStorage.getItem("folderStructure") ||
    JSON.stringify({
      name: "root",
      type: "folder",
      children: [],
    });
  return JSON.parse(data);
};

export const writeFileData = async (path: string[], data: FunctionData) => {
  localStorage.setItem("fileData:" + path.join("/"), JSON.stringify(data));
};

export const readFileData = async (path: string[]): Promise<FunctionData> => {
  const data = localStorage.getItem("fileData:" + path.join("/"));
  if (data === null) {
    throw new Error("Data not found");
  }
  return JSON.parse(data);
};

export const localFolderAction: FolderActionCallback = async (action, type, name, path): Promise<boolean> => {
  const folder = await readFolder();
  if (action === "add") {
    let currentFolder = folder;
    for (let i = 0; i < path.length; i++) {
      const pathItem = path[i];
      const child = currentFolder.children.find((child) => child.name === pathItem);
      if (child === undefined) {
        throw new Error("Path item not found");
      }
      if (child.type === "folder") {
        currentFolder = child;
      } else {
        throw new Error("Path item is not a folder");
      }
    }
    if (type === "folder") {
      currentFolder.children.push({
        name,
        type: "folder",
        children: [],
      });
    } else if (type === "item") {
      currentFolder.children.push({
        name,
        type: "item",
      });
      writeFileData([...path, name], {
        name,
        input: "{}",
        graph: {
          input: {
            x: -458.5540771484375,
            y: -156.08226013183594,
            type: "input",
            width: 200,
            connections: {
              inputs: {},
              outputs: {},
            },
            inputData: {
              button: {},
            },
            id: "input",
          },
        },
      });
    }
  } else if (action === "remove") {
    let currentFolder = folder;
    for (let i = 0; i < path.length; i++) {
      const pathItem = path[i];
      const child = currentFolder.children.find((child) => child.name === pathItem);
      if (child === undefined) {
        throw new Error("Path item not found");
      }
      if (child.type === "folder") {
        currentFolder = child;
      } else {
        throw new Error("Path item is not a folder");
      }
    }
    const index = currentFolder.children.findIndex((child) => child.name === name);
    if (index === -1) {
      throw new Error("Path item not found");
    }
    currentFolder.children.splice(index, 1);
    if (type === "item") {
      localStorage.removeItem("fileData:" + [...path, name].join("/"));
    } else {
      const removeChildren = (folder: Folder) => {
        for (const child of folder.children) {
          if (child.type === "item") {
            localStorage.removeItem("fileData:" + [...path, name].join("/"));
          } else {
            removeChildren(child);
          }
        }
      };
      removeChildren(currentFolder);
    }
  }
  localStorage.setItem("folderStructure", JSON.stringify(folder));
  return true;
};
