import { NodeTypeConfig } from "flume";
import { addPorts } from "./addPort";
import { createWithLabelNode } from "./withLabel";

export const createTriggerableNode = (config: NodeTypeConfig): NodeTypeConfig => {
  return createWithLabelNode(
    addPorts(config, {
      beforeInput: (ports) => ports.trigger({ name: "trigger", label: "Trigger" }),
      beforeOutput: (ports) => ports.trigger({ name: "trigger", label: "Trigger" }),
    })
  );
};
