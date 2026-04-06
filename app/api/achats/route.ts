import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { canWrite } from "@/lib/permissions";
import { achatCreateSchema } from "@/lib/validators";

export async function GET() {
  const achats = await prisma.achat.findMany({
    orderBy: { dateAchat: "desc" },
    include: { piece: true },
  });

  return NextResponse.json(achats);
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!canWrite(token?.role)) {
    return NextResponse.json({ message: "Action non autorisee" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = achatCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const achat = await prisma.achat.create({
    data: {
      description: payload.description,
      montant: payload.montant,
      dateAchat: new Date(payload.dateAchat),
      categorie: payload.categorie || null,
      fournisseur: payload.fournisseur || null,
      pieceId: payload.pieceId || null,
      justificatif: payload.notes || null,
    },
    include: { piece: true },
  });

  return NextResponse.json(achat, { status: 201 });
}
