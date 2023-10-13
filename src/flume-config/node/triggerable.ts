import { NodeTypeConfig } from "flume";
import { addPorts } from "./addPort";

export const createTriggerableNode = (
  config: NodeTypeConfig
): NodeTypeConfig => {
  return addPorts(config, {
    beforeInput: (ports) =>
      ports.trigger({ name: "trigger", label: "Trigger" }),
    beforeOutput: (ports) =>
      ports.trigger({ name: "trigger", label: "Trigger" }),
  });
};
