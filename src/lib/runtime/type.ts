import { Static, Type as t } from "@sinclair/typebox";

export const ConnectionSchema = t.Object({
  nodeId: t.String(),
  portName: t.String(),
  portType: t.Optional(t.String()),
});

export const ConnectionMapSchema = t.Record(t.String(), t.Array(ConnectionSchema));

export const ConnectionsSchema = t.Object({
  inputs: ConnectionMapSchema,
  outputs: ConnectionMapSchema,
});

export const GraphNodeSchema = t.Object({
  id: t.String(),
  type: t.String(),
  width: t.Number(),
  x: t.Number(),
  y: t.Number(),
  inputData: t.Record(t.String(), t.Any()),
  connections: ConnectionsSchema,
  defaultNode: t.Optional(t.Boolean()),
  root: t.Optional(t.Boolean()),
});

export const DefaultNodeSchema = t.Object({
  type: t.String(),
  x: t.Optional(t.Number()),
  y: t.Optional(t.Number()),
});

export const NodeMapSchema = t.Record(t.String(), GraphNodeSchema);

export const InputDataSchema = t.Record(t.String(), t.Any());

export const ControlDataSchema = t.Record(t.String(), t.Any());

export type Connection = Static<typeof ConnectionSchema>;
export type ConnectionMap = Static<typeof ConnectionMapSchema>;
export type Connections = Static<typeof ConnectionsSchema>;
export type GraphNode = Static<typeof GraphNodeSchema>;
export type DefaultNode = Static<typeof DefaultNodeSchema>;
export type NodeMap = Static<typeof NodeMapSchema>;
export type InputData = Static<typeof InputDataSchema>;
export type ControlData = Static<typeof ControlDataSchema>;
export type MaybePromise<T> = T | Promise<T>;

export type ExternalFunctionHandler = (name: string, payload: unknown) => MaybePromise<unknown>;
export type KVStore = {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
};
