import { NextResponse, type NextRequest } from "next/server";

const botRegEx =
  /facebookexternalhit|Facebot|Twitterbot|Slackbot|Discordbot|LinkedInBot|WhatsApp/i;

export default function proxy(req: NextRequest) {
  return NextResponse.next();
}
