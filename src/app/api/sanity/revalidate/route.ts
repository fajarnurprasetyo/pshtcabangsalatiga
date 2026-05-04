import Env from "@/libs/env";
import prisma from "@/libs/prisma";
import crypto from "crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

function normalizeBase64(base64: string) {
  return base64.replace(/=+$/, "");
}

function verifySignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const parts = signature.split(",");

  const timestamp = parts.find((p) => p.startsWith("t="))?.split("=")[1];
  const sig = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

  if (!timestamp || !sig) return false;

  const payload = `${timestamp}.${rawBody}`;

  const expected = crypto
    .createHmac("sha256", Env.SANITY_WEBHOOK_SECRET)
    .update(payload)
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(normalizeBase64(expected)),
    Buffer.from(normalizeBase64(sig)),
  );
}

function isPostType(type: string) {
  return /^article|event$/.test(type);
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("sanity-webhook-signature");
  const isValid = verifySignature(rawBody, signature);

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  const operation = req.headers.get("sanity-operation");
  const { _id, _type } = JSON.parse(rawBody);

  switch (operation) {
    case "create":
      if (isPostType(_type)) {
        await prisma.postView.create({ data: { postId: _id } });
      }
      revalidateTag(_type, "max");
      break;
    case "update":
      revalidateTag(`${_type}:${_id}`, "max");
      break;
    case "delete":
      if (isPostType(_type)) {
        await prisma.postView.delete({ where: { postId: _id } });
        await prisma.postLike.deleteMany({ where: { postId: _id } });
      }
      revalidateTag(_type, "max");
      break;
  }

  return NextResponse.json({ ok: true });
}
