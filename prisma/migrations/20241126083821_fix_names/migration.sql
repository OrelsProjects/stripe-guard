/*
  Warnings:

  - You are about to drop the `userMetaData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_metadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verificationtokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "userMetaData" DROP CONSTRAINT "userMetaData_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_metadata" DROP CONSTRAINT "user_metadata_user_id_fkey";

-- DropTable
DROP TABLE "userMetaData";

-- DropTable
DROP TABLE "user_metadata";

-- DropTable
DROP TABLE "verificationtokens";

-- CreateTable
CREATE TABLE "user_meta_data" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "paid_status" TEXT NOT NULL,

    CONSTRAINT "user_meta_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_meta_data_user_id_key" ON "user_meta_data"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");

-- AddForeignKey
ALTER TABLE "user_meta_data" ADD CONSTRAINT "user_meta_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
