import { createContext, useCallback, useContext, useState } from "react";
import { Folder } from "./types";

export type FolderActionCallback = (
  name: string,
  path: string[]
) => Promise<boolean> | boolean;

export const isPathPointingToItem = (
  name: string,
  parentPath: string[],
  path: string[]
) => {
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

export const getPathType = (
  root: Folder,
  path: string[]
): "folder" | "item" => {
  let currentFolder = root;
  for (let i = 0; i < path.length - 1; i++) {
    const pathItem = path[i];
    const child = currentFolder.children.find(
      (child) => child.name === pathItem
    );
    if (child === undefined) {
      throw new Error("Path item not found");
    }
    if (child.type === "folder") {
      currentFolder = child;
    } else {
      throw new Error("Path item is not a folder");
    }
  }
  return currentFolder.children.find(
    (child) => child.name === path[path.length - 1]
  )!.type;
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

export class Deferred<T> {
  promise: Promise<T>;
  resolve!: (value: T | PromiseLike<T>) => void;
  reject!: () => void;
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export const useFolder = (
  initialFolder: Folder,
  folderActionCallback?: FolderActionCallback
) => {
  const [folder, setFolder] = useState<Folder>(initialFolder);
  const [selectedPath, setSelectedPath] = useState<string[] | undefined>();
  const [expandedPaths, setExpandedPaths] = useState<string[][]>([]);

  const [deletionConfirm, setDeletionConfirm] = useState<
    | {
        path: string[];
        deferred: Deferred<{ result: boolean; silent: boolean }>;
      }
    | undefined
  >();

  const confirmDelete = useCallback((path: string[]) => {
    const deferred = new Deferred<{ result: boolean; silent: boolean }>();
    setDeletionConfirm((prev) => {
      if (prev !== undefined) {
        prev.deferred.resolve({ result: false, silent: true });
      }
      return { path, deferred };
    });
    return deferred.promise;
  }, []);

  const cancelConfirmDelete = useCallback(() => {
    setDeletionConfirm(undefined);
  }, []);

  const add = useCallback(
    async (type: "item" | "folder", name: string, path: string[]) => {
      if (folderActionCallback) {
        const shouldRun = await folderActionCallback(name, path);
        if (!shouldRun) {
          return;
        }
      }
      let currentFolder = folder;
      for (const pathItem of path) {
        const child = currentFolder.children.find(
          (child) => child.name === pathItem
        );
        if (child === undefined) {
          throw new Error("Path item not found");
        }
        if (child.type === "folder") {
          currentFolder = child;
        } else {
          throw new Error("Path item is not a folder");
        }
      }
      currentFolder.children.push(
        type === "item"
          ? { type: "item", name }
          : { type: "folder", name, children: [] }
      );
      setFolder({ ...folder });
    },
    [folder, folderActionCallback]
  );

  const remove = useCallback(
    async (name: string, path: string[]) => {
      if (folderActionCallback) {
        const shouldRun = await folderActionCallback(name, path);
        if (!shouldRun) {
          return;
        }
      }
      let currentFolder = folder;
      for (const pathItem of path) {
        const child = currentFolder.children.find(
          (child) => child.name === pathItem
        );
        if (child === undefined) {
          throw new Error("Path item not found");
        }
        if (child.type === "folder") {
          currentFolder = child;
        } else {
          throw new Error("Path item is not a folder");
        }
      }
      const index = currentFolder.children.findIndex(
        (child) => child.name === name
      );
      if (index === -1) {
        throw new Error("Item not found");
      }
      currentFolder.children.splice(index, 1);
      setFolder({ ...folder });
    },
    [folder, folderActionCallback]
  );

  const expand = useCallback((path: string[]) => {
    setExpandedPaths((expandedPaths) => {
      if (isExpanded(expandedPaths, path)) {
        return expandedPaths;
      }
      return [...expandedPaths, path];
    });
  }, []);

  const collapse = useCallback((path: string[]) => {
    setExpandedPaths((expandedPaths) => {
      const index = expandedPaths.findIndex((expandedPath) => {
        if (expandedPath.length !== path.length) {
          return false;
        }
        for (let i = 0; i < path.length; i++) {
          if (expandedPath[i] !== path[i]) {
            return false;
          }
        }
        return true;
      });
      if (index === -1) {
        return expandedPaths;
      }
      const newExpandedPaths = [...expandedPaths];
      newExpandedPaths.splice(index, 1);
      return newExpandedPaths;
    });
  }, []);

  return {
    root: folder,
    add,
    remove,
    selectedPath,
    setSelectedPath,
    expand,
    collapse,
    expanded: expandedPaths,
    confirmDelete,
    cancelConfirmDelete,
    deletionConfirm,
  };
};

export const FolderContext = createContext<
  ReturnType<typeof useFolder> | undefined
>(undefined);

export const FolderProvider = FolderContext.Provider;
export const useFolderContext = () => {
  const folderContext = useContext(FolderContext);
  if (folderContext === undefined) {
    throw new Error("Folder context not found");
  }
  return folderContext;
};
