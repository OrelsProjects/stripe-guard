/*
  Warnings:

  - Added the required column `payment_interval` to the `subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refill_interval` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "payment_interval" TEXT NOT NULL,
ADD COLUMN     "refill_interval" TEXT NOT NULL;
