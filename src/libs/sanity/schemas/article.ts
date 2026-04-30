import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  type: "document",
  title: "Article",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      title: "Slug",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "thumbnail",
      type: "image",
      title: "Thumbnail",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      type: "datetime",
      title: "Publish Date",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      of: [{ type: "block" }],
    }),
  ],
});
