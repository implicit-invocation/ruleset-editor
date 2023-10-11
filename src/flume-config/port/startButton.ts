import { Controls, FlumeConfig } from "flume";
import { createStartButton } from "./control/StartButton";

export const registerStartButton = (config: FlumeConfig) => {
  config.addPortType({
    type: "startButton",
    name: "button",
    label: "Button",
    hidePort: true,
    controls: [
      Controls.custom({
        render: createStartButton,
      }),
    ],
  });
};
