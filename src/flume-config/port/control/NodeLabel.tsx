/* eslint-disable react-hooks/rules-of-hooks */
import { ControlRenderCallback } from "flume";
import { useState } from "react";

export const createNodeLabelControl: ControlRenderCallback = (
  data,
  onChange
) => {
  const [editing, setEditing] = useState(false);
  const [previous, setPrevious] = useState(data);

  return (
    <div className="flex flex-col justify-center items-start">
      {!editing && (
        <div
          className="w-full h-full font-bold text-lg cursor-pointer"
          onClick={() => {
            setPrevious(data);
            setEditing(true);
          }}
        >
          {data}
        </div>
      )}
      {editing && (
        <input
          autoFocus
          onFocus={(e) => e.target.select()}
          className="w-full h-full text-lg p-1 outline-none "
          value={data}
          onMouseDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditing(false);
            } else if (e.key === "Escape") {
              setEditing(false);
              onChange(previous);
            }
          }}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <div className="text-sm italic text-gray-800">
        {editing ? "Press Enter to confirm" : "Click to modify"}
      </div>
    </div>
  );
};
