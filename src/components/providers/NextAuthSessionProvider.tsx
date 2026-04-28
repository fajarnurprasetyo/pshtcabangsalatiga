"use client";

import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export default function NextAuthSessionProvider({
  children,
}: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
