import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { canWrite } from "@/lib/permissions";
import { paiementCreateSchema } from "@/lib/validators";

export async function GET() {
  const paiements = await prisma.paiement.findMany({
    orderBy: { datePaiement: "desc" },
    include: {
      client: true,
      entree: { include: { piece: true } },
    },
  });

  return NextResponse.json(paiements);
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!canWrite(token?.role)) {
    return NextResponse.json({ message: "Action non autorisee" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = paiementCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const entree = await prisma.entree.findUnique({ where: { id: payload.entreeId } });

  if (!entree || entree.clientId !== payload.clientId) {
    return NextResponse.json({ message: "Entree invalide pour ce client" }, { status: 400 });
  }

  if (payload.nature !== "CHEQUE" && payload.reference) {
    return NextResponse.json({ message: "Reference reservee au cheque" }, { status: 400 });
  }

  const paiement = await prisma.paiement.create({
    data: {
      clientId: payload.clientId,
      entreeId: payload.entreeId,
      montant: payload.montant,
      nature: payload.nature,
      situation: payload.situation,
      datePaiement: new Date(payload.datePaiement),
      reference: payload.reference || null,
      notes: payload.notes || null,
    },
    include: {
      client: true,
      entree: { include: { piece: true } },
    },
  });

  return NextResponse.json(paiement, { status: 201 });
}
