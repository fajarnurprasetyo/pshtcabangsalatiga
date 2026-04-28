import { NavbarBrandLink, NavbarLink } from "@/components/link";
import { Navbar, NavbarCollapse, NavbarToggle } from "flowbite-react";
import { type PropsWithChildren } from "react";
import Footer from "./footer";
import { NavbarUserAvatar, NavbarUserListItem } from "./header";

export default async function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar fluid className="sticky top-0 w-full z-50">
        <NavbarBrandLink href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            PSHT Cabang Salatiga
          </span>
        </NavbarBrandLink>

        <div className="flex md:order-2">
          <div className="hidden md:block">
            <NavbarUserAvatar />
          </div>
          <NavbarToggle />
        </div>

        <NavbarCollapse>
          <NavbarLink href="#" active>
            Beranda
          </NavbarLink>
          <NavbarLink href="#">Artikel</NavbarLink>
          <NavbarLink href="#">Seminar</NavbarLink>
          <NavbarLink href="#">Kompetisi</NavbarLink>
          <NavbarLink href="#">Tentang Kami</NavbarLink>
          <div className="visible md:hidden">
            <NavbarUserListItem />
          </div>
        </NavbarCollapse>
      </Navbar>
      <main className="flex flex-col w-full max-w-7xl px-2 py-4 sm:px-4 sm:py-6 self-center">
        {children}
      </main>
      <div className="flex-1" />
      <Footer />
    </>
  );
}
