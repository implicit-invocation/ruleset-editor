import { FlumeConfig } from "flume";
import { createFlexibleOutputNode, createTriggerableNode } from "./triggerable";

export const registerJsonataNode = (config: FlumeConfig) => {
  config.addNodeType(
    createFlexibleOutputNode(
      createTriggerableNode({
        sortIndex: 10,
        type: "transform",
        label: "JSONata: Object Transform",
        description: "Transform a JSON object to another JSON object using JSONata expressions",
        initialWidth: 300,
        inputs: (ports) => (data) => {
          return [
            ports.multivar({ hidePort: true }),
            ...(data?.multivar?.variables || []).map(({ name, type }: { name: string; type: string }) =>
              ports[type]
                ? ports[type]({ name: name, label: `${name} (${type})` })
                : ports.object({ name: name, label: `${name} (${type}) - missing` })
            ),
            ports.expression({
              name: "expression",
              label: "Expression (JSONata):",
              hidePort: true,
            }),
          ];
        },
      })
    )
  );
};
