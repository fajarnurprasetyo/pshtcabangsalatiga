import { auth } from "@/libs/auth";
import { cache } from "react";

export const getSession = cache(auth);
