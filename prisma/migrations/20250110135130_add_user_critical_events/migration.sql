-- DropForeignKey
ALTER TABLE "user_meta_data" DROP CONSTRAINT "user_meta_data_user_id_fkey";

-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "user_critical_events" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AddForeignKey
ALTER TABLE "user_meta_data" ADD CONSTRAINT "user_meta_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
