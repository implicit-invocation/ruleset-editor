import { FlumeConfig } from "flume";
import { createTriggerableNode } from "./triggerable";

export const registerJsonataNode = (config: FlumeConfig) => {
  config.addNodeType(
    createTriggerableNode({
      sortIndex: 10,
      type: "transform",
      label: "JSONata: Object Transform",
      description: "Transform a JSON object to another JSON object using JSONata expressions",
      initialWidth: 300,
      inputs: (ports) => (data) => {
        return [
          ports.multivar({ hidePort: true }),
          ...(data?.multivar?.variables || []).map((variable: string) =>
            ports.object({ name: variable, label: variable }),
          ),
          ports.expression({
            name: "expression",
            label: "Expression (JSONata):",
            hidePort: true,
          }),
        ];
      },
      outputs: (ports) => [ports.object({ name: "output", label: "Output" })],
    }),
  );

  config.addNodeType(
    createTriggerableNode({
      sortIndex: 9,
      type: "stringTransform",
      label: "JSONata: String Transform",
      description: "Transform a JSON object to a string using JSONata expressions",
      initialWidth: 300,
      inputs: (ports) => (data) => {
        return [
          ports.multivar({ hidePort: true }),
          ...(data?.multivar?.variables || []).map((variable: string) =>
            ports.object({ name: variable, label: variable }),
          ),
          ports.expression({
            name: "expression",
            label: "Expression (JSONata):",
            hidePort: true,
          }),
        ];
      },
      outputs: (ports) => [ports.string({ name: "string", label: "String" })],
    }),
  );

  config.addNodeType(
    createTriggerableNode({
      sortIndex: 8,
      type: "condition",
      label: "JSONata: Condition",
      description: "Calculate condition based on a fact given by a JSON object and a JSONata expression",
      initialWidth: 300,
      inputs: (ports) => (data) => {
        return [
          ports.multivar({ hidePort: true }),
          ...(data?.multivar?.variables || []).map((variable: string) =>
            ports.object({ name: variable, label: variable }),
          ),
          ports.expression({
            name: "expression",
            label: "Expression (JSONata):",
            hidePort: true,
          }),
        ];
      },
      outputs: (ports) => [ports.boolean({ name: "valid", label: "Valid" })],
    }),
  );
};
