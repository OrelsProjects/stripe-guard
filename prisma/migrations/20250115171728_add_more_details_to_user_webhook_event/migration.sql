/*
  Warnings:

  - Added the required column `time_to_complete` to the `user_webhook_event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_webhook_event" ADD COLUMN     "alert_sent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "time_to_complete" INTEGER NOT NULL;
