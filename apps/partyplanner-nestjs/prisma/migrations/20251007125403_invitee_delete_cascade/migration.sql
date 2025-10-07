-- DropForeignKey
ALTER TABLE "public"."Invitee" DROP CONSTRAINT "Invitee_eventId_fkey";

-- AddForeignKey
ALTER TABLE "Invitee" ADD CONSTRAINT "Invitee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
