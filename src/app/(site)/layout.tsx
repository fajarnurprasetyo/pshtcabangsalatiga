import NextAuthSessionProvider from "@/components/providers/NextAuthSessionProvider";
import type { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
