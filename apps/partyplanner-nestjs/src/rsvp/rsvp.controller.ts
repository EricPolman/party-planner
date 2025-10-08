import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Invitee, InviteeStatus, PrismaClient } from 'generated/prisma';
import { Public } from 'src/auth/public.decorator';

@Controller('rsvp')
export class RsvpController {
  constructor(private readonly prismaClient: PrismaClient) {}

  @Get(':invitationCode')
  @Public()
  async getInvitationByCode(@Param('invitationCode') invitationCode: string) {
    return this.prismaClient.invitation.findUniqueOrThrow({
      where: {
        code: invitationCode,
        isActive: true,
      },
    });
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
  }
}
