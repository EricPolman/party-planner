import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { PrismaClient } from 'generated/prisma';
import { InvitationsService } from './invitations.service';
import { EventOrganiserGuard } from 'src/core/event-organiser.guard';
import { InvitationOrganiserGuard } from 'src/core/invitation-organiser.guard';

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
  async getInvitations(@Query('eventId') eventId: string) {
    return this.invitationsService.getByEventId({
      eventId,
    });
  }

  @Post(':invitationId/invitees')
  @UseGuards(InvitationOrganiserGuard)
  async addInvitee(
    @Req() request: Request,
    @Body()
    body: {
      email?: string;
      phoneNumber?: string;
      firstName?: string;
      lastName?: string;
    },
  ) {
    const invitation = request.invitation;

    return this.invitationsService.addInvitee({
      invitation,
      data: body,
    });
  }

  @Delete(':invitationId/invitees/:inviteeId')
  async removeInvitee(
    @Req() request: Request,
    @Param('inviteeId') inviteeId: string,
  ) {
    await this.invitationsService.removeInvitee({
      invitation: request.invitation,
      inviteeId,
    });
  }

  @Put(':invitationId/isActive')
  async updateInvitationStatus(
    @Param('invitationId') invitationId: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.invitationsService.update({
      invitationId,
      data: { isActive: body.isActive },
    });
  }
}
