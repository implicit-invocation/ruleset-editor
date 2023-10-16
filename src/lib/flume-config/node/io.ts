import { FlumeConfig } from "flume";
import { createFlexibleInputNode, createFlexibleOutputNode, createTriggerableNode } from "./triggerable";

export const registerIONodes = (config: FlumeConfig) => {
  // TODO: schema for input example, check in runtime too
  config.addNodeType(
    createFlexibleOutputNode({
      sortIndex: 0,
      type: "input",
      label: "IO: Input",
      description: "Input data",
      initialWidth: 200,
      outputs: (ports) => [ports.trigger({ name: "trigger", label: "Trigger" })],
    })
  );

  config.addNodeType(
    createFlexibleInputNode(
      {
        sortIndex: 1,
        type: "output",
        label: "IO: Output",
        description: "Output data",
        initialWidth: 200,
        inputs: (ports) => [
          ports.trigger({
            name: "trigger",
            label: "Trigger",
          }),
          ports.string({ name: "key", label: "Key" }),
        ],
      },
      "input"
    )
  );

  config.addNodeType({
    sortIndex: 2,
    type: "lazy",
    label: "IO: Lazy",
    description: "Lazy node, doesn't trigger the next node until it's required by a running node",
    initialWidth: 200,
    inputs: (ports) => [
      ports.object({ name: "input", label: "Object" }),
      ports.string({ name: "string", label: "String", noControls: true }),
      ports.boolean({ name: "boolean", label: "Boolean" }),
    ],
    outputs: (ports) => [
      ports.object({ name: "output", label: "Object" }),
      ports.string({ name: "string", label: "String" }),
      ports.boolean({ name: "boolean", label: "Boolean" }),
    ],
  });

  config.addNodeType({
    sortIndex: 3,
    type: "branch",
    label: "IO: Branch",
    description: "Accept a boolean and branch the flow",
    initialWidth: 200,
    inputs: (ports) => [ports.boolean({ name: "condition", label: "Condition" })],
    outputs: (ports) => [
      ports.trigger({ name: "true", label: "Trigger when true" }),
      ports.trigger({ name: "false", label: "Trigger when false" }),
    ],
  });

  config.addNodeType(
    createTriggerableNode({
      sortIndex: 3.5,
      type: "loop",
      label: "IO: Loop",
      description: "Loop over an array",
      initialWidth: 200,
      inputs: (ports) => [
        ports.object({ name: "array", label: "Array" }),
        ports.object({ name: "context", label: "Context" }),
        ports.function({ name: "function", label: "Function" }),
      ],
      outputs: (ports) => [ports.object({ name: "output", label: "Result" })],
    })
  );
};
