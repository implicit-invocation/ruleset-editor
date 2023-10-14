import { Configuration } from "../..";
import { FolderActionCallback } from "./types";

export const handleFolderAction: FolderActionCallback = async (action, type, name, path): Promise<boolean> => {
  if (action === "add") {
    return await Configuration.functionProvider.add(type, name, path);
  } else if (action === "remove") {
    return await Configuration.functionProvider.remove(type, name, path);
  }
  return false;
};
