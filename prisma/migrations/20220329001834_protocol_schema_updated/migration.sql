/*
  Warnings:

  - You are about to drop the `Protocol_Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_subredditId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Comment" DROP CONSTRAINT "Post_Comment_subredditId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol" DROP CONSTRAINT "Protocol_subredditId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol_Comment" DROP CONSTRAINT "Protocol_Comment_protocolId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol_Product" DROP CONSTRAINT "Protocol_Product_protocolId_fkey";

-- DropTable
DROP TABLE "Protocol_Product";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "instructions" TEXT,
    "dose" TEXT,
    "procedure" TEXT,
    "brand" TEXT,
    "link" TEXT,
    "protocolId" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_subredditId_fkey" FOREIGN KEY ("subredditId") REFERENCES "Subreddit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post_Comment" ADD CONSTRAINT "Post_Comment_subredditId_fkey" FOREIGN KEY ("subredditId") REFERENCES "Subreddit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol" ADD CONSTRAINT "Protocol_subredditId_fkey" FOREIGN KEY ("subredditId") REFERENCES "Subreddit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol_Comment" ADD CONSTRAINT "Protocol_Comment_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
