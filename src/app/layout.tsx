import DownloadCertificateModalProvider from "@/components/providers/DownloadCertificateModalProvider";
import NextAuthSessionProvider from "@/components/providers/NextAuthSessionProvider";
import { Geist, Geist_Mono } from "next/font/google";
import type { PropsWithChildren } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <NextAuthSessionProvider>
        <DownloadCertificateModalProvider>
          <body className="min-h-[100dvh] flex flex-col">{children}</body>
        </DownloadCertificateModalProvider>
      </NextAuthSessionProvider>
    </html>
  );
}
