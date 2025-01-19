/*
  Warnings:

  - You are about to drop the column `next_refill_at` on the `tokens_pool` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tokens_pool" DROP COLUMN "next_refill_at";
