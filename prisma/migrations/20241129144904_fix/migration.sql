/*
  Warnings:

  - You are about to drop the column `payment_intent_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_id` on the `payments` table. All the data in the column will be lost.
  - Added the required column `invoice_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_subscription_id_fkey";

-- DropIndex
DROP INDEX "payments_payment_intent_id_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "payment_intent_id",
DROP COLUMN "subscription_id",
ADD COLUMN     "invoice_id" TEXT NOT NULL,
ADD COLUMN     "price_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
