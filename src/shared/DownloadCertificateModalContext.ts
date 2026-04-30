import type { Event } from "@/generated/types/sanity";
import type { User } from "next-auth";
import { createContext } from "react";

export interface DownloadCertificateModalContextValue {
  downloadCertificate(user: User, event: Pick<Event, "_id" | "title">): void;
}

const DownloadCertificateModalContext =
  createContext<DownloadCertificateModalContextValue | null>(null);

export default DownloadCertificateModalContext;
