import { Resizable } from "re-resizable";
import { FunctionSettings } from "./FunctionSetting";
import { Functions } from "./Functions";

export const LeftPanel = ({ hidden }: { hidden?: boolean }) => {
  return (
    <Resizable
      className="flex flex-col border-r-2 border-gray-800 shadow-lg bg-gray-900 text-gray-300"
      style={{
        display: hidden ? "none" : "flex",
      }}
      enable={{
        right: true,
      }}
      defaultSize={{
        width: 300,
        height: "100%",
      }}
      minWidth={280}
    >
      <Functions />
      <FunctionSettings />
    </Resizable>
  );
};
