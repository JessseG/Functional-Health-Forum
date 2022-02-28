/*
  Warnings:

  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dobDay" TEXT,
ADD COLUMN     "dobMonth" TEXT,
ADD COLUMN     "dobYear" TEXT,
ADD COLUMN     "password" TEXT,
ALTER COLUMN "email" SET NOT NULL;
