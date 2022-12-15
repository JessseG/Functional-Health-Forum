/*
  Warnings:

  - Made the column `tour` on table `Reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "tour" SET NOT NULL;

-- CreateTable
CREATE TABLE "pendReservation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hotel" TEXT,
    "tour" TEXT NOT NULL,
    "transportFrom" TEXT,
    "transportTo" TEXT,
    "phone" TEXT,
    "rsvpDate" TIMESTAMP(3) NOT NULL,
    "rsvpTime" TEXT NOT NULL,
    "numAdults" INTEGER NOT NULL,
    "numKids" INTEGER NOT NULL,
    "reservedBy" TEXT,
    "roomNum" TEXT,
    "details" TEXT,
    "deposit" TEXT,
    "totalPrice" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pendReservation_pkey" PRIMARY KEY ("id")
);
