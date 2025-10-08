import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import AWS from 'aws-sdk';

import { Invitee, InviteeStatus, PrismaClient } from 'generated/prisma';
import { Public } from 'src/auth/public.decorator';

@Controller('rsvp')
export class RsvpController {
  constructor(private readonly prismaClient: PrismaClient) {}

  @Get(':invitationCode')
  @Public()
  async getInvitationByCode(@Param('invitationCode') invitationCode: string) {
    const { event, ...invitation } =
      await this.prismaClient.invitation.findUniqueOrThrow({
        where: {
          code: invitationCode,
          isActive: true,
        },
        include: {
          event: { include: { organisers: true } },
          invitees: false,
        },
      });

    return {
      ...invitation,
      organisers: event.organisers.map((o) => `${o.firstName} ${o.lastName}`),
    };
  }

  @Post(':invitationCode')
  @Public()
  async rsvpReply(
    @Param('invitationCode') invitationCode: string,
    @Body()
    body: {
      email?: string;
      phoneNumber?: string;
      firstName: string;
      lastName?: string;
      comments?: string;
      status: InviteeStatus;
    },
  ) {
    const invitation = await this.prismaClient.invitation.findUniqueOrThrow({
      where: {
        code: invitationCode,
        isActive: true,
      },
      include: { event: { include: { organisers: true } } },
    });

    // Upsert invitee based on email or phone number
    // If neither is provided, create a new invitee
    const inviteeData: {
      email?: string;
      phoneNumber?: string;
      firstName: string;
      lastName?: string;
      status: InviteeStatus;
      comments?: string;
      invitation: { connect: { id: string } };
    } = {
      email: body.email,
      phoneNumber: body.phoneNumber,
      firstName: body.firstName,
      lastName: body.lastName,
      status: body.status,
      comments: body.comments,
      invitation: { connect: { id: invitation.id } },
    };

    let invitee: Invitee | null = null;
    if (body.email) {
      invitee = await this.prismaClient.invitee.findFirst({
        where: { email: { equals: body.email } },
      });
    } else if (body.phoneNumber) {
      invitee = await this.prismaClient.invitee.findFirst({
        where: { phoneNumber: { equals: body.phoneNumber } },
      });
    }

    if (invitee) {
      invitee = await this.prismaClient.invitee.update({
        where: { id: invitee.id },
        data: {
          ...inviteeData,
          respondedAt: new Date(),
        },
      });
    } else {
      invitee = await this.prismaClient.invitee.create({
        data: {
          ...inviteeData,
          respondedAt: new Date(),
        },
      });
    }

    // Send email to organisers about new invitee
    //     const recipients = invitation.event.organisers.map((o) => o.email);
    //     AWS.config.update({ region: 'us-east-1' });
    //     const ses = new AWS.SES({ apiVersion: '2010-12-01' });
    //     if (recipients.length > 0) {
    //       await ses
    //         .sendEmail({
    //           Destination: {
    //             ToAddresses: recipients,
    //           },
    //           Message: {
    //             Body: {
    //               Text: {
    //                 Data: `${invitee.firstName} ${invitee.lastName} (${invitee.email}, ${invitee.phoneNumber}) voor uitnodiging ${invitation.title}:

    // Status: ${invitee.status}
    // Opmerkingen: ${invitee.comments || 'Geen'}`,
    //               },
    //             },
    //             Subject: {
    //               Data: `RSVP update voor ${invitation.title} van ${invitee.firstName} ${invitee.lastName}`,
    //             },
    //           },
    //           Source: 'no-reply@jouwfeestjeplannen.nl',
    //         })
    //         .promise();
    // }
  }
}
