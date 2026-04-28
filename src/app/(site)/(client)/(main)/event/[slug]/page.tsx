import { authOptions } from "@/libs/next-auth";
import { fetchEventName } from "@/libs/sanity/queries/event";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { getEvent } from "./actions";
import EventView from "./event-view";

export interface SeminarPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: SeminarPageProps,
  // parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const title = await fetchEventName(slug);
  return { title };
}
export default async function SeminarPage(props: SeminarPageProps) {
  const event = await getEvent((await props.params).slug);
  if (!event) notFound();

  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <EventView session={session} event={event} />
    </div>
  );
}
