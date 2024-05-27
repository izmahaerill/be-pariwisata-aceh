-- CreateTable
CREATE TABLE "TouristDestination" (
    "id" SERIAL NOT NULL,
    "url" TEXT,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "locate" TEXT,
    "typeLocation" TEXT,
    "typeSellTicket" TEXT,

    CONSTRAINT "TouristDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "lat" TEXT NOT NULL,
    "lng" TEXT NOT NULL,
    "touristDestinationId" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_touristDestinationId_key" ON "Location"("touristDestinationId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_touristDestinationId_fkey" FOREIGN KEY ("touristDestinationId") REFERENCES "TouristDestination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
