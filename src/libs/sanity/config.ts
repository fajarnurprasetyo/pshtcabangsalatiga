"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { googleMapsInput } from "@sanity/google-maps-input";
import { googleMapsApiKey } from "./env";
import options from "./options";
import { schema } from "./schemas";
import { structure } from "./structure";

export default defineConfig({
  basePath: "/admin/sanity-studio",
  ...options,

  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: options.apiVersion }),
    googleMapsInput({
      apiKey: googleMapsApiKey,
      defaultZoom: 14,
      defaultRadiusZoom: 15,
      defaultLocation: { lat: -7.3304082, lng: 110.499305 },
      defaultRadius: 1000,
    }),
  ],

  schema,
});
