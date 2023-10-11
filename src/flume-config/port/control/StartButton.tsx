import { ControlRenderCallback } from "flume";
import { SimpleButton } from "../../../ui/common/Button";
import { eventEmitter } from "../../../util/eventEmitter";

export const createStartButton: ControlRenderCallback = () => {
  return (
    <SimpleButton
      primaryStyle
      className="w-full"
      onClick={() => eventEmitter.emit("Start")}
      text="Run"
    />
  );
};
