/*
  Warnings:

  - A unique constraint covering the columns `[accessCode]` on the table `Comment_Vote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessCode]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessCode]` on the table `Post_Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessCode]` on the table `Post_Vote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessCode]` on the table `Protocol` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessCode]` on the table `Protocol_Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessCode]` on the table `Protocol_Comment_Vote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessCode]` on the table `Protocol_Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comment_Vote" ADD COLUMN     "accessCode" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "postId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "accessCode" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post_Comment" ADD COLUMN     "accessCode" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post_Vote" ADD COLUMN     "accessCode" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Protocol" ADD COLUMN     "accessCode" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Protocol_Comment" ADD COLUMN     "accessCode" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Protocol_Comment_Vote" ADD COLUMN     "accessCode" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Protocol_Vote" ADD COLUMN     "accessCode" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_Vote_accessCode_key" ON "Comment_Vote"("accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "Post_accessCode_key" ON "Post"("accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "Post_Comment_accessCode_key" ON "Post_Comment"("accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "Post_Vote_accessCode_key" ON "Post_Vote"("accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "Protocol_accessCode_key" ON "Protocol"("accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "Protocol_Comment_accessCode_key" ON "Protocol_Comment"("accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "Protocol_Comment_Vote_accessCode_key" ON "Protocol_Comment_Vote"("accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "Protocol_Vote_accessCode_key" ON "Protocol_Vote"("accessCode");
