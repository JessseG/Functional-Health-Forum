/*
  Warnings:

  - Changed the type of `rsvpDate` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rsvpTime` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rsvpDate` on the `pendReservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rsvpTime` on the `pendReservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "rsvpDate",
ADD COLUMN     "rsvpDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "rsvpTime",
ADD COLUMN     "rsvpTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "pendReservation" DROP COLUMN "rsvpDate",
ADD COLUMN     "rsvpDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "rsvpTime",
ADD COLUMN     "rsvpTime" TIMESTAMP(3) NOT NULL;
