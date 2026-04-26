"use client";

import { NavbarLink, type NavbarLinkProps } from "flowbite-react";
import { signOut } from "next-auth/react";
import type React from "react";

export type NavbarSignOut = NavbarLinkProps &
  React.RefAttributes<HTMLLIElement>;

export function NavbarSignOut({ onClick, ...props }: NavbarSignOut) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      signOut();
    }
  };

  return <NavbarLink {...props} onClick={handleClick} />;
}
