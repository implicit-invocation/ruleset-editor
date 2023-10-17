import { FlumeConfig } from "my-flume";
import { createFlexibleNode, createTriggerableNode } from "./triggerable";

export const registerExternalNodes = (config: FlumeConfig) => {
  config.addNodeType(
    createTriggerableNode({
      sortIndex: 7,
      type: "readData",
      label: "External: Read data",
      description: "Read data from a key-value store",
      initialWidth: 200,
      inputs: (ports) => [ports.string({ name: "key", label: "Key" })],
      outputs: (ports) => [ports.object({ name: "value", label: "Value" })],
    })
  );

  config.addNodeType(
    createTriggerableNode({
      sortIndex: 6,
      type: "writeData",
      label: "External: Write data",
      description: "Write data to a key-value store",
      initialWidth: 200,
      inputs: (ports) => [ports.string({ name: "key", label: "Key" }), ports.object({ name: "value", label: "Value" })],
    })
  );

  config.addNodeType(
    createTriggerableNode(
      createFlexibleNode({
        sortIndex: 5,
        type: "call",
        label: "External: Call engine function",
        description: "Call a function from the engine",
        initialWidth: 300,
        inputs: (ports) => [ports.function({ name: "function", label: "Function name" })],
      })
    )
  );
};
