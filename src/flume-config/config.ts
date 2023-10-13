import { FlumeConfig } from "flume";
import { registerDataNodes } from "./node/data";
import { registerExternalNodes } from "./node/external";
import { registerIONodes } from "./node/io";
import { registerJsonataNode } from "./node/jsonata";
import { registerLogicNodes } from "./node/logic";
import { registerMiscNodes } from "./node/misc";
import { registerBasicPort } from "./port/basic";
import { registerLabelPort } from "./port/label";
import { registerMultivarPort } from "./port/multivar";
import { registerTriggerPort } from "./port/trigger";

export const config = new FlumeConfig();
registerBasicPort(config);
registerTriggerPort(config);
// TODO: move run button to top bar, remove this, add function setting with example input and output logging panel
registerMultivarPort(config);
registerLabelPort(config);

registerIONodes(config);
registerDataNodes(config);
registerJsonataNode(config);
registerLogicNodes(config);
registerMiscNodes(config);
registerExternalNodes(config);
