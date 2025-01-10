-- AlterTable
ALTER TABLE "user_tokens" ADD COLUMN     "coupons_used" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "tokens_left" SET DEFAULT 0;
