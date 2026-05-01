import { defineField, defineType } from "sanity";
import LocationInput from "../components/LocationInput";
import { postFields } from "./fields";

export default defineType({
  name: "event",
  type: "document",
  fields: [
    defineField({
      name: "type",
      type: "string",
      title: "Event Type",
      options: {
        list: [
          { title: "Seminar", value: "seminar" },
          { title: "Competition", value: "competition" },
        ],
        layout: "radio",
      },
      initialValue: "seminar",
      validation: (rule) => rule.required(),
    }),
    ...postFields([
      defineField({
        name: "startDate",
        type: "datetime",
        title: "Start Date",
        initialValue: () => new Date().toISOString(),
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "finishDate",
        type: "datetime",
        title: "Finish Date",
      }),
      defineField({
        name: "fullDay",
        type: "boolean",
        title: "Full Day",
        initialValue: false,
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "location",
        type: "object",
        title: "Location",
        // validation: (rule) => rule.required(),
        components: { input: LocationInput },
        fields: [
          {
            name: "geo",
            type: "geopoint",
            title: "Coordinates",
          },
          {
            name: "placeName",
            type: "string",
            title: "Place Name",
          },
          {
            name: "address",
            type: "string",
            title: "Address",
          },
        ],
      }),
    ]),
  ],
});
