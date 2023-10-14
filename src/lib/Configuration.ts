import { Folder, FunctionData, MaybePromise, NodeRunner } from ".";
import { defaultTestRunSetting, localStorageFunctionProvider } from "./config/default";

export type FunctionProviderSetting = {
  builtInFunctions: (() => MaybePromise<string[]>) | string[];
  readFolder: () => MaybePromise<Folder>;
  writeFunctionData: (path: string[], data: FunctionData) => MaybePromise<void>;
  readFunctionData: (path: string[]) => MaybePromise<FunctionData>;
  add(type: "item" | "folder", name: string, path: string[]): MaybePromise<boolean>;
  remove(type: "item" | "folder", name: string, path: string[]): MaybePromise<boolean>;
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
