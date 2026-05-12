import options from "@/sanity/options";
import { createClient } from "next-sanity";

export default createClient({
  ...options,
  // Set to false if statically generating pages, using ISR or tag-based revalidation
  useCdn: true,
});
