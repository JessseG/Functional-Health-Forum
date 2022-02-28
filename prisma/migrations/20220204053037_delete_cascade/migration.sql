-- DropForeignKey
ALTER TABLE "Post_Vote" DROP CONSTRAINT "Post_Vote_postId_fkey";

-- AddForeignKey
ALTER TABLE "Post_Vote" ADD CONSTRAINT "Post_Vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
