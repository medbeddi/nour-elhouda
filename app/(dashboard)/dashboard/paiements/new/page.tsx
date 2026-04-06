"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Client = { id: number; nomComplet: string };
type Entree = { id: number; clientId: number; piece: { numero: string } };

export default function NewPaiementPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [entrees, setEntrees] = useState<Entree[]>([]);
  const [form, setForm] = useState({
    clientId: "",
    entreeId: "",
    montant: "",
    nature: "CHEQUE",
    situation: "MENSUEL",
    datePaiement: new Date().toISOString().slice(0, 10),
    reference: "",
    notes: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/clients"), fetch("/api/entrees")])
      .then(async ([c, e]) => {
        setClients(await c.json());
        const rows = await e.json();
        setEntrees(rows.filter((x: { statut: string }) => x.statut === "EN_COURS"));
      })
      .catch(() => setMessage("Impossible de charger les donnees"));
  }, []);

  const filteredEntrees = useMemo(
    () => entrees.filter((e) => String(e.clientId) === form.clientId),
    [entrees, form.clientId]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/paiements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        clientId: Number(form.clientId),
        entreeId: Number(form.entreeId),
        montant: Number(form.montant),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.message ? JSON.stringify(data.message) : "Erreur");
      return;
    }

    setMessage("Paiement enregistre");
    setForm({ ...form, entreeId: "", montant: "", reference: "", notes: "" });
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Nouveau paiement</h1>
      <form onSubmit={onSubmit} className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
        <select required className="w-full rounded border border-slate-300 px-3 py-2" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value, entreeId: "" })}>
          <option value="">Selection du client</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.nomComplet}</option>)}
        </select>

        <select required className="w-full rounded border border-slate-300 px-3 py-2" value={form.entreeId} onChange={(e) => setForm({ ...form, entreeId: e.target.value })}>
          <option value="">Selection de l&apos;entree</option>
          {filteredEntrees.map((e) => <option key={e.id} value={e.id}>Entree #{e.id} - Piece {e.piece.numero}</option>)}
        </select>

        <input required type="number" step="0.01" placeholder="Montant" value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />

        <div>
          <p className="mb-1 text-sm">Nature</p>
          <div className="flex gap-4 text-sm">
            {[
              ["CHEQUE", "Cheque"],
              ["ESPECES", "Especes"],
              ["VIREMENT", "Virement"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-1">
                <input type="radio" checked={form.nature === value} onChange={() => setForm({ ...form, nature: value })} /> {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm">Situation</p>
          <div className="flex gap-4 text-sm">
            {[
              ["JOURNALIER", "Journalier"],
              ["HEBDOMADAIRE", "Hebdomadaire"],
              ["MENSUEL", "Mensuel"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-1">
                <input type="radio" checked={form.situation === value} onChange={() => setForm({ ...form, situation: value })} /> {label}
              </label>
            ))}
          </div>
        </div>

        <input required type="date" value={form.datePaiement} onChange={(e) => setForm({ ...form, datePaiement: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />

        {form.nature === "CHEQUE" ? (
          <input placeholder="Reference cheque" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        ) : null}

        <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-sm text-white">Enregistrer</button>
      </form>
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </div>
  );
}

