import { Colors, FlumeConfig } from "flume";

export const registerTriggerPort = (config: FlumeConfig) => {
  config.addPortType({
    name: "trigger",
    type: "trigger",
    label: "Trigger",
    color: Colors.green,
  });
};
