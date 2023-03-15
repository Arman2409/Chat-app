-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "between" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "sequence" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "messages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastDate" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);
