import { Value } from "@sinclair/typebox/value";
import { NodeMap } from ".";
import { NodeMapSchema } from "./type";

export const parseNodeMap = (input: string | object): NodeMap => {
  if (typeof input === "string") {
    input = JSON.parse(input);
  }
  if (!Value.Check(NodeMapSchema, input)) {
    throw new Error("Invalid node map");
  }
  return input as NodeMap;
};
