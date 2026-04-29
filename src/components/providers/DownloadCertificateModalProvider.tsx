"use client";

import type { Event } from "@/generated/types/sanity";
import DownloadCertificateModalContext from "@/shared/DownloadCertificateModalContext";
import { Button, Modal, ModalBody, Spinner } from "flowbite-react";
import type { User } from "next-auth";
import { useState, type PropsWithChildren } from "react";
import { useBoolean } from "react-use";

export default function DownloadCertificateModalProvider({
  children,
}: PropsWithChildren) {
  const [showModal, setShowModal] = useBoolean(false);
  const [progressText, setProgressText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleDownload = async (
    user: User,
    event: Pick<Event, "_id" | "title">,
  ) => {
    if (showModal) return;

    setShowModal(true);
    setProgressText("Membuat sertifikat...");
    setErrorText(null);

    try {
      const url = `/api/event/${event._id}/certificate`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/pdf" },
      });

      if (!res.ok) throw new Error(await res.text());

      setProgressText("Mengunduh sertifikat...");
      const pdfBlob = await res.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${event.title ?? event._id} - ${user.name}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(pdfUrl);

      setShowModal(false);
    } catch (err) {
      setErrorText(
        err instanceof Error
          ? err.message
          : (err?.toString() ?? "Coba lagi nanti"),
      );
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <DownloadCertificateModalContext.Provider
      value={{ downloadCertificate: handleDownload }}
    >
      {children}
      <Modal show={showModal} onClose={handleCancel}>
        <ModalBody className="flex flex-col">
          {!errorText ? (
            <div className="flex gap-2">
              <Spinner size="sm" />
              <p>{progressText}</p>
            </div>
          ) : (
            <>
              <div className="mb-2">{errorText}</div>
              <Button
                size="sm"
                color="alternative"
                className="self-end"
                onClick={() => setShowModal(false)}
              >
                Tutup
              </Button>
            </>
          )}
        </ModalBody>
      </Modal>
    </DownloadCertificateModalContext.Provider>
  );
}
