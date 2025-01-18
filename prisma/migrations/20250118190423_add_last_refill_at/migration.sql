/*
  Warnings:

  - Added the required column `last_refill_at` to the `tokens_pool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens_pool" ADD COLUMN     "last_refill_at" TIMESTAMP(3) NOT NULL;
