import AuthProvider from "@/components/providers/AuthProvider";
import DownloadCertificateModalProvider from "@/components/providers/DownloadCertificateModalProvider";
import { createTheme, ThemeProvider } from "flowbite-react";
import { Suspense, type PropsWithChildren } from "react";
import "./globals.css";

const rootTheme = createTheme({
  button: {
    base: "cursor-pointer",
  },
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="id" className="antialiased">
      <Suspense fallback={null}>
        <AuthProvider>
          <ThemeProvider theme={rootTheme}>
            <DownloadCertificateModalProvider>
              <body className="flex flex-col min-h-[100dvh]">{children}</body>
            </DownloadCertificateModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </Suspense>
    </html>
  );
}
