import { createClient } from "next-sanity";
import options from "../options";

export default createClient({
  ...options,
  // Set to false if statically generating pages, using ISR or tag-based revalidation
  useCdn: true,
});
