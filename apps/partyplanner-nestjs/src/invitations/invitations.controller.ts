import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { PrismaClient } from 'generated/prisma';
import { InvitationsService } from './invitations.service';
import { EventOrganiserGuard } from 'src/core/event-organiser.guard';

@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly prismaClient: PrismaClient,
  ) {}

  @Post()
  @UseGuards(EventOrganiserGuard)
  async createInvitation(
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

    return this.invitationsService.create({
      eventId,
      title,
      message,
      startDate,
      endDate,
      location,
    });
  }

  @Delete(':invitationId')
  async deleteInvitation(
    @Req() request: Request,
    @Param('invitationId') invitationId: string,
  ) {
    return this.invitationsService.delete({
      invitationId,
      userId: request.user.id,
    });
  }

  @Get()
  async getInvitations(
    @Req() request: Request,
    @Query('eventId') eventId: string,
  ) {
    return this.invitationsService.getByEventId({
      eventId,
    });
  }

  @Post(':invitationId/invitees')
  @UseGuards(EventOrganiserGuard)
  async addInvitee(
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
