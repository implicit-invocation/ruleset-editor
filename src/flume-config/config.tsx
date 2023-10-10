import { Colors, Controls, FlumeConfig, NodeTypeConfig, PortType } from "flume";
import { useState } from "react";
import { eventEmitter } from "../util/eventEmitter";

export const createTriggerableNode = (
  config: NodeTypeConfig
): NodeTypeConfig => {
  return {
    ...config,
    inputs: (ports) => (data, connections, ctx) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let ownPorts: PortType[] = [];
      if (config.inputs && Array.isArray(config.inputs)) {
        ownPorts = config.inputs;
      } else if (config.inputs && typeof config.inputs === "function") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inputs = config.inputs(ports as any);
        if (Array.isArray(inputs)) {
          ownPorts = inputs;
        } else {
          ownPorts = inputs(data, connections, ctx);
        }
      }
      return [
        ports.trigger({ name: "trigger", label: "Trigger" }),
        ...ownPorts,
      ];
    },
    outputs: (ports) => (data, connection, ctx) => {
      let ownPorts: PortType[] = [];
      if (config.outputs && Array.isArray(config.outputs)) {
        ownPorts = config.outputs;
      } else if (config.outputs && typeof config.outputs === "function") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const outputs = config.outputs(ports);
        if (Array.isArray(outputs)) {
          ownPorts = outputs;
        } else {
          ownPorts = outputs(data, connection, ctx);
        }
      }
      return [
        ports.trigger({ name: "trigger", label: "Trigger" }),
        ...ownPorts,
      ];
    },
  };
};

export const config = new FlumeConfig();
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
  name: "trigger",
  type: "trigger",
  label: "Trigger",
  color: Colors.green,
});
config.addPortType({
  name: "multivar",
  type: "multivar",
  label: "Multivar",
  controls: [
    Controls.custom({
      defaultValue: ["input"],
      label: "Input variables",
      name: "variables",
      render: (data, onChange) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState("");
        return (
          <div>
            <form
              className="flex flex-row gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (value === "" || data.includes(value)) return;
                onChange([...data, value]);
                setValue("");
              }}
            >
              <input
                type="text"
                onMouseDown={(e) => e.stopPropagation()}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="rounded-lg p-0.5 px-1 flex-1 text-gray-800"
              />
              <button className="bg-gray-800 text-gray-200 p-2 rounded-lg">
                Add input
              </button>
            </form>
            <div className="flex flex-row gap-0.5 py-1 flex-wrap">
              {data.map((variable: string) => (
                <button
                  key={variable}
                  className="border-2 border-gray-600 bg-gray-300 p-0.5 px-2 flex justify-center items-center gap-2 rounded-lg"
                  onClick={() => {
                    onChange(data.filter((v: string) => v !== variable));
                  }}
                >
                  {variable} <span className="text-red-800">x</span>
                </button>
              ))}
            </div>
          </div>
        );
      },
    }),
  ],
});
config.addNodeType(
  createTriggerableNode({
    type: "transform",
    label: "Object Transform",
    description:
      "Transform a JSON object to another JSON object using JSONata expressions",
    initialWidth: 300,
    inputs: (ports) => (data) => {
      return [
        ports.multivar({ hidePort: true }),
        ...(data?.multivar?.variables || []).map((variable: string) =>
          ports.object({ name: variable, label: variable })
        ),
        ports.string({
          name: "expression",
          label: "Expression (JSONata):",
          hidePort: true,
        }),
      ];
    },
    outputs: (ports) => [ports.object({ name: "output", label: "Output" })],
  })
);

config.addNodeType({
  type: "time",
  label: "Time",
  description: "Return the current time",
  initialWidth: 200,
  outputs: (ports) => [ports.object({ name: "time", label: "Time" })],
});

config.addNodeType(
  createTriggerableNode({
    type: "stringTransform",
    label: "String Transform",
    description:
      "Transform a JSON object to a string using JSONata expressions",
    initialWidth: 300,
    inputs: (ports) => (data) => {
      return [
        ports.multivar({ hidePort: true }),
        ...(data?.multivar?.variables || []).map((variable: string) =>
          ports.object({ name: variable, label: variable })
        ),
        ports.string({
          name: "expression",
          label: "Expression (JSONata):",
          hidePort: true,
        }),
      ];
    },
    outputs: (ports) => [ports.string({ name: "string", label: "String" })],
  })
);

config.addNodeType(
  createTriggerableNode({
    type: "condition",
    label: "Condition",
    description:
      "Calculate condition based on a fact given by a JSON object and a JSONata expression",
    initialWidth: 300,
    inputs: (ports) => (data) => {
      return [
        ports.multivar({ hidePort: true }),
        ...(data?.multivar?.variables || []).map((variable: string) =>
          ports.object({ name: variable, label: variable })
        ),
        ports.string({
          name: "expression",
          label: "Expression (JSONata):",
          hidePort: true,
        }),
      ];
    },
    outputs: (ports) => [ports.boolean({ name: "valid", label: "Valid" })],
  })
);

config.addNodeType({
  type: "text",
  label: "Text",
  description: "a text node",
  initialWidth: 200,
  inputs: (ports) => [ports.string({ name: "text", label: "Text" })],
  outputs: (ports) => [ports.string({ name: "text", label: "Text" })],
});

config.addNodeType({
  type: "branch",
  label: "Branch",
  description: "Accept a boolean and branch the flow",
  initialWidth: 200,
  inputs: (ports) => [ports.boolean({ name: "condition", label: "Condition" })],
  outputs: (ports) => [
    ports.trigger({ name: "true", label: "Trigger when true" }),
    ports.trigger({ name: "false", label: "Trigger when false" }),
  ],
});

config.addNodeType({
  type: "not",
  label: "Not",
  description: "Invert a boolean",
  initialWidth: 200,
  inputs: (ports) => [ports.boolean({ name: "input", label: "Input" })],
  outputs: (ports) => [ports.boolean({ name: "output", label: "Output" })],
});

config.addNodeType({
  type: "and",
  label: "And",
  description: "Combine two booleans using AND",
  initialWidth: 200,
  inputs: (ports) => [
    ports.boolean({ name: "input1", label: "Input 1" }),
    ports.boolean({ name: "input2", label: "Input 2" }),
  ],
  outputs: (ports) => [ports.boolean({ name: "output", label: "Output" })],
});

config.addNodeType({
  type: "or",
  label: "Or",
  description: "Combine two booleans using OR",
  initialWidth: 200,
  inputs: (ports) => [
    ports.boolean({ name: "input1", label: "Input 1" }),
    ports.boolean({ name: "input2", label: "Input 2" }),
  ],
  outputs: (ports) => [ports.boolean({ name: "output", label: "Output" })],
});

config.addNodeType(
  createTriggerableNode({
    type: "readData",
    label: "Read data",
    description: "Read data from a key-value store",
    initialWidth: 200,
    inputs: (ports) => [ports.string({ name: "key", label: "Key" })],
    outputs: (ports) => [ports.object({ name: "value", label: "Value" })],
  })
);

config.addNodeType(
  createTriggerableNode({
    type: "writeData",
    label: "Write data",
    description: "Write data to a key-value store",
    initialWidth: 200,
    inputs: (ports) => [
      ports.string({ name: "key", label: "Key" }),
      ports.object({ name: "value", label: "Value" }),
    ],
  })
);

config.addPortType({
  type: "button",
  name: "button",
  label: "Button",
  hidePort: true,
  controls: [
    Controls.custom({
      render: () => {
        return (
          <button
            className="bg-gray-800 text-gray-200 p-2 rounded-lg w-full"
            onClick={() => eventEmitter.emit("Start")}
          >
            Run
          </button>
        );
      },
    }),
  ],
});
config.addNodeType({
  type: "input",
  label: "Input",
  description: "Input data",
  initialWidth: 200,
  inputs: (ports) => [ports.button({})],
  outputs: (ports) => [
    ports.object({
      name: "output",
      label: "Object",
    }),
    ports.trigger({ name: "trigger", label: "Trigger" }),
  ],
});

config.addNodeType({
  type: "output",
  label: "Output",
  description: "Output data",
  initialWidth: 200,
  inputs: (ports) => [
    ports.trigger({
      name: "trigger",
      label: "Trigger",
    }),
    ports.string({ name: "key", label: "Key" }),
    ports.object({ name: "input", label: "Object" }),
  ],
});

config.addNodeType({
  type: "lazy",
  label: "Lazy",
  description:
    "Lazy node, doesn't trigger the next node until it's required by a running node",
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

config.addNodeType(
  createTriggerableNode({
    type: "call",
    label: "Call engine function",
    description: "Call a function from the engine",
    initialWidth: 300,
    inputs: (ports) => [
      ports.string({ name: "function", label: "Function name" }),
      ports.object({ name: "data", label: "Payload (object)" }),
    ],
    outputs: (ports) => [ports.object({ name: "output", label: "Output" })],
  })
);

config.addNodeType(
  createTriggerableNode({
    type: "log",
    label: "Log",
    description: "Log data to the console",
    initialWidth: 200,
    inputs: (ports) => [
      ports.object({ name: "data", label: "Data" }),
      ports.string({ name: "message", label: "Message" }),
      ports.boolean({ name: "boolean", label: "Boolean" }),
    ],
  })
);
