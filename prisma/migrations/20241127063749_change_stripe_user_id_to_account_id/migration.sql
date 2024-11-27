/*
  Warnings:

  - You are about to drop the column `stripe_user_id` on the `user_stripe_credentials` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[account_id]` on the table `user_stripe_credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_stripe_credentials_stripe_user_id_key";

-- AlterTable
ALTER TABLE "user_stripe_credentials" DROP COLUMN "stripe_user_id",
ADD COLUMN     "account_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_stripe_credentials_account_id_key" ON "user_stripe_credentials"("account_id");
