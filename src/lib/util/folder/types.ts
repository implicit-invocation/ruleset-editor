import { NodeMap } from "my-flume";

export type Item = {
  type: "item";
  name: string;
};

export type Folder = {
  type: "folder";
  name: string;
  children: (Folder | Item)[];
};

export type FolderActionCallback = (
  action: "add" | "remove",
  type: "item" | "folder",
  name: string,
  path: string[]
) => Promise<boolean> | boolean;

export type FunctionData = {
  name: string;
  input: string;
  graph: NodeMap;
};

export type FunctionRegistry = {
  [key: string]: (payload: unknown) => Promise<unknown> | unknown;
};
