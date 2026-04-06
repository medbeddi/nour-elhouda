import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function EntreesPage() {
  const entrees = await prisma.entree.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true, piece: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Entrees</h1>
        <Link href="/dashboard/entrees/new" className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
          Nouvelle entree
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Client</th>
              <th>Piece</th>
              <th>Arrivee</th>
              <th>Depart</th>
              <th>Montant</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {entrees.map((entree) => (
              <tr key={entree.id} className="border-b border-slate-100">
                <td className="py-2">{entree.client.nomComplet}</td>
                <td>{entree.piece.numero}</td>
                <td>{new Date(entree.dateArrivee).toLocaleDateString("fr-FR")}</td>
                <td>{entree.dateDepart ? new Date(entree.dateDepart).toLocaleDateString("fr-FR") : "-"}</td>
                <td>{Number(entree.montantAnnuite).toFixed(2)}</td>
                <td>{entree.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
