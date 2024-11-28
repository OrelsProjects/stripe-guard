/*
  Warnings:

  - You are about to drop the `user_webhooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_webhooks" DROP CONSTRAINT "user_webhooks_user_id_fkey";

-- DropTable
DROP TABLE "user_webhooks";

-- CreateTable
CREATE TABLE "user_webhook_event" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "livemode" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "created" INTEGER NOT NULL,
    "pending_web_hooks" INTEGER NOT NULL,
    "connected" BOOLEAN NOT NULL DEFAULT true,
    "succeeded" BOOLEAN NOT NULL,
    "request_id" TEXT,
    "request_idempotency_key" TEXT,
    "user_notified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_webhook_event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_webhook_event" ADD CONSTRAINT "user_webhook_event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
