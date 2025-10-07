import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaClient } from 'generated/prisma';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaClient],
})
export class EventsModule {}
