"use client";

import { LinkButton, NavbarLink } from "@/components/link";
import useLoginUrl from "@/libs/hooks/useLoginUrl";
import useSession from "@/libs/hooks/useSession";
import type { PropsWithNullableSession } from "@/types/react";
import { Avatar, Dropdown, DropdownHeader, DropdownItem } from "flowbite-react";
import { signOut } from "next-auth/react";
import {
  FaArrowRightFromBracket,
  FaArrowRightToBracket,
} from "react-icons/fa6";

export function NavbarUserAvatar(props: PropsWithNullableSession) {
  const { data: session } = useSession(props.session);
  const loginUrl = useLoginUrl();

  return session ? (
    <Dropdown
      inline
      arrowIcon={false}
      label={<Avatar rounded className="cursor-pointer" />}
    >
      <DropdownHeader>
        <span className="block text-sm font-semibold">{session.user.name}</span>
      </DropdownHeader>
      <DropdownItem onClick={() => signOut({ redirect: false })}>
        Keluar
      </DropdownItem>
    </Dropdown>
  ) : (
    <LinkButton href={loginUrl}>
      <FaArrowRightToBracket className="mr-2" />
      Masuk
    </LinkButton>
  );
}

export function NavbarUserListItem(props: PropsWithNullableSession) {
  const { data: session } = useSession(props.session);
  const loginUrl = useLoginUrl();

  return session ? (
    <NavbarLink className="flex items-center" onClick={() => signOut()}>
      <FaArrowRightToBracket className="mr-2" />
      Keluar
    </NavbarLink>
  ) : (
    <NavbarLink href={loginUrl} className="flex items-center">
      <FaArrowRightFromBracket className="mr-2" />
      Masuk
    </NavbarLink>
  );
}
