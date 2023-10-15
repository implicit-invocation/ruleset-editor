import { ControlRenderCallback } from "flume";
import { useEffect, useState } from "react";
import { Configuration } from "../../..";

export const createFlexibleControl: ControlRenderCallback = (data, onChange, _context, _redraw, portProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [availableTypes, setAvailableTypes] = useState<string[]>(["any", "boolean", "string"]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    Promise.resolve(Configuration.functionProvider.getSchemaList()).then((types) =>
      setAvailableTypes(["any", "boolean", "string", ...types])
    );
  }, []);
  return (
    <div className="flex flex-col gap-1">
      <div>{portProps.portName}</div>
      <select
        value={data}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="outline-none border-none bg-gray-800 text-white p-1"
      >
        {availableTypes.map((type) => (
          <option value={type} key={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};
