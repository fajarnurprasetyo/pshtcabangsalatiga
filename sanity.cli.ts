/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import options from "@/sanity/options";
import { defineCliConfig } from "sanity/cli";

const BASE_PATH = "@/sanity";
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
