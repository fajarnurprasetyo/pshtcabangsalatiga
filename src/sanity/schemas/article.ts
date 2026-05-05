import { defineType } from "sanity";
import { postFields } from "./post";

export default defineType({
  name: "article",
  type: "document",
  fields: postFields(),
});
