import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { PrismaClient } from 'generated/prisma';

@Module({
  providers: [PrismaClient],
  controllers: [InvitationsController],
})
export class InvitationsModule {}
