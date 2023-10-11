/* eslint-disable @typescript-eslint/no-explicit-any */
import { Console, Hook, Unhook } from "console-feed";
import { Resizable } from "re-resizable";
import { useEffect, useRef, useState } from "react";
import { PanelHeader } from "../common/PanelHeader";

export const Output = () => {
  const [logs, setLogs] = useState<any[]>([]);
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
    <Resizable
      className="border-t-2 border-gray-800 shadow-lg bg-gray-900 text-gray-300 flex flex-col"
      enable={{
        top: true,
      }}
      defaultSize={{
        width: "100%",
        height: 300,
      }}
    >
      <PanelHeader headerTitle="OUTPUT" />
      <div className="flex-1 pb-10 overflow-auto" ref={ref}>
        <Console logs={logs} variant="dark" />
      </div>
    </Resizable>
  );
};
