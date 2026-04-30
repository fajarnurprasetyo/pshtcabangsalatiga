import type { NextStudioLayoutProps } from "next-sanity/studio";

export { metadata, viewport } from "next-sanity/studio";

export default function SanityStudioLayout({
  children,
}: NextStudioLayoutProps) {
  return children;
}
