-- CreateTable
CREATE TABLE "p_User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "dobDay" TEXT,
    "dobMonth" TEXT,
    "dobYear" TEXT,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,

    CONSTRAINT "p_User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "p_User_email_key" ON "p_User"("email");
