import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

type MessageEvents = {
  Start: () => void;
  openFile: (path: string[]) => void;
};

export const eventEmitter = new EventEmitter() as TypedEmitter<MessageEvents>;
