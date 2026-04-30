import NextAuthSessionProvider from "@/components/providers/NextAuthSessionProvider";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "PSHT Cabang Salatiga",
  description:
    "Mendidik manusia berbudi luhur, tahu benar dan salah 🤝\nSALAM PERSAUDARAAN!",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
