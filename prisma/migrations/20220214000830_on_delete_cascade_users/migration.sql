-- DropForeignKey
ALTER TABLE "Comment_Vote" DROP CONSTRAINT "Comment_Vote_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment_Vote" DROP CONSTRAINT "Comment_Vote_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment_Vote" DROP CONSTRAINT "Comment_Vote_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Comment" DROP CONSTRAINT "Post_Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Comment" DROP CONSTRAINT "Post_Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Vote" DROP CONSTRAINT "Post_Vote_userId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol" DROP CONSTRAINT "Protocol_userId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol_Comment" DROP CONSTRAINT "Protocol_Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol_Comment_Vote" DROP CONSTRAINT "Protocol_Comment_Vote_userId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol_Vote" DROP CONSTRAINT "Protocol_Vote_userId_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post_Comment" ADD CONSTRAINT "Post_Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post_Comment" ADD CONSTRAINT "Post_Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post_Vote" ADD CONSTRAINT "Post_Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment_Vote" ADD CONSTRAINT "Comment_Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment_Vote" ADD CONSTRAINT "Comment_Vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment_Vote" ADD CONSTRAINT "Comment_Vote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Post_Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol" ADD CONSTRAINT "Protocol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol_Comment" ADD CONSTRAINT "Protocol_Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol_Vote" ADD CONSTRAINT "Protocol_Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol_Comment_Vote" ADD CONSTRAINT "Protocol_Comment_Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
