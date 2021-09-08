/*
  Warnings:

  - You are about to drop the column `isDownVote` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteType` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Subreddit" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "infoBoxText" TEXT;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "isDownVote",
ADD COLUMN     "voteType" "VoteType" NOT NULL,
ALTER COLUMN "postId" DROP NOT NULL,
ALTER COLUMN "commentId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_SubredditToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubredditToUser_AB_unique" ON "_SubredditToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SubredditToUser_B_index" ON "_SubredditToUser"("B");

-- AddForeignKey
ALTER TABLE "_SubredditToUser" ADD FOREIGN KEY ("A") REFERENCES "Subreddit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubredditToUser" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
