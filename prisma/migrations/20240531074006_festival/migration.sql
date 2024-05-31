-- CreateTable
CREATE TABLE "Festival" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "locate" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Festival_pkey" PRIMARY KEY ("id")
);
