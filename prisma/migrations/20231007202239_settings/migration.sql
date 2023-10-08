-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailRecipients" TEXT [],
    "emailSubject" TEXT NOT NULL,
    "includeDateInSubject" BOOLEAN NOT NULL,
    "digitsToRound" INTEGER NOT NULL DEFAULT 0,
    "mileageRoundThreshold" DECIMAL(65, 30) NOT NULL DEFAULT 0.7,
    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
-- AddForeignKey
ALTER TABLE "Settings"
ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;