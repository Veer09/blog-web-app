-- DropForeignKey
ALTER TABLE `chapter` DROP FOREIGN KEY `Chapter_user_id_fkey`;

-- DropIndex
DROP INDEX `Chapter_title_user_id_key` ON `chapter`;

-- CreateTable
CREATE TABLE `BookInclude` (
    `id` VARCHAR(191) NOT NULL,
    `book_id` VARCHAR(191) NOT NULL,
    `child_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubBook` (
    `id` VARCHAR(191) NOT NULL,
    `chapter_id` VARCHAR(191) NOT NULL,
    `book_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookInclude` ADD CONSTRAINT `BookInclude_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookInclude` ADD CONSTRAINT `BookInclude_child_id_fkey` FOREIGN KEY (`child_id`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubBook` ADD CONSTRAINT `SubBook_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubBook` ADD CONSTRAINT `SubBook_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
