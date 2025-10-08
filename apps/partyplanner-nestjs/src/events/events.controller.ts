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
      description: string;
    },
  ) {
    const event = await this.prismaClient.event.create({
      data: {
        title: body.title,
        description: body.description,
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
    if (!event) {
      throw new Error('Event not found');
    }

    await this.prismaClient.event.delete({
      where: {
        id: eventId,
      },
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
    const event = await this.prismaClient.event.findUniqueOrThrow({
      where: {
        id: eventId,
        organisers: {
          some: {
            id: { equals: request.user.id },
          },
        },
      },
      include: { invitations: true },
    });

    return event;
  }
}
