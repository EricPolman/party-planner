-- CreateTable
CREATE TABLE "InviteeNotification" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "sentAt" TIMESTAMPTZ(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,

    CONSTRAINT "InviteeNotification_pkey" PRIMARY KEY ("id")
);
