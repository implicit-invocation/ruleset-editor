import { FlumeConfig } from "flume";
import { registerDataNodes } from "./node/data";
import { registerIONodes } from "./node/io";
import { registerLogicNodes } from "./node/logic";
import { registerMiscNodes } from "./node/misc";
import { registerBasicPort } from "./port/basic";
import { registerStartButton } from "./port/startButton";
import { registerTriggerPort } from "./port/trigger";

export const config = new FlumeConfig();
registerBasicPort(config);
registerTriggerPort(config);
// TODO: move run button to top bar, remove this, add function setting with example input and output logging panel
registerStartButton(config);

registerIONodes(config);
registerDataNodes(config);
registerLogicNodes(config);
registerMiscNodes(config);
