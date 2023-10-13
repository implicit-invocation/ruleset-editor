import { Resizable } from "re-resizable";
import { PanelHeader } from "../common/PanelHeader";
import { Tabs } from "../common/Tabs";
import { Output } from "./Output";

const renderTitle = (name: string) => {
  return <PanelHeader headerTitle={name} />;
};

const renderTab = (name: string) => {
  switch (name) {
    case "Ouput":
      return <Output />;
    case "Schema":
      return <div>Schema</div>;
    default:
      return <div>Unknown</div>;
  }
};

export const BottomPanel = ({ hidden }: { hidden: boolean }) => {
  return (
    <Resizable
      className="border-t-2 border-gray-800 shadow-lg bg-gray-900 text-gray-300 flex flex-col"
      style={{
        display: hidden ? "none" : "flex",
      }}
      enable={{
        top: true,
      }}
      defaultSize={{
        width: "100%",
        height: 300,
      }}
    >
      <Tabs tabNames={["Ouput", "Schema"]} renderTitle={renderTitle} renderTab={renderTab} />
    </Resizable>
  );
};
