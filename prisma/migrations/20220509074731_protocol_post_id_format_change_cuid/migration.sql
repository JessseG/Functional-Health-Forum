/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Protocol` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Comment_Vote" DROP CONSTRAINT "Comment_Vote_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Comment" DROP CONSTRAINT "Post_Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Vote" DROP CONSTRAINT "Post_Vote_postId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_protocolId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol_Comment" DROP CONSTRAINT "Protocol_Comment_protocolId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol_Comment_Vote" DROP CONSTRAINT "Protocol_Comment_Vote_protocolId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol_Vote" DROP CONSTRAINT "Protocol_Vote_protocolId_fkey";

-- AlterTable
ALTER TABLE "Comment_Vote" ALTER COLUMN "postId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Post_id_seq";

-- AlterTable
ALTER TABLE "Post_Comment" ALTER COLUMN "postId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Post_Vote" ALTER COLUMN "postId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "protocolId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Protocol" DROP CONSTRAINT "Protocol_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Protocol_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Protocol_id_seq";

-- AlterTable
ALTER TABLE "Protocol_Comment" ALTER COLUMN "protocolId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Protocol_Comment_Vote" ALTER COLUMN "protocolId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Protocol_Vote" ALTER COLUMN "protocolId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Post_Comment" ADD CONSTRAINT "Post_Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post_Vote" ADD CONSTRAINT "Post_Vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment_Vote" ADD CONSTRAINT "Comment_Vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol_Comment" ADD CONSTRAINT "Protocol_Comment_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol_Vote" ADD CONSTRAINT "Protocol_Vote_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol_Comment_Vote" ADD CONSTRAINT "Protocol_Comment_Vote_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
