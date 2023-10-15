import { Resizable } from "re-resizable";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineFileDone, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Configuration, Deferred } from "../..";
import { IconButton } from "../common/Button";
import { Monaco } from "../common/Editor";

export const Schema = () => {
  const [schemaList, setSchemaList] = useState<string[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<string | undefined>();
  const [content, setContent] = useState<string | undefined>();
  const [adding, setAdding] = useState<Deferred<{ name: string; cancel: boolean }> | undefined>();
  const [deleting, setDeleting] = useState<Deferred<{ cancel: boolean }> | undefined>();

  const openSchema = useCallback((schema: string) => {
    setSelectedSchema(schema);
    setContent(undefined);
    setTimeout(async () => {
      const content = await Configuration.functionProvider.getSchema(schema);
      setContent(content);
    }, 0);
  }, []);

  useEffect(() => {
    Promise.resolve(Configuration.functionProvider.getSchemaList()).then(setSchemaList);
  }, []);

  useEffect(() => {
    if (!selectedSchema || content === undefined) {
      return;
    }
    const handler = async () => {
      await Configuration.functionProvider.setSchema(selectedSchema, content);
    };
    handler();
  }, [content, selectedSchema]);

  return (
    <div className="flex-1 overflow-hidden flex flex-row justify-center items-center p-3">
      <Resizable
        defaultSize={{
          width: 300,
          height: "100%",
        }}
        enable={{
          right: true,
        }}
      >
        <div className="flex-1 flex flex-col justify-start items-start gap-2 w-full">
          <div className="flex flex-row justify-between items-center w-full pr-3">
            <div className="uppercase text-xs">Schema list</div>
            <div>
              <IconButton
                icon={AiOutlineFileDone}
                attachment={AiOutlinePlus}
                size="sm"
                onClick={async () => {
                  if (adding) {
                    return;
                  }
                  const deferred = new Deferred<{ name: string; cancel: boolean }>();
                  setAdding(deferred);
                  const result = await deferred.promise;
                  if (result.cancel) {
                    setAdding(undefined);
                    return;
                  }
                  if (schemaList.includes(result.name)) {
                    alert("Schema already exists");
                    setAdding(undefined);
                    return;
                  }
                  setAdding(undefined);
                  setContent(undefined);
                  await Configuration.functionProvider.setSchema(result.name, "");
                  setSchemaList([...schemaList, result.name]);
                  openSchema(result.name);
                }}
              />
              <IconButton
                icon={AiOutlineDelete}
                attachment={AiOutlineMinus}
                size="sm"
                attachmentColor="red"
                onClick={async () => {
                  if (deleting) {
                    return;
                  }
                  if (!selectedSchema) {
                    return;
                  }
                  const deferred = new Deferred<{ cancel: boolean }>();
                  setDeleting(deferred);
                  const result = await deferred.promise;
                  if (result.cancel) {
                    setDeleting(undefined);
                    return;
                  }
                  await Configuration.functionProvider.deleteSchema(selectedSchema);
                  setSchemaList(schemaList.filter((schema) => schema !== selectedSchema));
                  setSelectedSchema(undefined);
                  setDeleting(undefined);
                  setContent(undefined);
                }}
              />
            </div>
          </div>
          {schemaList.length === 0 && !adding && <div className="text-gray-500">No schema found</div>}
        </div>
        <div className="flex flex-col">
          {adding && (
            <div className="flex flex-row gap-2 justify-start items-center">
              <div>
                <AiOutlineFileDone />
              </div>
              <div className="flex-1">
                <input
                  autoFocus
                  type="text"
                  onKeyDown={(e) => {
                    if (!adding) {
                      return;
                    }
                    if (e.key === "Escape") {
                      adding.resolve({
                        cancel: true,
                        name: "",
                      });
                    } else if (e.key === "Enter") {
                      adding.resolve({
                        cancel: false,
                        name: e.currentTarget.value,
                      });
                    }
                  }}
                  className="w-full text-white bg-gray-700 border-none outline-none py-0.5 text-sm"
                />
              </div>
            </div>
          )}
          {schemaList.map((schema) => (
            <div
              key={schema}
              className={[
                "flex flex-row gap-2 cursor-pointer hover:bg-gray-800 text-sm p-1 relative",
                selectedSchema === schema ? "bg-indigo-700 hover:bg-indigo-600" : undefined,
              ].join(" ")}
              onClick={() => openSchema(schema)}
            >
              <div className="flex flex-row gap-2 justify-start items-center">
                <div>
                  <AiOutlineFileDone />
                </div>
                <div className="flex-1">{schema}</div>
              </div>
              {selectedSchema === schema && deleting && (
                <div className="w-full h-full absolute top-0 left-0 bg-black/75 flex flex-row justify-end items-center gap-2 pr-2">
                  <button
                    className="cursor-pointer bg-red-500 px-2 rounded-md w-12 shadow-md"
                    onClick={() => {
                      deleting.resolve({
                        cancel: false,
                      });
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="cursor-pointer bg-gray-800 px-2 rounded-md w-12 shadow-md"
                    onClick={() => {
                      deleting.resolve({
                        cancel: true,
                      });
                    }}
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Resizable>
      <div className="flex-1 h-full">
        <Monaco className="w-full h-full" value={content} onContentChange={setContent} />
      </div>
    </div>
  );
};
