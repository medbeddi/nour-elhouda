"use client";

import { FormEvent, useEffect, useState } from "react";

type Client = { id: number; nomComplet: string };
type Piece = { id: number; numero: string; type: string };

export default function NewEntreePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [form, setForm] = useState({
    clientId: "",
    clientNom: "",
    fonction: "",
    pieceId: "",
    dateArrivee: "",
    dateDepart: "",
    montantAnnuite: "",
    notes: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/clients"), fetch("/api/pieces")])
      .then(async ([c, p]) => {
        setClients(await c.json());
        setPieces(await p.json());
      })
      .catch(() => setMessage("Impossible de charger les donnees"));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    const payload = {
      ...form,
      clientId: form.clientId ? Number(form.clientId) : undefined,
      pieceId: Number(form.pieceId),
      montantAnnuite: Number(form.montantAnnuite),
    };

    const res = await fetch("/api/entrees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.message ? JSON.stringify(data.message) : "Erreur de creation");
      return;
    }

    setMessage("Entree creee avec succes");
    setForm({ clientId: "", clientNom: "", fonction: "", pieceId: "", dateArrivee: "", dateDepart: "", montantAnnuite: "", notes: "" });
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Nouvelle entree</h1>
      <form onSubmit={onSubmit} className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
        <div>
          <label className="mb-1 block text-sm">Client existant (optionnel)</label>
          <select className="w-full rounded border border-slate-300 px-3 py-2" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
            <option value="">Selectionner</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.nomComplet}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm">Nom du client (si nouveau)</label>
          <input list="clients" value={form.clientNom} onChange={(e) => setForm({ ...form, clientNom: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
          <datalist id="clients">{clients.map((c) => <option key={c.id} value={c.nomComplet} />)}</datalist>
        </div>
        <input placeholder="Fonction" value={form.fonction} onChange={(e) => setForm({ ...form, fonction: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <select required className="w-full rounded border border-slate-300 px-3 py-2" value={form.pieceId} onChange={(e) => setForm({ ...form, pieceId: e.target.value })}>
          <option value="">Piece disponible</option>
          {pieces.map((p) => <option key={p.id} value={p.id}>Piece {p.numero} - {p.type}</option>)}
        </select>
        <input required type="date" value={form.dateArrivee} onChange={(e) => setForm({ ...form, dateArrivee: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <input type="date" value={form.dateDepart} onChange={(e) => setForm({ ...form, dateDepart: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <input required type="number" step="0.01" placeholder="Montant annuite" value={form.montantAnnuite} onChange={(e) => setForm({ ...form, montantAnnuite: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-sm text-white">Enregistrer</button>
      </form>
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </div>
  );
}
