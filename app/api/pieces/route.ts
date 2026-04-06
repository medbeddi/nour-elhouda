import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const pieces = await prisma.piece.findMany({
    where: { statut: "DISPONIBLE" },
    orderBy: { numero: "asc" },
  });

  return NextResponse.json(pieces);
}
