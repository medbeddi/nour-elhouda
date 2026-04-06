import { z } from "zod";

export const clientCreateSchema = z.object({
  nomComplet: z.string().min(2),
  fonction: z.string().optional().or(z.literal("")),
  telephone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
});

export const entreeCreateSchema = z.object({
  clientId: z.coerce.number().int().positive().optional(),
  clientNom: z.string().min(2).optional(),
  fonction: z.string().optional().or(z.literal("")),
  pieceId: z.coerce.number().int().positive(),
  dateArrivee: z.string().min(1),
  dateDepart: z.string().optional().or(z.literal("")),
  montantAnnuite: z.coerce.number().positive(),
  notes: z.string().optional().or(z.literal("")),
});

export const paiementCreateSchema = z.object({
  clientId: z.coerce.number().int().positive(),
  entreeId: z.coerce.number().int().positive(),
  montant: z.coerce.number().positive(),
  nature: z.enum(["CHEQUE", "ESPECES", "VIREMENT"]),
  situation: z.enum(["JOURNALIER", "HEBDOMADAIRE", "MENSUEL"]),
  datePaiement: z.string().min(1),
  reference: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const achatCreateSchema = z.object({
  description: z.string().min(2),
  montant: z.coerce.number().positive(),
  dateAchat: z.string().min(1),
  categorie: z.string().optional().or(z.literal("")),
  fournisseur: z.string().optional().or(z.literal("")),
  pieceId: z.coerce.number().int().positive().optional(),
  notes: z.string().optional().or(z.literal("")),
});
