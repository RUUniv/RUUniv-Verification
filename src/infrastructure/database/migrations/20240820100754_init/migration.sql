/*
  Warnings:

  - You are about to drop the column `user_id` on the `api_key` table. All the data in the column will be lost.
  - Added the required column `userId` to the `api_key` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `api_key` DROP FOREIGN KEY `api_key_user_id_fkey`;

-- AlterTable
ALTER TABLE `api_key` DROP COLUMN `user_id`,
    ADD COLUMN `userId` BIGINT NOT NULL;
