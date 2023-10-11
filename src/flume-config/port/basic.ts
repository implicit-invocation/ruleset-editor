import { Colors, Controls, FlumeConfig } from "flume";

export const registerBasicPort = (config: FlumeConfig) => {
  config.addPortType({
    name: "boolean",
    type: "boolean",
    label: "Boolean",
    color: Colors.blue,
  });
  config.addPortType({
    name: "object",
    type: "object",
    label: "Object",
  });
  config.addPortType({
    type: "string",
    name: "string",
    label: "Text",
    color: Colors.purple,
    controls: [
      Controls.text({
        name: "string",
        label: "Text",
      }),
    ],
  });
};
