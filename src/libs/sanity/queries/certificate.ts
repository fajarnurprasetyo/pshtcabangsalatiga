import { CertificateQueryResult } from "@/generated/types/sanity";
import { groq } from "next-sanity";
import client from "./client";

export const CertificateQuery = groq`
*[_type == "certificate" && event._ref == $eventId][0]
{event->{_id, title, startDate, finishDate, fullDay}, image}
`;

export async function fetchCertificate(eventId: string) {
  return await client.fetch<CertificateQueryResult>(CertificateQuery, {
    eventId,
  });
}
