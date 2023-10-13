/* eslint-disable react-hooks/rules-of-hooks */
import { ControlRenderCallback } from "flume";
import { Resizable } from "re-resizable";
import { Monaco } from "../../../ui/common/Editor";

export const createExpressionControl: ControlRenderCallback = (
  data,
  onChange
) => {
  return (
    <Resizable
      defaultSize={{
        width: "100%",
        height: 200,
      }}
      enable={{
        bottom: true,
      }}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Monaco
        value={data}
        className="w-full h-full"
        onContentChange={onChange}
      />
    </Resizable>
  );
};
