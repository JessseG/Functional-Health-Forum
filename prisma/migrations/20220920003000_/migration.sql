/*
  Warnings:

  - The `deposit` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deposit` column on the `pendReservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "depositAmount" INTEGER,
DROP COLUMN "deposit",
ADD COLUMN     "deposit" BOOLEAN;

-- AlterTable
ALTER TABLE "pendReservation" ADD COLUMN     "depositAmount" INTEGER,
DROP COLUMN "deposit",
ADD COLUMN     "deposit" BOOLEAN;
