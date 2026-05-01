import config from "@/sanity/config";
import { NextStudio } from "next-sanity/studio";

export { metadata, viewport } from "next-sanity/studio";

export default function SanityStudioPage() {
  return <NextStudio config={config} />;
}
