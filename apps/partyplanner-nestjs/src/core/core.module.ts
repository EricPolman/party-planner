import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaClient } from 'generated/prisma';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PrismaClient],
  exports: [PrismaClient],
})
export class CoreModule {}
