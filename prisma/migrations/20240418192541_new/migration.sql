-- DropForeignKey
ALTER TABLE `bookchapter` DROP FOREIGN KEY `BookChapter_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `bookchapter` DROP FOREIGN KEY `BookChapter_chapter_id_fkey`;

-- DropForeignKey
ALTER TABLE `subchapter` DROP FOREIGN KEY `SubChapter_chapter_id_fkey`;

-- DropForeignKey
ALTER TABLE `subchapter` DROP FOREIGN KEY `SubChapter_subchapter_id_fkey`;

-- DropIndex
DROP INDEX `BookChapter_book_id_chapter_id_key` ON `bookchapter`;

-- DropIndex
DROP INDEX `SubChapter_chapter_id_subchapter_id_key` ON `subchapter`;
