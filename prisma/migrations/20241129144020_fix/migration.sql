/*
  Warnings:

  - You are about to drop the column `paid_amount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `payment_date` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `payment_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `payment_status` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `last_payment_amount` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `last_payment_date` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `next_billing_date` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `plan_id` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_id` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the `cart_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_orders` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[payment_intent_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount_received` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_intent_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cancel_at_period_end` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_period_end` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_period_start` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Made the column `user_id` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_subscription_id_fkey";

-- DropForeignKey
ALTER TABLE "user_orders" DROP CONSTRAINT "user_orders_cart_item_id_fkey";

-- DropForeignKey
ALTER TABLE "user_orders" DROP CONSTRAINT "user_orders_user_id_fkey";

-- DropIndex
DROP INDEX "payments_payment_id_key";

-- DropIndex
DROP INDEX "subscriptions_subscription_id_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paid_amount",
DROP COLUMN "payment_date",
DROP COLUMN "payment_id",
DROP COLUMN "payment_status",
ADD COLUMN     "amount_received" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "payment_intent_id" TEXT NOT NULL,
ADD COLUMN     "payment_method_id" TEXT,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "subscription_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "last_payment_amount",
DROP COLUMN "last_payment_date",
DROP COLUMN "next_billing_date",
DROP COLUMN "plan_id",
DROP COLUMN "start_date",
DROP COLUMN "subscription_id",
ADD COLUMN     "cancel_at_period_end" BOOLEAN NOT NULL,
ADD COLUMN     "canceled_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_period_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "current_period_start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "customer_id" TEXT NOT NULL,
ADD COLUMN     "price_id" TEXT NOT NULL,
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- DropTable
DROP TABLE "cart_items";

-- DropTable
DROP TABLE "user_orders";

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_intent_id_key" ON "payments"("payment_intent_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
