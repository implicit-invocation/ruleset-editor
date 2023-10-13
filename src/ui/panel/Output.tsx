import { Console, Hook, Unhook } from "console-feed";
import { Message } from "console-feed/lib/definitions/Console";
import { useEffect, useRef, useState } from "react";

export const Output = () => {
  const [logs, setLogs] = useState<Message[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hookedConsole = Hook(
      window.console,
      (log) => {
        setLogs((currLogs) => [...currLogs, log]);
        setTimeout(() => {
          ref.current?.scrollTo({
            top: ref.current.scrollHeight,
            left: 0,
            behavior: "instant",
          });
        }, 0);
      },
      false
    );
    return () => {
      Unhook(hookedConsole);
    };
  }, []);

  return (
    <div className="shadow-lg bg-gray-900 text-gray-300 flex-1 overflow-auto pb-10" ref={ref}>
      <Console
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        logs={logs as any}
        variant="dark"
        filter={["log", "debug", "info", "warn", "error", "table", "clear", "time", "timeEnd", "count", "assert"]}
      />
    </div>
  );
};
