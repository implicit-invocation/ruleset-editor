import { NodeTypeConfig } from "flume";
import { addPorts } from "./addPort";

// type NodeTypeConfig['inputs']

export const createWithLabelNode = (config: NodeTypeConfig): NodeTypeConfig => {
  return addPorts(config, {
    beforeInput: (ports) =>
      ports.label({
        hidePort: true,
        label: undefined,
      }),
  });
};
