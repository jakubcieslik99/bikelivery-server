/*
  Warnings:

  - You are about to alter the column `distance` on the `trips` table. The data in that column could be lost. The data in that column will be cast from `Decimal(7,2)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `trips` table. The data in that column could be lost. The data in that column will be cast from `Decimal(7,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "distance" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;
