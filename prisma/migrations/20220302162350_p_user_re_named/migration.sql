/*
  Warnings:

  - You are about to drop the `p_User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "p_User";

-- CreateTable
CREATE TABLE "pUser" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "dobDay" TEXT,
    "dobMonth" TEXT,
    "dobYear" TEXT,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,

    CONSTRAINT "pUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pUser_email_key" ON "pUser"("email");
