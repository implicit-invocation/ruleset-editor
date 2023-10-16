import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

type MessageEvents = {
  Start: (input: unknown) => void;
  openFile: (path: string[] | undefined) => void;
  schemaListChanged: () => void;
};

export const eventEmitter = new EventEmitter() as TypedEmitter<MessageEvents>;
eventEmitter.setMaxListeners(100);
