import { ControlRenderCallback } from "flume";
import { useState } from "react";

export const createMultivarControl: ControlRenderCallback = (
  data,
  onChange
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState("");
  return (
    <div>
      <form
        className="flex flex-row gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (value === "" || data.includes(value)) return;
          onChange([...data, value]);
          setValue("");
        }}
      >
        <input
          type="text"
          onMouseDown={(e) => e.stopPropagation()}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="rounded-lg p-0.5 px-1 flex-1 text-gray-800"
        />
        <button className="bg-gray-800 text-gray-200 p-2 rounded-lg">
          Add input
        </button>
      </form>
      <div className="flex flex-row gap-0.5 py-1 flex-wrap">
        {data.map((variable: string) => (
          <button
            key={variable}
            className="border-2 border-gray-600 bg-gray-300 p-0.5 px-2 flex justify-center items-center gap-2 rounded-lg"
            onClick={() => {
              onChange(data.filter((v: string) => v !== variable));
            }}
          >
            {variable} <span className="text-red-800">x</span>
          </button>
        ))}
      </div>
    </div>
  );
};
