/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from "sanity/cli";
import options from "./src/libs/sanity/options";

const BASE_PATH = "./src/generated/types";
const SCHEMA_PATH = `${BASE_PATH}/sanity.json`;
const TYPES_PATH = `${BASE_PATH}/sanity.d.ts`;

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
