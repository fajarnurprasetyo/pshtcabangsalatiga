"use client";

import {
  Button,
  NavbarLink as FlowbiteNavbarLink,
  NavbarBrand,
  type ButtonProps,
  type NavbarBrandProps,
  type NavbarLinkProps,
} from "flowbite-react";
import Link from "next/link";
import type { RefAttributes } from "react";

export function NavbarBrandLink(props: NavbarBrandProps) {
  return <NavbarBrand as={Link} {...props} />;
}

export function NavbarLink(
  props: NavbarLinkProps & RefAttributes<HTMLLIElement>,
) {
  return <FlowbiteNavbarLink as={props.href ? Link : undefined} {...props} />;
}

export function LinkButton(props: ButtonProps) {
  return <Button as={props.href ? Link : undefined} {...props} />;
}
