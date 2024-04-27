-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_topic_name_fkey`;

-- DropForeignKey
ALTER TABLE `bookchapter` DROP FOREIGN KEY `BookChapter_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `bookchapter` DROP FOREIGN KEY `BookChapter_chapter_id_fkey`;

-- DropForeignKey
ALTER TABLE `subchapter` DROP FOREIGN KEY `SubChapter_chapter_id_fkey`;

-- DropForeignKey
ALTER TABLE `subchapter` DROP FOREIGN KEY `SubChapter_subchapter_id_fkey`;

-- AlterTable
ALTER TABLE `book` MODIFY `topic_name` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_topic_name_fkey` FOREIGN KEY (`topic_name`) REFERENCES `Topic`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubChapter` ADD CONSTRAINT `SubChapter_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubChapter` ADD CONSTRAINT `SubChapter_subchapter_id_fkey` FOREIGN KEY (`subchapter_id`) REFERENCES `Chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookChapter` ADD CONSTRAINT `BookChapter_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookChapter` ADD CONSTRAINT `BookChapter_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
