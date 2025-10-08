import { Module } from '@nestjs/common';
import { RsvpController } from './rsvp.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [NotificationsModule, CoreModule],
  controllers: [RsvpController],
})
export class RsvpModule {}
