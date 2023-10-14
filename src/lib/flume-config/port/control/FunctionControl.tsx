/* eslint-disable react-hooks/rules-of-hooks */
import { ControlRenderCallback } from "flume";

export const createFunctionControl: ControlRenderCallback = (data, onChange) => {
  return (
    <div
      className="flex flex-col justify-center items-start gap-1 border-2 border-gray-500 p-1"
      onDrop={(e) => {
        onChange(e.dataTransfer.getData("text"));
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <div>Current Function:</div>
      <div className="font-bold text-sm">{data ? data.split("/").join(" > ") : "None"}</div>
      <div className="text-xs italic">Drag the function file from the left panel!</div>
    </div>
  );
};
