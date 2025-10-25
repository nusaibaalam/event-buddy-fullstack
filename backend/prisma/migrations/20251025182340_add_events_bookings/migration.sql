/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,eventId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Event_dateTime_idx` ON `Event`;

-- AlterTable
ALTER TABLE `Event` DROP COLUMN `dateTime`,
    ADD COLUMN `date` DATETIME(3) NOT NULL,
    MODIFY `tags` JSON NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_userId_eventId_key` ON `Booking`(`userId`, `eventId`);

-- CreateIndex
CREATE INDEX `Event_date_idx` ON `Event`(`date`);
