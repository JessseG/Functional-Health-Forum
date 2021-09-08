/*
  Warnings:

  - Made the column `displayName` on table `Subreddit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `infoBoxText` on table `Subreddit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Subreddit" ALTER COLUMN "displayName" SET NOT NULL,
ALTER COLUMN "infoBoxText" SET NOT NULL;
