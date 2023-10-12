import { NodeTypeConfig, PortType } from "flume";

export const createWithLabelNode = (config: NodeTypeConfig): NodeTypeConfig => {
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
        ports.label({
          hidePort: true,
          label: undefined,
        }),
        ...ownPorts,
      ];
    },
  };
};
