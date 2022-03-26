/*
  Warnings:

  - Added the required column `subredditId` to the `Post_Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post_Comment" ADD COLUMN     "subredditId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Post_Comment" ADD CONSTRAINT "Post_Comment_subredditId_fkey" FOREIGN KEY ("subredditId") REFERENCES "Subreddit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
