import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { entrees: true, paiements: true } } },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Clients</h1>
      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Nom</th>
              <th>Fonction</th>
              <th>Telephone</th>
              <th>Email</th>
              <th>Entrees</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-slate-100">
                <td className="py-2">{client.nomComplet}</td>
                <td>{client.fonction || "-"}</td>
                <td>{client.telephone || "-"}</td>
                <td>{client.email || "-"}</td>
                <td>{client._count.entrees}</td>
                <td>
                  <Link className="text-slate-700 underline" href={"/dashboard/clients/" + client.id}>
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
