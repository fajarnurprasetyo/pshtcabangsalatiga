import { defineField, type FieldDefinition } from "sanity";

export function postFields(insert: FieldDefinition[] = [], index: number = 4) {
  const fields = [
    defineField({
      type: "string",
      name: "title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "image",
      name: "thumbnail",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "datetime",
      name: "date",
      title: "Publish Date",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "array",
      name: "content",
      of: [{ type: "block" }],
    }),
  ];

  return [...fields.slice(0, index), ...insert, ...fields.slice(index)];
}
