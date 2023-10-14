import { FlumeConfig } from "flume";
import { createWithLabelNode } from "./withLabel";

export const registerDataNodes = (config: FlumeConfig) => {
  config.addNodeType({
    sortIndex: 12,
    type: "time",
    label: "Data: Time",
    description: "Return the current time",
    initialWidth: 200,
    outputs: (ports) => [ports.object({ name: "time", label: "Time" })],
  });

  config.addNodeType(
    createWithLabelNode({
      sortIndex: 11,
      type: "text",
      label: "Data: Text",
      description: "a text node",
      initialWidth: 200,
      inputs: (ports) => [ports.string({ name: "text", label: "Text" })],
      outputs: (ports) => [ports.string({ name: "text", label: "Text" })],
    }),
  );
};
