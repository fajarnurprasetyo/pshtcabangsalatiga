"use client";

import { LinkButton, NavbarLink } from "@/components/link";
import { Avatar, Dropdown, DropdownHeader, DropdownItem } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  FaArrowRightFromBracket,
  FaArrowRightToBracket,
  FaSpinner,
} from "react-icons/fa6";

function useLoginUrl() {
  const pathname = usePathname();
  return `/login?callbackUrl=${encodeURIComponent(pathname)}`;
}

export function NavbarUserAvatar() {
  const session = useSession();
  const loginUrl = useLoginUrl();

  switch (session.status) {
    case "authenticated":
      return (
        <Dropdown
          inline
          arrowIcon={false}
          label={<Avatar rounded className="cursor-pointer" />}
        >
          <DropdownHeader>
            <span className="block text-sm">{session.data.user.name}</span>
          </DropdownHeader>
          <DropdownItem onClick={() => signOut({ redirect: false })}>
            Keluar
          </DropdownItem>
        </Dropdown>
      );
    default:
      return (
        <LinkButton href={loginUrl}>
          <FaArrowRightToBracket className="mr-2" />
          Masuk
        </LinkButton>
      );
  }
}

export function NavbarUserListItem() {
  const session = useSession();
  const loginUrl = useLoginUrl();

  switch (session.status) {
    case "loading":
      return (
        <NavbarLink disabled>
          <FaSpinner className="animate-spin" />
        </NavbarLink>
      );
    case "unauthenticated":
      return (
        <NavbarLink href={loginUrl} className="flex items-center">
          <FaArrowRightFromBracket className="mr-2" />
          Masuk
        </NavbarLink>
      );
    default:
      return (
        <NavbarLink className="flex items-center" onClick={() => signOut()}>
          <FaArrowRightToBracket className="mr-2" />
          Keluar
        </NavbarLink>
      );
  }
}
