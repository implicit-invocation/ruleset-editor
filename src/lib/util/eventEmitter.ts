import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

type MessageEvents = {
  Start: (input: unknown) => void;
  openFile: (path: string[] | undefined) => void;
};

export const eventEmitter = new EventEmitter() as TypedEmitter<MessageEvents>;
