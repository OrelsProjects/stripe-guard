-- CreateTable
CREATE TABLE "email_sent" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "webhook_event_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_sent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_sent_email_key" ON "email_sent"("email");

-- AddForeignKey
ALTER TABLE "email_sent" ADD CONSTRAINT "email_sent_webhook_event_id_fkey" FOREIGN KEY ("webhook_event_id") REFERENCES "user_webhook_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
