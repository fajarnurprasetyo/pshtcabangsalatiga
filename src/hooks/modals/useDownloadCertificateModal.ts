import DownloadCertificateModalContext from "@/shared/DownloadCertificateModalContext";
import invariant from "invariant";
import { use } from "react";

export default function useDownloadCertificateModal() {
  const context = use(DownloadCertificateModalContext);
  invariant(context, "DownloadCertificateModalContext not provided.");
  return context;
}
