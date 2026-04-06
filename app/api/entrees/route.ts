import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { canWrite } from "@/lib/permissions";
import { entreeCreateSchema } from "@/lib/validators";

export async function GET() {
  const entrees = await prisma.entree.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: true,
      piece: true,
      paiements: true,
    },
  });

  return NextResponse.json(entrees);
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!canWrite(token?.role)) {
    return NextResponse.json({ message: "Action non autorisee" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = entreeCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;

  const piece = await prisma.piece.findUnique({ where: { id: payload.pieceId } });
  if (!piece || piece.statut !== "DISPONIBLE") {
    return NextResponse.json({ message: "Piece indisponible" }, { status: 400 });
  }

  let clientId = payload.clientId;

  if (!clientId) {
    if (!payload.clientNom) {
      return NextResponse.json({ message: "Client requis" }, { status: 400 });
    }
    const created = await prisma.client.create({
      data: {
        nomComplet: payload.clientNom,
        fonction: payload.fonction || null,
      },
    });
    clientId = created.id;
  }

  const entree = await prisma.$transaction(async (tx) => {
    const created = await tx.entree.create({
      data: {
        clientId,
        pieceId: payload.pieceId,
        dateArrivee: new Date(payload.dateArrivee),
        dateDepart: payload.dateDepart ? new Date(payload.dateDepart) : null,
        montantAnnuite: payload.montantAnnuite,
        notes: payload.notes || null,
      },
      include: { client: true, piece: true },
    });

    await tx.piece.update({
      where: { id: payload.pieceId },
      data: { statut: "OCCUPEE" },
    });

    return created;
  });

  return NextResponse.json(entree, { status: 201 });
}
