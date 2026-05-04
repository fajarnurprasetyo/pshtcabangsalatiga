"use client";

import config from "@/sanity/config";
import dynamic from "next/dynamic";

const Studio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false },
);

export default function SanityStudio() {
  return <Studio config={config} />;
}
