/* eslint-disable @typescript-eslint/no-explicit-any */
import jsonata from "jsonata";
import type { Connection, ConnectionMap, GraphNode, NodeMap } from "./type";
export type { Connection, ConnectionMap, GraphNode, NodeMap };

export type MaybePromise<T> = T | Promise<T>;

export type ExternalFunctionHandler = (name: string, payload: any) => MaybePromise<any>;

const flattenConnectionMap = (connectionMap: ConnectionMap) => {
  return Object.values(connectionMap).flat();
};

// TODO: flume alias and group, number and number operator nodes, read/write data orders
// TODO: resolve loop, maximum call for each run id
export const handleNodeRun = async (
  node: GraphNode,
  data: any,
  functionHandler: ExternalFunctionHandler,
  kvStore: KVStore,
  outputs: { [key: string]: any } = {}
) => {
  if (node.type === "lazy") {
    return { output: data.input, string: data.string, boolean: data.boolean };
  } else if (node.type === "log") {
    console.table([
      { type: "id", value: node.id },
      {
        type: "string",
        value: data?.message ?? node.inputData?.message?.string,
      },
      {
        type: "boolean",
        value: data?.boolean ?? node.inputData?.boolean?.boolean,
      },
      { type: "object", value: data?.data ?? node.inputData?.data?.object },
    ]);
    if (data?.data) {
      console.log(JSON.stringify(data.data, null, 2));
    }
  } else if (node.type === "condition") {
    const expression = node.inputData?.expression?.expression;
    if (!expression) {
      return {
        valid: false,
      };
    }
    if (typeof expression !== "string") {
      throw new Error("Expression is not a string");
    }
    const evaluationResult = await jsonata(expression).evaluate(data);
    return {
      valid: evaluationResult == true,
    };
  } else if (node.type === "stringTransform") {
    const expression = node.inputData?.expression?.expression;
    if (!expression) {
      return {
        string: data,
      };
    }
    if (typeof expression !== "string") {
      throw new Error("Expression is not a string");
    }
    const evaluationResult = await jsonata(expression).evaluate(data);
    return {
      string: evaluationResult,
    };
  } else if (node.type === "transform") {
    const expression = node.inputData?.expression?.expression;
    if (!expression) {
      return {
        output: data,
      };
    }
    if (typeof expression !== "string") {
      throw new Error("Expression is not a string");
    }
    const evaluationResult = await jsonata(expression).evaluate(data);
    return {
      output: evaluationResult,
    };
  } else if (node.type === "text") {
    if (data?.text) {
      return {
        text: data.text,
      };
    }
    return {
      text: node.inputData.text.string,
    };
  } else if (node.type === "branch") {
    return (data as any).condition;
  } else if (node.type === "not") {
    return {
      output: !(data as any).input,
    };
  } else if (node.type === "and") {
    return {
      output: data.input1 && data.input2,
    };
  } else if (node.type === "or") {
    return {
      output: data.input1 || data.input2,
    };
  } else if (node.type === "time") {
    return {
      time: {
        millis: Date.now(),
      },
    };
  } else if (node.type === "readData") {
    return {
      value: await kvStore.get(data?.key ?? node.inputData?.key?.string),
    };
  } else if (node.type === "writeData") {
    await kvStore.set(data?.key ?? node.inputData?.key?.string, data?.value ?? node.inputData?.value?.string);
  } else if (node.type === "call") {
    const funcName = node.inputData.function.function;
    if (typeof funcName !== "string") {
      throw new Error("Function name is not a string");
    }
    const output = await functionHandler(funcName, data?.data);
    return { output };
  } else if (node.type === "output") {
    const key = data?.key ?? node.inputData?.key?.string;
    outputs[key] = data?.input;
  } else if (node.type === "loop") {
    const funcName = node.inputData.function.function;
    if (typeof funcName !== "string") {
      throw new Error("Function name is not a string");
    }
    const array = data?.array;
    if (!Array.isArray(array)) {
      throw new Error("Input is not an array");
    }
    const context = data?.context;
    // TODO: parallel, sequential, limit
    const output: any[] = [];
    for (const item of array) {
      const iterationOutput = await functionHandler(funcName, {
        context,
        item,
      });
      output.push(iterationOutput);
    }
    return { output };
  }
};

export class Deferred<T> {
  promise: Promise<T>;
  resolve!: (value: T) => void;
  reject!: (reason?: any) => void;
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export type KVStore = {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
};

export const createMemoryKVStore = (): KVStore => {
  const data: Record<string, any> = {};
  return {
    get: async (key: string) => {
      return data[key];
    },
    set: async (key: string, value: any) => {
      data[key] = value;
    },
  };
};

export class NodeRunner {
  private nodes: GraphNode[] = [];
  constructor() {}
  promises = new Map<string, Deferred<unknown>>();
  started = new Map<string, boolean>();
  inputData: any;
  functionHandler: ExternalFunctionHandler = () => {};
  outputs: { [key: string]: any } = {};
  setFunctionHandler(functionHandler: ExternalFunctionHandler) {
    this.functionHandler = functionHandler;
  }
  kvStore: KVStore = createMemoryKVStore();
  setKVStore(kvStore: KVStore) {
    this.kvStore = kvStore;
  }
  markDeadBranches(connections: Connection[]) {
    if (!connections) return;
    for (const connection of connections) {
      const targetNode = this.nodes.find((node) => node.id === connection.nodeId);
      if (!targetNode) {
        throw new Error(`No target node found with id ${connection.nodeId}`);
      }
      this.markDeadBranches(flattenConnectionMap(targetNode.connections.outputs));
      this.promises.get(targetNode.id)?.resolve(undefined);
    }
  }
  async runNode(node: GraphNode) {
    if (this.started.has(node.id)) {
      return await this.promises.get(node.id)?.promise;
    }
    this.started.set(node.id, true);
    const inputData: {
      [key: string]: {
        [key: string]: unknown;
      };
    } = {};
    const inputPorts = Object.entries(node.connections.inputs);
    await Promise.all(
      inputPorts.map(async ([portName, connections]) => {
        await Promise.all(
          connections.map(async (connection) => {
            if (connection.portName === "trigger") {
              return;
            }
            const sourceNode = this.nodes.find((node) => node.id === connection.nodeId);
            if (!sourceNode) {
              throw new Error(`No source node found with id ${connection.nodeId}`);
            }
            const promise = this.runNode(sourceNode).then((result: any) => {
              inputData[portName] = result[connection.portName];
            });
            return promise;
          })
        );
      })
    );
    let result: unknown;
    if (node.type === "input") {
      result = { output: this.inputData };
    } else {
      result = await handleNodeRun(node, inputData, this.functionHandler, this.kvStore, this.outputs);
    }
    this.promises.get(node.id)?.resolve(result);

    if (node.type === "lazy") {
      return result;
    }
    if (node.type === "branch") {
      const outputPorts = node.connections.outputs;
      let connections: Connection[];
      if (result === true) {
        connections = outputPorts["true"];
        this.markDeadBranches(outputPorts["false"]);
      } else {
        connections = outputPorts["false"];
        this.markDeadBranches(outputPorts["true"]);
      }
      connections = connections || [];
      for (const connection of connections) {
        const targetNode = this.nodes.find((node) => node.id === connection.nodeId);
        if (!targetNode) {
          throw new Error(`No target node found with id ${connection.nodeId}`);
        }
        this.runNode(targetNode);
      }
      return result;
    }
    const outputPorts = Object.values(node.connections.outputs);
    for (const connections of outputPorts) {
      for (const connection of connections) {
        const targetNode = this.nodes.find((node) => node.id === connection.nodeId);
        if (!targetNode) {
          throw new Error(`No target node found with id ${connection.nodeId}`);
        }
        this.runNode(targetNode);
      }
    }
    return result;
  }
  async run(nodeMap: NodeMap, inputData: any) {
    this.nodes = Object.values(nodeMap);
    for (const node of this.nodes) {
      this.promises.set(node.id, new Deferred());
    }
    const startNode = this.nodes.find((node) => node.type === "input");
    if (!startNode) {
      throw new Error("No start node found");
    }
    this.inputData = inputData;
    this.runNode(startNode);

    await Promise.all(
      this.nodes.filter((node) => node.type === "output").map((node) => this.promises.get(node.id)?.promise)
    );
    return this.outputs;
  }
}
