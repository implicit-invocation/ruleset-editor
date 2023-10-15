import { Controls, FlumeConfig } from "flume";
import { createFlexibleControl } from "./control/FlexibleControl";

export const registerFlexiblePort = (config: FlumeConfig) => {
  config.addPortType({
    name: "flexible",
    type: "flexible",
    label: "Flexible",
    hidePort: true,
    controls: [
      Controls.custom({
        name: "schema",
        defaultValue: "any",
        label: "Type",
        render: createFlexibleControl,
      }),
    ],
  });
};

export const registerAllSchemaPort = (config: FlumeConfig, schemaList: string[]) => {
  for (const schema of schemaList) {
    if (config.portTypes[schema]) {
      continue;
    }
    config.addPortType({
      name: schema,
      acceptTypes: [schema, "object"],
      type: schema,
      label: schema,
    });
  }
};
