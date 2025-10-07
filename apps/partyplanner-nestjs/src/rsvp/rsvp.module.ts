import { Module } from '@nestjs/common';
import { RsvpController } from './rsvp.controller';
import { PrismaClient } from 'generated/prisma';

@Module({
  providers: [PrismaClient],
  controllers: [RsvpController],
})
export class RsvpModule {}
