import { Configuration, FunctionData, FunctionProviderSetting, FunctionRegistry, NodeRunner, TestRunSetting } from "..";
import { LocalStorageKvStore } from "../util/kvStore";

const dummyBuiltInFunctions: FunctionRegistry = {
  echo(payload: unknown) {
    console.log("Receive payload:", payload, "and send it back!");
    return payload;
  },
};

export const localStorageFunctionProvider: FunctionProviderSetting = {
  builtInFunctions: Object.keys(dummyBuiltInFunctions),
  readFolder: async () => {
    const data =
      localStorage.getItem("folderStructure") ||
      JSON.stringify({
        name: "root",
        type: "folder",
        children: [],
      });
    return JSON.parse(data);
  },
  writeFunctionData: async (path: string[], data: FunctionData) => {
    localStorage.setItem("fileData:" + path.join("/"), JSON.stringify(data));
  },
  readFunctionData: async (path: string[]): Promise<FunctionData> => {
    const data = localStorage.getItem("fileData:" + path.join("/"));
    if (data === null) {
      throw new Error("Data not found");
    }
    return JSON.parse(data);
  },
  add: async (type: "item" | "folder", name: string, path: string[]) => {
    const folder = await localStorageFunctionProvider.readFolder();
    let currentFolder = folder;
    for (const pathItem of path) {
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
    currentFolder.children.push(type === "item" ? { type: "item", name } : { type: "folder", name, children: [] });
    localStorage.setItem("folderStructure", JSON.stringify(folder));
    return true;
  },
  remove: async (type: "item" | "folder", name: string, path: string[]) => {
    const folder = await localStorageFunctionProvider.readFolder();
    let currentFolder = folder;
    for (const pathItem of path) {
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
    const target = currentFolder.children.find((child) => child.name === name);
    if (target === undefined) {
      return false;
    }
    if (target.type !== type) {
      return false;
    }
    currentFolder.children = currentFolder.children.filter((child) => child.name !== name);
    localStorage.setItem("folderStructure", JSON.stringify(folder));
    return true;
  },

  getSchemaList: async () => {
    const data = localStorage.getItem("schemaList");
    if (data === null) {
      return [];
    }
    return JSON.parse(data);
  },
  getSchema: async (name: string) => {
    const data = localStorage.getItem("schema:" + name);
    if (data === null) {
      return "";
    }
    return data;
  },
  setSchema: async (name: string, schema: string) => {
    const schemaList = await localStorageFunctionProvider.getSchemaList();
    if (!schemaList.includes(name)) {
      schemaList.push(name);
      localStorage.setItem("schemaList", JSON.stringify(schemaList));
    }
    localStorage.setItem("schema:" + name, schema);
  },
  deleteSchema: async (name: string) => {
    const schemaList = await localStorageFunctionProvider.getSchemaList();
    if (schemaList.includes(name)) {
      localStorage.setItem("schemaList", JSON.stringify(schemaList.filter((item) => item !== name)));
    }
    localStorage.removeItem("schema:" + name);
  },
};

const runBuildInFunction = async (name: string, payload: unknown) => {
  const fn = dummyBuiltInFunctions[name];
  if (!fn) {
    throw new Error(`Function ${name} not found`);
  }
  return await fn(payload);
};

export const defaultTestRunSetting: TestRunSetting = {
  nodeRunner: async () => {
    const runner = new NodeRunner();
    runner.setKVStore(LocalStorageKvStore);
    const schemaList = await Configuration.functionProvider.getSchemaList();
    for (const schemaName of schemaList) {
      const schema = await Configuration.functionProvider.getSchema(schemaName);
      runner.addSchema(schemaName, JSON.parse(schema));
    }
    runner.setFunctionHandler(async (name, payload) => {
      if (name.startsWith("builtin:")) {
        return runBuildInFunction(name.substring(8, name.length), payload);
      }
      const data = await Configuration.functionProvider.readFunctionData(name.split("/"));
      const runner = new NodeRunner();
      return await runner.run(data.graph, payload);
    });
    return runner;
  },
};
