import { LinkButton, NavbarBrandLink, NavbarLink } from "@/components/link";
import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Avatar, Navbar, NavbarCollapse, NavbarToggle } from "flowbite-react";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import {
  EventsSection,
  EventsSectionPlaceholder,
} from "./(components)/events-section";
import { NavbarSignOut } from "./(components)/signout";
import UserPopover from "./(components)/user-popover";

export default async function HomePage() {
  const session = await getServerSession();

  return (
    <>
      <Navbar fluid rounded>
        <NavbarBrandLink href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            PSHT Cabang Salatiga
          </span>
        </NavbarBrandLink>
        <div className="flex md:order-2">
          <div className="hidden md:block">
            {session ? (
              <UserPopover session={session}>
                <Avatar rounded className="cursor-pointer" />
              </UserPopover>
            ) : (
              <LinkButton href="/login">
                <ArrowRightEndOnRectangleIcon className="mr-2 w-6 h-6" />
                Masuk
              </LinkButton>
            )}
          </div>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="#" active>
            Beranda
          </NavbarLink>
          <NavbarLink href="#">Artikel</NavbarLink>
          <NavbarLink href="#">Kegiatan</NavbarLink>
          <NavbarLink href="#">Tentang Kami</NavbarLink>
          <div className="visible md:hidden">
            {session ? (
              <NavbarSignOut className="flex items-center">
                <ArrowRightStartOnRectangleIcon className="mr-2 w-5 h-5" />
                Keluar
              </NavbarSignOut>
            ) : (
              <NavbarLink href="/login" className="flex items-center">
                <ArrowRightEndOnRectangleIcon className="mr-2 w-5 h-5" />
                Masuk
              </NavbarLink>
            )}
          </div>
        </NavbarCollapse>
      </Navbar>
      <div className="flex flex-col w-full max-w-6xl self-center">
        <Suspense fallback={<EventsSectionPlaceholder />}>
          <EventsSection session={session} />
        </Suspense>
      </div>
    </>
  );
}
