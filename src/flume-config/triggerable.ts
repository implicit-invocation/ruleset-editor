import { NodeTypeConfig, PortType } from "flume";

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
