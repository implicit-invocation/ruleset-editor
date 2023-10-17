import { FlumeConfig } from "my-flume";
import { createTriggerableNode } from "./triggerable";

export const registerMiscNodes = (config: FlumeConfig) => {
  config.addNodeType(
    createTriggerableNode({
      sortIndex: 4,
      type: "log",
      label: "Log",
      description: "Log data to the console",
      initialWidth: 200,
      inputs: (ports) => [
        ports.object({ name: "data", label: "Data" }),
        ports.string({ name: "message", label: "Message" }),
        ports.boolean({ name: "boolean", label: "Boolean" }),
      ],
    })
  );
};
