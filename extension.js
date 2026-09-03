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
                                defaultValue: '{"name":"FirstVarInJson","name":"SecVarInJson"}'
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
                const results = [];

                function search(value) {
                    // Search through arrays
                    if (Array.isArray(value)) {
                        for (const item of value) {
                            search(item);
                        }
                        return;
                    }

                    // Search through objects
                    if (value !== null && typeof value === "object") {
                        for (const key of Object.keys(value)) {

                            // Found the requested variable
                            if (key === variable) {
                                const found = value[key];

                                if (
                                    typeof found === "object" &&
                                    found !== null
                                ) {
                                    results.push(JSON.stringify(found));
                                } else if (found === null) {
                                    results.push("null");
                                } else {
                                    results.push(String(found));
                                }
                            }

                            // Continue searching nested objects
                            search(value[key]);
                        }
                    }
                }

                search(json);

                // Multiple matches are separated by ", "
                return results.join(", ");

            } catch (error) {
                // Invalid JSON
                return "";
            }
        }
    }

    Scratch.extensions.register(new JSONValueExtension());

})(Scratch);
