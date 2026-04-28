import { defineField, defineType } from "sanity";
import { apiVersion } from "../../env";

export default defineType({
  name: "certificate",
  type: "document",
  title: "Certificate",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "event",
      type: "reference",
      to: [{ type: "event" }],
      title: "Event",
      validation: (rule) =>
        rule.required().custom(async (eventRef, context) => {
          const { getClient } = context;
          const client = getClient({ apiVersion });

          const existing = await client.fetch(
            `count(*[_type == "certificate" && event._ref == $id])`,
            { id: eventRef?._ref },
          );

          if (existing > 0) {
            return "Event already has certificate";
          }

          return true;
        }),
    }),
  ],
});
