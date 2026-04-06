import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { canWrite } from "@/lib/permissions";
import { clientCreateSchema } from "@/lib/validators";

export async function GET() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { entrees: true, paiements: true } } },
  });

  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!canWrite(token?.role)) {
    return NextResponse.json({ message: "Action non autorisee" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = clientCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const client = await prisma.client.create({
    data: {
      nomComplet: payload.nomComplet,
      fonction: payload.fonction || null,
      telephone: payload.telephone || null,
      email: payload.email || null,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
