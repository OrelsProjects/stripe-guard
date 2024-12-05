/*
  Warnings:

  - Made the column `tokens_added` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "tokens_added" SET NOT NULL;
