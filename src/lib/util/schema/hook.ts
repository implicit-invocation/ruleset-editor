import { useCallback, useEffect, useState } from "react";
import { Configuration } from "../..";
import { eventEmitter } from "../eventEmitter";

export const DEFAULT_LIST = ["object", "boolean", "string"];

export const useSchemaList = (onBeforeLoad?: () => void) => {
  const [customTypes, setCustomTypes] = useState<string[]>(DEFAULT_LIST);

  const loadSchemaList = useCallback(() => {
    (async () => {
      const schemaList = await Configuration.functionProvider.getSchemaList();
      setCustomTypes([...DEFAULT_LIST, ...schemaList]);
      onBeforeLoad && onBeforeLoad();
    })();
  }, [onBeforeLoad]);

  useEffect(() => {
    eventEmitter.on("schemaListChanged", loadSchemaList);
    loadSchemaList();
    return () => {
      eventEmitter.off("schemaListChanged", loadSchemaList);
    };
  }, [loadSchemaList]);
  return customTypes;
};
