/*
  Warnings:

  - You are about to drop the column `cancel_at_period_end` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `current_period_end` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `current_period_start` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "cancel_at_period_end",
DROP COLUMN "current_period_end",
DROP COLUMN "current_period_start";
