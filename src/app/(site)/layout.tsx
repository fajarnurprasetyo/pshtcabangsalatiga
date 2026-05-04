"use server";

import { auth, signIn, signOut } from "@/libs/auth";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import Link from "next/link";
import { type PropsWithChildren } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import {
  HiArrowRightEndOnRectangle,
  HiArrowRightStartOnRectangle,
  HiCog6Tooth,
} from "react-icons/hi2";

export default async function SiteLayout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <>
      <header className="top-0 z-10 sticky">
        <div className="flex justify-between items-center bg-black px-3 md:px-4 py-2 md:py-3">
          <Link href="/">
            <div className="relative bg-[url(/assets/images/logo_main.png)] bg-cover w-[150px] md:w-[218px] h-[40px] md:h-[58px]" />
          </Link>
          {session ? (
            <Dropdown
              inline
              arrowIcon={false}
              label={
                <Avatar
                  rounded
                  className="cursor-pointer"
                  img={session.user.image ?? undefined}
                />
              }
            >
              <DropdownHeader>
                <span className="block text-sm">{session.user.name}</span>
                <span className="block font-medium text-sm truncate">
                  {session.user.username || session.user.email}
                </span>
              </DropdownHeader>
              <DropdownItem href="/user-profile">
                <HiCog6Tooth className="mr-2" />
                Pengaturan Profil
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                onClick={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <HiArrowRightStartOnRectangle className="mr-2" />
                Keluar
              </DropdownItem>
            </Dropdown>
          ) : (
            <Button
              className="px-3 md:px-5 focus:ring-0 h-9 md:h-12 text-xs md:text-base"
              onClick={async () => {
                "use server";
                await signIn();
              }}
            >
              <HiArrowRightEndOnRectangle className="mr-2" />
              Masuk
            </Button>
          )}
        </div>
        <div className="bg-primary-700 h-0.75 md:h-1.25" />
      </header>
      <main className="flex flex-col flex-1 bg-gray-100">{children}</main>
      <footer className="flex md:flex-row flex-col-reverse justify-between items-center bg-gray-800 px-3 md:px-4 py-2 md:py-3 w-full text-gray-400">
        <div className="text-xs">
          © 2026 PSHT Cabang Salatiga. All rights reserved.
        </div>
        <hr className="md:hidden visible mt-2 mb-1 w-full" />
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
