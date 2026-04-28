"use client";

import { usePathname } from "next/navigation";
import { cache } from "react";

const useLoginUrl = cache(() => {
  const pathname = usePathname();
  const callbackUrl = encodeURIComponent(pathname);
  return `/login?callbackUrl=${callbackUrl}`;
});

export default useLoginUrl;
