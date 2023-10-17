import { Controls, FlumeConfig } from "my-flume";
import { createNodeLabelControl } from "./control/NodeLabel";

export const registerLabelPort = (config: FlumeConfig) => {
  config.addPortType({
    name: "label",
    type: "label",
    label: "Label",
    controls: [
      Controls.custom({
        defaultValue: "Unnamed node",
        label: "Input variables",
        name: "variables",
        render: createNodeLabelControl,
      }),
    ],
  });
};
