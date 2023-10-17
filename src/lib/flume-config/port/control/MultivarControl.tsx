import { ControlRenderCallback } from "my-flume";
import { useState } from "react";
import { useSchemaList } from "../../../util/schema/hook";

export const createMultivarControl: ControlRenderCallback = (data: { name: string; type: string }[], onChange) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [type, setType] = useState("object");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const availableTypes = useSchemaList();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editing, setEditing] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      {!editing && (
        <button className="bg-indigo-800 text-gray-200 p-2 rounded-lg flex-1" onClick={() => setEditing(true)}>
          Add new input
        </button>
      )}
      {editing && (
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (value === "" || data.findIndex((item) => item.name === value) > -1) return;
            onChange([...data, { name: value, type }]);
            setValue("");
            setEditing(false);
          }}
        >
          <div>Input name:</div>
          <input
            type="text"
            onMouseDown={(e) => e.stopPropagation()}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="p-2 text-white bg-gray-800"
          />
          <div>Input type</div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="outline-none border-none bg-gray-800 text-white p-1"
          >
            {availableTypes.map((type) => (
              <option value={type} key={type}>
                {type === "object" ? "any" : type}
              </option>
            ))}
          </select>
          <div className="flex flex-row gap-1">
            <button className="bg-indigo-800 text-gray-200 p-2 rounded-lg flex-1" type="submit">
              Save
            </button>
            <button
              className="bg-gray-900 text-gray-200 p-2 rounded-lg flex-1"
              type="button"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="flex flex-row gap-0.5 py-1 flex-wrap">
        {data.map((variable) => (
          <button
            key={variable.name}
            className="border-2 border-gray-600 bg-gray-300 p-0.5 px-2 flex justify-center items-center gap-2 rounded-lg"
            onClick={() => {
              onChange(data.filter((v) => v !== variable));
            }}
          >
            {variable.name} ({variable.type}) <span className="text-red-800">x</span>
          </button>
        ))}
      </div>
    </div>
  );
};
