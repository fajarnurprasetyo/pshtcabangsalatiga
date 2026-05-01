import { defineType } from "sanity";
import { postFields } from "./fields";

export default defineType({
  name: "article",
  type: "document",
  fields: postFields(),
});
