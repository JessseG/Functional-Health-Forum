-- AlterTable
ALTER TABLE "Protocol" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Protocol_Comment" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Protocol_Comment_Vote" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Protocol_Vote" ALTER COLUMN "userId" DROP NOT NULL;
