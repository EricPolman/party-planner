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
import { InvitationsService } from './invitations.service';
import { EventOrganiserGuard } from 'src/core/event-organiser.guard';
import { InvitationOrganiserGuard } from 'src/core/invitation-organiser.guard';
import { uniq } from 'lodash';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

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
      names: string;
    },
  ) {
    const invitation = request.invitation;

    const cleanedNames = uniq(
      body.names
        .split(',')
        .map((name) => name.trim())
        .filter((name) => name.length > 0),
    );

    return this.invitationsService.addInvitees({
      invitation,
      data: { names: cleanedNames },
    });
  }

  @Delete(':invitationId/invitees/:inviteeId')
  @UseGuards(InvitationOrganiserGuard)
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
