import { Container } from "@/components/Container";
import { Suspense } from "react";
import { getEvents } from "./actions";
import EventList from "./event-list";

export default async function HomePage() {
  return (
    <Container>
      <Suspense fallback="LOADING...">
        <EventList events={getEvents("seminar")} />
      </Suspense>
    </Container>
  );
}
