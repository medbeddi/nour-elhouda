import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/dashboard/clients", label: "Clients" },
  { href: "/dashboard/entrees", label: "Entrees" },
  { href: "/dashboard/paiements", label: "Paiements" },
  { href: "/dashboard/achats", label: "Achats" },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4">
      <p className="mb-6 text-lg font-semibold">Nour Elhouda</p>
      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
