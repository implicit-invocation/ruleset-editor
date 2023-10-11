export type Item = {
  type: "item";
  name: string;
};

export type Folder = {
  type: "folder";
  name: string;
  children: (Folder | Item)[];
};
