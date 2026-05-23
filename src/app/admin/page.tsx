import { LinkButton } from "@/components/link";
import { HR } from "flowbite-react";

export default async function AdminPage() {
  return (
    <div className="flex justify-center items-center h-dvh">
      <div className="flex flex-col items-stretch gap-2 w-full max-w-sm">
        <h1 className="font-semibold text-3xl text-center select-none">
          Admin Panel
        </h1>
        <HR className="my-2" />
        <LinkButton href="/admin/data-cawar/">Data Cawar</LinkButton>
      </div>
    </div>
  );
}
