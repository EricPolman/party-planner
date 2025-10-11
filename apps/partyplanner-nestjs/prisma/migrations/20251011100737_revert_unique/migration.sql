/*
  Warnings:

  - The required column `id` was added to the `InviteeNotification` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "public"."InviteeNotification_inviteeId_key";

-- AlterTable
ALTER TABLE "InviteeNotification" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "InviteeNotification_pkey" PRIMARY KEY ("id");
