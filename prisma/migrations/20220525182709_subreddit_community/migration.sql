/*
  Warnings:

  - You are about to drop the column `subredditId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `subredditId` on the `Post_Comment` table. All the data in the column will be lost.
  - You are about to drop the column `subredditId` on the `Protocol` table. All the data in the column will be lost.
  - You are about to drop the column `subredditId` on the `Protocol_Comment` table. All the data in the column will be lost.
  - You are about to drop the `Subreddit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SubredditToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `communityId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityId` to the `Post_Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityId` to the `Protocol` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityId` to the `Protocol_Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_subredditId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Comment" DROP CONSTRAINT "Post_Comment_subredditId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol" DROP CONSTRAINT "Protocol_subredditId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol_Comment" DROP CONSTRAINT "Protocol_Comment_subredditId_fkey";

-- DropForeignKey
ALTER TABLE "_SubredditToUser" DROP CONSTRAINT "_SubredditToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubredditToUser" DROP CONSTRAINT "_SubredditToUser_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "subredditId",
ADD COLUMN     "communityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post_Comment" DROP COLUMN "subredditId",
ADD COLUMN     "communityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Protocol" DROP COLUMN "subredditId",
ADD COLUMN     "communityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Protocol_Comment" DROP COLUMN "subredditId",
ADD COLUMN     "communityId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Subreddit";

-- DropTable
DROP TABLE "_SubredditToUser";

-- CreateTable
CREATE TABLE "Community" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "infoBoxText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CommunityToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityToUser_AB_unique" ON "_CommunityToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityToUser_B_index" ON "_CommunityToUser"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post_Comment" ADD CONSTRAINT "Post_Comment_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol" ADD CONSTRAINT "Protocol_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol_Comment" ADD CONSTRAINT "Protocol_Comment_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityToUser" ADD FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
