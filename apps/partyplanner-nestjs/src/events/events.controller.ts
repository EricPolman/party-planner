import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { EventOrganiserGuard } from 'src/core/event-organiser.guard';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(
    @Req() request: Request,
    @Body()
    body: {
      title: string;
      description: string;
    },
  ) {
    return this.eventsService.create({
      ...body,
      userId: request.user.id,
    });
  }

  @Delete(':eventId')
  @UseGuards(EventOrganiserGuard)
  async deleteEvent(
    @Req() request: Request,
    @Param('eventId') eventId: string,
  ) {
    return this.eventsService.delete({
      eventId,
      userId: request.user.id,
    });
  }

  @Get()
  async getEvents(@Req() request: Request) {
    return this.eventsService.getEvents(request.user.id);
  }

  @Get(':eventId')
  @UseGuards(EventOrganiserGuard)
  async getEventById(@Param('eventId') eventId: string) {
    return this.eventsService.getEventById(eventId);
  }
}
