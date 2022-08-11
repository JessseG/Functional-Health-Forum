/*
  Warnings:

  - Made the column `collaborator` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `collaborator` on table `pUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `pUser` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "collaborator" SET NOT NULL,
ALTER COLUMN "username" SET NOT NULL;

-- AlterTable
ALTER TABLE "pUser" ALTER COLUMN "collaborator" SET NOT NULL,
ALTER COLUMN "username" SET NOT NULL;
