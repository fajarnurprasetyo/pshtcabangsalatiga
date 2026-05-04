import { Container } from "@/components/Container";
import { auth, signIn } from "@/libs/auth";
import { Button, Tooltip } from "flowbite-react";
import Image from "next/image";
import { HiArrowUpTray, HiUser } from "react-icons/hi2";
import Form from "./form";

export default async function UserProfilePage() {
  const session = await auth();
  if (!session) return await signIn();

  const user = session.user;

  return (
    <Container className="md:flex-row-reverse gap-8 md:gap-20 md:px-12 xl:px-16">
      <div className="flex flex-col items-center gap-4 md:gap-8">
        <div className="relative self-center bg-gray-200 rounded-full w-50 md:w-70 aspect-square overflow-hidden">
          {user.image ? (
            <Image fill alt="Foto profil" src={user.image} />
          ) : (
            <HiUser className="absolute inset-0 m-auto w-[90%] h-[90%] text-gray-400 translate-y-1/7" />
          )}
        </div>
        <Tooltip placement="bottom" content="Fitur belum tersedia">
          <Button disabled>
            <HiArrowUpTray className="mr-2" />
            Unggah foto
          </Button>
        </Tooltip>
      </div>

      <Form user={user} />
    </Container>
  );
}
