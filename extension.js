(function (Scratch) {
    "use strict";

    class JSONValueExtension {
        getInfo() {
            return {
                id: "jsonvalue",
                name: "JSON Value",
                color1: "#4C97FF",
                color2: "#3373CC",
                color3: "#2E5DA8",

                blocks: [
                    {
                        opcode: "getJSONValue",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Get value of JSON [JSON] [VARIABLE]",
                        arguments: {
                            JSON: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"name":"Skye","age":15}'
                            },
                            VARIABLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "name"
                            }
                        }
                    }
                ]
            };
        }

        getJSONValue(args) {
            try {
                const json = JSON.parse(args.JSON);
                const variable = String(args.VARIABLE);

                // Only access normal object properties
                if (
                    json !== null &&
                    typeof json === "object" &&
                    Object.prototype.hasOwnProperty.call(json, variable)
                ) {
                    const value = json[variable];

                    // Convert objects/arrays back into JSON
                    if (typeof value === "object" && value !== null) {
                        return JSON.stringify(value);
                    }

                    // Convert other values to Scratch-friendly strings
                    if (value === null) {
                        return "null";
                    }

                    return String(value);
                }

                return "";
            } catch (error) {
                return "";
            }
        }
    }

    Scratch.extensions.register(new JSONValueExtension());
})(Scratch);
