/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dobDay` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dobMonth` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dobYear` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "dobDay" SET NOT NULL,
ALTER COLUMN "dobMonth" SET NOT NULL,
ALTER COLUMN "dobYear" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
