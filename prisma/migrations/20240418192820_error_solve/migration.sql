-- DropIndex
DROP INDEX `BookChapter_chapter_id_fkey` ON `bookchapter`;

-- DropIndex
DROP INDEX `SubChapter_subchapter_id_fkey` ON `subchapter`;

-- AddForeignKey
ALTER TABLE `SubChapter` ADD CONSTRAINT `SubChapter_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubChapter` ADD CONSTRAINT `SubChapter_subchapter_id_fkey` FOREIGN KEY (`subchapter_id`) REFERENCES `Chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookChapter` ADD CONSTRAINT `BookChapter_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookChapter` ADD CONSTRAINT `BookChapter_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
