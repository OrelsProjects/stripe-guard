/*
  Warnings:

  - You are about to drop the `app_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `app_user_metadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `app_user_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `app_user_stripe_credentials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "app_user_metadata" DROP CONSTRAINT "app_user_metadata_user_id_fkey";

-- DropForeignKey
ALTER TABLE "app_user_settings" DROP CONSTRAINT "app_user_settings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "app_user_stripe_credentials" DROP CONSTRAINT "app_user_stripe_credentials_user_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_orders" DROP CONSTRAINT "user_orders_user_id_fkey";

-- DropTable
DROP TABLE "app_user";

-- DropTable
DROP TABLE "app_user_metadata";

-- DropTable
DROP TABLE "app_user_settings";

-- DropTable
DROP TABLE "app_user_stripe_credentials";

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userMetaData" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "paid_status" TEXT NOT NULL,

    CONSTRAINT "userMetaData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "user_metadata" (
    "app_user_metadata_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "referral_code" TEXT,
    "referred_by" TEXT,
    "paid_status" TEXT,
    "push_token" TEXT,
    "push_token_mobile" TEXT,

    CONSTRAINT "user_metadata_pkey" PRIMARY KEY ("app_user_metadata_id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "app_user_settings_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "show_notifications" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("app_user_settings_id")
);

-- CreateTable
CREATE TABLE "user_stripe_credentials" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "stripe_user_id" TEXT,
    "publishable_key" TEXT,

    CONSTRAINT "user_stripe_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_provider_account_id_key" ON "account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_session_token_key" ON "session"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userMetaData_user_id_key" ON "userMetaData"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "user_metadata_user_id_key" ON "user_metadata"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_stripe_credentials_user_id_key" ON "user_stripe_credentials"("user_id");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userMetaData" ADD CONSTRAINT "userMetaData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_metadata" ADD CONSTRAINT "user_metadata_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stripe_credentials" ADD CONSTRAINT "user_stripe_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_orders" ADD CONSTRAINT "user_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
