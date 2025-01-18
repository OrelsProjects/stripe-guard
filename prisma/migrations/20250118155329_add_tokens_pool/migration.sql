-- CreateTable
CREATE TABLE "tokens_pool" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL,
    "tokens_used" INTEGER NOT NULL,
    "tokens_remaining" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_pool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_pool_user_id_key" ON "tokens_pool"("user_id");

-- AddForeignKey
ALTER TABLE "tokens_pool" ADD CONSTRAINT "tokens_pool_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
