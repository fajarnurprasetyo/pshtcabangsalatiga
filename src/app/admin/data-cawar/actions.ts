"use server";

import { fetchPicture, fetchRows, searchDataByNik } from "@/libs/google";
import { cacheTag } from "next/cache";

export async function getRows() {
  "use cache";
  cacheTag("data-cawar");

  const rows = await fetchRows([
    "rantingKomisariat",
    "namaLengkap",
    "nik",
    "active",
  ]);

  return rows.filter((row) => row.active);
}

export type Rows = Awaited<ReturnType<typeof getRows>>;

export async function getData(nik: string | null) {
  "use cache";
  if (!nik) return null;
  cacheTag(`data-cawar:${nik}`);

  const photo = await fetchPicture(nik);
  const data = await searchDataByNik(nik);
  return { photo, ...data };
}

export type Data = Awaited<ReturnType<typeof getData>>;
