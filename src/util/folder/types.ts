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
  path: string[],
) => Promise<boolean> | boolean;
