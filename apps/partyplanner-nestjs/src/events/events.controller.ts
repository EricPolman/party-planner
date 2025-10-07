import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { type Request } from 'express';

@Controller('events')
export class EventsController {
  constructor(private readonly prismaClient: PrismaClient) {}

  @Post()
  async createEvent(
    @Req() request: Request,
    @Body()
    body: {
      title: string;
      invitationText: string;
      startDate: Date;
      endDate: Date;
      location?: string;
    },
  ) {
    const event = await this.prismaClient.event.create({
      data: {
        title: body.title,
        invitationText: body.invitationText,
        startDate: body.startDate,
        endDate: body.endDate,
        location: body.location,
        organisers: { connect: { id: request.user.id } },
      },
    });
    return event;
  }

  @Delete(':eventId')
  async deleteEvent(
    @Req() request: Request,
    @Param('eventId') eventId: string,
  ) {
    const event = await this.prismaClient.event.findUnique({
      where: {
        id: eventId,
        organisers: {
          some: {
            id: { equals: request.user.id },
          },
        },
      },
    });
    if (!event) {
      throw new Error('Event not found');
    }

    await this.prismaClient.event.delete({
      where: {
        id: eventId,
      },
      include: { invitees: true },
    });
  }

  @Get()
  async getEvents(@Req() request: Request) {
    const events = await this.prismaClient.event.findMany({
      where: {
        organisers: {
          some: {
            id: { equals: request.user.id },
          },
        },
      },
    });
    return events;
  }

  @Get(':eventId')
  async getEventById(
    @Req() request: Request,
    @Param('eventId') eventId: string,
  ) {
    const event = await this.prismaClient.event.findUnique({
      where: {
        id: eventId,
        organisers: {
          some: {
            id: { equals: request.user.id },
          },
        },
      },
      include: { invitees: true },
    });

    return event;
  }

  @Post(':eventId/invitees')
  async addInvitee(
    @Req() request: Request,
    @Param('eventId') eventId: string,
    @Body()
    body: {
      email?: string;
      phoneNumber?: string;
      firstName?: string;
      lastName?: string;
    },
  ) {
    const event = await this.prismaClient.event.findUnique({
      where: {
        id: eventId,
        organisers: {
          some: {
            id: { equals: request.user.id },
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const inviteeData = {
      email: body.email,
      phoneNumber: body.phoneNumber,
      firstName: body.firstName,
      lastName: body.lastName,
      event: { connect: { id: eventId } },
    };

    const invitee = await this.prismaClient.invitee.create({
      data: inviteeData,
    });

    return invitee;
  }

  @Delete(':eventId/invitees/:inviteeId')
  async removeInvitee(
    @Req() request: Request,
    @Param('eventId') eventId: string,
    @Param('inviteeId') inviteeId: string,
  ) {
    const event = await this.prismaClient.event.findUnique({
      where: {
        id: eventId,
        organisers: {
          some: {
            id: { equals: request.user.id },
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    await this.prismaClient.invitee.deleteMany({
      where: {
        id: inviteeId,
        eventId: eventId,
      },
    });
  }
}
