export declare type Connection = {
  nodeId: string;
  portName: string;
};
export declare type ConnectionMap = {
  [portName: string]: Connection[];
};
export declare type Connections = {
  inputs: ConnectionMap;
  outputs: ConnectionMap;
};
export declare type GraphNode = {
  id: string;
  type: string;
  width: number;
  x: number;
  y: number;
  inputData: InputData;
  connections: Connections;
  defaultNode?: boolean;
  root?: boolean;
};
export declare type DefaultNode = {
  type: string;
  x?: number;
  y?: number;
};
export declare type NodeMap = {
  [nodeId: string]: GraphNode;
};
export declare type InputData = {
  [portName: string]: ControlData;
};
export declare type ControlData = {
  [controlName: string]: unknown;
};
