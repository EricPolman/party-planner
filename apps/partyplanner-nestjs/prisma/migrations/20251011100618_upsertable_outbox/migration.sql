/*
  Warnings:

  - The primary key for the `InviteeNotification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `InviteeNotification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteeId]` on the table `InviteeNotification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "InviteeNotification" DROP CONSTRAINT "InviteeNotification_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "InviteeNotification_inviteeId_key" ON "InviteeNotification"("inviteeId");
