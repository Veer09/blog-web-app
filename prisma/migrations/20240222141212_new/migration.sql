/*
  Warnings:

  - You are about to drop the column `likes` on the `comment` table. All the data in the column will be lost.
  - The primary key for the `topic` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `topic` table. All the data in the column will be lost.
  - You are about to drop the `blogtotopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usertotopic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coverImage` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `blogtotopic` DROP FOREIGN KEY `BlogToTopic_blog_id_fkey`;

-- DropForeignKey
ALTER TABLE `blogtotopic` DROP FOREIGN KEY `BlogToTopic_topic_id_fkey`;

-- DropForeignKey
ALTER TABLE `usertotopic` DROP FOREIGN KEY `UserToTopic_topic_id_fkey`;

-- DropForeignKey
ALTER TABLE `usertotopic` DROP FOREIGN KEY `UserToTopic_user_id_fkey`;

-- AlterTable
ALTER TABLE `blog` ADD COLUMN `coverImage` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `likes`,
    ADD COLUMN `reply_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `topic` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`name`);

-- DropTable
DROP TABLE `blogtotopic`;

-- DropTable
DROP TABLE `usertotopic`;

-- CreateTable
CREATE TABLE `Like` (
    `user_id` VARCHAR(191) NOT NULL,
    `blog_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Like_user_id_blog_id_key`(`user_id`, `blog_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TopicToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_TopicToUser_AB_unique`(`A`, `B`),
    INDEX `_TopicToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserFollows` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserFollows_AB_unique`(`A`, `B`),
    INDEX `_UserFollows_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SavedBlog` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_SavedBlog_AB_unique`(`A`, `B`),
    INDEX `_SavedBlog_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ReadingHistory` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ReadingHistory_AB_unique`(`A`, `B`),
    INDEX `_ReadingHistory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BlogToTopic` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BlogToTopic_AB_unique`(`A`, `B`),
    INDEX `_BlogToTopic_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_reply_id_fkey` FOREIGN KEY (`reply_id`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_blog_id_fkey` FOREIGN KEY (`blog_id`) REFERENCES `Blog`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TopicToUser` ADD CONSTRAINT `_TopicToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Topic`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TopicToUser` ADD CONSTRAINT `_TopicToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserFollows` ADD CONSTRAINT `_UserFollows_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserFollows` ADD CONSTRAINT `_UserFollows_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SavedBlog` ADD CONSTRAINT `_SavedBlog_A_fkey` FOREIGN KEY (`A`) REFERENCES `Blog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SavedBlog` ADD CONSTRAINT `_SavedBlog_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReadingHistory` ADD CONSTRAINT `_ReadingHistory_A_fkey` FOREIGN KEY (`A`) REFERENCES `Blog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReadingHistory` ADD CONSTRAINT `_ReadingHistory_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlogToTopic` ADD CONSTRAINT `_BlogToTopic_A_fkey` FOREIGN KEY (`A`) REFERENCES `Blog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlogToTopic` ADD CONSTRAINT `_BlogToTopic_B_fkey` FOREIGN KEY (`B`) REFERENCES `Topic`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
