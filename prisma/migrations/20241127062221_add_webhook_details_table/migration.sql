-- CreateTable
CREATE TABLE "user_webhooks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "livemode" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "created" INTEGER NOT NULL,
    "pending_web_hooks" INTEGER NOT NULL,
    "request_id" TEXT,
    "request_idempotency_key" TEXT,
    "user_notified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_webhooks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_webhooks" ADD CONSTRAINT "user_webhooks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
