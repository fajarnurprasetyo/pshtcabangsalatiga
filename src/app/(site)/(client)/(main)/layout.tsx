"use client";

import useLoginUrl from "@/hooks/useLoginUrl";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
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

export default function MainLayout({ children }: PropsWithChildren) {
  const session = useSession();
  const loginUrl = useLoginUrl();

  return (
    <>
      <header className="sticky top-0 z-1000">
        <div className="flex items-center justify-between bg-black px-3 md:px-4 py-2 md:py-3">
          <Link
            href="/"
            className="relative w-[128px] h-[34px] md:w-[240px] md:h-[64px]"
          >
            <Image
              alt="Main logo"
              src="/assets/images/logo_main.png"
              fill
              objectFit="object-contain"
            />
          </Link>
          <button
            className="-me-1 size-8 md:size-12 flex items-center justify-center text-xl md:text-3xl text-white/70 hover:text-white transition-opacity"
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
              <FaArrowRightFromBracket />
            ) : (
              <FaArrowRightToBracket />
            )}
          </button>
        </div>
        <div className="h-[3px] md:h-[5px] bg-blue-700" />
      </header>
      <main className="flex flex-1 flex-col w-full max-w-7xl px-2 py-4 sm:px-4 sm:py-6 self-center">
        {children}
      </main>
      <footer className="flex flex-col-reverse md:flex-row items-center justify-between bg-gray-800 text-gray-400 px-3 md:px-4 pt-2 pb-3 md:py-3">
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
      </footer>
    </>
  );
}
