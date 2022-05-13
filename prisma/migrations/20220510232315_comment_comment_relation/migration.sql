-- AlterTable
ALTER TABLE "Post_Comment" ADD COLUMN     "parentCommentId" INTEGER;

-- AlterTable
ALTER TABLE "Protocol_Comment" ADD COLUMN     "parentCommentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Post_Comment" ADD CONSTRAINT "Post_Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Post_Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol_Comment" ADD CONSTRAINT "Protocol_Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Protocol_Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
