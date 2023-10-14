import { Controls, FlumeConfig } from "flume";
import { createMultivarControl } from "./control/MultivarControl";

export const registerMultivarPort = (config: FlumeConfig) => {
  config.addPortType({
    name: "multivar",
    type: "multivar",
    label: "Multivar",
    controls: [
      Controls.custom({
        defaultValue: ["input"],
        label: "Input variables",
        name: "variables",
        render: createMultivarControl,
      }),
    ],
  });
};