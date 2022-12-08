/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `pUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pUser" ADD COLUMN     "collaborator" BOOLEAN,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pUser_username_key" ON "pUser"("username");
