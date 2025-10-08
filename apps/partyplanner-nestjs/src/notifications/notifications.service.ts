import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';

import { Invitation, Invitee, PrismaClient } from 'generated/prisma';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaClient: PrismaClient) {}

  async sendRsvpNotificationEmail(invitation: Invitation, invitee: Invitee) {
    const event = await this.prismaClient.event.findUniqueOrThrow({
      where: { id: invitation.eventId },
      include: { organisers: true },
    });

    const recipients = event.organisers.map((o) => o.email);

    // Send email to organisers about new invitee
    const ses = new AWS.SES({ region: 'us-east-1', apiVersion: '2010-12-01' });
    if (recipients.length > 0) {
      await ses
        .sendEmail({
          Destination: {
            ToAddresses: recipients,
          },
          Message: {
            Body: {
              Text: {
                Data: `${invitee.firstName} ${invitee.lastName} (${invitee.email}, ${invitee.phoneNumber}) voor uitnodiging ${invitation.title}:
                
Status: ${invitee.status}     
Opmerkingen: ${invitee.comments || 'Geen'}`,
              },
            },
            Subject: {
              Data: `RSVP update voor ${invitation.title} van ${invitee.firstName} ${invitee.lastName}`,
            },
          },
          Source: process.env.EMAIL_FROM_ADDRESS!,
        })
        .promise();
    }
  }
}
