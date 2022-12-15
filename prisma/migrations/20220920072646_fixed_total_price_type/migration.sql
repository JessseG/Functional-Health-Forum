/*
  Warnings:

  - The `totalPrice` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `totalPrice` column on the `pendReservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "totalPrice",
ADD COLUMN     "totalPrice" INTEGER;

-- AlterTable
ALTER TABLE "pendReservation" DROP COLUMN "totalPrice",
ADD COLUMN     "totalPrice" INTEGER;
