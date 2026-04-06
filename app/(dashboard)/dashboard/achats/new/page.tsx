"use client";

import { FormEvent, useEffect, useState } from "react";

type Piece = { id: number; numero: string };

export default function NewAchatPage() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [form, setForm] = useState({
    description: "",
    montant: "",
    dateAchat: new Date().toISOString().slice(0, 10),
    categorie: "Mobilier",
    fournisseur: "",
    pieceId: "",
    notes: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/pieces")
      .then((r) => r.json())
      .then(setPieces)
      .catch(() => setMessage("Impossible de charger les pieces"));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/achats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        montant: Number(form.montant),
        pieceId: form.pieceId ? Number(form.pieceId) : undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.message ? JSON.stringify(data.message) : "Erreur");
      return;
    }

    setMessage("Achat enregistre");
    setForm({ ...form, description: "", montant: "", fournisseur: "", pieceId: "", notes: "" });
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Nouvel achat</h1>
      <form onSubmit={onSubmit} className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
        <input required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <input required type="number" step="0.01" placeholder="Montant" value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <input required type="date" value={form.dateAchat} onChange={(e) => setForm({ ...form, dateAchat: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <select value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2">
          <option>Mobilier</option><option>Electromenager</option><option>Entretien</option><option>Autre</option>
        </select>
        <input placeholder="Fournisseur" value={form.fournisseur} onChange={(e) => setForm({ ...form, fournisseur: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <select value={form.pieceId} onChange={(e) => setForm({ ...form, pieceId: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2">
          <option value="">Piece concernee (optionnel)</option>
          {pieces.map((p) => <option key={p.id} value={p.id}>Piece {p.numero}</option>)}
        </select>
        <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-sm text-white">Enregistrer</button>
      </form>
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </div>
  );
}
