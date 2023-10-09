-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('Run', 'Ride');

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "activityTypes" "ActivityType"[] DEFAULT ARRAY['Run', 'Ride']::"ActivityType"[];
