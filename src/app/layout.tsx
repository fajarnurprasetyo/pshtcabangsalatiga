import AuthProvider from "@/components/providers/AuthProvider";
import DownloadCertificateModalProvider from "@/components/providers/DownloadCertificateModalProvider";
import { createTheme, ThemeProvider } from "flowbite-react";
import type { Metadata } from "next";
import { Suspense, type PropsWithChildren } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | PSHT Cabang Salatiga",
    default: "PSHT Cabang Salatiga",
  },
  description:
    "PSHT Cabang Salatiga merupakan organisasi pencak silat yang menjunjung tinggi nilai persaudaraan, pendidikan karakter, dan pembinaan bela diri bagi masyarakat di Salatiga.",
  keywords: [
    // Brand utama
    "PSHT Cabang Salatiga",
    "PSHT Salatiga",
    "Persaudaraan Setia Hati Terate Salatiga",
    "PSHT Cabang Salatiga Jawa Tengah",
    "PSHT Indonesia Salatiga",

    // Lokal SEO
    "pencak silat Salatiga",
    "perguruan silat Salatiga",
    "latihan PSHT Salatiga",
    "PSHT terdekat Salatiga",
    "organisasi silat Salatiga",
    "kegiatan PSHT Salatiga",

    // Intent (pencarian pengguna)
    "jadwal latihan PSHT Salatiga",
    "pendaftaran PSHT Salatiga",
    "syarat masuk PSHT",
    "cara daftar PSHT Salatiga",
    "kegiatan PSHT Cabang Salatiga",
    "sejarah PSHT",
    "makna PSHT",
    "seragam PSHT",
    "sabuk PSHT",

    // Long-tail SEO
    "pendaftaran anggota PSHT Cabang Salatiga 2026",
    "jadwal latihan pencak silat PSHT Salatiga terbaru",
    "cara daftar PSHT Salatiga online",
    "organisasi pencak silat resmi di Salatiga",
    "kegiatan PSHT Cabang Salatiga Jawa Tengah",
  ],
};

const rootTheme = createTheme({
  button: {
    base: "cursor-pointer",
  },
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="id" className="antialiased">
      <Suspense>
        <AuthProvider>
          <ThemeProvider theme={rootTheme}>
            <DownloadCertificateModalProvider>
              <body className="flex flex-col min-h-dvh">{children}</body>
            </DownloadCertificateModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </Suspense>
    </html>
  );
}
