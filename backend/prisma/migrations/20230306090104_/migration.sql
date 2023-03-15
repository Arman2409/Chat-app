-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "sentRequests" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
