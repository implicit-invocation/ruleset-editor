import { Controls, FlumeConfig } from "my-flume";
import { createMultivarControl } from "./control/MultivarControl";

export const registerMultivarPort = (config: FlumeConfig) => {
  config.addPortType({
    name: "multivar",
    type: "multivar",
    label: "Multivar",
    controls: [
      Controls.custom({
        defaultValue: [{ name: "input", type: "object" }],
        label: "Input variables",
        name: "variables",
        render: createMultivarControl,
      }),
    ],
  });
};
