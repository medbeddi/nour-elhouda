import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const appart = await prisma.appartement.create({
    data: { nom: "Nour Elhouda", gerant: "Abdelmalik", nombrePieces: 12 },
  });

  for (let i = 1; i <= 12; i += 1) {
    await prisma.piece.create({
      data: {
        appartementId: appart.id,
        numero: `${i}`.padStart(2, "0"),
        type: i <= 4 ? "Studio" : i <= 8 ? "F2" : "Suite",
        statut: "DISPONIBLE",
      },
    });
  }

  const hash = await bcrypt.hash("admin123", 10);

  await prisma.utilisateur.createMany({
    data: [
      { nom: "Nour Elhouda", email: "proprietaire@nour.dz", role: "PROPRIETAIRE", password: hash },
      { nom: "Abdelmalik", email: "gerant@nour.dz", role: "GESTIONNAIRE", password: hash },
      { nom: "Admin", email: "admin@nour.dz", role: "ADMIN", password: hash },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
