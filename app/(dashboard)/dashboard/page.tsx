import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatMoney(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function DashboardPage() {
  const [totalPieces, occupees, latestPaiements, latestEntrees, revenusMois] = await Promise.all([
    prisma.piece.count(),
    prisma.piece.count({ where: { statut: "OCCUPEE" } }),
    prisma.paiement.findMany({ orderBy: { datePaiement: "desc" }, take: 5, include: { client: true } }),
    prisma.entree.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { client: true, piece: true } }),
    prisma.paiement.aggregate({
      _sum: { montant: true },
      where: { datePaiement: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
    }),
  ]);

  const disponibles = totalPieces - occupees;
  const taux = totalPieces > 0 ? Math.round((occupees / totalPieces) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Pieces occupees / disponibles</p>
          <p className="mt-1 text-xl font-semibold">{occupees} / {disponibles} (sur {totalPieces})</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Revenus du mois</p>
          <p className="mt-1 text-xl font-semibold">{formatMoney(Number(revenusMois._sum.montant || 0))}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Taux d&apos;occupation</p>
          <p className="mt-1 text-xl font-semibold">{taux}%</p>
        </div>
      </section>

      <section className="rounded-lg bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Derniers paiements</h2>
          <Link href="/dashboard/paiements" className="text-sm text-slate-700 underline">Voir tout</Link>
        </div>
        <ul className="space-y-2">
          {latestPaiements.map((p) => (
            <li key={p.id} className="flex justify-between border-b border-slate-100 py-1 text-sm">
              <span>{p.client.nomComplet}</span>
              <span>{formatMoney(Number(p.montant))}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold">5 dernieres entrees</h2>
        <ul className="space-y-2 text-sm">
          {latestEntrees.map((e) => (
            <li key={e.id} className="flex justify-between border-b border-slate-100 py-1">
              <span>{e.client.nomComplet} - Piece {e.piece.numero}</span>
              <span>{new Date(e.dateArrivee).toLocaleDateString("fr-FR")}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

