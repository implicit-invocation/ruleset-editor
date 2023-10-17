import { NodeTypeConfig, PortType, PortTypeBuilder } from "my-flume";

export const addPorts = (
  config: NodeTypeConfig,
  additional: {
    beforeInput?: PortType | ((ports: { [portType: string]: PortTypeBuilder }) => PortType);
    afterInput?: PortType | ((ports: { [portType: string]: PortTypeBuilder }) => PortType);
    beforeOutput?: PortType | ((ports: { [portType: string]: PortTypeBuilder }) => PortType);
    afterOutput?: PortType | ((ports: { [portType: string]: PortTypeBuilder }) => PortType);
  }
): NodeTypeConfig => {
  let inputs = config.inputs;
  if (additional.beforeInput || additional.afterInput) {
    inputs = (ports) => (data, connections, ctx) => {
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
      const newPorts = [...ownPorts];
      if (additional.beforeInput) {
        if (typeof additional.beforeInput === "function") {
          newPorts.unshift(additional.beforeInput(ports));
        } else {
          newPorts.unshift(additional.beforeInput);
        }
      }
      if (additional.afterInput) {
        if (typeof additional.afterInput === "function") {
          newPorts.push(additional.afterInput(ports));
        } else {
          newPorts.push(additional.afterInput);
        }
      }
      return newPorts;
    };
  }
  let outputs = config.outputs;
  if (additional.beforeOutput || additional.afterOutput) {
    outputs = (ports) => (data, connection, ctx) => {
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
      const newPorts = [...ownPorts];
      if (additional.beforeOutput) {
        if (typeof additional.beforeOutput === "function") {
          newPorts.unshift(additional.beforeOutput(ports));
        } else {
          newPorts.unshift(additional.beforeOutput);
        }
      }
      if (additional.afterOutput) {
        if (typeof additional.afterOutput === "function") {
          newPorts.push(additional.afterOutput(ports));
        } else {
          newPorts.push(additional.afterOutput);
        }
      }
      return newPorts;
    };
  }
  return {
    ...config,
    inputs,
    outputs,
  };
};
