import type { Metadata } from "next";
import Form from "./form";

export const metadata: Metadata = {
  title: "Cek Data Cawar",
};

export default function CheckPage() {
  return <Form />;
}
