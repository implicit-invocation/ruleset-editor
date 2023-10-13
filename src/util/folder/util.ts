import { Folder, Item } from "./types";

export const compareFolderNode = (a: Folder | Item, b: Folder | Item) => {
  if (a.type === "folder" && b.type === "item") {
    return -1;
  } else if (a.type === "item" && b.type === "folder") {
    return 1;
  }
  return a.name.localeCompare(b.name);
};

export const isSamePath = (path1: string[], path2: string[]) => {
  if (path1.length !== path2.length) {
    return false;
  }
  for (let i = 0; i < path1.length; i++) {
    if (path1[i] !== path2[i]) {
      return false;
    }
  }
  return true;
};

export const isPathPointingToItem = (name: string, parentPath: string[], path: string[]) => {
  if (parentPath.length !== path.length - 1) {
    return false;
  }
  for (let i = 0; i < parentPath.length; i++) {
    if (parentPath[i] !== path[i]) {
      return false;
    }
  }
  return path[parentPath.length] === name;
};

export const getPathType = (root: Folder, path: string[]): "folder" | "item" | "none" => {
  let currentFolder = root;
  for (let i = 0; i < path.length - 1; i++) {
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
  const target = currentFolder.children.find((child) => child.name === path[path.length - 1]);
  return target === undefined ? "none" : target.type;
};

export const isExpanded = (expanded: string[][], path: string[]) => {
  for (const expandedPath of expanded) {
    if (expandedPath.length !== path.length) {
      continue;
    }
    let match = true;
    for (let i = 0; i < path.length; i++) {
      if (expandedPath[i] !== path[i]) {
        match = false;
        break;
      }
    }
    if (match) {
      return true;
    }
  }
  return false;
};
