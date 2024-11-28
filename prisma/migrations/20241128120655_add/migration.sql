-- AlterTable
ALTER TABLE "user_stripe_credentials" ADD COLUMN     "webhook_id" TEXT,
ADD COLUMN     "webhook_secret" TEXT;
