-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "tagLine" TEXT NOT NULL,
    "dateRelease" TIMESTAMP(3) NOT NULL,
    "desc" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);
