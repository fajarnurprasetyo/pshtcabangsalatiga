import { type SchemaTypeDefinition } from "sanity";
import certificate from "./certificate";
import event from "./event";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // author,
    // post
    certificate,
    event,
  ],
};
