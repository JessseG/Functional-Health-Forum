/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reservation_email_key" ON "Reservation"("email");
