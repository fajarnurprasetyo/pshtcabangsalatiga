import config from "@/libs/sanity/config";
import { NextStudio } from "next-sanity/studio";

export const dynamic = "force-dynamic";

export default function SanityStudioPage() {
  return <NextStudio config={config} />;
}
