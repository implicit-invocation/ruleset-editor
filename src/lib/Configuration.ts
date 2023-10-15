import { Folder, FunctionData, MaybePromise, NodeRunner } from ".";
import { defaultTestRunSetting, localStorageFunctionProvider } from "./config/default";

export type FunctionProviderSetting = {
  builtInFunctions: (() => MaybePromise<string[]>) | string[];
  readFolder: () => MaybePromise<Folder>;
  writeFunctionData: (path: string[], data: FunctionData) => MaybePromise<void>;
  readFunctionData: (path: string[]) => MaybePromise<FunctionData>;
  add(type: "item" | "folder", name: string, path: string[]): MaybePromise<boolean>;
  remove(type: "item" | "folder", name: string, path: string[]): MaybePromise<boolean>;

  getSchemaList: () => MaybePromise<string[]>;
  getSchema: (name: string) => MaybePromise<string>;
  setSchema: (name: string, schema: string) => MaybePromise<void>;
  deleteSchema: (name: string) => MaybePromise<void>;
};

export type TestRunSetting = {
  nodeRunner: () => MaybePromise<NodeRunner>;
};

export const Configuration: {
  functionProvider: FunctionProviderSetting;
  testRun: TestRunSetting;
} = {
  functionProvider: localStorageFunctionProvider,
  testRun: defaultTestRunSetting,
};

export const setConfiguration = (config: {
  functionProvider?: Partial<FunctionProviderSetting>;
  testRun?: Partial<TestRunSetting>;
}) => {
  if (config.testRun) Object.assign(Configuration.testRun, config.testRun);
  if (config.functionProvider) Object.assign(Configuration.functionProvider, config.functionProvider);
};
