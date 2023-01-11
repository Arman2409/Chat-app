-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friendRequests" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
