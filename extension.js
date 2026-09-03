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
                                defaultValue:
                                    '{"id":"123","username":"Bunnycakes"},{"id":"456","username":"Cubes Studio"}'
                            },

                            VARIABLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "username"
                            }
                        }
                    }
                ]
            };
        }

        getJSONValue(args) {
            const input = String(args.JSON);
            const variable = String(args.VARIABLE);
            const results = [];

            /*
             * First try normal JSON.
             *
             * This supports:
             *
             * {
             *   "username": "Bunnycakes"
             * }
             *
             * and:
             *
             * [
             *   {"username":"Bunnycakes"},
             *   {"username":"Cubes Studio"}
             * ]
             */
            try {
                const json = JSON.parse(input);

                this.searchJSON(json, variable, results);

                return results.join(", ");
            } catch (error) {
                /*
                 * If normal JSON parsing fails, try the special
                 * multiple-object format:
                 *
                 * {"username":"Bunnycakes"},{"username":"Cubes Studio"}
                 */
                try {
                    const objects = this.extractObjects(input);

                    for (const object of objects) {
                        this.searchJSON(object, variable, results);
                    }

                    return results.join(", ");
                } catch (error2) {
                    return "";
                }
            }
        }

        /*
         * Recursively search objects and arrays for the requested
         * variable.
         */
        searchJSON(value, variable, results) {
            if (Array.isArray(value)) {
                for (const item of value) {
                    this.searchJSON(item, variable, results);
                }

                return;
            }

            if (value !== null && typeof value === "object") {
                for (const key of Object.keys(value)) {

                    if (key === variable) {
                        const found = value[key];

                        if (
                            found !== null &&
                            typeof found === "object"
                        ) {
                            results.push(JSON.stringify(found));
                        } else if (found === null) {
                            results.push("null");
                        } else {
                            results.push(String(found));
                        }
                    }

                    this.searchJSON(value[key], variable, results);
                }
            }
        }

        /*
         * Extract multiple JSON objects from a string like:
         *
         * {"id":"1","username":"Bunnycakes"},{"id":"2","username":"Cubes Studio"}
         *
         * This handles nested objects and strings containing braces.
         */
        extractObjects(input) {
            const objects = [];

            let depth = 0;
            let start = -1;
            let inString = false;
            let escaped = false;

            for (let i = 0; i < input.length; i++) {
                const char = input[i];

                if (inString) {
                    if (escaped) {
                        escaped = false;
                    } else if (char === "\\") {
                        escaped = true;
                    } else if (char === '"') {
                        inString = false;
                    }

                    continue;
                }

                if (char === '"') {
                    inString = true;
                    continue;
                }

                if (char === "{") {
                    if (depth === 0) {
                        start = i;
                    }

                    depth++;
                }

                if (char === "}") {
                    depth--;

                    if (depth === 0 && start !== -1) {
                        const objectText = input.slice(start, i + 1);

                        const object = JSON.parse(objectText);

                        objects.push(object);

                        start = -1;
                    }
                }
            }

            if (objects.length === 0) {
                throw new Error("No JSON objects found");
            }

            return objects;
        }
    }

    Scratch.extensions.register(new JSONValueExtension());

})(Scratch);
