/*
  Warnings:

  - You are about to drop the column `activeUsers` on the `ActiveUsers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActiveUsers" DROP COLUMN "activeUsers",
ADD COLUMN     "ids" INTEGER[];
