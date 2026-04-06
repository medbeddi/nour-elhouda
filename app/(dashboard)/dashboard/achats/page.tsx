import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AchatsPage() {
  const achats = await prisma.achat.findMany({ orderBy: { dateAchat: "desc" }, include: { piece: true } });

  const totalParCategorie = achats.reduce<Record<string, number>>((acc, achat) => {
    const key = achat.categorie || "Autre";
    acc[key] = (acc[key] || 0) + Number(achat.montant);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Achats</h1>
        <Link href="/dashboard/achats/new" className="rounded bg-slate-900 px-3 py-2 text-sm text-white">Nouvel achat</Link>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {Object.entries(totalParCategorie).map(([categorie, total]) => (
          <div key={categorie} className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{categorie}</p>
            <p className="text-lg font-semibold">{total.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b"><th className="py-2">Description</th><th>Montant</th><th>Date</th><th>Categorie</th><th>Fournisseur</th><th>Piece</th></tr>
          </thead>
          <tbody>
            {achats.map((a) => (
              <tr key={a.id} className="border-b border-slate-100">
                <td className="py-2">{a.description}</td>
                <td>{Number(a.montant).toFixed(2)}</td>
                <td>{new Date(a.dateAchat).toLocaleDateString("fr-FR")}</td>
                <td>{a.categorie || "-"}</td>
                <td>{a.fournisseur || "-"}</td>
                <td>{a.piece?.numero || "General"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
