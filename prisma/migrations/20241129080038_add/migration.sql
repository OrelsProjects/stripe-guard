/*
  Warnings:

  - You are about to drop the column `show_notifications` on the `user_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_settings" DROP COLUMN "show_notifications",
ADD COLUMN     "email_to_notify" TEXT,
ADD COLUMN     "email_webhook_notifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "frequency" TEXT;

-- AlterTable
ALTER TABLE "user_stripe_credentials" ADD COLUMN     "webhook_url" TEXT;
