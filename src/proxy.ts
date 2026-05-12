import {
  NextResponse
} from "next/server";
import { auth } from "./libs/auth";

const botRegEx =
  /facebookexternalhit|Facebot|Twitterbot|Slackbot|Discordbot|LinkedInBot|WhatsApp/i;

export default auth((req) => {
  const ua = req.headers.get("user-agent") || "";
  if (botRegEx.test(ua)) return NextResponse.next();
});
