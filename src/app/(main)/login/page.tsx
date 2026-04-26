import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./form";

export default async function LoginPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getServerSession();
  if (session) redirect("/");

  const searchParams = await props.searchParams;
  return <LoginForm callbackUrl={searchParams.callbackUrl} />;
}
