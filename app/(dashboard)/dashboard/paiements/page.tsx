import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PaiementsPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; nature?: string; situation?: string; from?: string; to?: string }>;
}) {
  const filters = await searchParams;

  const paiements = await prisma.paiement.findMany({
    where: {
      clientId: filters.clientId ? Number(filters.clientId) : undefined,
      nature: (filters.nature as "CHEQUE" | "ESPECES" | "VIREMENT" | undefined) || undefined,
      situation: (filters.situation as "JOURNALIER" | "HEBDOMADAIRE" | "MENSUEL" | undefined) || undefined,
      datePaiement:
        filters.from || filters.to
          ? {
              gte: filters.from ? new Date(filters.from) : undefined,
              lte: filters.to ? new Date(filters.to) : undefined,
            }
          : undefined,
    },
    orderBy: { datePaiement: "desc" },
    include: { client: true, entree: { include: { piece: true } } },
  });

  const clients = await prisma.client.findMany({ orderBy: { nomComplet: "asc" } });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Paiements</h1>
        <Link href="/dashboard/paiements/new" className="rounded bg-slate-900 px-3 py-2 text-sm text-white">Nouveau paiement</Link>
      </div>

      <form className="grid grid-cols-1 gap-2 rounded-lg bg-white p-4 shadow-sm md:grid-cols-6">
        <select name="clientId" defaultValue={filters.clientId || ""} className="rounded border border-slate-300 px-2 py-1 text-sm">
          <option value="">Client</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.nomComplet}</option>)}
        </select>
        <select name="nature" defaultValue={filters.nature || ""} className="rounded border border-slate-300 px-2 py-1 text-sm">
          <option value="">Nature</option><option value="CHEQUE">Cheque</option><option value="ESPECES">Especes</option><option value="VIREMENT">Virement</option>
        </select>
        <select name="situation" defaultValue={filters.situation || ""} className="rounded border border-slate-300 px-2 py-1 text-sm">
          <option value="">Situation</option><option value="JOURNALIER">Journalier</option><option value="HEBDOMADAIRE">Hebdomadaire</option><option value="MENSUEL">Mensuel</option>
        </select>
        <input type="date" name="from" defaultValue={filters.from || ""} className="rounded border border-slate-300 px-2 py-1 text-sm" />
        <input type="date" name="to" defaultValue={filters.to || ""} className="rounded border border-slate-300 px-2 py-1 text-sm" />
        <button className="rounded bg-slate-900 px-3 py-1 text-sm text-white" type="submit">Filtrer</button>
      </form>

      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b"><th className="py-2">Client</th><th>Piece</th><th>Montant</th><th>Nature</th><th>Situation</th><th>Date</th></tr>
          </thead>
          <tbody>
            {paiements.map((p) => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="py-2">{p.client.nomComplet}</td>
                <td>{p.entree.piece.numero}</td>
                <td>{Number(p.montant).toFixed(2)}</td>
                <td>{p.nature}</td>
                <td>{p.situation}</td>
                <td>{new Date(p.datePaiement).toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
