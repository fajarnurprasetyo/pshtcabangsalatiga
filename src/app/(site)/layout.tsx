"use client";

import useLoginUrl from "@/hooks/useLoginUrl";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const session = useSession();
  const loginUrl = useLoginUrl();

  return (
    <>
      <header className="top-0 z-1000 sticky">
        <div className="flex justify-between items-center bg-black px-3 md:px-4 py-2 md:py-3">
          <Link href="/">
            <div className="relative bg-[url(/assets/images/logo_main.png)] bg-cover w-[150px] md:w-[218px] h-[40px] md:h-[58px]" />
          </Link>
          <button
            className="flex justify-center items-center -me-1 size-8 md:size-10 text-md text-white/70 hover:text-white md:text-xl transition-opacity"
            onClick={() => {
              if (session.status === "unauthenticated") {
                router.push(loginUrl);
              } else if (session.status === "authenticated") {
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
        <div className="bg-primary h-[3px] md:h-[5px]" />
      </header>
      <main className="flex flex-col flex-1">{children}</main>
      <footer className="flex flex-col items-center bg-gray-800 text-gray-400">
        <div className="flex md:flex-row flex-col-reverse justify-between items-center px-3 md:px-4 py-2 md:py-3 w-full max-w-7xl">
          <div className="text-xs">
            © 2026 PSHT Cabang Salatiga. All rights reserved.
          </div>
          <hr className="md:hidden visible mt-2 mb-1" />
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
