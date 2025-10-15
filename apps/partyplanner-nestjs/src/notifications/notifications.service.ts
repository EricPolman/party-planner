import { Injectable } from '@nestjs/common';
import { groupBy } from 'lodash';
import { Cron } from '@nestjs/schedule';
import AWS from 'aws-sdk';

import { Invitation, Invitee, Prisma, PrismaClient } from 'generated/prisma';
import { DefaultArgs } from 'generated/prisma/runtime/library';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaClient: PrismaClient) {}

  async sendInviteeNotification(invitation: Invitation, invitee: Invitee) {
    // Store in tx outbox. Upsert based on inviteeId + status = PENDING
    const notification = await this.prismaClient.inviteeNotification.findFirst({
      where: {
        inviteeId: invitee.id,
        status: 'PENDING',
      },
    });

    if (!notification) {
      await this.prismaClient.inviteeNotification.create({
        data: {
          eventId: invitation.eventId,
          inviteeId: invitee.id,
          invitationId: invitation.id,
        },
      });
    }
  }

  @Cron('*/5 * * * *')
  async processPendingNotifications() {
    await this.prismaClient.$transaction(async (prisma) => {
      // Find all pending notifications
      // Group by invitation

      const pendingNotifications =
        await this.prismaClient.inviteeNotification.findMany({
          where: { status: 'PENDING' },
        });

      const groupedByInvitation = groupBy(pendingNotifications, 'invitationId');

      for (const [invitationId, notifications] of Object.entries(
        groupedByInvitation,
      )) {
        const invitation = await this.prismaClient.invitation.findUnique({
          where: { id: invitationId },
        });

        if (!invitation) {
          // Can happen in case the invitation was deleted in the meantime
          continue;
        }

        const invitees = await this.prismaClient.invitee.findMany({
          where: { id: { in: notifications.map((n) => n.inviteeId) } },
        });

        try {
          await this.processInviteesNotification(prisma, invitation, invitees);

          // Mark notifications as sent
          await prisma.inviteeNotification.updateMany({
            where: {
              inviteeId: { in: invitees.map((i) => i.id) },
            },
            data: {
              status: 'SENT',
              sentAt: new Date(),
            },
          });
        } catch (error) {
          // Mark notifications as failed
          await prisma.inviteeNotification.updateMany({
            where: {
              inviteeId: { in: invitees.map((i) => i.id) },
            },
            data: {
              status: 'FAILED',
              errorMessage: (error as Error).message,
            },
          });
        }
      }
    });
  }

  async processInviteesNotification(
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
    >,
    invitation: Invitation,
    invitees: Invitee[],
  ) {
    const event = await prisma.event.findUniqueOrThrow({
      where: { id: invitation.eventId },
      include: { organisers: true },
    });

    const recipients = event.organisers.map((o) => o.email);

    // Send email to organisers about new invitee
    const ses = new AWS.SES({
      region: 'us-east-1',
      apiVersion: '2010-12-01',
    });
    if (recipients.length === 0) {
      return;
    }
    if (invitees.length === 1) {
      const invitee = invitees[0];
      await ses
        .sendEmail({
          Destination: {
            ToAddresses: recipients,
          },
          Message: {
            Body: {
              Text: {
                Data: `${invitee.name} (${invitee.email}, ${invitee.phoneNumber}) voor uitnodiging ${invitation.title}:
              
Status: ${invitee.status}     
Opmerkingen: ${invitee.comments || 'Geen'}`,
              },
            },
            Subject: {
              Data: `RSVP update voor ${invitation.title} van ${invitee.name}`,
            },
          },
          Source: process.env.EMAIL_FROM_ADDRESS!,
        })
        .promise();
      return;
    }

    await ses
      .sendEmail({
        Destination: {
          ToAddresses: recipients,
        },
        Message: {
          Body: {
            Text: {
              Data: `${invitees.length} reacties voor uitnodiging ${invitation.title}:
              ${invitees
                .map(
                  (invitee) => `
--------------------------------------
${invitee.name}:
              
Status: ${invitee.status}     
Opmerkingen: ${invitee.comments || 'Geen'}`,
                )
                .join('\n')}`,
            },
          },
          Subject: {
            Data: `RSVP update voor ${invitation.title} van ${invitees.length} personen`,
          },
        },
        Source: process.env.EMAIL_FROM_ADDRESS!,
      })
      .promise();
    return;
  }
}
