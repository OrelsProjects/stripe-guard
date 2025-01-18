/*
  Warnings:

  - A unique constraint covering the columns `[subscription_id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subscription_id]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payment_subscription_id_key" ON "payment"("subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_subscription_id_key" ON "subscription"("subscription_id");
