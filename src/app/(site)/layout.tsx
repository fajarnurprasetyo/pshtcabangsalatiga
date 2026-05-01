"use client";

import useLoginUrl from "@/hooks/useLoginUrl";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";
import {
  FaArrowRightFromBracket,
  FaArrowRightToBracket,
  FaFacebook,
  FaInstagram,
  FaSpinner,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";

export default function SiteLayout({ children }: PropsWithChildren) {
  const session = useSession();
  const loginUrl = useLoginUrl();

  return (
    <>
      <header className="sticky top-0 z-1000">
        <div className="flex items-center justify-between bg-black px-3 md:px-4 py-2 md:py-3">
          <Link href="/">
            <div className="relative w-[150px] h-[40px] md:w-[218px] md:h-[58px] bg-[url(/assets/images/logo_main.png)] bg-cover" />
          </Link>
          <button
            className="-me-1 size-8 md:size-10 flex items-center justify-center text-md md:text-xl text-white/70 hover:text-white transition-opacity"
            onClick={() => {
              switch (session.status) {
                case "unauthenticated":
                  redirect(loginUrl, "push");
                case "authenticated":
                  signOut({ redirect: false });
              }
            }}
          >
            {session.status === "loading" ? (
              <FaSpinner className="animate-spin" />
            ) : session.status === "authenticated" ? (
              <FaArrowRightFromBracket className="text-red-500" />
            ) : (
              <FaArrowRightToBracket />
            )}
          </button>
        </div>
        <div className="h-[3px] md:h-[5px] bg-primary" />
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="flex flex-col items-center bg-gray-800 text-gray-400">
        <div className="w-full max-w-7xl flex flex-col-reverse md:flex-row items-center justify-between px-3 md:px-4 py-2 md:py-3">
          <div className="text-xs">
            © 2026 PSHT Cabang Salatiga. All rights reserved.
          </div>
          <hr className="visible md:hidden mt-2 mb-1" />
          <div className="flex gap-6 text-lg md:text-xl">
            <a
              target="_blank"
              href="https://whatsapp.com/channel/0029VbCHXBwJUM2dyEg5rw2J"
            >
              <FaWhatsapp />
            </a>
            <a target="_blank" href="https://facebook.com/pshtcabangsalatiga">
              <FaFacebook />
            </a>
            <a target="_blank" href="https://instagram.com/pshtcabangsalatiga">
              <FaInstagram />
            </a>
            <a target="_blank" href="https://tiktok.com/@pshtcabangsalatiga">
              <FaTiktok />
            </a>
            <a target="_blank" href="https://youtube.com/@pshtcabangsalatiga">
              <FaYoutube />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
