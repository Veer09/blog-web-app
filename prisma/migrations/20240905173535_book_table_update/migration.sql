/*
  Warnings:

  - Made the column `topic_name` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_topic_name_fkey";

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "topic_name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_topic_name_fkey" FOREIGN KEY ("topic_name") REFERENCES "Topic"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
