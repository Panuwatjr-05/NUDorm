-- CreateEnum
CREATE TYPE "WaterRateType" AS ENUM ('FLAT', 'METERED');

-- AlterTable
ALTER TABLE "Dorm" ADD COLUMN     "waterRateType" "WaterRateType" NOT NULL DEFAULT 'FLAT';
