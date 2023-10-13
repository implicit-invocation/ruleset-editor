import { Colors, Controls, FlumeConfig } from "flume";
import { createExpressionControl } from "./control/ExpressionControl";
import { createFunctionControl } from "./control/FunctionControl";

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
  config.addPortType({
    type: "function",
    label: "Function",
    name: "function",
    hidePort: true,
    controls: [
      Controls.custom({
        name: "function",
        label: "Function",
        defaultValue: "",
        render: createFunctionControl,
      }),
    ],
  });
  config.addPortType({
    type: "expression",
    name: "expression",
    label: "Expression",
    hidePort: true,
    controls: [
      Controls.custom({
        name: "expression",
        label: "Expression (JSONata)",
        defaultValue: "",
        render: createExpressionControl,
      }),
    ],
  });
};
