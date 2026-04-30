import type { User } from "next-auth";
import { createContext } from "react";

export interface DownloadCertificateModalContextValue {
  downloadCertificate(
    user: User,
    eventId: string,
    eventTitle: string | null,
  ): void;
}

const DownloadCertificateModalContext =
  createContext<DownloadCertificateModalContextValue | null>(null);

export default DownloadCertificateModalContext;
