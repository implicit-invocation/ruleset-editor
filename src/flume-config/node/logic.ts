import { FlumeConfig } from "flume";

export const registerLogicNodes = (config: FlumeConfig) => {
  config.addNodeType({
    sortIndex: 15,
    type: "not",
    label: "Logic: Not",
    description: "Invert a boolean",
    initialWidth: 200,
    inputs: (ports) => [ports.boolean({ name: "input", label: "Input" })],
    outputs: (ports) => [ports.boolean({ name: "output", label: "Output" })],
  });

  config.addNodeType({
    sortIndex: 13,
    type: "and",
    label: "Logic: And",
    description: "Combine two booleans using AND",
    initialWidth: 200,
    inputs: (ports) => [
      ports.boolean({ name: "input1", label: "Input 1" }),
      ports.boolean({ name: "input2", label: "Input 2" }),
    ],
    outputs: (ports) => [ports.boolean({ name: "output", label: "Output" })],
  });

  config.addNodeType({
    sortIndex: 14,
    type: "or",
    label: "Logic: Or",
    description: "Combine two booleans using OR",
    initialWidth: 200,
    inputs: (ports) => [
      ports.boolean({ name: "input1", label: "Input 1" }),
      ports.boolean({ name: "input2", label: "Input 2" }),
    ],
    outputs: (ports) => [ports.boolean({ name: "output", label: "Output" })],
  });
};
