/*
  Warnings:

  - Added the required column `child_number` to the `BookInclude` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_number` to the `SubBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookinclude` ADD COLUMN `child_number` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `subbook` ADD COLUMN `book_number` INTEGER NOT NULL;
