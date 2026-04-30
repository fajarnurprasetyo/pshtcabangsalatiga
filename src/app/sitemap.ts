import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://pshtcabangsalatiga.or.id",
      lastModified: new Date(),
    },
  ];
}