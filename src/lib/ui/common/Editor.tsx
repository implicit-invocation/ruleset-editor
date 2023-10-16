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
  mode,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onContentChange?: (value: string) => void;
  mode?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(null);
  useEffect(() => {
    if (ref.current) {
      getMonaco().then((monaco) => {
        if (ref.current) {
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: false,
          });
          const editor = monaco.editor.create(ref.current, {
            language: mode || "json",
            theme: "vs-dark",
            automaticLayout: true,
            lineNumbers: "off",

            minimap: {
              enabled: false,
            },
          });
          setEditor(editor);
        }
      });
    }
  }, [mode]);

  useEffect(() => {
    if (editor && onContentChange) {
      editor.onDidChangeModelContent(() => {
        onContentChange(editor.getValue());
      });
    }
  }, [onContentChange, editor]);

  useEffect(() => {
    if (editor && value !== undefined) {
      if (editor.getValue() !== value) {
        editor.setValue(value);
      }
    }
  }, [editor, value]);
  return <div {...props} ref={ref} />;
};
