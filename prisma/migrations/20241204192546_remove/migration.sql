/*
  Warnings:

  - You are about to drop the column `customer_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_id` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "customer_id",
DROP COLUMN "invoice_id";
