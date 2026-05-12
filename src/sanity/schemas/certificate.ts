import { apiVersion } from "@/sanity/env";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "certificate",
  type: "document",
  fields: [
    defineField({
      type: "reference",
      name: "event",
      to: [{ type: "event" }],
      validation: (rule) =>
        rule.custom(async (eventRef, context) => {
          if (!eventRef) return "Required";

          const { getClient, document } = context;
          const client = getClient({ apiVersion });

          const existing = await client.fetch(
            `count(*[_type == "certificate" && event._ref == $eventId && _id != $currentId && _id != "drafts." + $currentId])`,
            {
              eventId: eventRef._ref,
              currentId: document?._id.replace(/^drafts\./, ""),
            },
          );

          if (existing > 0) {
            return "Event already has certificate";
          }

          return true;
        }),
    }),
    defineField({
      type: "image",
      name: "image",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "event.title" },
  },
});
