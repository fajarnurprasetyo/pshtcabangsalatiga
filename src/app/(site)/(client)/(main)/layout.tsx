import { NavbarBrandLink, NavbarLink } from "@/components/link";
import { UserRole } from "@/generated/prisma/enums";
import { authOptions } from "@/libs/next-auth";
import { Navbar, NavbarCollapse, NavbarToggle } from "flowbite-react";
import { getServerSession } from "next-auth";
import { type PropsWithChildren } from "react";
import Footer from "./footer";
import { NavbarUserAvatar, NavbarUserListItem } from "./header";

export default async function MainLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

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
            <NavbarUserAvatar session={session} />
          </div>
          <NavbarToggle />
        </div>

        <NavbarCollapse>
          {session?.user.roles.includes(UserRole.ADMIN) && (
            <NavbarLink href="/admin">Admin Panel</NavbarLink>
          )}
          <NavbarLink href="#" active>
            Beranda
          </NavbarLink>
          <NavbarLink href="#">Artikel</NavbarLink>
          <NavbarLink href="#">Seminar</NavbarLink>
          <NavbarLink href="#">Kompetisi</NavbarLink>
          <NavbarLink href="#">Tentang Kami</NavbarLink>
          <div className="visible md:hidden">
            <NavbarUserListItem session={session} />
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
