/*
  Warnings:

  - A unique constraint covering the columns `[stripe_user_id]` on the table `user_stripe_credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_stripe_credentials_stripe_user_id_key" ON "user_stripe_credentials"("stripe_user_id");
