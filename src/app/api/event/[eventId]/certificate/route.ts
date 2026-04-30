import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { urlFor } from "@/libs/sanity/image";
import { fetchCertificate } from "@/libs/sanity/queries/certificate";
import { createCanvas, loadImage, registerFont } from "canvas";
import dayjs from "dayjs";
import { getServerSession, type Session } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import path from "path";

registerFont(path.join(process.cwd(), "public/assets/fonts/arial-bold.ttf"), {
  family: "Arial",
  weight: "bold",
});

const WIDTH = 1754;
const HEIGHT = 1240;

async function isAuthorized(session: Session, eventId: string) {
  const userId = session.user.id;

  const participated = await prisma.participant.findUnique({
    where: { userId_postId: { userId, postId: eventId } },
  });

  return !!participated;
}

async function generatePdf(session: Session, eventId: string) {
  const certificate = await fetchCertificate(eventId);
  if (!certificate?.event || !certificate?.image)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  const event = certificate.event;

  const finishDate = dayjs(event.finishDate ?? event.startDate);
  const eventPassed =
    finishDate.isValid() &&
    (event.fullDay
      ? dayjs().startOf("day").isAfter(finishDate.startOf("day"))
      : dayjs().isAfter(finishDate));

  if (!eventPassed) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const name = session.user.name!;
  const canvas = createCanvas(WIDTH, HEIGHT, "pdf");
  const ctx = canvas.getContext("2d");

  const bgImageUrl = urlFor(certificate.image).url();
  const bgImage = await loadImage(bgImageUrl);
  ctx.drawImage(bgImage, 0, 0, WIDTH, HEIGHT);

  ctx.font = "Bold 72px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "#181818";
  ctx.fillText(name, WIDTH / 2, 552);

  const title = `Sertifikat ${event.title || eventId} - ${name}`;
  const pdfStream = canvas.createPDFStream({
    title,
    author: "PSHT Cabang Salatiga",
    creationDate: finishDate.toDate(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new NextResponse(pdfStream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${title}.pdf`,
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const eventId = (await params).eventId;
  const session = await getServerSession(authOptions);

  if (!session || !(await isAuthorized(session, eventId))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!req.headers.get("Content-Type")?.includes("application/pdf")) {
    return NextResponse.json(
      { message: "Invalid Content-Type" },
      { status: 400 },
    );
  }

  try {
    return await generatePdf(session, eventId);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
