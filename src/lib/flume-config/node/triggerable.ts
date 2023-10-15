import { NodeTypeConfig, PortType } from "flume";
import { addPorts } from "./addPort";
import { createWithLabelNode } from "./withLabel";

export const createTriggerableNode = (config: NodeTypeConfig): NodeTypeConfig => {
  return createWithLabelNode(
    addPorts(config, {
      beforeInput: (ports) => ports.trigger({ name: "trigger", label: "Trigger" }),
      beforeOutput: (ports) => ports.trigger({ name: "trigger", label: "Trigger" }),
    })
  );
};

export const createFlexibleNode = (
  config: NodeTypeConfig,
  inputName = "data",
  outputName = "output"
): NodeTypeConfig => {
  return createFlexibleOutputNode(createFlexibleInputNode(config, inputName), outputName);
};

export const createFlexibleOutputNode = (config: NodeTypeConfig, outputName = "output"): NodeTypeConfig => {
  return {
    ...config,
    inputs: (ports) => (data, connections, ctx) => {
      let ownPorts: PortType[] = [];
      if (config.inputs && Array.isArray(config.inputs)) {
        ownPorts = config.inputs;
      } else if (config.inputs && typeof config.inputs === "function") {
        const inputs = config.inputs(ports);
        if (Array.isArray(inputs)) {
          ownPorts = inputs;
        } else {
          ownPorts = inputs(data, connections, ctx);
        }
      }
      return [...ownPorts, ports.flexible({ name: "outputType" })];
    },
    outputs: (ports) => (data, connection, ctx) => {
      let ownPorts: PortType[] = [];
      if (config.outputs && Array.isArray(config.outputs)) {
        ownPorts = config.outputs;
      } else if (config.outputs && typeof config.outputs === "function") {
        const outputs = config.outputs(ports);
        if (Array.isArray(outputs)) {
          ownPorts = outputs;
        } else {
          ownPorts = outputs(data, connection, ctx);
        }
      }
      let dataPort = ports.object({ name: outputName, label: "Payload (object)" });
      const type = data?.outputType?.schema;
      if (type && type !== "object") {
        dataPort = ports[type]
          ? ports[type]({ name: outputName, label: `Payload (${type})` })
          : ports.object({ name: outputName, label: `Payload (${type}) - missing` });
      }
      return [...ownPorts, dataPort];
    },
  };
};

export const createFlexibleInputNode = (config: NodeTypeConfig, inputName = "data"): NodeTypeConfig => {
  return {
    ...config,
    inputs: (ports) => (data, connections, ctx) => {
      let ownPorts: PortType[] = [];
      if (config.inputs && Array.isArray(config.inputs)) {
        ownPorts = config.inputs;
      } else if (config.inputs && typeof config.inputs === "function") {
        const inputs = config.inputs(ports);
        if (Array.isArray(inputs)) {
          ownPorts = inputs;
        } else {
          ownPorts = inputs(data, connections, ctx);
        }
      }
      let dataPort = ports.object({ name: inputName, label: "Payload (object)" });
      const type = data?.inputType?.schema;
      if (type && type !== "object") {
        dataPort = ports[type]
          ? ports[type]({ name: inputName, label: `Payload (${type})` })
          : ports.object({ name: inputName, label: `Payload (${type}) - missing` });
      }
      return [...ownPorts, ports.flexible({ name: "inputType" }), dataPort];
    },
  };
};
