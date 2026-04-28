"use client";

import { usePathname } from "next/navigation";

export default function useLoginUrl() {
  const pathname = usePathname();
  const callbackUrl = encodeURIComponent(pathname);
  return `/login?callbackUrl=${callbackUrl}`;
}
