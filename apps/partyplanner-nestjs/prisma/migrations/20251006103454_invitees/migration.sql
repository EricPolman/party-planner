/*
  Warnings:

  - Made the column `invitationText` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InviteeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'MAYBE');

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "invitationText" SET NOT NULL;

-- CreateTable
CREATE TABLE "Invitee" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "eventId" INTEGER NOT NULL,
    "status" "InviteeStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "comments" TEXT,

    CONSTRAINT "Invitee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invitee" ADD CONSTRAINT "Invitee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
