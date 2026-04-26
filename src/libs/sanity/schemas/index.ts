import { type SchemaTypeDefinition } from "sanity";
import certificate from "./documents/certificate";
import event from "./documents/event";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    // author,
    certificate,
    event,
    // post
  ],
};
