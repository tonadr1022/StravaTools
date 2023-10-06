-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stravaAccessToken" TEXT,
ADD COLUMN     "stravaAuthorized" BOOLEAN DEFAULT false,
ADD COLUMN     "stravaExpiresAt" INTEGER,
ADD COLUMN     "stravaRefreshToken" TEXT;
