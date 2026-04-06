-- CreateEnum
CREATE TYPE "StatutPiece" AS ENUM ('DISPONIBLE', 'OCCUPEE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "StatutEntree" AS ENUM ('EN_COURS', 'TERMINE', 'ANNULE');

-- CreateEnum
CREATE TYPE "NaturePaiement" AS ENUM ('CHEQUE', 'ESPECES', 'VIREMENT');

-- CreateEnum
CREATE TYPE "SituationPaiement" AS ENUM ('JOURNALIER', 'HEBDOMADAIRE', 'MENSUEL');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PROPRIETAIRE', 'GESTIONNAIRE', 'ADMIN');

-- CreateTable
CREATE TABLE "Appartement" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL DEFAULT 'Nour Elhouda',
    "gerant" TEXT NOT NULL DEFAULT 'Abdelmalik',
    "nombrePieces" INTEGER NOT NULL DEFAULT 12,

    CONSTRAINT "Appartement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Piece" (
    "id" SERIAL NOT NULL,
    "appartementId" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "statut" "StatutPiece" NOT NULL DEFAULT 'DISPONIBLE',

    CONSTRAINT "Piece_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "nomComplet" TEXT NOT NULL,
    "fonction" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entree" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "pieceId" INTEGER NOT NULL,
    "dateArrivee" TIMESTAMP(3) NOT NULL,
    "dateDepart" TIMESTAMP(3),
    "montantAnnuite" DECIMAL(10,2) NOT NULL,
    "statut" "StatutEntree" NOT NULL DEFAULT 'EN_COURS',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" SERIAL NOT NULL,
    "entreeId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "nature" "NaturePaiement" NOT NULL,
    "situation" "SituationPaiement" NOT NULL,
    "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "notes" TEXT,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achat" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "dateAchat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categorie" TEXT,
    "fournisseur" TEXT,
    "pieceId" INTEGER,
    "justificatif" TEXT,

    CONSTRAINT "Achat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'GESTIONNAIRE',
    "password" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Piece_numero_key" ON "Piece"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- AddForeignKey
ALTER TABLE "Piece" ADD CONSTRAINT "Piece_appartementId_fkey" FOREIGN KEY ("appartementId") REFERENCES "Appartement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entree" ADD CONSTRAINT "Entree_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entree" ADD CONSTRAINT "Entree_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_entreeId_fkey" FOREIGN KEY ("entreeId") REFERENCES "Entree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achat" ADD CONSTRAINT "Achat_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece"("id") ON DELETE SET NULL ON UPDATE CASCADE;
