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
            schemas: [
              {
                uri: "https://json-schema.org/draft/2020-12/schema",
                fileMatch: ["*"],
                schema: {
                  $schema: "https://meta.json-schema.tools/",
                  $id: "https://meta.json-schema.tools/",
                  title: "JSONSchema",
                  default: {},
                  oneOf: [{ $ref: "#/definitions/JSONSchemaObject" }, { $ref: "#/definitions/JSONSchemaBoolean" }],
                  definitions: {
                    JSONSchemaBoolean: {
                      title: "JSONSchemaBoolean",
                      description: "Always valid if true. Never valid if false. Is constant.",
                      type: "boolean",
                    },
                    JSONSchemaObject: {
                      title: "JSONSchemaObject",
                      type: "object",
                      properties: {
                        $id: {
                          title: "$id",
                          type: "string",
                          format: "uri-reference",
                        },
                        $schema: {
                          title: "$schema",
                          type: "string",
                          format: "uri",
                        },
                        $ref: {
                          title: "$ref",
                          type: "string",
                          format: "uri-reference",
                        },
                        $comment: {
                          title: "$comment",
                          type: "string",
                        },
                        title: {
                          title: "title",
                          type: "string",
                        },
                        description: {
                          title: "description",
                          type: "string",
                        },
                        default: true,
                        readOnly: {
                          title: "readOnly",
                          type: "boolean",
                          default: false,
                        },
                        examples: {
                          title: "examples",
                          type: "array",
                          items: true,
                        },
                        multipleOf: {
                          title: "multipleOf",
                          type: "number",
                          exclusiveMinimum: 0,
                        },
                        maximum: {
                          title: "maximum",
                          type: "number",
                        },
                        exclusiveMaximum: {
                          title: "exclusiveMaximum",
                          type: "number",
                        },
                        minimum: {
                          title: "minimum",
                          type: "number",
                        },
                        exclusiveMinimum: {
                          title: "exclusiveMinimum",
                          type: "number",
                        },
                        maxLength: {
                          $ref: "#/definitions/nonNegativeInteger",
                        },
                        minLength: {
                          $ref: "#/definitions/nonNegativeIntegerDefault0",
                        },
                        pattern: {
                          title: "pattern",
                          type: "string",
                          format: "regex",
                        },
                        additionalItems: {
                          $ref: "#",
                        },
                        items: {
                          title: "items",
                          anyOf: [
                            {
                              $ref: "#",
                            },
                            {
                              $ref: "#/definitions/schemaArray",
                            },
                          ],
                          default: true,
                        },
                        maxItems: {
                          $ref: "#/definitions/nonNegativeInteger",
                        },
                        minItems: {
                          $ref: "#/definitions/nonNegativeIntegerDefault0",
                        },
                        uniqueItems: {
                          title: "uniqueItems",
                          type: "boolean",
                          default: false,
                        },
                        contains: {
                          $ref: "#",
                        },
                        maxProperties: {
                          $ref: "#/definitions/nonNegativeInteger",
                        },
                        minProperties: {
                          $ref: "#/definitions/nonNegativeIntegerDefault0",
                        },
                        required: {
                          $ref: "#/definitions/stringArray",
                        },
                        additionalProperties: {
                          $ref: "#",
                        },
                        definitions: {
                          title: "definitions",
                          type: "object",
                          additionalProperties: {
                            $ref: "#",
                          },
                          default: {},
                        },
                        properties: {
                          title: "properties",
                          type: "object",
                          additionalProperties: {
                            $ref: "#",
                          },
                          default: {},
                        },
                        patternProperties: {
                          title: "patternProperties",
                          type: "object",
                          additionalProperties: {
                            $ref: "#",
                          },
                          propertyNames: {
                            title: "propertyNames",
                            format: "regex",
                          },
                          default: {},
                        },
                        dependencies: {
                          title: "dependencies",
                          type: "object",
                          additionalProperties: {
                            title: "dependenciesSet",
                            anyOf: [
                              {
                                $ref: "#",
                              },
                              {
                                $ref: "#/definitions/stringArray",
                              },
                            ],
                          },
                        },
                        propertyNames: {
                          $ref: "#",
                        },
                        const: true,
                        enum: {
                          title: "enum",
                          type: "array",
                          items: true,
                          minItems: 1,
                          uniqueItems: true,
                        },
                        type: {
                          title: "type",
                          anyOf: [
                            {
                              $ref: "#/definitions/simpleTypes",
                            },
                            {
                              title: "arrayOfSimpleTypes",
                              type: "array",
                              items: {
                                $ref: "#/definitions/simpleTypes",
                              },
                              minItems: 1,
                              uniqueItems: true,
                            },
                          ],
                        },
                        format: {
                          title: "format",
                          type: "string",
                        },
                        contentMediaType: {
                          title: "contentMediaType",
                          type: "string",
                        },
                        contentEncoding: {
                          title: "contentEncoding",
                          type: "string",
                        },
                        if: {
                          $ref: "#",
                        },
                        then: {
                          $ref: "#",
                        },
                        else: {
                          $ref: "#",
                        },
                        allOf: {
                          $ref: "#/definitions/schemaArray",
                        },
                        anyOf: {
                          $ref: "#/definitions/schemaArray",
                        },
                        oneOf: {
                          $ref: "#/definitions/schemaArray",
                        },
                        not: {
                          $ref: "#",
                        },
                      },
                    },
                    schemaArray: {
                      title: "schemaArray",
                      type: "array",
                      minItems: 1,
                      items: {
                        $ref: "#",
                      },
                    },
                    nonNegativeInteger: {
                      title: "nonNegativeInteger",
                      type: "integer",
                      minimum: 0,
                    },
                    nonNegativeIntegerDefault0: {
                      title: "nonNegativeIntegerDefaultZero",
                      type: "integer",
                      minimum: 0,
                      default: 0,
                    },
                    simpleTypes: {
                      title: "simpleTypes",
                      type: "string",
                      enum: ["array", "boolean", "integer", "null", "number", "object", "string"],
                    },
                    stringArray: {
                      title: "stringArray",
                      type: "array",
                      items: {
                        type: "string",
                      },
                      uniqueItems: true,
                      default: [],
                    },
                  },
                },
              },
            ],
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
