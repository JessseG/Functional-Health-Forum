/*
  Warnings:

  - Made the column `userId` on table `Protocol` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Protocol_Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Protocol_Comment_Vote` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Protocol_Vote` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Protocol" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Protocol_Comment" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Protocol_Comment_Vote" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Protocol_Vote" ALTER COLUMN "userId" SET NOT NULL;
