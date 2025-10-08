import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { type Request } from 'express';
import { PrismaClient } from 'generated/prisma';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly prismaClient: PrismaClient) {}

  @Post()
  async createInvitation(
    @Req() request: Request,
    @Body()
    body: {
      eventId: string;
      title: string;
      message: string;
      startDate: Date;
      endDate?: Date;
      location?: string;
    },
  ) {
    const { eventId, title, message, startDate, endDate, location } = body;

    // Check if the user is an organiser of the event
    // If not, throw an error
    // If yes, create the invitation
    const event = await this.prismaClient.event.findUniqueOrThrow({
      where: {
        id: eventId,
        organisers: {
          some: {
            id: { equals: request.user.id },
          },
        },
      },
    });

    return this.prismaClient.invitation.create({
      data: {
        code: crypto.randomUUID().split('-')[0],
        title,
        message,
        isActive: true,
        location,
        endDate,
        startDate,
        event: { connect: { id: event.id } },
      },
    });
  }

  @Delete(':invitationId')
  async deleteInvitation(
    @Req() request: Request,
    @Param('invitationId') invitationId: string,
  ) {
    await this.prismaClient.invitation.findUniqueOrThrow({
      where: {
        id: invitationId,
        event: {
          organisers: {
            some: {
              id: { equals: request.user.id },
            },
          },
        },
      },
    });

    await this.prismaClient.invitation.delete({
      where: {
        id: invitationId,
      },
    });
  }

  @Get()
  async getInvitations(
    @Req() request: Request,
    @Query('eventId') eventId: string,
  ) {
    const invitations = await this.prismaClient.invitation.findMany({
      where: {
        event: {
          id: { equals: eventId },
          organisers: {
            some: {
              id: { equals: request.user.id },
            },
          },
        },
      },
      include: { invitees: true },
    });
    return invitations;
  }

  @Post(':invitationId/invitees')
  async addInvitee(
    @Req() request: Request,
    @Param('invitationId') invitationId: string,
    @Body()
    body: {
      email?: string;
      phoneNumber?: string;
      firstName?: string;
      lastName?: string;
    },
  ) {
    const invitation = await this.prismaClient.invitation.findUniqueOrThrow({
      where: {
        id: invitationId,
        event: {
          organisers: {
            some: {
              id: { equals: request.user.id },
            },
          },
        },
      },
    });

    const inviteeData = {
      email: body.email,
      phoneNumber: body.phoneNumber,
      firstName: body.firstName,
      lastName: body.lastName,
      invitation: { connect: { id: invitation.id } },
    };

    const invitee = await this.prismaClient.invitee.create({
      data: inviteeData,
    });

    return invitee;
  }

  @Delete(':invitationId/invitees/:inviteeId')
  async removeInvitee(
    @Req() request: Request,
    @Param('invitationId') invitationId: string,
    @Param('inviteeId') inviteeId: string,
  ) {
    const invitation = await this.prismaClient.invitation.findUniqueOrThrow({
      where: {
        id: invitationId,
        event: {
          organisers: {
            some: {
              id: { equals: request.user.id },
            },
          },
        },
      },
    });

    await this.prismaClient.invitee.deleteMany({
      where: {
        id: inviteeId,
        invitationId: invitation.id,
      },
    });
  }
}
