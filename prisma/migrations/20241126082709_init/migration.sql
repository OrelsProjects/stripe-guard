-- CreateTable
CREATE TABLE "app_user" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "display_name" TEXT,
    "photo_url" TEXT,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_user_metadata" (
    "app_user_metadata_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "referral_code" TEXT,
    "referred_by" TEXT,
    "paid_status" TEXT,
    "push_token" TEXT,
    "push_token_mobile" TEXT,

    CONSTRAINT "app_user_metadata_pkey" PRIMARY KEY ("app_user_metadata_id")
);

-- CreateTable
CREATE TABLE "app_user_settings" (
    "app_user_settings_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "show_notifications" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "app_user_settings_pkey" PRIMARY KEY ("app_user_settings_id")
);

-- CreateTable
CREATE TABLE "app_user_stripe_credentials" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "stripe_user_id" TEXT,
    "publishable_key" TEXT,

    CONSTRAINT "app_user_stripe_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_orders" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cart_item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "plan_id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "next_billing_date" TIMESTAMP(3),
    "last_payment_date" TIMESTAMP(3),
    "last_payment_amount" DOUBLE PRECISION,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "paid_amount" DOUBLE PRECISION NOT NULL,
    "payment_status" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_user_user_id_key" ON "app_user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_metadata_user_id_key" ON "app_user_metadata"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_settings_user_id_key" ON "app_user_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_stripe_credentials_user_id_key" ON "app_user_stripe_credentials"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_orders_order_id_key" ON "user_orders"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_subscription_id_key" ON "subscriptions"("subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_id_key" ON "payments"("payment_id");

-- AddForeignKey
ALTER TABLE "app_user_metadata" ADD CONSTRAINT "app_user_metadata_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user_settings" ADD CONSTRAINT "app_user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_user_stripe_credentials" ADD CONSTRAINT "app_user_stripe_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_orders" ADD CONSTRAINT "user_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_orders" ADD CONSTRAINT "user_orders_cart_item_id_fkey" FOREIGN KEY ("cart_item_id") REFERENCES "cart_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("subscription_id") ON DELETE CASCADE ON UPDATE CASCADE;
