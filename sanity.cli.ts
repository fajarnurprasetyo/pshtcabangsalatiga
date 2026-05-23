import { defineCliConfig } from "sanity/cli";
import options from "./src/sanity/options";

const BASE_PATH = "./src/sanity";
const SCHEMA_PATH = `${BASE_PATH}/types.json`;
const TYPES_PATH = `${BASE_PATH}/types.d.ts`;

export default defineCliConfig({
  api: options,
  schemaExtraction: {
    path: SCHEMA_PATH,
  },
  typegen: {
    schema: SCHEMA_PATH,
    generates: TYPES_PATH,
  },
});
