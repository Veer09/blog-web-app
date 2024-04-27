/*
  Warnings:

  - You are about to drop the `_chapterrelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_chapterrelation` DROP FOREIGN KEY `_ChapterRelation_A_fkey`;

-- DropForeignKey
ALTER TABLE `_chapterrelation` DROP FOREIGN KEY `_ChapterRelation_B_fkey`;

-- DropTable
DROP TABLE `_chapterrelation`;

-- CreateTable
CREATE TABLE `SubChapter` (
    `id` VARCHAR(191) NOT NULL,
    `chapter_id` VARCHAR(191) NOT NULL,
    `subchapter_id` VARCHAR(191) NOT NULL,
    `subchapter_number` INTEGER NOT NULL,

    UNIQUE INDEX `SubChapter_chapter_id_subchapter_id_key`(`chapter_id`, `subchapter_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubChapter` ADD CONSTRAINT `SubChapter_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubChapter` ADD CONSTRAINT `SubChapter_subchapter_id_fkey` FOREIGN KEY (`subchapter_id`) REFERENCES `Chapter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
