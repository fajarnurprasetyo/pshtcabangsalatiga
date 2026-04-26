"use client";

import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { Button, Popover } from "flowbite-react";
import { signOut } from "next-auth/react";
import type { PropsWithChildren } from "react";

export type UserPopoverProps = PropsWithChildren<{
  session: unknown;
}>;

export default function UserPopover({ children }: UserPopoverProps) {
  return (
    <Popover
      content={
        <div className="p-3">
          <Button onClick={() => signOut()} color="red">
            <ArrowRightStartOnRectangleIcon className="mr-2 w-6 h-6" />
            Keluar
          </Button>
        </div>
      }
    >
      {children}
    </Popover>
  );
}
