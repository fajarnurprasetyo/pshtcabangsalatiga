"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "@/libs/sanity/env";
import { schema } from "./src/libs/sanity/schemas";
import { structure } from "./src/libs/sanity/structure";

export default defineConfig({
  basePath: "/studio/sanity",
  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema,
});
