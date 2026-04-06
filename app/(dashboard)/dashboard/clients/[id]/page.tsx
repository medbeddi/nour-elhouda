import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id: Number(id) },
    include: {
      entrees: { include: { piece: true }, orderBy: { createdAt: "desc" } },
      paiements: { orderBy: { datePaiement: "desc" } },
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{client.nomComplet}</h1>
      <p className="text-sm text-slate-600">{client.fonction || "Fonction non renseignee"}</p>

      <section className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold">Entrees</h2>
        <ul className="space-y-2 text-sm">
          {client.entrees.map((entree) => (
            <li key={entree.id} className="flex justify-between border-b border-slate-100 py-1">
              <span>Piece {entree.piece.numero}</span>
              <span>{new Date(entree.dateArrivee).toLocaleDateString("fr-FR")}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold">Paiements</h2>
        <ul className="space-y-2 text-sm">
          {client.paiements.map((p) => (
            <li key={p.id} className="flex justify-between border-b border-slate-100 py-1">
              <span>{p.nature}</span>
              <span>{Number(p.montant).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
