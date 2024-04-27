-- DropIndex
DROP INDEX `Chapter_user_id_fkey` ON `chapter`;

-- AddForeignKey
ALTER TABLE `Chapter` ADD CONSTRAINT `Chapter_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
