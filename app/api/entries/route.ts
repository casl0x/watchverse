import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// GET — récupérer toutes les entrées
export async function GET() {
  const entries = await prisma.entry.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return Response.json(entries);
}

// POST — ajouter une entrée
export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry = await prisma.entry.upsert({
    where: {
      id: body.id ?? "new",
    },
    update: {
      status: body.status,
      seen: body.seen,
      comment: body.comment,
    },
    create: {
      mediaId: body.mediaId,
      mediaType: body.mediaType,
      title: body.title,
      posterPath: body.posterPath,
      status: body.status,
      seen: body.seen,
      comment: body.comment,
    },
  });
  return Response.json(entry);
}
