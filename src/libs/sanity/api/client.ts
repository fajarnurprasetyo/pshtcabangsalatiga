import Env from "@/libs/env";
import { createClient } from "next-sanity";
import options from "../options";

export default createClient({
  ...options,
  token: Env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
