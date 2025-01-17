/*
  Warnings:

  - You are about to drop the column `sent_to_user` on the `email_sent` table. All the data in the column will be lost.
  - You are about to drop the column `alert_sent` on the `user_webhook_event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "email_sent" DROP COLUMN "sent_to_user",
ADD COLUMN     "sent_to_customer" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_webhook_event" DROP COLUMN "alert_sent";
