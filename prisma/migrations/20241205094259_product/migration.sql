/*
  Warnings:

  - Made the column `product_name` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "product_name" SET NOT NULL;
