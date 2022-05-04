-- DropForeignKey
ALTER TABLE "Protocol_Comment_Vote" DROP CONSTRAINT "Protocol_Comment_Vote_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol_Comment_Vote" DROP CONSTRAINT "Protocol_Comment_Vote_protocolId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol_Vote" DROP CONSTRAINT "Protocol_Vote_protocolId_fkey";

-- AddForeignKey
ALTER TABLE "Protocol_Vote" ADD CONSTRAINT "Protocol_Vote_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol_Comment_Vote" ADD CONSTRAINT "Protocol_Comment_Vote_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol_Comment_Vote" ADD CONSTRAINT "Protocol_Comment_Vote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Protocol_Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
