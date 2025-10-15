/*
  Warnings:

  - You are about to drop the column `firstName` on the `Invitee` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Invitee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invitee" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ALTER COLUMN "name" DROP DEFAULT;
