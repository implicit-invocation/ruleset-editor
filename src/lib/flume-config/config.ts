import { FlumeConfig } from "my-flume";
import { registerDataNodes } from "./node/data";
import { registerExternalNodes } from "./node/external";
import { registerIONodes } from "./node/io";
import { registerJsonataNode } from "./node/jsonata";
import { registerLogicNodes } from "./node/logic";
import { registerMiscNodes } from "./node/misc";
import { registerBasicPort } from "./port/basic";
import { registerLabelPort } from "./port/label";
import { registerMultivarPort } from "./port/multivar";
import { registerFlexiblePort } from "./port/schema";
import { registerTriggerPort } from "./port/trigger";

export const initConfig = (config: FlumeConfig, customTypes: string[]) => {
  registerBasicPort(config, customTypes);
  registerTriggerPort(config);
  // TODO: move run button to top bar, remove this, add function setting with example input and output logging panel
  registerMultivarPort(config);
  registerLabelPort(config);
  registerFlexiblePort(config);

  registerIONodes(config);
  registerDataNodes(config);
  registerJsonataNode(config);
  registerLogicNodes(config);
  registerMiscNodes(config);
  registerExternalNodes(config);
};
