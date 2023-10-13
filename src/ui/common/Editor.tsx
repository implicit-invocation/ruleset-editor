import loader from "@monaco-editor/loader";
import type { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";

let monanco: Awaited<ReturnType<typeof loader.init>> | null = null;
const getMonaco = async () => {
  if (!monanco) {
    monanco = await loader.init();
  }
  return monanco;
};
getMonaco();

export const Monaco = ({
  value,
  onContentChange,
  ...props
}: React.ButtonHTMLAttributes<HTMLDivElement> & {
  value?: string;
  onContentChange?: (value: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(
    null
  );
  useEffect(() => {
    if (ref.current) {
      getMonaco().then((monaco) => {
        if (ref.current) {
          const editor = monaco.editor.create(ref.current, {
            language: "json",
            theme: "vs-dark",
            automaticLayout: true,
            lineNumbers: "off",

            minimap: {
              enabled: false,
            },
          });
          editor.onDidChangeModelContent(() => {
            if (onContentChange) {
              onContentChange(editor.getValue());
            }
          });
          setEditor(editor);
        }
      });
    }
  }, [onContentChange]);

  useEffect(() => {
    if (editor && value) {
      if (editor.getValue() !== value) {
        editor.setValue(value);
      }
    }
  }, [editor, value]);
  return <div {...props} ref={ref} />;
};
