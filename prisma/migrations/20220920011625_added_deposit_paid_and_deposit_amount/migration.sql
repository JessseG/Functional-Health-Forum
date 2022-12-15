/*
  Warnings:

  - You are about to drop the column `deposit` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `deposit` on the `pendReservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "deposit",
ADD COLUMN     "depositPaid" BOOLEAN;

-- AlterTable
ALTER TABLE "pendReservation" DROP COLUMN "deposit",
ADD COLUMN     "depositPaid" BOOLEAN;
