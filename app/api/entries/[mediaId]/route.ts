import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ mediaId: string }> },
) {
  const { mediaId } = await params;
  const entry = await prisma.entry.findFirst({
    where: { mediaId: +mediaId },
  });
  return Response.json(entry);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ mediaId: string }> },
) {
  const { mediaId } = await params;
  await prisma.entry.deleteMany({
    where: { mediaId: +mediaId },
  });
  return Response.json({ ok: true });
}
