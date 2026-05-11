"use server";

import { fetchPicture, searchDataByNik, updateData } from "@/libs/google";
import { revalidateTag } from "next/cache";

export async function fetchData(nik: string) {
  // "use cache";
  // cacheTag(nik);

  const data = await searchDataByNik(nik);
  if (!data) return null;

  const photo = await fetchPicture(nik);
  console.log(!!photo);
  return { ...data, photo };
}

export type Data = Awaited<ReturnType<typeof fetchData>>;

export async function saveData(nik: string, data: Omit<Data, "nik">) {
  const success = await updateData(nik, data);
  if (success) revalidateTag(nik, "max");
  return success;
}
