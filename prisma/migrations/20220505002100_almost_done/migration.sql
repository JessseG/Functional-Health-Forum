/*
  Warnings:

  - You are about to drop the column `protocol_CommentId` on the `Protocol_Vote` table. All the data in the column will be lost.
  - Made the column `protocolId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Protocol_Vote" DROP CONSTRAINT "Protocol_Vote_protocol_CommentId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "protocolId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Protocol_Vote" DROP COLUMN "protocol_CommentId";
