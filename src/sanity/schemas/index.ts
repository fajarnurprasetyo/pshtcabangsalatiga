import { type SchemaTypeDefinition } from "sanity";
import article from "./article";
import certificate from "./certificate";
import event from "./event";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // author
    article,
    certificate,
    event,
  ],
};
