/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, FlumeNode, NodeEditor, NodeMap } from "flume";
import jsonata from "jsonata";
import { useEffect, useState } from "react";
import { config } from "./flume-config/config";
import { eventEmitter } from "./util/eventEmitter";

// TODO: flume alias and group, number and number operator nodes, read/write data orders
const handleNodeRun = async (node: FlumeNode, data: any) => {
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
  } else if (node.type === "condition") {
    const expression = node.inputData?.expression?.string;
    if (!expression) {
      return {
        valid: false,
      };
    }
    const evaluationResult = await jsonata(expression).evaluate(data);
    return {
      valid: evaluationResult == true,
    };
  } else if (node.type === "stringTransform") {
    const expression = node.inputData?.expression?.string;
    if (!expression) {
      return {
        string: data,
      };
    }
    const evaluationResult = await jsonata(expression).evaluate(data);
    return {
      string: evaluationResult,
    };
  } else if (node.type === "transform") {
    const expression = node.inputData?.expression?.string;
    if (!expression) {
      return {
        output: data,
      };
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
      value: JSON.parse(
        localStorage.getItem(data?.key && node?.inputData?.key?.string) || "{}"
      ),
    };
  } else if (node.type === "writeData") {
    localStorage.setItem(
      data?.key && node?.inputData?.key?.string,
      JSON.stringify(data?.value)
    );
  } else if (node.type === "call") {
    const funcName = data?.function ?? node.inputData?.function?.string;
    console.log("call", funcName, data?.data);
  }
};

class Deferred<T> {
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

class NodeRunner {
  private nodes: FlumeNode[] = [];
  constructor() {}
  promises = new Map<string, Deferred<unknown>>();
  inputData: any;
  async runNode(node: FlumeNode) {
    if (this.promises.has(node.id)) {
      return await this.promises.get(node.id)?.promise;
    }
    this.promises.set(node.id, new Deferred());
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
            const sourceNode = this.nodes.find(
              (node) => node.id === connection.nodeId
            );
            if (!sourceNode) {
              throw new Error(
                `No source node found with id ${connection.nodeId}`
              );
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
      result = await handleNodeRun(node, inputData);
    }
    this.promises.get(node.id)?.resolve(result);
    // TODO: generalize this, use getOutputConnections(node), allow handleNodeRun and getOutputConnections to be overridden
    if (node.type === "lazy") {
      return result;
    }
    if (node.type === "branch") {
      const outputPorts = node.connections.outputs;
      let connections: Connection[];
      if (result === true) {
        connections = outputPorts["true"];
      } else {
        connections = outputPorts["false"];
      }
      connections = connections || [];
      for (const connection of connections) {
        const targetNode = this.nodes.find(
          (node) => node.id === connection.nodeId
        );
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
        const targetNode = this.nodes.find(
          (node) => node.id === connection.nodeId
        );
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
    const startNode = this.nodes.find((node) => node.type === "input");
    if (!startNode) {
      throw new Error("No start node found");
    }
    this.inputData = inputData;
    await this.runNode(startNode);
  }
}

const testRun = async (nodeMap: NodeMap) => {
  console.log("==============================================");
  console.log("try to run");
  await new NodeRunner().run(nodeMap, {
    type: "payBill",
    payload: {
      cif: "12341234123",
      amount: 1000,
    },
  });
};

export const App = () => {
  const [nodeMap, setNodeMap] = useState<NodeMap>();
  useEffect(() => {
    if (!nodeMap) {
      return;
    }
    const handler = () => {
      testRun(nodeMap!);
    };
    eventEmitter.on("Start", handler);
    return () => {
      eventEmitter.off("Start", handler);
    };
  }, [nodeMap]);
  return (
    <div className="flex flex-1">
      <NodeEditor
        onChange={setNodeMap}
        nodeTypes={config.nodeTypes}
        portTypes={config.portTypes}
        defaultNodes={[
          {
            type: "input",
            x: -500,
            y: 0,
          },
        ]}
      />
    </div>
  );
};
